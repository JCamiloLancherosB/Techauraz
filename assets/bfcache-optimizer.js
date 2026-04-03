/**
 * bfcache + Page Lifecycle Optimizer — TechAuraz 2026
 * 
 * Hidden tips:
 * 1. bfcache (back/forward cache): Makes back-button instant (~0ms)
 *    Google uses bfcache eligibility as a ranking signal since 2024.
 *    Common blockers: unload listeners, Cache-Control: no-store
 * 
 * 2. Page Lifecycle API: Properly handle frozen/discarded states
 *    to prevent stale data and broken interactions.
 * 
 * 3. Restore hooks: Re-fire critical initializations on bfcache restore
 */
(function () {
  'use strict';

  // ===== 1. 'unload' → 'pagehide' conversion =====
  // NOTE: This is now handled by the unified patch in performance-monitor.js
  // which loads before this script. Both passive listeners AND unload conversion
  // are consolidated there to prevent double-patching conflicts.

  // ===== 2. bfcache restore handling =====
  // When page is restored from bfcache, re-initialize dynamic elements
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      // Page was restored from bfcache
      document.body.classList.remove('page-loading');

      // Re-fire cart updates (cart may have changed in another tab)
      var cartEvent = new CustomEvent('cart:refresh', { bubbles: true });
      document.dispatchEvent(cartEvent);

      // Update any dynamic timestamps
      document.querySelectorAll('[data-dynamic-time]').forEach(function (el) {
        el.textContent = new Date().toLocaleTimeString('es-CO', {
          hour: '2-digit',
          minute: '2-digit'
        });
      });

      // Track bfcache restore in analytics
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'bfcache_restore',
        page: location.pathname
      });
    }
  });

  // ===== 3. Freeze/Resume lifecycle =====
  // Properly handle tab being frozen (mobile, tab discarding)
  document.addEventListener('freeze', function () {
    // Save critical state before freeze
    try {
      sessionStorage.setItem('ta_frozen_at', Date.now().toString());
    } catch (e) { }
  });

  document.addEventListener('resume', function () {
    // Check if we were frozen too long
    try {
      var frozenAt = parseInt(sessionStorage.getItem('ta_frozen_at') || '0');
      if (frozenAt && (Date.now() - frozenAt) > 5 * 60 * 1000) {
        // Frozen for >5 min — refresh dynamic content
        var cartEvent = new CustomEvent('cart:refresh', { bubbles: true });
        document.dispatchEvent(cartEvent);
      }
      sessionStorage.removeItem('ta_frozen_at');
    } catch (e) { }
  });

  // ===== 4. Connection-aware prefetching =====
  // Hidden tip: Adjust behavior based on network quality
  if (navigator.connection) {
    var conn = navigator.connection;

    // Disable heavy animations on slow connections
    if (['slow-2g', '2g'].includes(conn.effectiveType) || conn.saveData) {
      document.documentElement.classList.add('reduce-data');
      var style = document.createElement('style');
      style.textContent = '.reduce-data img[loading="lazy"] { content-visibility: auto; } .reduce-data video, .reduce-data .lottie-player { display: none !important; }';
      document.head.appendChild(style);
    }

    // Track connection quality for analytics
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'connection_info',
      connection_type: conn.effectiveType,
      connection_downlink: conn.downlink,
      connection_rtt: conn.rtt,
      connection_saveData: conn.saveData || false
    });
  }

  // ===== 5. Prerender on high-intent clicks =====
  // Hidden tip: On collection pages, prerender the first product
  // that users are most likely to click (first visible card)
  if (/\/(collections|$)/.test(location.pathname)) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var link = entry.target.querySelector('a[href*="/products/"]');
          if (link && !document.querySelector('link[rel="prerender"][href="' + link.href + '"]')) {
            var prerender = document.createElement('link');
            prerender.rel = 'prefetch'; // prerender deprecated, prefetch as fallback
            prerender.href = link.href;
            document.head.appendChild(prerender);
            observer.unobserve(entry.target);
          }
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.card-wrapper, .product-card').forEach(function (card, i) {
      if (i < 3) observer.observe(card); // Only first 3 cards
    });
  }
})();
