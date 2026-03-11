/**
 * TECHAURAZ SLIDESHOW AUTOPLAY + HEADER FIX — March 2026
 * Forces autoplay on slideshow components regardless of admin setting.
 * Forces solid white header background (overrides Shopify color schemes).
 * Hides the pause button from the DOM.
 */
(function () {
    'use strict';

    function forceHeaderWhite() {
        // Force solid white background on header wrapper via inline style
        var hw = document.querySelector('.header-wrapper');
        if (hw) {
            hw.style.setProperty('background', '#ffffff', 'important');
            hw.style.setProperty('background-color', '#ffffff', 'important');
            hw.style.setProperty('background-image', 'none', 'important');
        }

        // Force dark text on all header links and icons
        var headerElements = document.querySelectorAll(
            '.header__menu-link, .header__icon, .header__heading-link, .header a, .header summary'
        );
        headerElements.forEach(function (el) {
            el.style.setProperty('color', '#1e293b', 'important');
        });

        // Also set color on SVGs inside header icons
        var headerSVGs = document.querySelectorAll('.header__icon svg');
        headerSVGs.forEach(function (svg) {
            svg.style.setProperty('color', '#1e293b', 'important');
        });
    }

    function forceAutoplay() {
        var sliders = document.querySelectorAll('[data-autoplay]');
        sliders.forEach(function (slider) {
            slider.setAttribute('data-autoplay', 'true');
            if (!slider.dataset.speed || slider.dataset.speed === '0') {
                slider.setAttribute('data-speed', '5');
            }
        });

        // Hide pause buttons
        var pauseButtons = document.querySelectorAll('.slideshow__autoplay, [data-autoplay-button]');
        pauseButtons.forEach(function (btn) {
            btn.style.display = 'none';
        });

        // Trigger autoplay on slideshow-component custom elements
        var components = document.querySelectorAll('slideshow-component');
        components.forEach(function (comp) {
            if (comp.autoplayButtonIsSetToPlay === false || !comp.autoplayButtonIsSetToPlay) {
                if (typeof comp.play === 'function') {
                    comp.play();
                } else if (comp.sliderAutoplayButton) {
                    comp.autoplayButtonIsSetToPlay = true;
                    comp.setAutoPlay();
                }
            }
        });
    }

    function applyFixes() {
        forceHeaderWhite();
        forceAutoplay();
    }

    // Run on DOM ready and after delays for Shopify hydration
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            applyFixes();
            // Run again after Shopify might re-apply color scheme styles
            setTimeout(applyFixes, 300);
            setTimeout(applyFixes, 1000);
        });
    } else {
        applyFixes();
        setTimeout(applyFixes, 300);
        setTimeout(applyFixes, 1000);
    }

    // Also run on scroll to handle sticky header state changes
    var lastScrollHandled = 0;
    window.addEventListener('scroll', function () {
        var now = Date.now();
        if (now - lastScrollHandled > 200) {
            lastScrollHandled = now;
            forceHeaderWhite();
        }
    }, { passive: true });
})();
