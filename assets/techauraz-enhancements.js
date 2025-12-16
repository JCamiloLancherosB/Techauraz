/**
 * =============================================================================
 * TECHAURAZ HEADER ENHANCEMENTS
 * =============================================================================
 * Handles sticky header with shrink-on-scroll behavior
 */

(function() {
  'use strict';

  // Sticky header shrink on scroll
  const header = document.querySelector('.header');
  const headerSection = document.querySelector('.section-header');
  
  if (!header || !headerSection) return;

  let lastScrollTop = 0;
  let ticking = false;

  function updateHeader() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class when user scrolls down more than 50px
    if (scrollTop > 50) {
      header.classList.add('scrolled');
      document.body.classList.add('scrolled-past-header');
    } else {
      header.classList.remove('scrolled');
      document.body.classList.remove('scrolled-past-header');
    }
    
    lastScrollTop = scrollTop;
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  // Listen for scroll events
  window.addEventListener('scroll', requestTick, { passive: true });
  
  // Check initial state
  updateHeader();
})();

/**
 * =============================================================================
 * IMAGE LAZY LOADING HANDLER
 * =============================================================================
 * Adds loaded class to images when they finish loading
 */

(function() {
  'use strict';

  const images = document.querySelectorAll('img[loading="lazy"]');
  
  images.forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', function() {
        this.classList.add('loaded');
      });
    }
  });
})();

/**
 * =============================================================================
 * METAFIELD THEME STYLE HANDLER
 * =============================================================================
 * Applies theme style overrides based on product metafield
 */

(function() {
  'use strict';

  const productContainer = document.querySelector('.product');
  if (!productContainer) return;

  // Get theme style from data attribute (set in Liquid)
  const themeStyle = productContainer.dataset.themeStyle;
  
  if (themeStyle === 'warm_cro') {
    productContainer.classList.add('pdp--warm');
  }
})();
