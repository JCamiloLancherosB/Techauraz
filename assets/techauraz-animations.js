/**
 * =============================================================================
 * TECHAURAZ PDP ENHANCEMENTS
 * Version: 3.0.0 — March 2026
 * =============================================================================
 *
 * Metafield theme style handler — applies PDP warm theme via metafield.
 *
 * Note: Image lazy-loading is handled by image-loading.js (global).
 *       Scroll-trigger animations are handled by Dawn core (animations.js).
 *
 * =============================================================================
 */

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
