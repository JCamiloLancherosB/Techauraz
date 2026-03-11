/**
 * TECHAURAZ SLIDESHOW AUTOPLAY FORCE — March 2026
 * Forces autoplay on slideshow components regardless of admin setting.
 * Also hides the pause button from the DOM.
 */
(function () {
    'use strict';

    function forceAutoplay() {
        var sliders = document.querySelectorAll('[data-autoplay]');
        sliders.forEach(function (slider) {
            // Force autoplay attribute to true
            slider.setAttribute('data-autoplay', 'true');

            // Set speed if not already set (5 seconds default)
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
                // Try to start autoplay if the component has the method
                if (typeof comp.play === 'function') {
                    comp.play();
                } else if (comp.sliderAutoplayButton) {
                    // Simulate clicking play
                    comp.autoplayButtonIsSetToPlay = true;
                    comp.setAutoPlay();
                }
            }
        });
    }

    // Run on DOM ready and after a short delay for Shopify hydration
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(forceAutoplay, 500);
        });
    } else {
        setTimeout(forceAutoplay, 500);
    }
})();
