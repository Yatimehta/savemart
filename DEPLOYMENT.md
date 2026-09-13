# SavingMart Production Deployment Runbook

**Domain:** `savingmart.dk` / `www.savingmart.dk`  
**Server IP:** `76.13.248.128`  
**Server Hostname:** `srv1970698.hstgr.cloud`  
**Hosting:** Hostinger VPS KVM 1 (Ubuntu / Lithuania EU)  
**Security Model:** Dedicated non-root `deployer` user runs PM2 & owns web files.

---

## 1. Pre-Deployment Verification: Current IP `2.57.91.91`

We verified `2.57.91.91` via WHOIS:
- **Owner:** `HOSTINGER-CDN` (Hostinger International Ltd.)
- **Status:** This is Hostinger's default parked domain gateway assigned to newly registered domains before custom DNS is routed.
- **Confirmation:** No active site or custom application is hosted at `2.57.91.91`. It is 100% safe to point your `savingmart.dk` DNS to your VPS (`76.13.248.128`).

---

## 2. DNS Configuration (Hostinger DNS Zone Editor)

In your Hostinger DNS Zone Editor for `savingmart.dk`:

| Type | Name / Host | Value / Target | TTL |
|---|---|---|---|
| **A** | `@` | `76.13.248.128` | 300 / Default |
| **A** | `www` | `76.13.248.128` | 300 / Default |

Verify propagation:
```bash
dig +short savingmart.dk
# Target output: 76.13.248.128
```

---

## 3. Server Provisioning & Hardening (Run Once as Root)

SSH into your VPS as `root`:
```bash
ssh root@76.13.248.128
```

### Option A: Run the Automated Setup Script
Copy the setup script to the server and execute:
```bash
curl -fsSL https://raw.githubusercontent.com/.../setup-vps.sh | bash
# OR create setup-vps.sh directly on server and run:
bash setup-vps.sh
```

### Option B: Step-by-Step Manual Hardening

#### A. Install Packages & Create `deployer` Sudo User
```bash
export DEBIAN_FRONTEND=noninteractive
apt update && apt upgrade -y
apt install -y ufw fail2ban curl git nginx certbot python3-certbot-nginx postgresql postgresql-contrib build-essential rsync

# Create deployer user without password prompts
adduser --disabled-password --gecos "" deployer
usermod -aG sudo deployer
echo "deployer ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/deployer

# Copy SSH Authorized Keys to deployer
mkdir -p /home/deployer/.ssh
cp /root/.ssh/authorized_keys /home/deployer/.ssh/
chown -R deployer:deployer /home/deployer/.ssh
chmod 700 /home/deployer/.ssh
chmod 600 /home/deployer/.ssh/authorized_keys
```

#### B. Configure UFW Firewall & Fail2ban
```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

systemctl enable --now fail2ban
```

#### C. Install Node.js 20 LTS & PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2
```

#### D. Provision PostgreSQL with a Secure Random Secret
```bash
systemctl enable --now postgresql

# Generate random 32-character hex password
DB_PASS=$(openssl rand -hex 16)
DB_USER="savemart_user"
DB_NAME="savemart_db"

sudo -u postgres psql << EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER DATABASE $DB_NAME OWNER TO $DB_USER;
\q
EOF

sudo -u postgres psql -d $DB_NAME -c "GRANT ALL ON SCHEMA public TO $DB_USER;"

# Prepare application directory and store credentials in .env with restricted permissions
mkdir -p /var/www/savemart
mkdir -p /var/backups/savemart

cat << EOF > /var/www/savemart/.env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}
NEXT_PUBLIC_SITE_URL=https://savingmart.dk
EOF

chown -R deployer:deployer /var/www/savemart
chmod 600 /var/www/savemart/.env

# Configure PM2 systemd service for deployer
env PATH=$PATH:/usr/bin pm2 startup systemd -u deployer --hp /home/deployer
```

#### E. Lock Root Password Login (After verifying deployer SSH access)
```bash
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/PermitRootLogin yes/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
systemctl restart ssh
```

---

## 4. Application Deployment (Run as `deployer`)

### A. Transfer Code from Local Mac to VPS
From your Mac terminal inside `/Users/yatimehta/savemart`:
```bash
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' /Users/yatimehta/savemart/ deployer@76.13.248.128:/var/www/savemart/
```

### B. Build, Seed Database & Start Application
SSH into the server as **`deployer`**:
```bash
ssh deployer@76.13.248.128
```

Run as `deployer`:
```bash
cd /var/www/savemart

# Install dependencies (production + build tools)
npm install --production=false

# Run PostgreSQL migration & seed product catalog
npm run db:seed

# Build Next.js optimized production bundle
npm run build

# Start Next.js with PM2
pm2 start ecosystem.config.js
pm2 save
```

---

## 5. Nginx Multi-Site Reverse Proxy & SSL Setup

Run on the server (with sudo):
```bash
# Link the Nginx server block
sudo cp /var/www/savemart/scripts/nginx-savingmart.conf /etc/nginx/sites-available/savingmart.dk
sudo ln -sf /etc/nginx/sites-available/savingmart.dk /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

# Issue Let's Encrypt SSL Certificate
sudo certbot --nginx -d savingmart.dk -d www.savingmart.dk --non-interactive --agree-tos -m admin@savingmart.dk --redirect
```

---

## 6. PostgreSQL Automated Daily Backups

Set up daily automated backups under `deployer` or `root`:
```bash
sudo chmod +x /var/www/savemart/scripts/backup-db.sh
(sudo crontab -l 2>/dev/null; echo "0 2 * * * /var/www/savemart/scripts/backup-db.sh >> /var/log/savemart-backup.log 2>&1") | sudo crontab -
```

---

## 7. Verification & Post-Deployment Checklist

- [ ] **HTTPS Live Check:** Visit `https://savingmart.dk`
- [ ] **Process Status:** `pm2 status savemart` (Running under `deployer`)
- [ ] **Database Check:** `sudo -u postgres psql -d savemart_db -c "SELECT count(*) FROM products;"`
- [ ] **Firewall Status:** `sudo ufw status` (22, 80, 443 only)
- [ ] **Backups:** Test running `sudo /var/www/savemart/scripts/backup-db.sh`
