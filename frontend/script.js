// ========================================
// PITSPOT AUTO - HOMEPAGE JAVASCRIPT
// ========================================

// ===== MOBILE MENU TOGGLE =====
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mainNav.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (mainNav.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  });

  // Close menu when clicking on a link
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mainNav.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !mainNav.contains(e.target)) {
      menuToggle.classList.remove('active');
      mainNav.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });
}

// ===== HEADER SCROLL EFFECT =====
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// ===== MOBILE CAROUSEL =====
const mobileSlides = document.querySelectorAll('.mobile-slide');
const indicators = document.querySelectorAll('.indicator');
let currentMobileSlide = 0;
let mobileCarouselInterval;

function showMobileSlide(index) {
  mobileSlides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  indicators.forEach((indicator, i) => {
    indicator.classList.toggle('active', i === index);
  });
}

function startMobileCarousel() {
  mobileCarouselInterval = setInterval(() => {
    currentMobileSlide = (currentMobileSlide + 1) % mobileSlides.length;
    showMobileSlide(currentMobileSlide);
  }, 3500); // Changed to 3.5 seconds for better viewing
}

function stopMobileCarousel() {
  clearInterval(mobileCarouselInterval);
}

function resetMobileCarousel() {
  stopMobileCarousel();
  startMobileCarousel();
}

// Initialize mobile carousel if slides exist
if (mobileSlides.length > 0) {
  startMobileCarousel();

  // Indicator click handlers
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentMobileSlide = index;
      showMobileSlide(currentMobileSlide);
      resetMobileCarousel();
    });
  });

  // Touch/Swipe functionality for mobile carousel
  let touchStartX = 0;
  let touchEndX = 0;
  const mobileCarousel = document.querySelector('.mobile-carousel');

  if (mobileCarousel) {
    mobileCarousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    mobileCarousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      const swipeThreshold = 50;
      
      if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left - next slide
        currentMobileSlide = (currentMobileSlide + 1) % mobileSlides.length;
        showMobileSlide(currentMobileSlide);
        resetMobileCarousel();
      } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - previous slide
        currentMobileSlide = (currentMobileSlide - 1 + mobileSlides.length) % mobileSlides.length;
        showMobileSlide(currentMobileSlide);
        resetMobileCarousel();
      }
    }
  }

  // Pause carousel on hover
  if (mobileCarousel) {
    mobileCarousel.addEventListener('mouseenter', stopMobileCarousel);
    mobileCarousel.addEventListener('mouseleave', startMobileCarousel);
  }
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId !== '#' && targetId !== '') {
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
});

// ===== INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS =====
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

