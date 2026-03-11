/* =============================================================================
   SCROLL-REVEAL ANIMATION SYSTEM — TechAura 2030
   
   GPU-accelerated IntersectionObserver-based entrance animations.
   Targets .ta-reveal elements and auto-discovers major sections.
   
   Features:
   - Staggered fade-up for grid children (product cards, category cards)
   - Slide-in for headings
   - Scale-up for benefit/trust cards
   - Parallax-style depth on hero elements
   - Respects prefers-reduced-motion
   - Uses content-visibility for off-screen performance
   ============================================================================= */

(function () {
    'use strict';

    // Skip if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Configuration
    var CONFIG = {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
        staggerDelay: 80,   // ms between staggered children
        maxStagger: 12,      // max children to stagger
    };

    // Auto-discovery selectors (elements that get reveal automatically)
    var AUTO_SELECTORS = [
        // Section headings
        '.category-nav-title',
        '.section-header__title',
        'h2.title-wrapper-hdr',
        '.section-heading',
        // Category cards
        '.category-card',
        // Product cards
        '.card-wrapper.product-card-wrapper',
        // Benefit / trust items
        '.ta-conv-benefit-card',
        '.trust-badge-item',
        '.ta-conv-benefits-grid',
        // Testimonial cards
        '.testimonial-card',
        // Newsletter
        '.newsletter__wrapper',
        // FAQ items
        '.ta-pdp-faq__item',
        // Generic section content
        '.benefits-bar',
        '.category-nav-section',
    ];

    // Staggered parent selectors (children get stagger delay)
    var STAGGER_PARENTS = [
        '.category-nav-grid',
        '.collection-list',
        '.grid.product-grid',
        '.ta-conv-benefits-grid',
    ];

    /**
     * Apply the appropriate reveal class based on element type
     */
    function classifyElement(el) {
        var tag = el.tagName;
        var cls = el.className || '';

        // Headings get slide-up
        if (tag === 'H1' || tag === 'H2' || tag === 'H3' || cls.includes('title') || cls.includes('heading')) {
            el.classList.add('ta-reveal', 'ta-reveal--fade-up');
            return;
        }

        // Cards get scale-fade
        if (cls.includes('card') || cls.includes('benefit') || cls.includes('badge')) {
            el.classList.add('ta-reveal', 'ta-reveal--scale-fade');
            return;
        }

        // Default: fade-up
        el.classList.add('ta-reveal', 'ta-reveal--fade-up');
    }

    /**
     * Set stagger delays on children
     */
    function applyStagger(parent) {
        var children = parent.children;
        for (var i = 0; i < children.length && i < CONFIG.maxStagger; i++) {
            var child = children[i];
            if (!child.classList.contains('ta-reveal')) {
                child.classList.add('ta-reveal', 'ta-reveal--scale-fade');
            }
            child.style.setProperty('--ta-reveal-delay', (i * CONFIG.staggerDelay) + 'ms');
        }
    }

    /**
     * Initialize: discover elements and set up observer
     */
    function init() {
        // Auto-discover and classify
        AUTO_SELECTORS.forEach(function (sel) {
            document.querySelectorAll(sel).forEach(function (el) {
                if (!el.classList.contains('ta-reveal')) {
                    classifyElement(el);
                }
            });
        });

        // Apply stagger to parent containers
        STAGGER_PARENTS.forEach(function (sel) {
            document.querySelectorAll(sel).forEach(applyStagger);
        });

        // Create observer
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('ta-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: CONFIG.threshold,
            rootMargin: CONFIG.rootMargin,
        });

        // Observe all reveal elements
        document.querySelectorAll('.ta-reveal').forEach(function (el) {
            observer.observe(el);
        });

        // Mark elements already in viewport as revealed immediately
        requestAnimationFrame(function () {
            document.querySelectorAll('.ta-reveal').forEach(function (el) {
                var rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.classList.add('ta-revealed');
                }
            });
        });
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // Small delay to let Shopify finish rendering
        setTimeout(init, 100);
    }
})();
