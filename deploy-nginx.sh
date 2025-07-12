#!/bin/bash

# ParaFort Nginx Deployment Script
# This script sets up Nginx reverse proxy for the ParaFort application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="parafort.com"
APP_PORT="3000"
NGINX_SITES_AVAILABLE="/etc/nginx/sites-available"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"
WWW_ROOT="/var/www/parafort"

echo -e "${GREEN}Starting ParaFort Nginx deployment...${NC}"

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root${NC}"
   exit 1
fi

# Update system packages
echo -e "${YELLOW}Updating system packages...${NC}"
apt update && apt upgrade -y

# Install Nginx if not already installed
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}Installing Nginx...${NC}"
    apt install nginx -y
else
    echo -e "${GREEN}Nginx is already installed${NC}"
fi

# Install Certbot for SSL certificates
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}Installing Certbot...${NC}"
    apt install certbot python3-certbot-nginx -y
else
    echo -e "${GREEN}Certbot is already installed${NC}"
fi

# Create web root directory
echo -e "${YELLOW}Creating web root directory...${NC}"
mkdir -p $WWW_ROOT/public
chown -R www-data:www-data $WWW_ROOT

# Create log directory
mkdir -p /var/log/nginx
chown -R www-data:adm /var/log/nginx

# Copy proxy parameters
echo -e "${YELLOW}Setting up proxy parameters...${NC}"
cp nginx-proxy-params.conf /etc/nginx/proxy_params

# Copy site configuration
echo -e "${YELLOW}Setting up site configuration...${NC}"
cp nginx-site.conf $NGINX_SITES_AVAILABLE/parafort

# Enable the site
if [ ! -L "$NGINX_SITES_ENABLED/parafort" ]; then
    ln -s $NGINX_SITES_AVAILABLE/parafort $NGINX_SITES_ENABLED/parafort
    echo -e "${GREEN}Site enabled${NC}"
fi

# Remove default Nginx site if it exists
if [ -L "$NGINX_SITES_ENABLED/default" ]; then
    rm $NGINX_SITES_ENABLED/default
    echo -e "${YELLOW}Removed default Nginx site${NC}"
fi

# Test Nginx configuration
echo -e "${YELLOW}Testing Nginx configuration...${NC}"
if nginx -t; then
    echo -e "${GREEN}Nginx configuration is valid${NC}"
else
    echo -e "${RED}Nginx configuration has errors${NC}"
    exit 1
fi

# Start and enable Nginx
echo -e "${YELLOW}Starting Nginx service...${NC}"
systemctl start nginx
systemctl enable nginx

# Configure firewall
echo -e "${YELLOW}Configuring firewall...${NC}"
if command -v ufw &> /dev/null; then
    ufw allow 'Nginx Full'
    ufw allow ssh
    echo -e "${GREEN}Firewall configured${NC}"
fi

# Setup SSL certificate with Certbot
echo -e "${YELLOW}Setting up SSL certificate...${NC}"
echo -e "${YELLOW}Note: Make sure your domain points to this server before running certbot${NC}"
read -p "Do you want to obtain SSL certificate now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    
    # Setup auto-renewal
    echo -e "${YELLOW}Setting up SSL certificate auto-renewal...${NC}"
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
fi

# Reload Nginx
echo -e "${YELLOW}Reloading Nginx...${NC}"
systemctl reload nginx

# Create a simple health check endpoint test
echo -e "${YELLOW}Testing reverse proxy...${NC}"
if curl -f http://localhost/health &> /dev/null; then
    echo -e "${GREEN}Reverse proxy is working${NC}"
else
    echo -e "${YELLOW}Health check failed - make sure your Node.js app is running on port $APP_PORT${NC}"
fi

# Display status
echo -e "${GREEN}\n=== Deployment Summary ===${NC}"
echo -e "Domain: $DOMAIN"
echo -e "App Port: $APP_PORT"
echo -e "Web Root: $WWW_ROOT"
echo -e "Nginx Status: $(systemctl is-active nginx)"
echo -e "SSL Certificate: $(if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then echo "Installed"; else echo "Not installed"; fi)"

echo -e "\n${GREEN}Nginx reverse proxy deployment completed!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Start your Node.js application on port $APP_PORT"
echo -e "2. Update DNS records to point to this server"
echo -e "3. Test the application at https://$DOMAIN"
echo -e "4. Monitor logs: tail -f /var/log/nginx/parafort_access.log"

# Create useful aliases
echo -e "\n${YELLOW}Creating useful aliases...${NC}"
cat >> /root/.bashrc << 'EOF'

# ParaFort Nginx aliases
alias nginx-reload='systemctl reload nginx'
alias nginx-restart='systemctl restart nginx'
alias nginx-status='systemctl status nginx'
alias nginx-test='nginx -t'
alias nginx-logs='tail -f /var/log/nginx/parafort_access.log'
alias nginx-errors='tail -f /var/log/nginx/parafort_error.log'
EOF

echo -e "${GREEN}Deployment script completed successfully!${NC}"