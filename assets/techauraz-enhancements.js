/**
 * =============================================================================
 * TECHAURAZ ENHANCEMENTS
 * =============================================================================
 * NOTE: Header scroll handling has been consolidated into header-scroll-handler.js
 * to avoid duplicate scroll listeners and conflicting state management.
 * 
 * This file now contains:
 * - Image lazy loading handler
 * - Metafield theme style handler
 */

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

/**
 * =============================================================================
 * TESTIMONIALS SLIDER COMPONENT
 * =============================================================================
 * Note: SliderComponent is now defined in global.js (Dawn core).
 * The <slider-component> custom element registration from global.js handles
 * all slider functionality including testimonials.
 */
