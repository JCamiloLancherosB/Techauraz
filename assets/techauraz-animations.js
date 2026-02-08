/**
 * =============================================================================
 * TECHAURAZ ANIMATIONS & ENHANCEMENTS
 * Version: 2.0.0
 * =============================================================================
 *
 * Consolidated module for Techauraz-specific UI enhancements.
 *
 * Contents:
 * 1. Image lazy-loading handler — adds `.loaded` class to lazy images
 * 2. Metafield theme style handler — applies PDP warm theme via metafield
 *
 * Note: Scroll-trigger animations are handled by Dawn core (animations.js).
 *       Animated-benefits animations are handled by animated-benefits.js.
 *
 * =============================================================================
 */

/**
 * Adds a `loaded` class to every lazy-loaded image once it finishes loading.
 * Images that are already complete when the script runs are handled
 * synchronously; others get a one-time `load` event listener.
 *
 * @returns {void}
 */
(function initImageLazyLoadHandler() {
  'use strict';

  const images = document.querySelectorAll('img[loading="lazy"]');

  images.forEach(function (img) {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', function () {
        this.classList.add('loaded');
      });
    }
  });
})();

/**
 * Applies a warm CRO theme class to the PDP container when the product
 * metafield `theme_style` is set to `warm_cro`.
 *
 * Expects a `.product` element with a `data-theme-style` attribute set in
 * Liquid (e.g. `data-theme-style="{{ product.metafields.custom.theme_style }}"`).
 *
 * @returns {void}
 */
(function initMetafieldThemeStyle() {
  'use strict';

  var productContainer = document.querySelector('.product');
  if (!productContainer) return;

  var themeStyle = productContainer.dataset.themeStyle;

  if (themeStyle === 'warm_cro') {
    productContainer.classList.add('pdp--warm');
  }
})();
