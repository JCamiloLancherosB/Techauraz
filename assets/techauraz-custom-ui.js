/**
 * =============================================================================
 * TECHAURAZ CUSTOM UI COMPONENTS - JAVASCRIPT
 * =============================================================================
 * Consolidated JS for WhatsApp button, Cookie banner, and scroll optimizations
 * Extracted from inline scripts to improve maintainability
 */

/* =============================================================================
   WHATSAPP BUTTON ANIMATIONS
   ============================================================================= */
(function() {
  'use strict';

  // WhatsApp button animations - load on idle to reduce main thread blocking
  if ('requestIdleCallback' in window) {
    requestIdleCallback(function() {
      initWhatsAppButton();
    }, { timeout: 3000 });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(initWhatsAppButton, 2000);
  }
  
  function initWhatsAppButton() {
    const whatsappBtn = document.querySelector('.whatsapp-button');
    if (!whatsappBtn) return;
    
    // Initial shake after delay
    setTimeout(() => {
      whatsappBtn.classList.add('shake');
      setTimeout(() => whatsappBtn.classList.remove('shake'), 500);
    }, 1000);

    // Periodic shake
    setInterval(() => {
      whatsappBtn.classList.add('shake');
      setTimeout(() => whatsappBtn.classList.remove('shake'), 500);
    }, 15000);

    // Track clicks (only if gtag is loaded)
    whatsappBtn.addEventListener('click', function() {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          'event_category': 'WhatsApp',
          'event_label': 'Floating Button Click'
        });
      }
    });
  }
})();

/* =============================================================================
   COOKIE BANNER
   ============================================================================= */
(function() {
  'use strict';

  // Configuration constants
  const COOKIE_CONSENT_KEY = 'techauraz_cookie_consent';
  const BANNER_DELAY_MS = 1000;
  const WHATSAPP_OFFSET_MOBILE = '10rem';
  const WHATSAPP_OFFSET_DESKTOP = '8rem';
  
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');
  
  if (!banner) return; // Exit if banner element doesn't exist
  
  // Check if consent was already given
  function hasConsent() {
    return localStorage.getItem(COOKIE_CONSENT_KEY) !== null;
  }
  
  // Show banner with animation
  function showBanner() {
    if (!hasConsent()) {
      setTimeout(() => {
        // Remove hidden class if present (from previous session)
        banner.classList.remove('is-hidden');
        banner.classList.add('is-visible');
        updateWhatsAppPosition();
      }, BANNER_DELAY_MS);
    }
  }
  
  // Hide banner
  function hideBanner() {
    banner.classList.remove('is-visible');
    banner.classList.add('is-hidden');
    updateWhatsAppPosition();
  }
  
  // Update WhatsApp button position based on banner visibility
  function updateWhatsAppPosition() {
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
      if (banner.classList.contains('is-visible')) {
        // Move WhatsApp button up when banner is visible
        const isMobile = window.matchMedia('(max-width: 749px)').matches;
        whatsappBtn.style.bottom = isMobile ? WHATSAPP_OFFSET_MOBILE : WHATSAPP_OFFSET_DESKTOP;
      } else {
        // Reset to original position
        whatsappBtn.style.bottom = '';
      }
    }
  }
  
  // Save consent
  function saveConsent(type) {
    const consent = {
      type: type, // 'all' or 'essential'
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    hideBanner();
    
    // Trigger custom event for analytics
    window.dispatchEvent(new CustomEvent('cookieConsentGiven', { detail: consent }));
  }
  
  // Event listeners
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => saveConsent('all'));
  }
  
  if (declineBtn) {
    declineBtn.addEventListener('click', () => saveConsent('essential'));
  }
  
  // Initialize
  showBanner();
})();

/* =============================================================================
   SCROLL OPTIMIZATION
   ============================================================================= */
(function() {
  'use strict';

  // Defer de scripts de terceros
  function loadScriptDefer(src, id) {
    if(document.getElementById(id)) return;
    var script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.defer = true;
    document.body.appendChild(script);
  }
  
  // Defer non-critical scripts using requestIdleCallback
  if ('requestIdleCallback' in window) {
    requestIdleCallback(function() {
      // Load third-party widgets in idle time
      // Here go widgets like Tidio, Klaviyo, etc. if needed
    }, { timeout: 5000 });
  } else {
    // Fallback: use setTimeout for older browsers
    window.addEventListener('load', function() {
      setTimeout(function() {
        // Here go widgets like Tidio, Klaviyo, etc.
      }, 3000);
    });
  }
  
  // Optimize scroll handlers - consolidate into one with debounce
  let scrollTicking = false;
  let lastScrollY = 0;
  
  function handleScroll() {
    lastScrollY = window.scrollY || window.pageYOffset;
    scrollTicking = false;
    // Any scroll logic here runs with requestAnimationFrame
  }
  
  window.addEventListener('scroll', function() {
    if (!scrollTicking) {
      window.requestAnimationFrame(handleScroll);
      scrollTicking = true;
    }
  }, { passive: true });
})();
