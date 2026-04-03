/**
 * LQIP Blur-Up Image Loading — TechAuraz 2026
 * 
 * Hidden CRO tip: Blur-up placeholders create a perceived performance
 * improvement of 40-60%. Users feel the page is loading faster because
 * they see content immediately, even before the full image loads.
 * 
 * Technique: Uses Shopify's image_url API to load a tiny 20px wide
 * version as CSS background, then fades to the full image.
 * Google explicitly supports this as a CLS-safe technique.
 */
(function () {
  'use strict';

  // Only run on pages with product images
  if (!/\/(products|collections)/.test(location.pathname) && location.pathname !== '/') return;

  var BLUR_SIZE = 20; // Tiny placeholder width
  var TRANSITION_MS = 400;

  function setupBlurUp(img) {
    if (img.dataset.blurApplied) return;
    img.dataset.blurApplied = 'true';

    // Skip if already loaded
    if (img.complete && img.naturalWidth > 0) return;

    // Get the Shopify CDN URL and generate tiny version
    var src = img.src || img.dataset.src || img.srcset;
    if (!src || !src.includes('cdn.shopify.com')) return;

    // Extract base URL and generate tiny placeholder
    var tinyUrl = src.replace(/width=\d+/, 'width=' + BLUR_SIZE)
                     .replace(/&height=\d+/, '')
                     .split(' ')[0]; // Handle srcset format

    // If URL uses Shopify's _WIDTHx format
    if (tinyUrl.includes('_') && !tinyUrl.includes('width=')) {
      tinyUrl = tinyUrl.replace(/_\d+x(\d+)?/, '_' + BLUR_SIZE + 'x');
    }

    // Apply blur placeholder as background
    var wrapper = img.closest('.media, .card__media, .product__media-item, .banner__media');
    if (!wrapper) return;

    wrapper.style.backgroundImage = 'url(' + tinyUrl + ')';
    wrapper.style.backgroundSize = 'cover';
    wrapper.style.backgroundPosition = 'center';
    wrapper.style.backgroundRepeat = 'no-repeat';

    // Start with image transparent
    img.style.opacity = '0';
    img.style.transition = 'opacity ' + TRANSITION_MS + 'ms ease-out';

    // Fade in when loaded
    function onLoad() {
      img.style.opacity = '1';
      // Clean up background after transition
      setTimeout(function () {
        wrapper.style.backgroundImage = '';
      }, TRANSITION_MS + 100);
    }

    if (img.complete && img.naturalWidth > 0) {
      onLoad();
    } else {
      img.addEventListener('load', onLoad, { once: true });
    }
  }

  // Apply to all lazy-loaded images
  function processImages() {
    document.querySelectorAll('img[loading="lazy"]').forEach(setupBlurUp);
  }

  // Run on initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processImages);
  } else {
    processImages();
  }

  // Watch for dynamically added images (infinite scroll, quick view, etc.)
  var observer = new MutationObserver(function (mutations) {
    var hasNew = false;
    mutations.forEach(function (m) {
      m.addedNodes.forEach(function (n) {
        if (n.nodeType === 1 && (n.tagName === 'IMG' || n.querySelector('img'))) {
          hasNew = true;
        }
      });
    });
    if (hasNew) processImages();
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
