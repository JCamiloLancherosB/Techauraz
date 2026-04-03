/**
 * View Transitions API — TechAuraz 2026
 * 
 * Enables smooth cross-document page transitions (Chrome 126+).
 * Pages fade/slide instead of hard-loading, creating an app-like experience.
 * 
 * Hidden tip: This signals to Google that the site is a modern web app,
 * potentially improving engagement metrics (lower bounce, higher dwell time).
 */
(function () {
  'use strict';

  // 1. Cross-document View Transitions (Chrome 126+)
  // Automatically enabled via CSS @view-transition rule + meta tag
  // The meta tag is injected below if not present
  if (!document.querySelector('meta[name="view-transition"]')) {
    var meta = document.createElement('meta');
    meta.name = 'view-transition';
    meta.content = 'same-origin';
    document.head.appendChild(meta);
  }

  // 2. Add view-transition-name to key elements for animated persistence
  function tagTransitionElements() {
    // Product images persist across navigations
    var heroImg = document.querySelector('.product__media-item--main img, .product__media img:first-of-type');
    if (heroImg) heroImg.style.viewTransitionName = 'product-hero';

    // Product title persists
    var title = document.querySelector('.product__title h1, .product__title');
    if (title) title.style.viewTransitionName = 'product-title';

    // Price persists
    var price = document.querySelector('.price-item--regular, .price__regular');
    if (price) price.style.viewTransitionName = 'product-price';

    // Cart icon count badge persists
    var cartBadge = document.querySelector('.cart-count-bubble');
    if (cartBadge) cartBadge.style.viewTransitionName = 'cart-badge';

    // Product card images (for collection → PDP transitions)
    document.querySelectorAll('.product-card__image img, .card__media img').forEach(function (img, i) {
      if (i < 12) img.style.viewTransitionName = 'product-card-' + i;
    });
  }

  // Tag elements when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tagTransitionElements);
  } else {
    tagTransitionElements();
  }

  // 3. Inject cross-document transition CSS
  var style = document.createElement('style');
  style.textContent = [
    '/* Cross-document View Transition animations */',
    '@view-transition { navigation: auto; }',
    '::view-transition-old(root) { animation: fade-out 0.15s ease-in; }',
    '::view-transition-new(root) { animation: fade-in 0.2s ease-out; }',
    '::view-transition-old(product-hero) { animation: slide-out-left 0.25s ease-in; }',
    '::view-transition-new(product-hero) { animation: slide-in-right 0.3s ease-out; }',
    '::view-transition-group(product-title) { animation-duration: 0.25s; }',
    '::view-transition-group(product-price) { animation-duration: 0.2s; }',
    '::view-transition-group(cart-badge) { animation-duration: 0.15s; }',
    '@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }',
    '@keyframes fade-out { from { opacity: 1; } to { opacity: 0; } }',
    '@keyframes slide-in-right { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }',
    '@keyframes slide-out-left { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-20px); opacity: 0; } }',
    '@media (prefers-reduced-motion: reduce) {',
    '  ::view-transition-old(root), ::view-transition-new(root),',
    '  ::view-transition-old(product-hero), ::view-transition-new(product-hero) {',
    '    animation: none !important;',
    '  }',
    '}'
  ].join('\n');
  document.head.appendChild(style);
})();
