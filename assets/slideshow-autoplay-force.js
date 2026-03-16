/**
 * TECHAURAZ SLIDESHOW AUTOPLAY — March 2026 (v3)
 * Forces 6-second autoplay interval.
 * Pauses on hover (desktop), visibility change, and IntersectionObserver.
 * Uses MutationObserver to detect slideshow-component.
 */
(function () {
    'use strict';

    var SLIDE_INTERVAL = 6;
    var isPaused = false;
    var comp = null;

    function forceAutoplay() {
        var sliders = document.querySelectorAll('[data-autoplay]');
        sliders.forEach(function (slider) {
            slider.setAttribute('data-autoplay', 'true');
            slider.setAttribute('data-speed', String(SLIDE_INTERVAL));
        });

        var pauseButtons = document.querySelectorAll('.slideshow__autoplay, [data-autoplay-button]');
        pauseButtons.forEach(function (btn) {
            btn.style.display = 'none';
        });

        var components = document.querySelectorAll('slideshow-component');
        if (components.length > 0) {
            comp = components[0];
        }
        components.forEach(function (c) {
            if (c.autoplayButtonIsSetToPlay === false || !c.autoplayButtonIsSetToPlay) {
                if (typeof c.play === 'function') {
                    c.play();
                } else if (c.sliderAutoplayButton) {
                    c.autoplayButtonIsSetToPlay = true;
                    c.setAutoPlay();
                }
            }
        });

        return components.length > 0;
    }

    function pauseSlideshow() {
        if (isPaused || !comp) return;
        isPaused = true;
        if (typeof comp.pause === 'function') {
            comp.pause();
        }
    }

    function resumeSlideshow() {
        if (!isPaused || !comp) return;
        isPaused = false;
        if (typeof comp.play === 'function') {
            comp.play();
        }
    }

    function setupHoverPause() {
        if (!comp) return;
        comp.addEventListener('mouseenter', pauseSlideshow);
        comp.addEventListener('mouseleave', resumeSlideshow);
    }

    function setupIntersectionObserver() {
        if (!comp || !('IntersectionObserver' in window)) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    resumeSlideshow();
                } else {
                    pauseSlideshow();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(comp);
    }

    function setupVisibilityPause() {
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                pauseSlideshow();
            } else {
                resumeSlideshow();
            }
        });
    }

    function init() {
        if (forceAutoplay()) {
            setupHoverPause();
            setupIntersectionObserver();
            setupVisibilityPause();
            return;
        }

        // Watch for slideshow-component to appear
        var observer = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                var added = mutations[i].addedNodes;
                for (var j = 0; j < added.length; j++) {
                    var node = added[j];
                    if (node.nodeType === 1 && (node.tagName === 'SLIDESHOW-COMPONENT' || node.querySelector('slideshow-component'))) {
                        setTimeout(function () {
                            forceAutoplay();
                            setupHoverPause();
                            setupIntersectionObserver();
                            setupVisibilityPause();
                        }, 200);
                        observer.disconnect();
                        return;
                    }
                }
            }
        });

        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true
        });

        setTimeout(function () {
            observer.disconnect();
            forceAutoplay();
            setupHoverPause();
            setupIntersectionObserver();
            setupVisibilityPause();
        }, 4000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
