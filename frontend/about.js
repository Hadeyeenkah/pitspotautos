// script_about.js

// ===================================
// 1. MOBILE MENU TOGGLE (For consistency)
// ===================================
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if (menuToggle && mainNav) {
        // Toggle menu on hamburger click
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking nav links
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// ===================================
// 2. SCROLL FADE-IN EFFECT (Intersection Observer)
// ===================================

function initScrollAnimation() {
    // Select all elements with the 'fade-in' class
    const observerElements = document.querySelectorAll('.fade-in');

    // Configuration for the observer
    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the element is visible
    };

    // The callback function executed when the observed element enters/leaves the viewport
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If element is intersecting (visible), add the 'visible' class
                entry.target.classList.add('visible');
                // Stop observing after the animation plays once
                observer.unobserve(entry.target);
            }
        });
    };

    // Create the Intersection Observer instance
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Start observing each element
    observerElements.forEach(element => {
        observer.observe(element);
    });
}

// ===================================
// 3. INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollAnimation();
    console.log('✅ About PitSpot Auto page initialized successfully with scroll animations.');
});
