/**
 * Speculative Navigation Prefetching — TechAuraz 2026
 * 
 * Prefetches product/collection pages when users hover over links
 * for 200ms+ (Speculation Rules API fallback for non-Chromium).
 * This eliminates ~200-400ms of navigation latency.
 * 
 * 2026 Best Practice: Chrome 121+ supports Speculation Rules natively,
 * but this script provides graceful fallback for Safari/Firefox.
 */
(function () {
  'use strict';

  // Avoid prefetching on slow connections or data-saver mode
  if (navigator.connection) {
    if (navigator.connection.saveData) return;
    if (['slow-2g', '2g'].includes(navigator.connection.effectiveType)) return;
  }

  var prefetched = new Set();
  var MAX_PREFETCHES = 6; // limit total prefetches per page

  function prefetchUrl(url) {
    if (prefetched.has(url) || prefetched.size >= MAX_PREFETCHES) return;
    prefetched.add(url);

    var link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'document';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  function isInternalProductOrCollection(href) {
    if (!href) return false;
    try {
      var u = new URL(href, location.origin);
      if (u.origin !== location.origin) return false;
      return /^\/(products|collections)\//.test(u.pathname);
    } catch (e) {
      return false;
    }
  }

  var hoverTimer = null;
  var HOVER_DELAY = 200; // ms — intentional hover threshold

  document.addEventListener('pointerenter', function (e) {
    var anchor = e.target.closest('a[href]');
    if (!anchor || !isInternalProductOrCollection(anchor.href)) return;

    hoverTimer = setTimeout(function () {
      prefetchUrl(anchor.href);
    }, HOVER_DELAY);
  }, { capture: true, passive: true });

  document.addEventListener('pointerleave', function () {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }
  }, { capture: true, passive: true });

  // Also prefetch on touchstart (mobile — no hover)
  document.addEventListener('touchstart', function (e) {
    var anchor = e.target.closest('a[href]');
    if (anchor && isInternalProductOrCollection(anchor.href)) {
      prefetchUrl(anchor.href);
    }
  }, { capture: true, passive: true });

  // Speculation Rules API (Chrome 121+) for instant navigations
  if (HTMLScriptElement.supports && HTMLScriptElement.supports('speculationrules')) {
    var rules = document.createElement('script');
    rules.type = 'speculationrules';
    rules.textContent = JSON.stringify({
      prefetch: [{
        source: 'document',
        where: {
          and: [
            { href_matches: '/products/*' },
            { not: { selector_matches: '.no-prefetch' } }
          ]
        },
        eagerness: 'moderate'
      }, {
        source: 'document',
        where: {
          href_matches: '/collections/*'
        },
        eagerness: 'conservative'
      }]
    });
    document.head.appendChild(rules);
  }
})();
