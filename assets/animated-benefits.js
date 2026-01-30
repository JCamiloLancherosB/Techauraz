/**
 * =============================================================================
 * ANIMATED BENEFITS JAVASCRIPT
 * Version: 1.0.0
 * Created: 2026-01-30
 * =============================================================================
 *
 * Features:
 * - Lazy load Lottie library (lottie-web)
 * - Play animations when cards enter viewport
 * - Pause animations when not visible (performance optimization)
 * - Number counter animation using requestAnimationFrame
 * - Reduced motion support
 * - Staggered entrance animations via Intersection Observer
 *
 * =============================================================================
 */

(function () {
  'use strict';

  // Configuration
  const CONFIG = {
    // SRI hash for lottie-web 5.12.2 minified from cdnjs
    lottieLibUrl: 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js',
    lottieLibIntegrity: 'sha512-jEnuDt6jfAi0GPdnQ5L04TV1wGCnZZaH2AVn2mSwMJkE2q4o4GTbM1pSjE7fRUCXe4ujTx5lnX1C3Cw2e8Uolw==',
    observerThreshold: 0.15,
    observerRootMargin: '0px 0px -50px 0px',
    counterDuration: 2000, // ms
    counterEasing: 'easeOutExpo'
  };

  // State
  let lottieLoaded = false;
  let lottieLoadPromise = null;
  const lottieAnimations = new Map();

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Lazy load the Lottie library
   */
  function loadLottieLibrary() {
    if (lottieLoadPromise) return lottieLoadPromise;

    lottieLoadPromise = new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.lottie) {
        lottieLoaded = true;
        resolve(window.lottie);
        return;
      }

      const script = document.createElement('script');
      script.src = CONFIG.lottieLibUrl;
      script.async = true;
      script.integrity = CONFIG.lottieLibIntegrity;
      script.crossOrigin = 'anonymous';

      script.onload = () => {
        lottieLoaded = true;
        resolve(window.lottie);
      };

      script.onerror = () => {
        reject(new Error('Failed to load Lottie library'));
      };

      document.head.appendChild(script);
    });

    return lottieLoadPromise;
  }

  /**
   * Initialize a Lottie animation in a container
   */
  async function initLottieAnimation(container) {
    if (prefersReducedMotion) return null;

    const src = container.dataset.lottieSrc;
    const name = container.dataset.lottieName;

    if (!src) return null;

    try {
      await loadLottieLibrary();

      const animation = window.lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: true,
        autoplay: false, // We control playback based on visibility
        path: src,
        name: name || 'benefit-animation'
      });

      // Handle load errors
      animation.addEventListener('data_failed', () => {
        container.classList.add('lottie-failed');
      });

      // Store reference for later control
      lottieAnimations.set(container, animation);

      return animation;
    } catch (error) {
      // Log error for debugging in development
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('Animated Benefits: Failed to load Lottie animation', error);
      }
      container.classList.add('lottie-failed');
      return null;
    }
  }

  /**
   * Easing functions for counter animation
   */
  const easings = {
    easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    easeOutQuad: (t) => 1 - (1 - t) * (1 - t),
    linear: (t) => t
  };

  /**
   * Animate a counter from 0 to target value
   */
  function animateCounter(element) {
    const target = parseInt(element.dataset.counterTarget, 10);
    const suffix = element.dataset.counterSuffix || '';
    
    // Validate that target is a valid number
    if (isNaN(target)) {
      // Show the original text content or a fallback
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('Animated Benefits: Invalid counter target', element.dataset.counterTarget);
      }
      return;
    }

    if (prefersReducedMotion) {
      // Just set the final value immediately
      element.textContent = target + suffix;
      return;
    }

    const duration = CONFIG.counterDuration;
    const easing = easings[CONFIG.counterEasing] || easings.easeOutExpo;

    let start = null;
    let current = 0;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const easedProgress = easing(progress);

      current = Math.floor(easedProgress * target);
      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  /**
   * Handle card visibility change
   */
  function handleCardVisibility(card, isVisible) {
    const lottieContainer = card.querySelector('.benefit-card__lottie');
    const animation = lottieContainer ? lottieAnimations.get(lottieContainer) : null;

    if (isVisible) {
      // Start Lottie animation
      if (animation) {
        animation.play();
      }

      // Trigger counter animation if present (only once)
      const counter = card.querySelector('.benefit-card__counter');
      if (counter && !counter.dataset.animated) {
        counter.dataset.animated = 'true';
        animateCounter(counter);
      }
    } else {
      // Pause Lottie animation for performance
      if (animation) {
        animation.pause();
      }
    }
  }

  /**
   * Initialize the Intersection Observer for cards
   */
  function initObserver() {
    const cards = document.querySelectorAll('.benefit-card');

    if (cards.length === 0) return;

    // Fallback for browsers without IntersectionObserver
    if (!window.IntersectionObserver) {
      cards.forEach((card) => {
        card.classList.add('is-visible');
        handleCardVisibility(card, true);
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const card = entry.target;

          if (entry.isIntersecting) {
            // Add visible class for CSS entrance animation
            if (!card.classList.contains('is-visible')) {
              card.classList.add('is-visible');
            }
            handleCardVisibility(card, true);
          } else {
            // Pause animations when not visible (performance)
            handleCardVisibility(card, false);
          }
        });
      },
      {
        threshold: CONFIG.observerThreshold,
        rootMargin: CONFIG.observerRootMargin
      }
    );

    // Initialize Lottie animations and observe cards
    // Start observing immediately, Lottie will load in background
    cards.forEach((card, index) => {
      // Set staggered animation delay
      const delay = index * 150;
      card.style.setProperty('--animation-delay', `${delay}ms`);

      // Start observing immediately for entrance animations
      observer.observe(card);

      // Initialize Lottie for this card (non-blocking)
      const lottieContainer = card.querySelector('.benefit-card__lottie');
      if (lottieContainer) {
        initLottieAnimation(lottieContainer).catch(() => {
          // Error already handled in initLottieAnimation
        });
      }
    });
  }

  /**
   * Initialize section header animation
   */
  function initHeaderAnimation() {
    const sections = document.querySelectorAll('.animated-benefits');

    if (!window.IntersectionObserver || prefersReducedMotion) {
      sections.forEach((section) => {
        section.setAttribute('data-animated', 'true');
      });
      return;
    }

    const headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-animated', 'true');
            headerObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1
      }
    );

    sections.forEach((section) => {
      headerObserver.observe(section);
    });
  }

  /**
   * Main initialization
   */
  function init() {
    // For reduced motion, show everything immediately
    if (prefersReducedMotion) {
      document.querySelectorAll('.benefit-card').forEach((card) => {
        card.classList.add('is-visible');
        const counter = card.querySelector('.benefit-card__counter');
        if (counter) {
          animateCounter(counter);
        }
      });
      document.querySelectorAll('.animated-benefits').forEach((section) => {
        section.setAttribute('data-animated', 'true');
      });
      return;
    }

    initHeaderAnimation();
    initObserver();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Support Shopify theme editor
  if (typeof Shopify !== 'undefined' && Shopify.designMode) {
    document.addEventListener('shopify:section:load', (event) => {
      if (event.target.querySelector('.animated-benefits')) {
        init();
      }
    });

    document.addEventListener('shopify:section:select', (event) => {
      if (event.target.querySelector('.animated-benefits')) {
        // Show all animations immediately in editor
        event.target.querySelectorAll('.benefit-card').forEach((card) => {
          card.classList.add('is-visible');
          handleCardVisibility(card, true);
        });
        event.target.querySelector('.animated-benefits')?.setAttribute('data-animated', 'true');
      }
    });
  }
})();
