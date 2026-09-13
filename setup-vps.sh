#!/usr/bin/env bash
set -e

# ==============================================================================
# SavingMart Production VPS Setup Script (Hostinger KVM 1 - Ubuntu)
# Run as root once during initial server provisioning.
# ==============================================================================

echo ">>> [1/7] Updating system and installing base packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get upgrade -y
apt-get install -y ufw fail2ban curl git nginx certbot python3-certbot-nginx postgresql postgresql-contrib build-essential rsync

echo ">>> [2/7] Creating non-root 'deployer' user with SSH key access..."
if ! id -u deployer >/dev/null 2>&1; then
    adduser --disabled-password --gecos "" deployer
    usermod -aG sudo deployer
    echo "deployer ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/deployer
fi

mkdir -p /home/deployer/.ssh
if [ -f /root/.ssh/authorized_keys ]; then
    cp /root/.ssh/authorized_keys /home/deployer/.ssh/
fi
chown -R deployer:deployer /home/deployer/.ssh
chmod 700 /home/deployer/.ssh
chmod 600 /home/deployer/.ssh/authorized_keys 2>/dev/null || true

echo ">>> [3/7] Hardening SSH & Firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

systemctl enable --now fail2ban

echo ">>> [4/7] Installing Node.js 20 LTS & PM2..."
if ! command -v node >/dev/null 2>&1; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi
npm install -g pm2

echo ">>> [5/7] Provisioning PostgreSQL Database with secure random password..."
systemctl enable --now postgresql

# Generate high-entropy 32-char hex secret
DB_PASS=$(openssl rand -hex 16)
DB_USER="savemart_user"
DB_NAME="savemart_db"

sudo -u postgres psql << EOF
DO \$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME') THEN
      CREATE DATABASE $DB_NAME;
   END IF;
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DB_USER') THEN
      CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';
   ELSE
      ALTER USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASS';
   END IF;
END
\$\$;
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER DATABASE $DB_NAME OWNER TO $DB_USER;
EOF

sudo -u postgres psql -d $DB_NAME -c "GRANT ALL ON SCHEMA public TO $DB_USER;"

echo ">>> [6/7] Creating /var/www/savemart directory and .env owned by 'deployer'..."
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

echo ">>> [7/7] Configuring PM2 startup for deployer..."
env PATH=$PATH:/usr/bin pm2 startup systemd -u deployer --hp /home/deployer

echo "=========================================================================="
echo "✓ VPS Base Setup & Hardening Completed Successfully!"
echo "• Deployer user configured with SSH key access."
echo "• Database '$DB_NAME' configured with random secret."
echo "• Environment file created securely at /var/www/savemart/.env."
echo "• Ready for code rsync from local machine using: deployer@76.13.248.128"
echo "=========================================================================="
