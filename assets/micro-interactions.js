/* =============================================================================
   MICRO-INTERACTIONS ENGINE — TechAura 2030
   
   Premium interactive effects:
   - Button ripple on click  
   - Magnetic hover on CTAs
   - Smooth number count-up for prices
   - Parallax depth on hero
   ============================================================================= */

(function () {
    'use strict';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* ---- 1. BUTTON RIPPLE EFFECT ---- */
    function initRipple() {
        document.addEventListener('click', function (e) {
            var btn = e.target.closest('button, .button, .btn, a.ta-cta-button, .quick-add__submit, .product-form__submit');
            if (!btn) return;

            var rect = btn.getBoundingClientRect();
            var ripple = document.createElement('span');
            ripple.className = 'ta-ripple';
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';

            btn.style.position = btn.style.position || 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);

            ripple.addEventListener('animationend', function () {
                ripple.remove();
            });
        });
    }

    /* ---- 2. MAGNETIC HOVER on primary CTAs ---- */
    function initMagneticHover() {
        var ctas = document.querySelectorAll('.quick-add__submit, .product-form__submit, .ta-cta-button, .slideshow__button');

        ctas.forEach(function (cta) {
            cta.addEventListener('mousemove', function (e) {
                var rect = cta.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;

                cta.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
            });

            cta.addEventListener('mouseleave', function () {
                cta.style.transform = '';
            });
        });
    }

    /* ---- 3. SMOOTH COUNT-UP for visible numbers ---- */
    function initCountUp() {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                if (el.dataset.counted) return;
                el.dataset.counted = 'true';

                var text = el.textContent;
                var match = text.match(/([\d.,]+)/);
                if (!match) return;

                var raw = match[1];
                var target = parseFloat(raw.replace(/\./g, '').replace(',', '.'));
                if (isNaN(target) || target <= 0) return;

                var duration = 1200;
                var start = performance.now();
                var prefix = text.substring(0, text.indexOf(raw));
                var suffix = text.substring(text.indexOf(raw) + raw.length);

                function formatNum(n) {
                    return Math.round(n).toLocaleString('es-CO');
                }

                function step(now) {
                    var progress = Math.min((now - start) / duration, 1);
                    // Ease-out cubic
                    var ease = 1 - Math.pow(1 - progress, 3);
                    var current = target * ease;
                    el.textContent = prefix + formatNum(current) + suffix;
                    if (progress < 1) requestAnimationFrame(step);
                }

                requestAnimationFrame(step);
                observer.unobserve(el);
            });
        }, { threshold: 0.5 });

        // Observe price elements
        document.querySelectorAll('.price-item--regular, .price-item--sale').forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ---- 4. PARALLAX on hero/slideshow ---- */
    function initParallax() {
        var hero = document.querySelector('.slideshow, .banner, .hero');
        if (!hero) return;

        var img = hero.querySelector('img');
        if (!img) return;

        var ticking = false;
        window.addEventListener('scroll', function () {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                var scroll = window.scrollY;
                if (scroll < window.innerHeight) {
                    img.style.transform = 'translate3d(0, ' + (scroll * 0.2) + 'px, 0) scale(1.05)';
                }
                ticking = false;
            });
        }, { passive: true });
    }

    /* ---- 5. SMOOTH HOVER GLOW on cards ---- */
    function initCardGlow() {
        document.addEventListener('mousemove', function (e) {
            var card = e.target.closest('.card-wrapper.product-card-wrapper, .category-card');
            if (!card) return;

            var rect = card.getBoundingClientRect();
            var x = ((e.clientX - rect.left) / rect.width) * 100;
            var y = ((e.clientY - rect.top) / rect.height) * 100;

            card.style.setProperty('--glow-x', x + '%');
            card.style.setProperty('--glow-y', y + '%');
        });
    }

    /* ---- INIT ---- */
    function init() {
        initRipple();
        initMagneticHover();
        initCountUp();
        // initParallax() removed — perpetual scroll listener fights LCP compositing
        initCardGlow();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 200);
    }
})();
