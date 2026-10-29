-- =============================================
-- Portfolio Database Schema
-- Samol Murmu - Portfolio Website
-- Target: MySQL 8.0+
-- =============================================

-- Create database
CREATE DATABASE IF NOT EXISTS portfolio_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE portfolio_db;

-- =============================================
-- CONTACTS TABLE
-- Stores contact form submissions
-- =============================================
CREATE TABLE IF NOT EXISTS contacts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT 'Sender full name',
    email VARCHAR(255) NOT NULL COMMENT 'Sender email address',
    phone VARCHAR(50) DEFAULT NULL COMMENT 'Sender phone number',
    subject VARCHAR(200) NOT NULL COMMENT 'Message subject',
    message TEXT NOT NULL COMMENT 'Message content',
    ip_address VARCHAR(45) DEFAULT NULL COMMENT 'Sender IP address',
    is_read TINYINT(1) NOT NULL DEFAULT 0 COMMENT '0=Unread, 1=Read',
    is_replied TINYINT(1) NOT NULL DEFAULT 0 COMMENT '0=Not replied, 1=Replied',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Submission timestamp',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
    
    INDEX idx_contacts_is_read (is_read),
    INDEX idx_contacts_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Contact form submissions';

-- =============================================
-- PROJECTS TABLE
-- Stores portfolio projects
-- =============================================
CREATE TABLE IF NOT EXISTS projects (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL COMMENT 'Project title',
    slug VARCHAR(255) NOT NULL UNIQUE COMMENT 'URL-friendly slug',
    description TEXT COMMENT 'Project description',
    category VARCHAR(50) DEFAULT NULL COMMENT 'AI, SaaS, Web, Mobile, Automation',
    technologies JSON DEFAULT NULL COMMENT 'JSON array of technologies used',
    image_url VARCHAR(500) DEFAULT NULL COMMENT 'Project image URL',
    github_url VARCHAR(500) DEFAULT NULL COMMENT 'GitHub repository URL',
    live_url VARCHAR(500) DEFAULT NULL COMMENT 'Live demo URL',
    is_featured TINYINT(1) NOT NULL DEFAULT 0 COMMENT '0=Normal, 1=Featured',
    sort_order INT DEFAULT 0 COMMENT 'Display order',
    is_active TINYINT(1) NOT NULL DEFAULT 1 COMMENT '0=Hidden, 1=Visible',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_projects_category (category),
    INDEX idx_projects_featured (is_featured),
    INDEX idx_projects_active (is_active),
    INDEX idx_projects_sort (sort_order),
    FULLTEXT idx_projects_search (title, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Portfolio projects';

-- Insert sample projects
INSERT INTO projects (title, slug, description, category, technologies, image_url, github_url, live_url, is_featured, sort_order) VALUES
('AI Chatbot Platform', 'ai-chatbot-platform', 'Intelligent chatbot solution with GPT-4 integration, multi-language support, and analytics dashboard for business customer engagement.', 'AI', '["Laravel","OpenAI","Python","MySQL"]', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop', '#', '#', 1, 1),
('Restaurant Management System', 'restaurant-management-system', 'Complete restaurant management solution with POS, inventory tracking, online ordering, table booking, and staff management.', 'Web', '["Laravel","Bootstrap","MySQL","JavaScript"]', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop', '#', '#', 1, 2),
('Hospital Management System', 'hospital-management-system', 'Comprehensive hospital management with patient records, appointment scheduling, billing, pharmacy management, and reporting.', 'SaaS', '["Laravel","Python","PostgreSQL","Bootstrap"]', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop', '#', '#', 1, 3),
('Gym Management System', 'gym-management-system', 'Fully featured gym management with member tracking, workout plans, payment processing, attendance, and class scheduling.', 'Web', '["Laravel","Bootstrap","MySQL","JavaScript"]', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop', '#', '#', 1, 4),
('E-commerce Platform', 'ecommerce-platform', 'Scalable e-commerce solution with multi-vendor support, payment gateway integration, inventory management, and analytics.', 'SaaS', '["Laravel","React","MongoDB","Node.js"]', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop', '#', '#', 1, 5),
('School Management System', 'school-management-system', 'Complete school management with student records, grade management, attendance, timetable, parent portal, and communication tools.', 'SaaS', '["Laravel","Python","MySQL","Bootstrap"]', 'https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=600&h=400&fit=crop', '#', '#', 1, 6);

-- =============================================
-- BLOG POSTS TABLE
-- Stores blog content
-- =============================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT COMMENT 'Short description',
    content LONGTEXT COMMENT 'Full article content',
    category VARCHAR(50) DEFAULT NULL COMMENT 'AI, Laravel, Python, Golang, SaaS, Technology',
    image_url VARCHAR(500) DEFAULT NULL,
    author VARCHAR(100) DEFAULT 'Samol Murmu',
    read_time INT DEFAULT 5 COMMENT 'Estimated read time in minutes',
    is_published TINYINT(1) NOT NULL DEFAULT 1,
    published_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_blog_category (category),
    INDEX idx_blog_published (is_published, published_at),
    FULLTEXT idx_blog_search (title, excerpt, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Blog posts';

-- =============================================
-- TESTIMONIALS TABLE
-- Stores client testimonials
-- =============================================
CREATE TABLE IF NOT EXISTS testimonials (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    client_title VARCHAR(200) DEFAULT NULL COMMENT 'Position and Company',
    client_country VARCHAR(100) DEFAULT NULL,
    client_image VARCHAR(500) DEFAULT NULL,
    rating TINYINT UNSIGNED DEFAULT 5 COMMENT '1-5 stars',
    feedback TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_testimonials_active (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Client testimonials';

-- Insert sample testimonials
INSERT INTO testimonials (client_name, client_title, client_country, client_image, rating, feedback, sort_order) VALUES
('John Smith', 'CEO, TechStart Inc.', 'USA', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', 5, 'Samol is an exceptional developer. He built our AI-powered customer service platform that transformed our business operations. Highly recommended!', 1),
('Sarah Johnson', 'CTO, DataFlow Ltd.', 'UK', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', 5, 'Outstanding Laravel expertise! Samol delivered our SaaS platform ahead of schedule and exceeded our expectations. The code quality is superb.', 2),
('Michael Chen', 'Founder, CloudBase', 'Canada', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', 5, 'Working with Samol was a pleasure. His AI integration skills are top-notch. He helped us automate our entire customer support system.', 3);

-- =============================================
-- SERVICES TABLE
-- Stores service offerings
-- =============================================
CREATE TABLE IF NOT EXISTS services (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon VARCHAR(50) DEFAULT NULL COMMENT 'Font Awesome icon class',
    pricing_range VARCHAR(50) DEFAULT NULL COMMENT 'e.g., Starting from $500',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_services_active (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Service offerings';

-- =============================================
-- SUBSCRIBERS TABLE
-- Stores newsletter subscribers
-- =============================================
CREATE TABLE IF NOT EXISTS subscribers (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP NULL DEFAULT NULL,
    
    INDEX idx_subscribers_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Newsletter subscribers';

-- =============================================
-- VISITOR LOGS TABLE
-- Tracks site visitors (basic analytics)
-- =============================================
CREATE TABLE IF NOT EXISTS visitor_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    page_visited VARCHAR(500) DEFAULT NULL,
    referrer_url VARCHAR(500) DEFAULT NULL,
    country_code VARCHAR(2) DEFAULT NULL,
    visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_visitor_date (visited_at),
    INDEX idx_visitor_ip (ip_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Visitor activity logs';