// Add animation styles to elements
const animateElements = document.querySelectorAll('.feature-card, .featured-card, .testimonial-card, .stat-box');
animateElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ===== STATS COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + '+';
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + '+';
    }
  }, 16);
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumbers = document.querySelectorAll('.stat-number');
      statNumbers.forEach(stat => {
        const targetText = stat.textContent;
        const target = parseInt(targetText.replace(/\D/g, ''));
        if (!isNaN(target)) {
          stat.textContent = '0+';
          animateCounter(stat, target);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  statsObserver.observe(statsBar);
}

// ===== LAZY LOADING FOR IMAGES =====
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ===== FEATURED CARDS CLICK ANIMATION =====
document.querySelectorAll('.featured-card, .feature-card').forEach(card => {
  card.addEventListener('click', function(e) {
    // Add ripple effect
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    this.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
});

// Add ripple CSS dynamically
const style = document.createElement('style');
style.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(230, 57, 70, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
    z-index: 1;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ===== PERFORMANCE OPTIMIZATION: Debounce Function =====
function debounce(func, wait) {
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

// Optimize scroll event with debounce
const optimizedScrollHandler = debounce(() => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// ===== PRELOAD CRITICAL IMAGES =====
function preloadImages() {
  const criticalImages = [
    'assets/car1.png',
    'assets/car2.png',
    'assets/car3.png'
  ];
  
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

// ===== PAGE LOAD OPTIMIZATIONS =====
window.addEventListener('load', () => {
  // Preload images
  preloadImages();
  
  // Remove loading class if exists
  document.body.classList.remove('loading');
  
  // Initialize any third-party scripts here
  console.log('✅ PitSpot Auto Homepage loaded successfully!');
});

// ===== PREVENT LAYOUT SHIFT =====
// Add dimensions to images without them
document.querySelectorAll('img:not([width]):not([height])').forEach(img => {
  img.style.aspectRatio = '16/9';
});

// ===== ERROR HANDLING FOR IMAGES =====
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    this.src = 'https://placehold.co/800x450/cccccc/666666?text=Image+Unavailable';
    this.alt = 'Image unavailable';
  });
});

// ===== ACCESSIBILITY IMPROVEMENTS =====
// Add keyboard navigation for interactive elements
document.querySelectorAll('.featured-card, .feature-card, .cta-button, .view-details-btn').forEach(element => {
  element.setAttribute('tabindex', '0');
  
  element.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.click();
    }
  });
});

// ===== BACK TO TOP BUTTON (OPTIONAL) =====
function createBackToTopButton() {
  const button = document.createElement('button');
  button.innerHTML = '↑';
  button.className = 'back-to-top';
  button.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #e63946;
    color: white;
    border: none;
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 4px 12px rgba(230, 57, 70, 0.4);
  `;
  
  document.body.appendChild(button);
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      button.style.opacity = '1';
      button.style.visibility = 'visible';
    } else {
      button.style.opacity = '0';
      button.style.visibility = 'hidden';
    }
  });
  
  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  button.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1) translateY(-3px)';
    this.style.boxShadow = '0 6px 20px rgba(230, 57, 70, 0.6)';
  });

  button.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1) translateY(0)';
    this.style.boxShadow = '0 4px 12px rgba(230, 57, 70, 0.4)';
  });
}

// Initialize back to top button
createBackToTopButton();

// ===== VIDEO AUTOPLAY HANDLING =====
const heroVideo = document.getElementById('hero-video');
if (heroVideo) {
  // Ensure video plays on mobile
  heroVideo.addEventListener('loadeddata', () => {
    heroVideo.play().catch(error => {
      console.log('Video autoplay prevented:', error);
    });
  });

  // Pause video when not in viewport (performance optimization)
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        heroVideo.play().catch(() => {});
      } else {
        heroVideo.pause();
      }
    });
  }, { threshold: 0.5 });

  videoObserver.observe(heroVideo);
}

// ===== FORM VALIDATION (if contact forms exist) =====
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^[\d\s\-\+\(\)]+$/;
  return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// ===== WHATSAPP CLICK TO CHAT (OPTIONAL) =====
function initWhatsAppButton() {
  const whatsappNumber = '+2348020000298'; // Your number
  const whatsappButton = document.createElement('a');
  whatsappButton.href = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=Hello%20PitSpot%20Auto,%20I'm%20interested%20in%20your%20vehicles`;
  whatsappButton.target = '_blank';
  whatsappButton.rel = 'noopener noreferrer';
  whatsappButton.className = 'whatsapp-float';
  whatsappButton.innerHTML = `
    <svg viewBox="0 0 32 32" width="32" height="32">
      <path fill="currentColor" d="M16 0C7.164 0 0 7.163 0 16c0 2.84.744 5.508 2.05 7.82L.052 31.93l8.354-2.066A15.94 15.94 0 0016 32c8.836 0 16-7.163 16-16S24.836 0 16 0zm8.348 22.641c-.37.986-2.124 1.805-3.093 1.926-.746.092-1.717.165-2.777-.174-.645-.205-1.473-.478-2.528-.935-4.405-1.906-7.284-6.338-7.504-6.629-.22-.291-1.793-2.386-1.793-4.551 0-2.165 1.135-3.232 1.538-3.672.403-.44.88-.55 1.174-.55.294 0 .587.003.844.015.27.012.635-.103.993.757.37.875 1.258 3.074 1.368 3.297.11.223.183.484.037.775-.146.291-.22.473-.44.728-.22.255-.463.57-.66.765-.22.219-.448.455-.193.893.255.44 1.135 1.872 2.437 3.033 1.676 1.493 3.087 1.955 3.525 2.178.44.223.696.185.953-.11.256-.294 1.1-1.284 1.393-1.724.294-.44.587-.367.99-.22.403.146 2.565 1.21 3.005 1.43.44.22.733.33.843.513.11.183.11 1.058-.259 2.083z"/>
    </svg>
  `;
  whatsappButton.style.cssText = `
    position: fixed;
    bottom: 90px;
    right: 30px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #25D366;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
    z-index: 998;
    transition: all 0.3s ease;
    text-decoration: none;
  `;

  document.body.appendChild(whatsappButton);

  whatsappButton.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
    this.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.6)';
  });

  whatsappButton.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.4)';
  });

  // Show WhatsApp button after user scrolls
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      whatsappButton.style.opacity = '1';
      whatsappButton.style.visibility = 'visible';
    } else {
      whatsappButton.style.opacity = '0';
      whatsappButton.style.visibility = 'hidden';
    }
  });

  whatsappButton.style.opacity = '0';
  whatsappButton.style.visibility = 'hidden';
}

// Initialize WhatsApp button
initWhatsAppButton();

