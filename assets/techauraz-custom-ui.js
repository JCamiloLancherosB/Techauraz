/**
 * =============================================================================
 * TECHAURAZ CUSTOM UI COMPONENTS - JAVASCRIPT
 * =============================================================================
 * Consolidated JS for WhatsApp button, Cookie banner, Announcement ticker,
 * and scroll optimizations.
 * Extracted from inline scripts to improve maintainability
 */

/* =============================================================================
   ANNOUNCEMENT MARQUEE - Continuous scrolling ticker
   ============================================================================= */
(function() {
  'use strict';

  // Configuration constants
  var BASE_PPS = 40;           // Base pixels-per-second
  var PPS_INCREMENT = 10;      // Added per speed level
  var MIN_TRACK_MULTIPLIER = 2; // Track must be at least 2x viewport width
  var RESIZE_DEBOUNCE_MS = 200; // Debounce delay for resize handler

  /**
   * Calculate pixels-per-second from speed level.
   * Speed level 1-10, where pps = BASE_PPS + (speedLevel * PPS_INCREMENT)
   * e.g., speed=5 => 90pps
   * @param {HTMLElement} root - The ticker element
   * @returns {number} Pixels per second
   */
  function getPixelsPerSecond(root) {
    // Check for CSS variable override first
    var computedStyle = getComputedStyle(root);
    var cssOverride = computedStyle.getPropertyValue('--ta-ticker-pps').trim();
    if (cssOverride && !isNaN(parseFloat(cssOverride))) {
      return parseFloat(cssOverride);
    }
    
    // Calculate from data-ticker-speed attribute
    var speedLevel = parseInt(root.getAttribute('data-ticker-speed') || '5', 10);
    var clampedSpeed = Math.max(1, Math.min(10, speedLevel));
    return BASE_PPS + (clampedSpeed * PPS_INCREMENT);
  }

  /**
   * Initialize announcement marquee with continuous left-scrolling animation.
   * @param {HTMLElement} root - The .announcement-ticker element
   */
  function initAnnouncementMarquee(root) {
    // Skip if already initialized
    if (root.getAttribute('data-ta-ticker-initialized') === 'true') {
      return;
    }

    var viewport = root.querySelector('.announcement-ticker__viewport');
    var track = root.querySelector('.announcement-ticker__track');
    
    if (!viewport || !track) {
      return;
    }

    // Check for reduced motion preference
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Store cleanup handlers for proper teardown
    var resizeTimeout = null;
    var abortController = typeof AbortController !== 'undefined' ? new AbortController() : null;

    /**
     * Remove all cloned elements from the track
     */
    function removeClones() {
      var clones = track.querySelectorAll('[data-ta-cloned="true"]');
      clones.forEach(function(clone) { clone.remove(); });
    }

    /**
     * Measure and set up the marquee
     */
    function setupMarquee() {
      // Remove any existing clones first (for resize handling)
      removeClones();
      
      // Reset animation temporarily by adding a class
      root.classList.add('announcement-ticker--resetting');
      
      // Get original items (not clones)
      var originalItems = Array.from(track.querySelectorAll('.announcement-ticker__item:not([data-ta-cloned="true"])'));
      
      if (originalItems.length === 0) {
        return;
      }

      // Measure original track width
      var originalWidth = track.scrollWidth;
      var viewportWidth = viewport.offsetWidth;

      // If reduced motion is preferred, just mark as initialized and return
      if (prefersReducedMotion.matches) {
        root.setAttribute('data-ta-ticker-initialized', 'true');
        root.classList.remove('announcement-ticker--resetting');
        return;
      }

      // Clone items until track is at least MIN_TRACK_MULTIPLIER x viewport width for seamless loop
      var minWidth = viewportWidth * MIN_TRACK_MULTIPLIER;
      
      while (track.scrollWidth < minWidth) {
        originalItems.forEach(function(item) {
          var clone = item.cloneNode(true);
          clone.setAttribute('data-ta-cloned', 'true');
          clone.setAttribute('aria-hidden', 'true');
          // Remove any links' tabindex to prevent keyboard navigation to clones
          var links = clone.querySelectorAll('a');
          links.forEach(function(link) { link.setAttribute('tabindex', '-1'); });
          track.appendChild(clone);
        });
      }

      // Calculate animation duration based on scroll distance and speed
      var pps = getPixelsPerSecond(root);
      var scrollDistance = originalWidth;
      var duration = scrollDistance / pps;

      // Set CSS custom properties for the animation
      root.style.setProperty('--ta-ticker-scroll-distance', '-' + scrollDistance + 'px');
      root.style.setProperty('--ta-ticker-duration', duration + 's');

      // Re-enable animation
      root.classList.remove('announcement-ticker--resetting');
      
      // Mark as initialized
      root.setAttribute('data-ta-ticker-initialized', 'true');
    }

    /**
     * Throttled resize handler
     */
    function handleResize() {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(function() {
        // Only rebuild if element is still in DOM
        if (document.contains(root)) {
          setupMarquee();
        }
      }, RESIZE_DEBOUNCE_MS);
    }

    /**
     * Handle reduced motion preference changes
     */
    function handleMotionChange() {
      if (document.contains(root)) {
        setupMarquee();
      }
    }

    // Add event listeners with cleanup support
    var listenerOptions = abortController ? { signal: abortController.signal } : undefined;
    
    prefersReducedMotion.addEventListener('change', handleMotionChange, listenerOptions);
    window.addEventListener('resize', handleResize, listenerOptions);

    // Store cleanup function on element for potential teardown
    root._taMarqueeCleanup = function() {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      if (abortController) {
        abortController.abort();
      } else {
        // Fallback for browsers without AbortController
        prefersReducedMotion.removeEventListener('change', handleMotionChange);
        window.removeEventListener('resize', handleResize);
      }
    };

    // Initial setup
    setupMarquee();
  }

  /**
   * Initialize all announcement marquees on the page
   */
  function initAllMarquees() {
    var tickers = document.querySelectorAll('.announcement-ticker');
    tickers.forEach(function(ticker) {
      initAnnouncementMarquee(ticker);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllMarquees);
  } else {
    initAllMarquees();
  }

  // Re-init on Shopify section render (for theme editor)
  document.addEventListener('shopify:section:load', function(event) {
    var ticker = event.target.querySelector('.announcement-ticker');
    if (ticker) {
      // Reset initialization flag to allow re-init
      ticker.removeAttribute('data-ta-ticker-initialized');
      initAnnouncementMarquee(ticker);
    }
  });

  // Cleanup on Shopify section unload (for theme editor)
  document.addEventListener('shopify:section:unload', function(event) {
    var ticker = event.target.querySelector('.announcement-ticker');
    if (ticker && typeof ticker._taMarqueeCleanup === 'function') {
      ticker._taMarqueeCleanup();
    }
  });

  // Expose for external use if needed
  window.TechaurazUI = window.TechaurazUI || {};
  window.TechaurazUI.initAnnouncementMarquee = initAnnouncementMarquee;
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
