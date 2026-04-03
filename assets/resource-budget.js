/**
 * Resource Budget Monitor — TechAuraz 2026
 * 
 * Hidden tip: Resource budgets prevent performance regression by tracking
 * the total weight of CSS, JS, images, and fonts loaded on each page.
 * When a budget is exceeded, it logs to GTM for alerting.
 * 
 * Google recommends:
 * - JS budget: < 300KB (compressed)
 * - CSS budget: < 100KB (compressed, critical path)
 * - Total page weight: < 1.5MB
 * - Image count: < 25 per page
 * - Third-party count: < 10 scripts
 */
(function () {
  'use strict';

  // Wait for page to fully load before checking budgets
  window.addEventListener('load', function () {
    // Delay to allow all resources to register
    setTimeout(checkBudgets, 2000);
  });

  function checkBudgets() {
    if (!window.performance || !performance.getEntriesByType) return;

    var resources = performance.getEntriesByType('resource');
    var budget = {
      js: { count: 0, bytes: 0 },
      css: { count: 0, bytes: 0 },
      img: { count: 0, bytes: 0 },
      font: { count: 0, bytes: 0 },
      thirdParty: { count: 0, domains: {} },
      total: { count: 0, bytes: 0 }
    };

    var ownDomains = ['techauraz.com', 'cdn.shopify.com', 'shopify.com'];

    resources.forEach(function (r) {
      var size = r.transferSize || r.decodedBodySize || 0;
      budget.total.count++;
      budget.total.bytes += size;

      // Categorize
      if (/\.js(\?|$)/.test(r.name)) {
        budget.js.count++;
        budget.js.bytes += size;
      } else if (/\.css(\?|$)/.test(r.name)) {
        budget.css.count++;
        budget.css.bytes += size;
      } else if (/\.(png|jpg|jpeg|webp|avif|gif|svg|ico)(\?|$)/.test(r.name)) {
        budget.img.count++;
        budget.img.bytes += size;
      } else if (/\.(woff2?|ttf|otf|eot)(\?|$)/.test(r.name)) {
        budget.font.count++;
        budget.font.bytes += size;
      }

      // Third-party detection
      try {
        var domain = new URL(r.name).hostname;
        var isOwn = ownDomains.some(function (d) { return domain.includes(d); });
        if (!isOwn) {
          budget.thirdParty.count++;
          budget.thirdParty.domains[domain] = (budget.thirdParty.domains[domain] || 0) + 1;
        }
      } catch (e) { }
    });

    // Report to GTM
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'resource_budget',
      budget_js_kb: Math.round(budget.js.bytes / 1024),
      budget_css_kb: Math.round(budget.css.bytes / 1024),
      budget_img_kb: Math.round(budget.img.bytes / 1024),
      budget_font_kb: Math.round(budget.font.bytes / 1024),
      budget_total_kb: Math.round(budget.total.bytes / 1024),
      budget_js_count: budget.js.count,
      budget_img_count: budget.img.count,
      budget_third_party_count: budget.thirdParty.count,
      budget_page: location.pathname
    });

    // Alert on budget violations
    var violations = [];
    if (budget.total.bytes > 1.5 * 1024 * 1024) violations.push('total>' + Math.round(budget.total.bytes / 1024) + 'KB');
    if (budget.js.bytes > 500 * 1024) violations.push('js>' + Math.round(budget.js.bytes / 1024) + 'KB');
    if (budget.img.count > 30) violations.push('imgs>' + budget.img.count);
    if (budget.thirdParty.count > 15) violations.push('3p>' + budget.thirdParty.count);

    if (violations.length > 0) {
      window.dataLayer.push({
        event: 'budget_violation',
        violations: violations.join(', '),
        violation_page: location.pathname
      });
    }
  }
})();