// ===== COOKIE CONSENT (OPTIONAL) =====
function showCookieConsent() {
  // Check if user has already consented
  if (localStorage.getItem('cookieConsent')) {
    return;
  }

  const cookieBanner = document.createElement('div');
  cookieBanner.className = 'cookie-consent';
  cookieBanner.innerHTML = `
    <div class="cookie-content">
      <p>🍪 We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
      <div class="cookie-buttons">
        <button class="cookie-accept">Accept</button>
        <button class="cookie-decline">Decline</button>
      </div>
    </div>
  `;
  cookieBanner.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(34, 34, 34, 0.98);
    color: white;
    padding: 1.5rem;
    z-index: 1000;
    box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
    animation: slideUp 0.4s ease;
  `;

  document.body.appendChild(cookieBanner);

  // Add styles for cookie banner elements
  const cookieStyle = document.createElement('style');
  cookieStyle.textContent = `
    @keyframes slideUp {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }
    
    .cookie-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
      flex-wrap: wrap;
    }
    
    .cookie-content p {
      margin: 0;
      flex: 1;
      min-width: 250px;
    }
    
    .cookie-buttons {
      display: flex;
      gap: 1rem;
    }
    
    .cookie-accept,
    .cookie-decline {
      padding: 10px 24px;
      border: none;
      border-radius: 25px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .cookie-accept {
      background: #e63946;
      color: white;
    }
    
    .cookie-accept:hover {
      background: #d62828;
      transform: translateY(-2px);
    }
    
    .cookie-decline {
      background: transparent;
      color: white;
      border: 1px solid white;
    }
    
    .cookie-decline:hover {
      background: white;
      color: #222;
    }
  `;
  document.head.appendChild(cookieStyle);

  // Handle accept
  cookieBanner.querySelector('.cookie-accept').addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    cookieBanner.style.animation = 'slideDown 0.4s ease';
    setTimeout(() => cookieBanner.remove(), 400);
  });

  // Handle decline
  cookieBanner.querySelector('.cookie-decline').addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'declined');
    cookieBanner.style.animation = 'slideDown 0.4s ease';
    setTimeout(() => cookieBanner.remove(), 400);
  });

  // Add slideDown animation
  const slideDownStyle = document.createElement('style');
  slideDownStyle.textContent = `
    @keyframes slideDown {
      from {
        transform: translateY(0);
      }
      to {
        transform: translateY(100%);
      }
    }
  `;
  document.head.appendChild(slideDownStyle);
}

// Show cookie consent after 2 seconds
setTimeout(showCookieConsent, 2000);

// ===== TESTIMONIALS AUTO-ROTATE (OPTIONAL) =====
function initTestimonialRotation() {
  const testimonials = document.querySelectorAll('.testimonial-card');
  if (testimonials.length === 0) return;

  let currentTestimonial = 0;
  const highlightClass = 'testimonial-highlight';

  // Add highlight styles
  const highlightStyle = document.createElement('style');
  highlightStyle.textContent = `
    .testimonial-highlight {
      border: 2px solid #e63946;
      transform: scale(1.02);
    }
  `;
  document.head.appendChild(highlightStyle);

  function rotateTestimonials() {
    testimonials.forEach(t => t.classList.remove(highlightClass));
    testimonials[currentTestimonial].classList.add(highlightClass);
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  }

  // Only rotate when section is visible
  const testimonialsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const interval = setInterval(rotateTestimonials, 4000);
        testimonialsObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const testimonialsSection = document.querySelector('.testimonials-section');
  if (testimonialsSection) {
    testimonialsObserver.observe(testimonialsSection);
  }
}

// Initialize testimonial rotation
initTestimonialRotation();

// ===== PERFORMANCE MONITORING =====
if ('PerformanceObserver' in window) {
  try {
    const perfObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log(`Resource loaded: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
      }
    });
    perfObserver.observe({ entryTypes: ['resource'] });
  } catch (e) {
    // PerformanceObserver not supported
  }
}

// ===== ANALYTICS TRACKING (Placeholder) =====
function trackEvent(category, action, label) {
  // Implement your analytics tracking here
  console.log(`Event tracked: ${category} - ${action} - ${label}`);
  
  // Example: Google Analytics
  // if (typeof gtag !== 'undefined') {
  //   gtag('event', action, {
  //     'event_category': category,
  //     'event_label': label
  //   });
  // }
}

// Track button clicks
document.querySelectorAll('.cta-button, .view-details-btn, .view-all-btn').forEach(button => {
  button.addEventListener('click', function() {
    const buttonText = this.textContent.trim();
    trackEvent('Button', 'Click', buttonText);
  });
});

// Track external links
document.querySelectorAll('a[target="_blank"]').forEach(link => {
  link.addEventListener('click', function() {
    trackEvent('External Link', 'Click', this.href);
  });
});

// ===== ERROR BOUNDARY =====
window.addEventListener('error', (event) => {
  console.error('JavaScript Error:', event.error);
  // You can send this to your error tracking service
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  // You can send this to your error tracking service
});

// ===== PAGE VISIBILITY API =====
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause any heavy operations when page is not visible
    stopMobileCarousel();
    if (heroVideo) {
      heroVideo.pause();
    }
  } else {
    // Resume operations when page becomes visible
    startMobileCarousel();
    if (heroVideo) {
      heroVideo.play().catch(() => {});
    }
  }
});


// ===== CONSOLE MESSAGE =====
console.log('%c🚗 Welcome to PitSpot Auto! 🚗', 'color: #e63946; font-size: 20px; font-weight: bold;');
console.log('%cWe\'re glad you\'re here. Find your dream car today!', 'color: #666; font-size: 14px;');
console.log('%c💼 Interested in working with us? Email: info@pitspotautos.com', 'color: #3498db; font-size: 12px;');

// ===== INITIALIZATION COMPLETE =====
console.log('✅ All scripts initialized successfully!');
console.log('📊 Page performance:', {
  loadTime: performance.now().toFixed(2) + 'ms',
  resources: performance.getEntriesByType('resource').length
});