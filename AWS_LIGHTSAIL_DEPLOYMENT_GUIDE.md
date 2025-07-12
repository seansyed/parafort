# AWS Lightsail Deployment Guide for ParaFort

This guide provides step-by-step instructions for deploying the ParaFort application to AWS Lightsail.

## 📋 Prerequisites

- AWS Account with billing enabled
- Domain name (optional but recommended)
- SSL certificate (for HTTPS)
- Production environment variables
- Basic knowledge of Linux commands

## 🚀 Step 1: Create AWS Lightsail Instance

### 1.1 Launch Instance
1. Go to [AWS Lightsail Console](https://lightsail.aws.amazon.com/)
2. Click **"Create instance"**
3. Choose **"Linux/Unix"** platform
4. Select **"Ubuntu 22.04 LTS"** blueprint
5. Choose instance plan:
   - **$10/month**: 1 GB RAM, 1 vCPU, 40 GB SSD (minimum)
   - **$20/month**: 2 GB RAM, 1 vCPU, 60 GB SSD (recommended)
   - **$40/month**: 4 GB RAM, 2 vCPU, 80 GB SSD (production)

### 1.2 Configure Instance
1. **Instance name**: `parafort-production`
2. **Key pair**: Create new or use existing
3. **Tags**: Add relevant tags for organization
4. Click **"Create instance"**

### 1.3 Configure Networking
1. Go to **"Networking"** tab
2. Create static IP:
   - Click **"Create static IP"**
   - Attach to your instance
   - Note the IP address

## 🔧 Step 2: Set Up Database

### Option A: Lightsail Managed Database (Recommended)
1. In Lightsail console, click **"Create database"**
2. Choose **"PostgreSQL"**
3. Select plan:
   - **$15/month**: 1 GB RAM, 40 GB SSD (minimum)
   - **$30/month**: 2 GB RAM, 80 GB SSD (recommended)
4. Configure:
   - **Database name**: `parafort_db`
   - **Master username**: `parafort`
   - **Master password**: Generate strong password
5. **Availability zone**: Same as your instance
6. Click **"Create database"**

### Option B: Self-hosted PostgreSQL
```bash
# Install PostgreSQL on your instance
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE parafort_db;
CREATE USER parafort WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE parafort_db TO parafort;
\q
```

## 🖥️ Step 3: Connect to Your Instance

### 3.1 SSH Connection
```bash
# Download your key pair and set permissions
chmod 400 your-key.pem

# Connect to instance
ssh -i your-key.pem ubuntu@YOUR_STATIC_IP
```

### 3.2 Initial Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git unzip software-properties-common

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

## 🐳 Step 4: Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes
exit
# Reconnect via SSH

# Verify installation
docker --version
docker-compose --version
```

## 📁 Step 5: Deploy Application

### 5.1 Clone Repository
```bash
# Clone your repository
git clone https://github.com/your-username/parafort.git
cd parafort

# Or upload files via SCP
# scp -i your-key.pem -r ./parafort ubuntu@YOUR_STATIC_IP:~/
```

### 5.2 Configure Environment
```bash
# Copy environment template
cp .env.production.template .env.production

# Edit environment file
nano .env.production
```

**Configure these variables in `.env.production`:**
```env
# Database (use your Lightsail database endpoint)
DATABASE_URL=postgresql://parafort:password@your-db-endpoint:5432/parafort_db

# Stripe (production keys)
STRIPE_SECRET_KEY=sk_live_your_production_key
VITE_STRIPE_PUBLIC_KEY=pk_live_your_production_key

# Email
OUTLOOK_FROM_EMAIL=noreply@yourdomain.com
OUTLOOK_SMTP_PASSWORD=your_email_password

# Security
SESSION_SECRET=your_very_secure_random_32_char_secret

# Production settings
NODE_ENV=production
PORT=5000
```

### 5.3 Build and Deploy
```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

## 🔒 Step 6: Configure SSL/HTTPS

### Option A: Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Get SSL certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Copy certificates to nginx directory
sudo mkdir -p /etc/nginx/ssl
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /etc/nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /etc/nginx/ssl/key.pem
```

### Option B: Upload Custom Certificate
```bash
# Create SSL directory
sudo mkdir -p /etc/nginx/ssl

# Upload your certificate files
sudo nano /etc/nginx/ssl/cert.pem  # Paste your certificate
sudo nano /etc/nginx/ssl/key.pem   # Paste your private key

# Set proper permissions
sudo chmod 600 /etc/nginx/ssl/key.pem
sudo chmod 644 /etc/nginx/ssl/cert.pem
```

## 🌐 Step 7: Configure Domain (Optional)

### 7.1 DNS Configuration
1. Go to your domain registrar
2. Add A record:
   - **Name**: `@` (or your subdomain)
   - **Value**: Your Lightsail static IP
   - **TTL**: 300
3. Add CNAME record for www:
   - **Name**: `www`
   - **Value**: `yourdomain.com`

### 7.2 Update Nginx Configuration
```bash
# Edit nginx config
sudo nano nginx.conf

# Update server_name
server_name yourdomain.com www.yourdomain.com;
```

## 🔥 Step 8: Configure Firewall

```bash
# Configure UFW firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5000/tcp

# Check status
sudo ufw status
```

### Lightsail Firewall
1. Go to Lightsail console
2. Click on your instance
3. Go to **"Networking"** tab
4. Add rules:
   - **HTTP**: Port 80
   - **HTTPS**: Port 443
   - **Custom**: Port 5000 (for direct access)

## 📊 Step 9: Set Up Monitoring

### 9.1 Application Monitoring
```bash
# Create monitoring script
sudo nano /usr/local/bin/monitor-parafort.sh
```

```bash
#!/bin/bash
# ParaFort monitoring script

APP_URL="http://localhost:5000/api/health"
LOG_FILE="/var/log/parafort-monitor.log"

if curl -f $APP_URL > /dev/null 2>&1; then
    echo "$(date): ParaFort is healthy" >> $LOG_FILE
else
    echo "$(date): ParaFort is down - restarting" >> $LOG_FILE
    cd /home/ubuntu/parafort
    docker-compose restart
fi
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/monitor-parafort.sh

# Add to crontab (check every 5 minutes)
sudo crontab -e
# Add this line:
*/5 * * * * /usr/local/bin/monitor-parafort.sh
```

### 9.2 Log Management
```bash
# Set up log rotation
sudo nano /etc/logrotate.d/parafort
```

```
/var/log/parafort-monitor.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 root root
}
```

## 🔄 Step 10: Backup Strategy

### 10.1 Database Backup
```bash
# Create backup script
sudo nano /usr/local/bin/backup-parafort.sh
```

```bash
#!/bin/bash
# ParaFort backup script

BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_BACKUP="$BACKUP_DIR/parafort_db_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
pg_dump $DATABASE_URL > $DB_BACKUP

# Compress backup
gzip $DB_BACKUP

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "$(date): Backup completed - $DB_BACKUP.gz"
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-parafort.sh

# Add to crontab (daily backup at 2 AM)
sudo crontab -e
# Add this line:
0 2 * * * /usr/local/bin/backup-parafort.sh
```

## 🚀 Step 11: Final Deployment

### 11.1 Start Services
```bash
cd /home/ubuntu/parafort

# Start with Docker Compose
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f app
```

### 11.2 Verify Deployment
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test external access
curl http://YOUR_STATIC_IP:5000/api/health

# Test HTTPS (if configured)
curl https://yourdomain.com/api/health
```

## 🛠️ Maintenance Commands

### Application Management
```bash
# View logs
docker-compose logs -f app

# Restart application
docker-compose restart app

# Update application
git pull
./deploy.sh

# Scale application (if needed)
docker-compose up -d --scale app=2
```

### Database Management
```bash
# Connect to database
psql $DATABASE_URL

# Manual backup
pg_dump $DATABASE_URL > backup.sql

# Restore backup
psql $DATABASE_URL < backup.sql
```

### System Monitoring
```bash
# Check system resources
htop
df -h
free -h

# Check Docker stats
docker stats

# Check application health
curl http://localhost:5000/api/health
```

## 🔧 Troubleshooting

### Common Issues

1. **Application won't start**
   ```bash
   # Check logs
   docker-compose logs app
   
   # Check environment variables
   docker-compose config
   ```

2. **Database connection issues**
   ```bash
   # Test database connection
   psql $DATABASE_URL -c "SELECT 1;"
   
   # Check database logs
   docker-compose logs db
   ```

3. **SSL certificate issues**
   ```bash
   # Check certificate validity
   openssl x509 -in /etc/nginx/ssl/cert.pem -text -noout
   
   # Renew Let's Encrypt certificate
   sudo certbot renew
   ```

4. **Performance issues**
   ```bash
   # Monitor resources
   docker stats
   
   # Check application metrics
   curl http://localhost:5000/api/health
   ```

## 📈 Scaling Considerations

### Vertical Scaling
- Upgrade Lightsail instance plan
- Increase database resources
- Add more CPU/RAM

### Horizontal Scaling
- Use Application Load Balancer
- Deploy multiple instances
- Implement session store (Redis)
- Use managed database service

## 🔐 Security Best Practices

1. **Regular Updates**
   ```bash
   sudo apt update && sudo apt upgrade
   docker-compose pull
   ```

2. **Firewall Configuration**
   - Only open necessary ports
   - Use security groups
   - Enable fail2ban

3. **SSL/TLS**
   - Use strong ciphers
   - Enable HSTS
   - Regular certificate renewal

4. **Database Security**
   - Strong passwords
   - Network isolation
   - Regular backups
   - Encryption at rest

## 📞 Support

For deployment issues:
1. Check application logs
2. Verify environment configuration
3. Test database connectivity
4. Review firewall settings
5. Check SSL certificate validity

---

**🎉 Congratulations!** Your ParaFort application is now deployed on AWS Lightsail and ready for production use.

**Next Steps:**
- Set up monitoring and alerting
- Configure automated backups
- Implement CI/CD pipeline
- Set up staging environment
- Configure domain and SSL
- Test all functionality

**Important URLs:**
- Application: `https://yourdomain.com`
- Health Check: `https://yourdomain.com/api/health`
- Admin Panel: `https://yourdomain.com/admin`

**Remember to:**
- Keep your environment variables secure
- Regularly update dependencies
- Monitor application performance
- Maintain regular backups
- Review security settings periodically