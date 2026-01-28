/**
 * =============================================================================
 * TECHAURAZ CUSTOM UI COMPONENTS - JAVASCRIPT
 * =============================================================================
 * Consolidated JS for WhatsApp button, Cookie banner, Announcement ticker,
 * and scroll optimizations.
 * Extracted from inline scripts to improve maintainability
 */

/* =============================================================================
   ANNOUNCEMENT TICKER - Rotating messages with fade animation
   ============================================================================= */
(function() {
  'use strict';

  /**
   * AnnouncementTicker class
   * Manages rotating announcement messages with accessibility support
   */
  class AnnouncementTicker {
    constructor(container) {
      this.container = container;
      this.items = Array.from(container.querySelectorAll('.announcement-ticker__item'));
      this.currentIndex = 0;
      this.isPaused = false;
      this.intervalId = null;
      
      // Get speed from data attribute (in seconds), default to 5 seconds
      const speedAttr = container.getAttribute('data-ticker-speed');
      this.speed = (speedAttr ? parseInt(speedAttr, 10) : 5) * 1000;
      
      // Ensure speed is within reasonable bounds (3-8 seconds)
      this.speed = Math.max(3000, Math.min(8000, this.speed));
      
      // Check for reduced motion preference
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      this.init();
    }
    
    init() {
      if (this.items.length <= 1) {
        // No rotation needed for single item
        return;
      }
      
      this.bindEvents();
      this.startRotation();
      
      // Listen for reduced motion preference changes
      this.prefersReducedMotion.addEventListener('change', () => {
        // Restart with new preference
        this.stopRotation();
        this.startRotation();
      });
    }
    
    bindEvents() {
      // Store bound references for cleanup
      this.boundPause = () => this.pause();
      this.boundResume = () => this.resume();
      
      // Pause on hover (desktop only)
      this.container.addEventListener('mouseenter', this.boundPause);
      this.container.addEventListener('mouseleave', this.boundResume);
      
      // Pause on focus for keyboard users
      this.container.addEventListener('focusin', this.boundPause);
      this.container.addEventListener('focusout', this.boundResume);
    }
    
    startRotation() {
      if (this.items.length <= 1) return;
      
      this.intervalId = setInterval(() => {
        if (!this.isPaused) {
          this.showNext();
        }
      }, this.speed);
    }
    
    stopRotation() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
    
    pause() {
      this.isPaused = true;
      this.container.classList.add('announcement-ticker--paused');
    }
    
    resume() {
      this.isPaused = false;
      this.container.classList.remove('announcement-ticker--paused');
    }
    
    showNext() {
      const prevIndex = this.currentIndex;
      this.currentIndex = (this.currentIndex + 1) % this.items.length;
      this.transition(prevIndex, this.currentIndex);
    }
    
    transition(fromIndex, toIndex) {
      const fromItem = this.items[fromIndex];
      const toItem = this.items[toIndex];
      
      if (!fromItem || !toItem) return;
      
      // Remove active state from current
      fromItem.classList.remove('announcement-ticker__item--active');
      fromItem.setAttribute('aria-hidden', 'true');
      
      // Add active state to next
      toItem.classList.add('announcement-ticker__item--active');
      toItem.removeAttribute('aria-hidden');
    }
    
    destroy() {
      this.stopRotation();
      this.container.removeEventListener('mouseenter', this.boundPause);
      this.container.removeEventListener('mouseleave', this.boundResume);
      this.container.removeEventListener('focusin', this.boundPause);
      this.container.removeEventListener('focusout', this.boundResume);
    }
  }
  
  // Store ticker instances for cleanup
  const tickerInstances = new WeakMap();
  
  // Initialize ticker on DOM ready
  function initTickers() {
    const tickers = document.querySelectorAll('.announcement-ticker');
    tickers.forEach(ticker => {
      // Destroy existing instance if present
      if (tickerInstances.has(ticker)) {
        tickerInstances.get(ticker).destroy();
      }
      // Create new instance
      const instance = new AnnouncementTicker(ticker);
      tickerInstances.set(ticker, instance);
      ticker.setAttribute('data-ticker-initialized', 'true');
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTickers);
  } else {
    initTickers();
  }
  
  // Re-init on Shopify section render (for theme editor)
  document.addEventListener('shopify:section:load', initTickers);
})();

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
        
        // Update WhatsApp position
        updateWhatsAppPosition();
        
        // Set focus after transition completes for accessibility
        banner.addEventListener('transitionend', function onTransitionEnd(e) {
          if (e.propertyName === 'transform') {
            banner.removeEventListener('transitionend', onTransitionEnd);
            banner.focus({ preventScroll: true });
          }
        });
      }, BANNER_DELAY_MS);
    }
  }
  
  // Hide banner
  function hideBanner() {
    banner.classList.remove('is-visible');
    banner.classList.add('is-hidden');
    
    // Update WhatsApp position
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
