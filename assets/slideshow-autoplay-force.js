/**
 * TECHAURAZ SLIDESHOW AUTOPLAY + HEADER FIX — March 2026
 * Forces autoplay on slideshow, forces white header background,
 * and slows down slideshow speed to 9 seconds.
 */
(function () {
    'use strict';

    function forceHeaderWhite() {
        var hw = document.querySelector('.header-wrapper');
        if (hw) {
            hw.style.setProperty('background', '#ffffff', 'important');
            hw.style.setProperty('background-color', '#ffffff', 'important');
            hw.style.setProperty('background-image', 'none', 'important');
        }
        var headerElements = document.querySelectorAll(
            '.header__menu-link, .header__icon, .header__heading-link, .header a, .header summary'
        );
        headerElements.forEach(function (el) {
            el.style.setProperty('color', '#1e293b', 'important');
        });
        var headerSVGs = document.querySelectorAll('.header__icon svg');
        headerSVGs.forEach(function (svg) {
            svg.style.setProperty('color', '#1e293b', 'important');
        });
    }

    function forceAutoplay() {
        var sliders = document.querySelectorAll('[data-autoplay]');
        sliders.forEach(function (slider) {
            slider.setAttribute('data-autoplay', 'true');
            // Force slower speed — 9 seconds between slides
            slider.setAttribute('data-speed', '9');
        });

        var pauseButtons = document.querySelectorAll('.slideshow__autoplay, [data-autoplay-button]');
        pauseButtons.forEach(function (btn) {
            btn.style.display = 'none';
        });

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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            applyFixes();
            setTimeout(applyFixes, 300);
            setTimeout(applyFixes, 1000);
        });
    } else {
        applyFixes();
        setTimeout(applyFixes, 300);
        setTimeout(applyFixes, 1000);
    }

    var lastScrollHandled = 0;
    window.addEventListener('scroll', function () {
        var now = Date.now();
        if (now - lastScrollHandled > 200) {
            lastScrollHandled = now;
            forceHeaderWhite();
        }
    }, { passive: true });
})();
