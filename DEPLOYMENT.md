# SavingMart Production Deployment Runbook

**Domain:** `savingmart.dk` / `www.savingmart.dk`  
**Server IP:** `76.13.248.128`  
**Server Hostname:** `srv1970698.hstgr.cloud`  
**Hosting:** Hostinger VPS KVM 1 (Ubuntu / Lithuania EU)  

---

## 1. DNS Configuration (Hostinger DNS Zone Editor)

Ensure the following DNS records are set for `savingmart.dk`:

| Type | Name / Host | Value / Target | TTL |
|---|---|---|---|
| **A** | `@` | `76.13.248.128` | 300 / Default |
| **A** | `www` | `76.13.248.128` | 300 / Default |

Verify DNS resolution on your terminal:
```bash
dig +short savingmart.dk
# Should output: 76.13.248.128
```

---

## 2. Server Hardening & Base Setup

SSH into the server as root:
```bash
ssh root@76.13.248.128
```

### A. Create a Dedicated Non-Root User (`deployer`)
```bash
adduser deployer
usermod -aG sudo deployer

# Copy SSH keys to new user
mkdir -p /home/deployer/.ssh
cp /root/.ssh/authorized_keys /home/deployer/.ssh/
chown -R deployer:deployer /home/deployer/.ssh
chmod 700 /home/deployer/.ssh
chmod 600 /home/deployer/.ssh/authorized_keys
```

### B. Configure UFW Firewall & Fail2ban
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ufw fail2ban curl git build-essential

# Firewall rules
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Start & enable Fail2ban
sudo systemctl enable --now fail2ban
```

### C. SSH Hardening (Optional but Recommended)
After verifying you can log in with `ssh deployer@76.13.248.128`:
```bash
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
sudo systemctl restart ssh
```

---

## 3. Runtime Stack Installation (Node.js 20, PostgreSQL, PM2, Nginx)

Run the following as `deployer` (or `root`):

```bash
# 1. Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 2. Install PM2 Globally
sudo npm install -g pm2

# 3. Install Nginx & Certbot
sudo apt install -y nginx certbot python3-certbot-nginx

# 4. Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql
```

---

## 4. Production PostgreSQL Database Setup

```bash
# Switch to postgres user and create database + user
sudo -u postgres psql
```

Inside the PostgreSQL shell (`psql`):
```sql
CREATE DATABASE savemart_db;
CREATE USER savemart_user WITH ENCRYPTED PASSWORD 'SaveMartProductionPassword2026!';
GRANT ALL PRIVILEGES ON DATABASE savemart_db TO savemart_user;
ALTER DATABASE savemart_db OWNER TO savemart_user;
\q
```

Grant schema permissions (PostgreSQL 15+):
```bash
sudo -u postgres psql -d savemart_db -c "GRANT ALL ON SCHEMA public TO savemart_user;"
```

---

## 5. Application Deployment

### A. Deploy Code to `/var/www/savemart`
```bash
sudo mkdir -p /var/www/savemart
sudo chown -R deployer:deployer /var/www/savemart
```

From your local machine (Mac), rsync the codebase to the VPS:
```bash
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' /Users/yatimehta/savemart/ deployer@76.13.248.128:/var/www/savemart/
```

### B. Environment Setup & Data Migration
On the VPS:
```bash
cd /var/www/savemart

# Create .env file
cat << 'EOF' > .env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://savemart_user:SaveMartProductionPassword2026!@localhost:5432/savemart_db
NEXT_PUBLIC_SITE_URL=https://savingmart.dk
EOF

# Install dependencies, migrate & seed catalog into PostgreSQL
npm install --production=false
npm run db:seed
npm run build
```

### C. Start Application with PM2 (Auto-Restart on Crash/Reboot)
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
# (Run the generated sudo env command if prompted by pm2 startup)
```

---

## 6. Nginx Multi-Site Reverse Proxy & Free SSL

### A. Configure Nginx Server Block
```bash
sudo cp /var/www/savemart/scripts/nginx-savingmart.conf /etc/nginx/sites-available/savingmart.dk
sudo ln -s /etc/nginx/sites-available/savingmart.dk /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### B. Issue Let's Encrypt SSL Certificate & Auto-Redirect HTTPS
```bash
sudo certbot --nginx -d savingmart.dk -d www.savingmart.dk --non-interactive --agree-tos -m admin@savingmart.dk --redirect
```

Certbot will automatically install SSL certificates and setup renewal via systemd timer (`certbot.timer`).

---

## 7. PostgreSQL Automated Daily Backups

Set up the automated backup script with 7-day retention:
```bash
sudo mkdir -p /var/backups/savemart
sudo chmod +x /var/www/savemart/scripts/backup-db.sh

# Add to cron (runs daily at 2:00 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/savemart/scripts/backup-db.sh >> /var/log/savemart-backup.log 2>&1") | crontab -
```

---

## 8. Post-Deployment Verification Checklist

1. [ ] **DNS:** `dig savingmart.dk` points to `76.13.248.128`
2. [ ] **HTTPS:** `curl -I https://savingmart.dk` returns `HTTP/2 200`
3. [ ] **PM2 Status:** `pm2 status savemart` is `online`
4. [ ] **PostgreSQL Data:** `sudo -u postgres psql -d savemart_db -c "SELECT count(*) FROM products;"`
5. [ ] **Firewall:** `sudo ufw status` shows 22, 80, 443 ALLOWED
6. [ ] **Multi-Site Ready:** Additional domain configs can be added as `/etc/nginx/sites-available/<another-domain>` without touching savingmart.
