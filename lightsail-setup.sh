#!/bin/bash

# ParaFort AWS Lightsail Quick Setup Script
# This script automates the initial setup of your Lightsail instance

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root. Please run as ubuntu user."
fi

log "Starting ParaFort Lightsail Setup..."

# Update system
log "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
log "Installing essential packages..."
sudo apt install -y curl wget git unzip software-properties-common htop ufw fail2ban

# Install Node.js 18
log "Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js installation
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
log "Node.js installed: $NODE_VERSION"
log "npm installed: $NPM_VERSION"

# Install Docker
log "Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
rm get-docker.sh

# Install Docker Compose
log "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx
log "Installing Nginx..."
sudo apt install -y nginx
sudo systemctl enable nginx

# Configure UFW Firewall
log "Configuring firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5000/tcp

# Configure fail2ban
log "Configuring fail2ban..."
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Create application directory
log "Creating application directory..."
mkdir -p /home/ubuntu/parafort
mkdir -p /home/ubuntu/backups
mkdir -p /home/ubuntu/logs

# Set up log rotation
log "Setting up log rotation..."
sudo tee /etc/logrotate.d/parafort > /dev/null <<EOF
/home/ubuntu/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
}
EOF

# Create monitoring script
log "Creating monitoring script..."
sudo tee /usr/local/bin/monitor-parafort.sh > /dev/null <<'EOF'
#!/bin/bash
# ParaFort monitoring script

APP_URL="http://localhost:5000/api/health"
LOG_FILE="/home/ubuntu/logs/monitor.log"
APP_DIR="/home/ubuntu/parafort"

# Create log directory if it doesn't exist
mkdir -p /home/ubuntu/logs

if curl -f $APP_URL > /dev/null 2>&1; then
    echo "$(date): ParaFort is healthy" >> $LOG_FILE
else
    echo "$(date): ParaFort is down - attempting restart" >> $LOG_FILE
    cd $APP_DIR
    if [ -f "docker-compose.yml" ]; then
        docker-compose restart app >> $LOG_FILE 2>&1
        sleep 10
        if curl -f $APP_URL > /dev/null 2>&1; then
            echo "$(date): ParaFort restarted successfully" >> $LOG_FILE
        else
            echo "$(date): ParaFort restart failed" >> $LOG_FILE
        fi
    else
        echo "$(date): docker-compose.yml not found" >> $LOG_FILE
    fi
fi
EOF

sudo chmod +x /usr/local/bin/monitor-parafort.sh
sudo chown ubuntu:ubuntu /usr/local/bin/monitor-parafort.sh

# Create backup script
log "Creating backup script..."
sudo tee /usr/local/bin/backup-parafort.sh > /dev/null <<'EOF'
#!/bin/bash
# ParaFort backup script

BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/home/ubuntu/logs/backup.log"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR
mkdir -p /home/ubuntu/logs

echo "$(date): Starting backup" >> $LOG_FILE

# Check if DATABASE_URL is set
if [ -f "/home/ubuntu/parafort/.env.production" ]; then
    source /home/ubuntu/parafort/.env.production
    
    if [ ! -z "$DATABASE_URL" ]; then
        DB_BACKUP="$BACKUP_DIR/parafort_db_$DATE.sql"
        
        # Database backup
        if pg_dump "$DATABASE_URL" > "$DB_BACKUP" 2>> $LOG_FILE; then
            # Compress backup
            gzip "$DB_BACKUP"
            echo "$(date): Database backup completed - $DB_BACKUP.gz" >> $LOG_FILE
            
            # Keep only last 7 days of backups
            find $BACKUP_DIR -name "*.gz" -mtime +7 -delete
        else
            echo "$(date): Database backup failed" >> $LOG_FILE
        fi
    else
        echo "$(date): DATABASE_URL not found in environment" >> $LOG_FILE
    fi
else
    echo "$(date): Environment file not found" >> $LOG_FILE
