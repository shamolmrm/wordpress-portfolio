# Samol Murmu - Portfolio Website Deployment Guide

## Overview
A premium, dark-themed personal portfolio website built for **Samol Murmu**, an AI Engineer & Full Stack Developer. This guide covers deployment on various platforms.

## 📁 Project Structure

```
portfolio/
├── index.html                    # Main HTML file
├── .htaccess                     # Apache configuration
├── robots.txt                    # SEO robots configuration
├── sitemap.xml                   # XML sitemap
├── site.webmanifest             # PWA manifest
├── assets/
│   ├── css/
│   │   ├── style.css            # Main stylesheet
│   │   ├── responsive.css       # Responsive breakpoints
│   │   └── dark-mode.css        # Light mode overrides
│   ├── js/
│   │   └── main.js              # All JavaScript functionality
│   ├── img/                     # Images directory
│   └── fonts/                   # Custom fonts directory
├── backend/
│   ├── config/
│   │   └── database.php         # Database configuration
│   ├── controllers/
│   │   └── contact.php          # Contact form handler
│   ├── models/                  # Database models (future)
│   └── routes/                  # API routes (future)
└── sql/
    └── schema.sql               # Database schema
```

## 🚀 Deployment Options

### Option 1: Shared Hosting (cPanel)

1. **Upload Files**
   - Compress all files into `portfolio.zip`
   - Upload via cPanel File Manager → Extract in `public_html/`
   - Or use FTP client (FileZilla) to upload to `public_html/`

2. **Configure Database** (for contact form)
   - Open phpMyAdmin → Import `sql/schema.sql`
   - Edit `backend/config/database.php` with your credentials

3. **Set Permissions**
   - Set `755` for directories
   - Set `644` for files
   - Set `755` for `backend/controllers/`

### Option 2: VPS / Dedicated Server (Ubuntu + Apache)

```bash
# 1. Connect via SSH
ssh user@your-server-ip

# 2. Install LAMP stack (if not installed)
sudo apt update && sudo apt upgrade -y
sudo apt install apache2 mysql-server php php-mysql php-curl php-gd php-mbstring php-xml -y

# 3. Configure Apache
sudo nano /etc/apache2/sites-available/portfolio.conf
```

Add this configuration:
```apache
<VirtualHost *:80>
    ServerName samolmurmu.com
    ServerAlias www.samolmurmu.com
    DocumentRoot /var/www/portfolio
    
    <Directory /var/www/portfolio>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/portfolio_error.log
    CustomLog ${APACHE_LOG_DIR}/portfolio_access.log combined
</VirtualHost>
```

```bash
# 4. Enable site and modules
sudo a2ensite portfolio.conf
sudo a2enmod rewrite
sudo a2enmod headers
sudo systemctl restart apache2

# 5. Upload files to /var/www/portfolio/
sudo chown -R www-data:www-data /var/www/portfolio/
sudo chmod -R 755 /var/www/portfolio/

# 6. Setup MySQL database
sudo mysql -u root -p < /var/www/portfolio/sql/schema.sql

# 7. Secure with SSL (Let's Encrypt)
sudo apt install certbot python3-certbot-apache -y
sudo certbot --apache -d samolmurmu.com -d www.samolmurmu.com
```

### Option 3: Nginx Server

```nginx
server {
    listen 80;
    server_name samolmurmu.com www.samolmurmu.com;
    root /var/www/portfolio;
    index index.html index.php;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ =404;
    }

    location /backend/ {
        try_files $uri $uri/ /backend/controllers/contact.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### Option 4: Netlify (Static Only)

1. Push to GitHub repository
2. Connect Netlify to your repo
3. Build command: (none needed)
4. Publish directory: `/`
5. Add redirect rule in `_redirects`:
   ```
   /backend/*  https://your-backend.com/backend/:splat  200!
   ```

### Option 5: Vercel (Static + Serverless)

1. Push to GitHub
2. Import project in Vercel
3. Framework: **Other**
4. Build command: (none)
5. Output directory: `./`

## ⚙️ Configuration

### Environment Variables
For production, set these in your hosting environment:

```php
// backend/config/database.php
DB_HOST = 'localhost'
DB_NAME = 'portfolio_db'
DB_USER = 'your_database_user'
DB_PASS = 'your_secure_password'
```

### Email Configuration
Update the email address in `backend/controllers/contact.php`:

```php
$to = 'hello@samolmurmu.com';
```

## 🔒 Security Checklist

- [ ] Enable HTTPS (SSL certificate)
- [ ] Set secure file permissions (755 dirs, 644 files)
- [ ] Disable directory listing (`Options -Indexes`)
- [ ] Hide PHP version (`expose_php = Off` in php.ini)
- [ ] Use strong database passwords
- [ ] Enable WAF (CloudFlare, ModSecurity)
- [ ] Regular backups
- [ ] Monitor error logs

## ⚡ Performance Optimization

1. **Enable Gzip/Brotli compression**
2. **Set browser caching headers**
3. **Optimize images** (WebP format recommended)
4. **Minify CSS and JS** (use tools like UglifyJS, CSSNano)
5. **Use CDN** (CloudFlare, jsDelivr for libraries)
6. **Lazy load images** (already implemented)
7. **Reduce DNS lookups** (preconnect already added)

## 📊 SEO Configuration

The site includes:
- ✅ Schema.org structured data (Person, ProfessionalService)
- ✅ Open Graph tags (Facebook, LinkedIn)
- ✅ Twitter Cards
- ✅ Canonical URL
- ✅ Meta keywords and description
- ✅ JSON-LD markup
- ✅ Sitemap reference

### Google Search Console Setup
1. Verify ownership via DNS TXT record or HTML file
2. Submit sitemap: `https://samolmurmu.com/sitemap.xml`
3. Monitor performance in Search Console

## 🔄 Maintenance

### Update Content
- **Projects**: Edit project cards in `index.html`
- **Blog**: Create new blog card sections in `index.html`
- **Testimonials**: Update carousel items in `index.html`
- **Skills**: Modify progress bars in `index.html`

### Database Backups
```bash
# Automated backup script
mysqldump -u root -p portfolio_db > backup_$(date +%Y%m%d).sql
```

## 📱 Testing

- Test on: Chrome, Firefox, Safari, Edge
- Mobile: iPhone 12/13/14, Samsung Galaxy S21/S22
- Tablet: iPad Pro, Samsung Tab
- Tools: Google Lighthouse, GTmetrix, PageSpeed Insights

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| 500 Internal Server Error | Check PHP error logs |
| 403 Forbidden | Fix file permissions (`chmod 755` for dirs) |
| Contact form not sending | Verify PHP mail() function or use SMTP |
| Images not loading | Check file paths and permissions |
| Dark/Light mode not working | Clear browser cache |
| Bootstrap not loading | Check CDN links are accessible |

## 📄 License

This portfolio is custom-built for **Samol Murmu**. All rights reserved.

---

**Built with ❤️ using HTML5, CSS3, Bootstrap 5, JavaScript, and PHP**