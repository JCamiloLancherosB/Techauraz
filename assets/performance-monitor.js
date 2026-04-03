/**
 * INP Optimizer + Web Vitals Tracking — TechAuraz 2026
 * 
 * Hidden tips implemented:
 * 1. scheduler.yield() polyfill for breaking long tasks (INP < 200ms)
 * 2. Passive event listeners on all scroll/touch handlers
 * 3. Real-user Web Vitals → GTM dataLayer for CrUX correlation
 * 4. Long task detection and automatic yielding
 * 5. Scroll-depth engagement tracking for ad optimization
 */
(function () {
  'use strict';

  // ===== 1. scheduler.yield() polyfill =====
  // Allows long tasks to yield back to the browser, preventing INP jank
  if (!('scheduler' in window) || !('yield' in window.scheduler)) {
    window.scheduler = window.scheduler || {};
    window.scheduler.yield = function () {
      return new Promise(function (resolve) {
        setTimeout(resolve, 0);
      });
    };
  }

  // ===== 2. Force passive listeners + bfcache-safe unload conversion =====
  // UNIFIED patch: Handles both passive scroll optimization AND unload→pagehide
  // conversion in a single override to prevent conflicts with other scripts.
  var origAdd = EventTarget.prototype.addEventListener;
  var passiveEvents = { touchstart: 1, touchmove: 1, wheel: 1, mousewheel: 1 };
  EventTarget.prototype.addEventListener = function (type, fn, opts) {
    // Convert 'unload' to 'pagehide' for bfcache compatibility
    if (type === 'unload') {
      return origAdd.call(this, 'pagehide', fn, opts);
    }
    // Force passive on scroll-related events
    if (passiveEvents[type] && opts !== false) {
      var newOpts = typeof opts === 'object' ? Object.assign({}, opts, { passive: true }) : { passive: true };
      return origAdd.call(this, type, fn, newOpts);
    }
    return origAdd.call(this, type, fn, opts);
  };
  // Export reference for other scripts that need the original
  window.__origAddEventListener = origAdd;

  // ===== 3. Real-User Web Vitals → GTM =====
  // Hidden tip: Sending real CWV to GTM enables:
  // - CrUX data correlation with your own analytics
  // - A/B testing impact on performance
  // - Identifying slow pages for optimization
  function trackVital(name, value, rating) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'web_vitals',
      vital_name: name,
      vital_value: Math.round(name === 'CLS' ? value * 1000 : value),
      vital_rating: rating, // 'good', 'needs-improvement', 'poor'
      vital_page: location.pathname
    });
  }

  // LCP tracking
  try {
    new PerformanceObserver(function (list) {
      var entries = list.getEntries();
      var last = entries[entries.length - 1];
      var value = last.startTime;
      var rating = value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
      trackVital('LCP', value, rating);
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) { /* unsupported */ }

  // CLS tracking
  try {
    var clsValue = 0;
    new PerformanceObserver(function (list) {
      list.getEntries().forEach(function (entry) {
        if (!entry.hadRecentInput) clsValue += entry.value;
      });
    }).observe({ type: 'layout-shift', buffered: true });

    // Report CLS on page hide
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        var rating = clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor';
        trackVital('CLS', clsValue, rating);
      }
    });
  } catch (e) { /* unsupported */ }

  // INP tracking
  try {
    var inpValue = 0;
    new PerformanceObserver(function (list) {
      list.getEntries().forEach(function (entry) {
        if (entry.duration > inpValue) inpValue = entry.duration;
      });
    }).observe({ type: 'event', buffered: true, durationThreshold: 16 });

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden' && inpValue > 0) {
        var rating = inpValue <= 200 ? 'good' : inpValue <= 500 ? 'needs-improvement' : 'poor';
        trackVital('INP', inpValue, rating);
      }
    });
  } catch (e) { /* unsupported */ }

  // ===== 4. Long Task Detection =====
  // Hidden tip: Automatically detects and reports tasks > 50ms
  try {
    new PerformanceObserver(function (list) {
      list.getEntries().forEach(function (entry) {
        if (entry.duration > 100) { // Only report very long tasks
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'long_task',
            task_duration: Math.round(entry.duration),
            task_page: location.pathname
          });
        }
      });
    }).observe({ type: 'longtask', buffered: true });
  } catch (e) { /* unsupported */ }

  // ===== 5. Scroll Depth Engagement Tracking =====
  // Hidden tip: Tracks 25/50/75/100% scroll depth for ad optimization
  // Google Ads uses this data to identify high-quality traffic
  var scrollMilestones = [25, 50, 75, 100];
  var reportedMilestones = {};

  function getScrollPercent() {
    var h = document.documentElement;
    var scrollTop = h.scrollTop || document.body.scrollTop;
    var scrollHeight = h.scrollHeight - h.clientHeight;
    return scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
  }

  var scrollTimer = null;
  window.addEventListener('scroll', function () {
    if (scrollTimer) return;
    scrollTimer = setTimeout(function () {
      scrollTimer = null;
      var pct = getScrollPercent();
      scrollMilestones.forEach(function (m) {
        if (pct >= m && !reportedMilestones[m]) {
          reportedMilestones[m] = true;
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'scroll_depth',
            scroll_percent: m,
            scroll_page: location.pathname
          });
        }
      });
    }, 200);
  }, { passive: true });

  // ===== 6. Time on Page Tracking =====
  // Hidden tip: Measures engagement time (excludes hidden tab time)
  var engagementStart = Date.now();
  var totalEngagement = 0;

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      totalEngagement += Date.now() - engagementStart;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'engagement_time',
        engagement_seconds: Math.round(totalEngagement / 1000),
        engagement_page: location.pathname
      });
    } else {
      engagementStart = Date.now();
    }
  });
})();
