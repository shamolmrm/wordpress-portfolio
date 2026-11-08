# Samol Murmu — Portfolio website

Dark-themed personal portfolio for an AI Engineer & Full Stack Developer (Laravel, Python, Golang). Static front end with a small PHP + MySQL backend for the contact form.

## Features
- Single-page portfolio: about, skills, projects, experience, contact
- Dark / light mode, fully responsive
- Contact form saved to MySQL (`backend/controllers/contact.php`)
- SEO: `robots.txt`, `sitemap.xml`, meta tags; Apache `.htaccess`

## Structure
```
index.html              main page
assets/css, assets/js   styles and scripts
backend/config          database connection
backend/controllers     contact form handler
sql/schema.sql          database tables
```

## Deploy
1. Upload the files to any PHP + MySQL host (Apache).
2. Import `sql/schema.sql`.
3. Set database credentials in `backend/config/database.php` (keep real passwords out of Git).

Full guide: [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md)
