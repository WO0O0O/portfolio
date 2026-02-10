// === SMOOTH SCROLL & NAVIGATION ===
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // === INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ===
    const observerOptions = {
        root: null,
        rootMargin: '-100px',
        threshold: 0.2
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Update background color with smooth transition
                const bgColor = entry.target.getAttribute('data-bg-color');
                if (bgColor) {
                    document.body.style.backgroundColor = bgColor;
                }
                
                // Update active nav link
                updateActiveNavLink(entry.target.id);
            }
        });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Update active navigation link
    function updateActiveNavLink(sectionId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }

    // === PARALLAX EFFECT FOR HERO ===
    const heroSection = document.querySelector('.hero-section');
    const halftoneOverlay = document.querySelector('.halftone-overlay');
    
    window.addEventListener('scroll', () => {
        if (heroSection) {
            const scrolled = window.pageYOffset;
            const heroHeight = heroSection.offsetHeight;
            
            if (scrolled < heroHeight) {
                const opacity = 1 - (scrolled / heroHeight);
                heroSection.style.opacity = opacity;
                
                if (halftoneOverlay) {
                    halftoneOverlay.style.transform = `translateY(${scrolled * 0.3}px)`;
                }
            }
        }
    });

    // === SYNCOPATED REVEAL ANIMATIONS ===
    // Add stagger effect to elements within sections
    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    };

    const elementObserver = new IntersectionObserver(animateOnScroll, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe cards and items for staggered animation
    const animatedElements = document.querySelectorAll(
        '.skill-card, .album-card, .tour-date, .stat-item, .contact-method'
    );
    
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        elementObserver.observe(el);
    });

    // === JAZZ-THEMED CURSOR INTERACTION (Optional Enhancement) ===
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.3s ease';
        });
    });

    // === MOBILE MENU TOGGLE ===
    // Simple hamburger menu for mobile (you can expand this)
    const createMobileMenu = () => {
        if (window.innerWidth <= 640) {
            const nav = document.querySelector('.navbar');
            const navLinks = document.querySelector('.nav-links');
            
            // Check if menu button already exists
            if (!document.querySelector('.mobile-menu-btn')) {
                const menuBtn = document.createElement('button');
                menuBtn.className = 'mobile-menu-btn';
                menuBtn.innerHTML = '☰';
                menuBtn.style.cssText = `
                    background: none;
                    border: none;
                    color: var(--cream);
                    font-size: 2rem;
                    cursor: pointer;
                    display: block;
                `;
                
                nav.querySelector('.nav-content').appendChild(menuBtn);
                
                menuBtn.addEventListener('click', () => {
                    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
                    navLinks.style.position = 'absolute';
                    navLinks.style.top = '100%';
                    navLinks.style.left = '0';
                    navLinks.style.right = '0';
                    navLinks.style.background = 'rgba(13, 13, 13, 0.98)';
                    navLinks.style.flexDirection = 'column';
                    navLinks.style.padding = '2rem';
                    navLinks.style.gap = '1.5rem';
                });
            }
        }
    };

    createMobileMenu();
    window.addEventListener('resize', createMobileMenu);

    // === PERFORMANCE OPTIMIZATION ===
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = window.requestAnimationFrame(() => {
            // Additional scroll-based animations can go here
        });
    });

    // === PRELOAD ANIMATIONS ===
    // Trigger hero animations on load
    setTimeout(() => {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.classList.add('active');
        }
    }, 100);
});

// === UTILITY: SMOOTH COLOR TRANSITIONS ===
// This ensures body background transitions are always smooth
document.body.style.transition = 'background-color 1.2s cubic-bezier(0.4, 0, 0.2, 1)';

// === EASTER EGG: VINYL PLAYER (Placeholder for future implementation) ===
// When you're ready to add the vinyl player, you can use this structure:
/*
class VinylPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.vinyl = null;
        this.init();
    }
    
    init() {
        // Create vinyl player UI
        this.createPlayer();
        // Set up audio source - you can change this later
        this.audio.src = 'path/to/your/jazz-track.mp3';
    }
    
    createPlayer() {
        const player = document.createElement('div');
        player.className = 'vinyl-player';
        player.innerHTML = `
            <div class="vinyl-disc"></div>
            <button class="vinyl-btn">▶</button>
        `;
        // Style and position in corner
        // Add to document
    }
    
    toggle() {
        if (this.isPlaying) {
            this.audio.pause();
            // Stop vinyl rotation
        } else {
            this.audio.play();
            // Start vinyl rotation animation
        }
        this.isPlaying = !this.isPlaying;
    }
}

// To activate: const player = new VinylPlayer();
*/
