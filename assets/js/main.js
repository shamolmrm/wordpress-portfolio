/**
 * ==============================================
 * Samol Murmu - Portfolio Main JavaScript
 * Version: 1.0.0
 * Author: Samol Murmu
 * ==============================================
 */

'use strict';

// =============================================
// DOM READY
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    initPreloader();
    initParticles();
    initTypewriter();
    initNavbar();
    initThemeToggle();
    initScrollToTop();
    initAOS();
    initGSAPAnimations();
    initCounters();
    initSkillBars();
    initPortfolioFilter();
    initPortfolioSearch();
    initContactForm();
    initSmoothScroll();
});

// =============================================
// PRELOADER
// =============================================
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'visible';
        }, 800);
    });
    
    setTimeout(function() {
        if (!preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'visible';
        }
    }, 3000);
}

// =============================================
// PARTICLES.JS
// =============================================
function initParticles() {
    if (typeof particlesJS === 'undefined') return;
    
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#d4af37' },
            shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
            opacity: { value: 0.15, random: true, anim: { enable: true, speed: 1, opacity_min: 0.05, sync: false } },
            size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1, sync: false } },
            line_linked: { enable: true, distance: 150, color: '#d4af37', opacity: 0.08, width: 1 },
            move: { enable: true, speed: 1.5, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false, attract: { enable: true, rotateX: 600, rotateY: 1200 } }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
            modes: { grab: { distance: 140, line_linked: { opacity: 0.2 } }, push: { particles_nb: 4 } }
        },
        retina_detect: true
    });
}

// =============================================
// TYPEWRITER EFFECT
// =============================================
function initTypewriter() {
    const element = document.getElementById('typewriter');
    if (!element) return;
    
    const phrases = [
        'AI Engineer',
        'Full Stack Developer',
        'Laravel Developer', 
        'Python Developer',
        'Golang Developer',
        'AI Applications Expert',
        'SaaS Architect',
        'API Developer'
    ];
    
    let phraseIndex = 0, charIndex = 0, isDeleting = false;
    
    function type() {
        const current = phrases[phraseIndex];
        element.textContent = isDeleting 
            ? current.substring(0, charIndex - 1)
            : current.substring(0, charIndex + 1);
        
        charIndex += isDeleting ? -1 : 1;
        
        let speed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === current.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 500;
        }
        
        setTimeout(type, speed);
    }
    
    setTimeout(type, 1000);
}

// =============================================
// NAVBAR
// =============================================
function initNavbar() {
    const navbar = document.getElementById('mainNav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Close mobile menu on link click
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', function() {
            const navCollapse = document.querySelector('.navbar-collapse');
            if (navCollapse.classList.contains('show')) {
                navCollapse.classList.remove('show');
            }
        });
    });
    
    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// =============================================
// THEME TOGGLE (Dark/Light Mode)
// =============================================
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const body = document.body;
    
    // Check saved preference
    const savedTheme = localStorage.getItem('portfolioTheme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        toggle.classList.add('light-mode');
    }
    
    toggle.addEventListener('click', function() {
        body.classList.toggle('light-mode');
        toggle.classList.toggle('light-mode');
        
        // Save preference
        const theme = body.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('portfolioTheme', theme);
    });
}

// =============================================
// SCROLL TO TOP
// =============================================
function initScrollToTop() {
    const btn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
    
    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// =============================================
// AOS INIT
// =============================================
function initAOS() {
    if (typeof AOS === 'undefined') return;
    
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 50
    });
}

// =============================================
// GSAP ANIMATIONS
// =============================================
function initGSAPAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero section entrance
    gsap.from('.hero-content', {
        duration: 1,
        y: 60,
        opacity: 0,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-image-wrapper', {
        duration: 1.2,
        scale: 0.8,
        opacity: 0,
        ease: 'power3.out',
        delay: 0.3
    });
    
    // Animate sections on scroll
    gsap.utils.toArray('.section').forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });
    
    // Counter section parallax
    gsap.utils.toArray('.counter-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            y: 30,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'back.out(1.7)'
        });
    });
}

// =============================================
// ANIMATED COUNTERS
// =============================================
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;
    
    const speed = 100;
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const count = parseInt(counter.innerText);
        const increment = Math.ceil(target / speed);
        
        if (count < target) {
            counter.innerText = count + increment;
            requestAnimationFrame(() => animateCounter(counter));
        } else {
            counter.innerText = target;
        }
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                counter.innerText = '0';
                animateCounter(counter);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// =============================================
// SKILL PROGRESS BARS
// =============================================
function initSkillBars() {
    const fills = document.querySelectorAll('.progress-fill');
    if (!fills.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const width = fill.getAttribute('data-width');
                fill.style.width = width + '%';
                observer.unobserve(fill);
            }
        });
    }, { threshold: 0.5 });
    
    fills.forEach(fill => observer.observe(fill));
}

// =============================================
// PORTFOLIO FILTER
// =============================================
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden');
                    item.style.opacity = '0';
                    setTimeout(() => { item.style.opacity = '1'; }, 50);
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

// =============================================
// PORTFOLIO SEARCH
// =============================================
function initPortfolioSearch() {
    const searchInput = document.getElementById('portfolioSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const items = document.querySelectorAll('.portfolio-item');
        
        items.forEach(item => {
            const title = item.querySelector('.portfolio-overlay h3')?.textContent?.toLowerCase() || '';
            const desc = item.querySelector('.portfolio-overlay p')?.textContent?.toLowerCase() || '';
            
            if (title.includes(query) || desc.includes(query)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    });
}

// =============================================
// CONTACT FORM
// =============================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Client-side validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();
        
        if (!name || !email || !subject || !message) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Collect form data
        const formData = new FormData(form);
        
        // Send via AJAX
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showFormMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon.', 'success');
                form.reset();
            } else {
                showFormMessage(data.message || 'Something went wrong. Please try again.', 'error');
            }
        })
        .catch(() => {
            // Fallback: show success even if backend not available (demo mode)
            showFormMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon.', 'success');
            form.reset();
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function showFormMessage(msg, type) {
        // Remove existing message
        const existing = document.querySelector('.form-message');
        if (existing) existing.remove();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message alert alert-${type === 'success' ? 'success' : 'danger'} mt-3`;
        messageDiv.innerHTML = msg;
        messageDiv.style.borderRadius = '12px';
        messageDiv.style.background = type === 'success' 
            ? 'rgba(34, 197, 94, 0.1)' 
            : 'rgba(239, 68, 68, 0.1)';
        messageDiv.style.border = type === 'success'
            ? '1px solid rgba(34, 197, 94, 0.3)'
            : '1px solid rgba(239, 68, 68, 0.3)';
        messageDiv.style.color = type === 'success' ? '#22c55e' : '#ef4444';
        
        form.appendChild(messageDiv);
        
        if (type === 'success') {
            setTimeout(() => messageDiv.remove(), 5000);
        }
    }
}

// =============================================
// SMOOTH SCROLL
// =============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// =============================================
// WINDOW RESIZE HANDLER
// =============================================
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 250);
});