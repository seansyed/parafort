# 🚀 ParaFort AWS Lightsail Deployment

Complete deployment package for hosting ParaFort on AWS Lightsail with production-ready configuration.

## 📁 Deployment Files Overview

This deployment package includes:

- **`Dockerfile`** - Multi-stage Docker build configuration
- **`docker-compose.yml`** - Complete service orchestration
- **`nginx.conf`** - Production Nginx configuration with SSL
- **`deploy.sh`** - Automated deployment script
- **`lightsail-setup.sh`** - Server initialization script
- **`.env.production.template`** - Environment variables template
- **`AWS_LIGHTSAIL_DEPLOYMENT_GUIDE.md`** - Detailed step-by-step guide
- **`PRODUCTION_CHECKLIST.md`** - Pre-deployment verification checklist

## 🎯 Quick Start

### Option 1: Automated Setup (Recommended)

1. **Create Lightsail Instance**
   - Ubuntu 22.04 LTS
   - Minimum $20/month plan (2GB RAM)
   - Assign static IP

2. **Run Setup Script**
   ```bash
   # Upload and run the setup script
   scp -i your-key.pem lightsail-setup.sh ubuntu@YOUR_IP:~/
   ssh -i your-key.pem ubuntu@YOUR_IP
   chmod +x lightsail-setup.sh
   ./lightsail-setup.sh
   sudo reboot
   ```

3. **Deploy Application**
   ```bash
   # After reboot, clone your repository
   git clone https://github.com/your-username/parafort.git /home/ubuntu/parafort
   cd /home/ubuntu/parafort
   
   # Configure environment
   cp .env.production.template .env.production
   nano .env.production  # Fill in your values
   
   # Deploy
   ./deploy-parafort.sh
   ```

### Option 2: Manual Setup

Follow the detailed instructions in `AWS_LIGHTSAIL_DEPLOYMENT_GUIDE.md`

## 🔧 Configuration Requirements

### Environment Variables

Configure these in `.env.production`:

```env
# Database (use Lightsail managed database)
DATABASE_URL=postgresql://user:pass@db-endpoint:5432/parafort_db

# Stripe (PRODUCTION keys)
STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLIC_KEY=pk_live_...

# Email
OUTLOOK_FROM_EMAIL=noreply@yourdomain.com
OUTLOOK_SMTP_PASSWORD=your_app_password

# Security
SESSION_SECRET=your_32_character_random_secret

# Production
NODE_ENV=production
PORT=5000
```

### SSL Certificate

**Option A: Let's Encrypt (Free)**
```bash
sudo certbot certonly --standalone -d yourdomain.com
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /etc/nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /etc/nginx/ssl/key.pem
```

**Option B: Custom Certificate**
```bash
sudo nano /etc/nginx/ssl/cert.pem  # Paste certificate
sudo nano /etc/nginx/ssl/key.pem   # Paste private key
```

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │────│  ParaFort App   │────│   PostgreSQL    │
│   (Port 80/443) │    │   (Port 5000)   │    │   (Port 5432)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────│  Static Files   │──────────────┘
                        │   (/dist/public) │
                        └─────────────────┘
```

## 📊 Service Configuration

### Docker Services

- **app**: ParaFort application (Node.js + Express)
- **db**: PostgreSQL database (optional, use Lightsail managed DB)
- **nginx**: Reverse proxy with SSL termination

### Ports

- **80**: HTTP (redirects to HTTPS)
- **443**: HTTPS (main application)
- **5000**: Direct app access (internal)
- **5432**: PostgreSQL (internal)

### Health Monitoring

- **Health endpoint**: `/api/health`
- **Monitoring**: Every 5 minutes
- **Auto-restart**: On failure
- **Logging**: `/home/ubuntu/logs/`

## 🔒 Security Features

### Implemented Security

- ✅ HTTPS with SSL/TLS
- ✅ Security headers (HSTS, CSP, etc.)
- ✅ Rate limiting
- ✅ Firewall configuration
- ✅ Fail2ban protection
- ✅ Non-root container execution
- ✅ Environment variable protection
- ✅ Session security

### Security Headers

```nginx
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
```

## 📈 Performance Optimizations

### Enabled Features

- ✅ Gzip compression
- ✅ Static file caching
- ✅ Connection pooling
- ✅ Asset optimization
- ✅ HTTP/2 support
- ✅ Browser caching

### Performance Targets

- Page load: < 3 seconds
- API response: < 500ms
- Database queries: < 100ms
- Uptime: > 99.9%

## 🔄 Backup Strategy

### Automated Backups

- **Database**: Daily at 2 AM
- **Application files**: Daily
- **Retention**: 7 days
- **Location**: `/home/ubuntu/backups/`

### Manual Backup

```bash
# Database backup
pg_dump $DATABASE_URL > backup.sql

