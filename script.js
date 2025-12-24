// Navigation Toggle for Mobile
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Smooth scroll with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            // For hero to story transition, scroll directly to story section
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhance scroll indicator functionality
const scrollIndicator = document.querySelector('.scroll-indicator a');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function(e) {
        e.preventDefault();
        const storySection = document.querySelector('#story');
        if (storySection) {
            storySection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animations
const animateElements = document.querySelectorAll('.story-grid, .timeline-item, .detail-card, .thing-card, .stay-card, .travel-card, .gallery-item');

animateElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
});

// Add parallax effect to hero section
const hero = document.querySelector('.hero');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;

    if (hero) {
        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
});

// Gallery lightbox with navigation
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
        const imgs = galleryItems.map(i => i.querySelector('img'));
        let currentIndex = idx;

        const createLightbox = (index) => {
            const img = imgs[index];
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <button class="lightbox-prev" aria-label="Previous image">◀</button>
                    <img src="${img.src}" alt="${img.alt}">
                    <button class="lightbox-next" aria-label="Next image">▶</button>
                    <button class="lightbox-close" aria-label="Close">&times;</button>
                </div>
            `;

            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';

            // Styles
            lightbox.style.cssText = `position: fixed;top: 0;left: 0;right: 0;bottom: 0;background: rgba(0,0,0,0.95);z-index:10000;display:flex;align-items:center;justify-content:center;`;
            const lbContent = lightbox.querySelector('.lightbox-content');
            lbContent.style.cssText = `position: relative; max-width: 90%; max-height: 90vh; display:flex; align-items:center; gap:1rem;`;
            const lbImg = lbContent.querySelector('img');
            lbImg.style.cssText = `max-width: 100%; max-height: 90vh; border-radius:10px; box-shadow:0 10px 50px rgba(0,0,0,0.5);`;

            const prevBtn = lightbox.querySelector('.lightbox-prev');
            const nextBtn = lightbox.querySelector('.lightbox-next');
            const closeBtn = lightbox.querySelector('.lightbox-close');

            [prevBtn, nextBtn, closeBtn].forEach(btn => {
                btn.style.cssText = `background: rgba(255,255,255,0.06); border:none; color:white; padding:0.6rem 0.9rem; border-radius:6px; cursor:pointer; font-size:18px;`;
            });

            const showImage = (i) => {
                currentIndex = (i + imgs.length) % imgs.length;
                const nextImg = imgs[currentIndex];
                lbImg.src = nextImg.src;
                lbImg.alt = nextImg.alt;
            };

            const closeLightbox = () => {
                document.removeEventListener('keydown', keyHandler);
                lightbox.remove();
                document.body.style.overflow = 'auto';
            };

            const keyHandler = (e) => {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
                if (e.key === 'ArrowRight') showImage(currentIndex + 1);
            };

            prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
            nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
            closeBtn.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
            document.addEventListener('keydown', keyHandler);
        };

        createLightbox(currentIndex);
    });

    // Add pointer cursor
    item.style.cursor = 'pointer';
});

// Countdown timer to wedding ceremony
function createCountdown() {
    const weddingDate = new Date('January 3, 2026 14:30:00').getTime();

    const countdownTimer = setInterval(() => {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update countdown display
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');

        if (distance < 0) {
            clearInterval(countdownTimer);
            const messageEl = document.querySelector('.countdown-message');
            if (messageEl) {
                messageEl.textContent = 'The big day is here!';
            }
        }
    }, 1000);
}

// Lazy loading images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add smooth hover effects to cards
const cards = document.querySelectorAll('.detail-card, .thing-card, .stay-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// Initialize animations on page load
window.addEventListener('load', () => {
    // Add loaded class to body for any CSS animations
    document.body.classList.add('loaded');

    // Start countdown
    createCountdown();
});

// Prevent scroll when mobile menu is open
navMenu.addEventListener('transitionend', () => {
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});

// Add loading animation
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Performance optimization: Debounce scroll events
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handlers
const debouncedScrollHandler = debounce(() => {
    // Your scroll handling code here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

console.log('Wedding website loaded successfully! 💒');