fi

# Backup application files
APP_BACKUP="$BACKUP_DIR/parafort_app_$DATE.tar.gz"
if tar -czf "$APP_BACKUP" -C /home/ubuntu parafort --exclude=node_modules --exclude=dist 2>> $LOG_FILE; then
    echo "$(date): Application backup completed - $APP_BACKUP" >> $LOG_FILE
else
    echo "$(date): Application backup failed" >> $LOG_FILE
fi

echo "$(date): Backup process completed" >> $LOG_FILE
EOF

sudo chmod +x /usr/local/bin/backup-parafort.sh
sudo chown ubuntu:ubuntu /usr/local/bin/backup-parafort.sh

# Install PostgreSQL client for backups
log "Installing PostgreSQL client..."
sudo apt install -y postgresql-client

# Create SSL directory for certificates
log "Creating SSL directory..."
sudo mkdir -p /etc/nginx/ssl
sudo chown root:root /etc/nginx/ssl
sudo chmod 755 /etc/nginx/ssl

# Install Certbot for Let's Encrypt
log "Installing Certbot..."
sudo apt install -y snapd
sudo snap install core
sudo snap refresh core
sudo snap install --classic certbot
sudo ln -sf /snap/bin/certbot /usr/bin/certbot

# Create systemd service for ParaFort (optional)
log "Creating systemd service..."
sudo tee /etc/systemd/system/parafort.service > /dev/null <<EOF
[Unit]
Description=ParaFort Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/ubuntu/parafort
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0
User=ubuntu
Group=ubuntu

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload

# Set up cron jobs
log "Setting up cron jobs..."
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/monitor-parafort.sh") | crontab -
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-parafort.sh") | crontab -

# Create deployment helper script
log "Creating deployment helper..."
tee /home/ubuntu/deploy-parafort.sh > /dev/null <<'EOF'
#!/bin/bash
# ParaFort deployment helper

set -e

cd /home/ubuntu/parafort

echo "Pulling latest changes..."
git pull

echo "Building application..."
npm install
npm run build

echo "Building Docker image..."
docker-compose build

echo "Restarting services..."
docker-compose down
docker-compose up -d

echo "Waiting for application to start..."
sleep 10

echo "Checking health..."
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Deployment successful!"
else
    echo "❌ Deployment failed - check logs"
    docker-compose logs app
    exit 1
fi
EOF

chmod +x /home/ubuntu/deploy-parafort.sh

# Create environment template
log "Creating environment template..."
tee /home/ubuntu/parafort/.env.production.template > /dev/null <<'EOF'
# Production Environment Variables for ParaFort
# Copy this file to .env.production and fill in your values

# Database Configuration
DATABASE_URL=postgresql://username:password@host:5432/database_name

# Stripe Configuration (PRODUCTION KEYS)
STRIPE_SECRET_KEY=sk_live_your_production_secret_key
VITE_STRIPE_PUBLIC_KEY=pk_live_your_production_public_key

# Email Configuration
OUTLOOK_FROM_EMAIL=noreply@yourdomain.com
OUTLOOK_SMTP_PASSWORD=your_email_app_password

# AI Services
GEMINI_API_KEY=your_gemini_api_key

# Security
SESSION_SECRET=your_very_secure_32_character_secret_key

# Application Settings
NODE_ENV=production
PORT=5000
EOF

# Create quick status check script
log "Creating status check script..."
tee /home/ubuntu/status.sh > /dev/null <<'EOF'
#!/bin/bash
# Quick status check for ParaFort

echo "=== ParaFort Status Check ==="
echo

echo "🐳 Docker Status:"
docker --version
docker-compose --version
echo

echo "📦 Application Status:"
if [ -d "/home/ubuntu/parafort" ]; then
    cd /home/ubuntu/parafort
    if [ -f "docker-compose.yml" ]; then
        docker-compose ps
    else
        echo "❌ docker-compose.yml not found"
    fi