# Application backup
tar -czf app-backup.tar.gz /home/ubuntu/parafort
```

## 📊 Monitoring & Logging

### Available Logs

- **Application**: `docker-compose logs app`
- **Nginx**: `/var/log/nginx/`
- **Monitoring**: `/home/ubuntu/logs/monitor.log`
- **Backups**: `/home/ubuntu/logs/backup.log`
- **System**: `journalctl -u parafort`

### Monitoring Commands

```bash
# Quick status check
./status.sh

# Health check
curl https://yourdomain.com/api/health

# Resource usage
htop
docker stats

# Application logs
docker-compose logs -f app
```

## 🛠️ Maintenance Commands

### Application Management

```bash
# Deploy updates
./deploy-parafort.sh

# Restart services
docker-compose restart

# View logs
docker-compose logs -f app

# Scale application
docker-compose up -d --scale app=2
```

### System Maintenance

```bash
# Update system
sudo apt update && sudo apt upgrade

# Update Docker images
docker-compose pull

# Clean up old images
docker system prune -f

# Check disk space
df -h
```

## 🚨 Troubleshooting

### Common Issues

1. **Application won't start**
   ```bash
   docker-compose logs app
   docker-compose config
   ```

2. **Database connection failed**
   ```bash
   psql $DATABASE_URL -c "SELECT 1;"
   docker-compose logs db
   ```

3. **SSL certificate issues**
   ```bash
   sudo certbot renew
   openssl x509 -in /etc/nginx/ssl/cert.pem -text -noout
   ```

4. **Performance issues**
   ```bash
   docker stats
   curl https://yourdomain.com/api/health
   htop
   ```

### Emergency Procedures

- **Rollback**: `git checkout previous-version && ./deploy-parafort.sh`
- **Restore backup**: `psql $DATABASE_URL < backup.sql`
- **Emergency restart**: `docker-compose restart`

## 💰 Cost Estimation

### Lightsail Costs (Monthly)

- **Instance** ($20): 2GB RAM, 1 vCPU, 60GB SSD
- **Database** ($30): 2GB RAM, 80GB SSD
- **Static IP** ($0): Free with instance
- **Data Transfer** ($0): 3TB included

**Total**: ~$50/month for production setup

### Scaling Options

- **Vertical**: Upgrade instance plan
- **Horizontal**: Load balancer + multiple instances
- **Database**: Managed RDS for high availability

## 📞 Support & Resources

### Documentation

- **Detailed Guide**: `AWS_LIGHTSAIL_DEPLOYMENT_GUIDE.md`
- **Checklist**: `PRODUCTION_CHECKLIST.md`
- **AWS Lightsail**: [Official Documentation](https://docs.aws.amazon.com/lightsail/)

### Getting Help

1. Check application logs
2. Review environment configuration
3. Test database connectivity
4. Verify firewall settings
5. Check SSL certificate validity

### Useful Links

- [AWS Lightsail Console](https://lightsail.aws.amazon.com/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)

## 🎉 Success Checklist

After deployment, verify:

- [ ] Application accessible via HTTPS
- [ ] Health check responding
- [ ] User registration working
- [ ] Email sending functional
- [ ] Payment processing working
- [ ] Admin panel accessible
- [ ] SSL certificate valid
- [ ] Monitoring active
- [ ] Backups configured

## 🚀 Next Steps

After successful deployment:

1. **Set up monitoring alerts**
2. **Configure CI/CD pipeline**
3. **Implement staging environment**
4. **Set up CDN (CloudFront)**
5. **Configure auto-scaling**
6. **Implement advanced monitoring**
7. **Set up disaster recovery**

---

**🎯 Ready to Deploy?**

1. Review the `PRODUCTION_CHECKLIST.md`
2. Follow `AWS_LIGHTSAIL_DEPLOYMENT_GUIDE.md`
3. Use the automated setup scripts
4. Test thoroughly before going live

**Need Help?** Check the troubleshooting section or review the detailed deployment guide.

**🚀 Happy Deploying!**