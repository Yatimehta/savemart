#!/usr/bin/env bash
set -e

echo "==========================================="
echo "  SaveMart Production VPS Setup (Hostinger) "
echo "==========================================="

# 1. Update and install basic dependencies
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install -y curl git nginx ufw build-essential

# 2. Install Node.js (v20 LTS) & PM2
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

sudo npm install -g pm2

# 3. Configure Firewall (UFW)
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "PM2 version: $(pm2 -v)"
echo "VPS Base Environment configured successfully!"