else
    echo "❌ Application directory not found"
fi
echo

echo "🏥 Health Check:"
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Application is healthy"
    curl -s http://localhost:5000/api/health | jq .
else
    echo "❌ Application health check failed"
fi
echo

echo "💾 System Resources:"
echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
echo "Memory Usage: $(free | grep Mem | awk '{printf "%.1f%%", $3/$2 * 100.0}')"
echo "Disk Usage: $(df -h / | awk 'NR==2{printf "%s", $5}')"
echo

echo "🔥 Firewall Status:"
sudo ufw status
echo

echo "📊 Recent Logs:"
if [ -f "/home/ubuntu/logs/monitor.log" ]; then
    echo "Last 5 monitoring entries:"
    tail -5 /home/ubuntu/logs/monitor.log
else
    echo "No monitoring logs found"
fi
EOF

chmod +x /home/ubuntu/status.sh

# Install jq for JSON parsing
sudo apt install -y jq

# Create welcome message
log "Creating welcome message..."
tee /home/ubuntu/README.md > /dev/null <<'EOF'
# ParaFort AWS Lightsail Instance

Welcome to your ParaFort production server!

## Quick Commands

- **Check Status**: `./status.sh`
- **Deploy Application**: `./deploy-parafort.sh`
- **View Logs**: `docker-compose logs -f app`
- **Restart Application**: `cd parafort && docker-compose restart`
- **Health Check**: `curl http://localhost:5000/api/health`

## Important Files

- **Application**: `/home/ubuntu/parafort/`
- **Environment**: `/home/ubuntu/parafort/.env.production`
- **Logs**: `/home/ubuntu/logs/`
- **Backups**: `/home/ubuntu/backups/`
- **Nginx Config**: `/etc/nginx/sites-available/default`
- **SSL Certificates**: `/etc/nginx/ssl/`

## Next Steps

1. Clone your ParaFort repository to `/home/ubuntu/parafort/`
2. Copy `.env.production.template` to `.env.production` and configure
3. Run `./deploy-parafort.sh` to deploy
4. Configure SSL certificates
5. Set up domain DNS

## Monitoring

- Health checks run every 5 minutes
- Backups run daily at 2 AM
- Logs are rotated daily
- Check `/home/ubuntu/logs/` for monitoring and backup logs

## Support

For issues, check:
1. Application logs: `docker-compose logs app`
2. System logs: `journalctl -u parafort`
3. Monitoring logs: `tail -f /home/ubuntu/logs/monitor.log`
4. Backup logs: `tail -f /home/ubuntu/logs/backup.log`
EOF

log "Setup completed successfully!"
info "Please reboot the system to ensure all changes take effect:"
info "sudo reboot"
echo
info "After reboot, you can:"
info "1. Clone your repository: git clone <your-repo> /home/ubuntu/parafort"
info "2. Configure environment: cp .env.production.template .env.production"
info "3. Deploy application: ./deploy-parafort.sh"
info "4. Check status: ./status.sh"
echo
warn "Don't forget to:"
warn "- Configure your domain DNS"
warn "- Set up SSL certificates"
warn "- Configure production environment variables"
warn "- Test all functionality"
echo
log "ParaFort Lightsail setup complete! 🚀"

# Display system info
echo
echo "=== System Information ==="
echo "OS: $(lsb_release -d | cut -f2)"
echo "Kernel: $(uname -r)"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Docker: $(docker --version | cut -d' ' -f3 | cut -d',' -f1)"
echo "Docker Compose: $(docker-compose --version | cut -d' ' -f3 | cut -d',' -f1)"
echo "Nginx: $(nginx -v 2>&1 | cut -d' ' -f3 | cut -d'/' -f2)"
echo "PostgreSQL Client: $(psql --version | cut -d' ' -f3)"
echo
echo "Instance is ready for ParaFort deployment!"