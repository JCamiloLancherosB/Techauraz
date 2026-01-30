/**
 * FAQ Accordion - TechAura Product FAQ Section
 * Version: 1.0.0
 *
 * Features:
 * - Vanilla JS accordion functionality
 * - Keyboard accessibility (Enter/Space to toggle)
 * - ARIA attributes (aria-expanded, aria-controls)
 * - Optional "only one item open at a time" behavior
 * - Smooth height animations
 * - Analytics tracking for FAQ clicks
 */

(function () {
  'use strict';

  // Animation duration in ms - must match CSS transition duration
  const ANIMATION_DURATION = 300;

  /**
   * FAQ Accordion Controller
   */
  class FaqAccordion {
    constructor(container) {
      if (!container) return;

      this.container = container;
      this.items = container.querySelectorAll('.product-faq__item');
      this.singleOpen = container.dataset.singleOpen === 'true';

      if (this.items.length === 0) return;

      this.init();
    }

    init() {
      this.setupAccessibility();
      this.bindEvents();
    }

    /**
     * Set up ARIA attributes for accessibility
     */
    setupAccessibility() {
      this.items.forEach((item, index) => {
        const summary = item.querySelector('.product-faq__question');
        const answer = item.querySelector('.product-faq__answer');

        if (!summary || !answer) return;

        // Generate unique IDs
        const sectionId = this.container.closest('section')?.id || 'faq';
        const questionId = `${sectionId}-question-${index}`;
        const answerId = `${sectionId}-answer-${index}`;

        // Set IDs
        summary.id = questionId;
        answer.id = answerId;

        // Set ARIA attributes
        summary.setAttribute('aria-expanded', item.open ? 'true' : 'false');
        summary.setAttribute('aria-controls', answerId);
        answer.setAttribute('aria-labelledby', questionId);
        answer.setAttribute('role', 'region');

        // Wrap answer content for animation
        if (!answer.querySelector('.product-faq__answer-inner')) {
          const innerWrapper = document.createElement('div');
          innerWrapper.className = 'product-faq__answer-inner';
          innerWrapper.innerHTML = answer.innerHTML;
          answer.innerHTML = '';
          answer.appendChild(innerWrapper);
        }
      });
    }

    /**
     * Bind event handlers
     */
    bindEvents() {
      this.items.forEach((item) => {
        const summary = item.querySelector('.product-faq__question');

        if (!summary) return;

        // Handle click events
        summary.addEventListener('click', (e) => this.handleToggle(e, item));

        // Handle keyboard events
        summary.addEventListener('keydown', (e) =>
          this.handleKeydown(e, item)
        );

        // Handle toggle event (native details behavior)
        item.addEventListener('toggle', () => this.handleToggleEvent(item));
      });
    }

    /**
     * Handle toggle interaction
     */
    handleToggle(event, item) {
      // Let the native details behavior handle the toggle
      // Analytics are tracked in handleToggleEvent after toggle completes
    }

    /**
     * Handle toggle event from details element
     */
    handleToggleEvent(item) {
      const summary = item.querySelector('.product-faq__question');

      // Update ARIA
      if (summary) {
        summary.setAttribute('aria-expanded', item.open ? 'true' : 'false');
      }

      // Close other items if single open mode
      if (item.open && this.singleOpen) {
        this.closeOtherItems(item);
      }

      // Track analytics (after toggle state is finalized)
      this.trackClick(item);

      // Animate
      this.animateToggle(item);
    }

    /**
     * Handle keyboard navigation
     */
    handleKeydown(event, item) {
      const { key } = event;

      // Enter or Space to toggle (native behavior handles this, but we ensure consistency)
      if (key === 'Enter' || key === ' ') {
        // Native details element handles this
        return;
      }

      // Arrow key navigation between items
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        event.preventDefault();
        this.navigateItems(item, key === 'ArrowDown' ? 1 : -1);
      }

      // Home/End navigation
      if (key === 'Home') {
        event.preventDefault();
        this.focusItem(0);
      }

      if (key === 'End') {
        event.preventDefault();
        this.focusItem(this.items.length - 1);
      }
    }

    /**
     * Navigate between items with arrow keys
     */
    navigateItems(currentItem, direction) {
      const currentIndex = Array.from(this.items).indexOf(currentItem);
      let nextIndex = currentIndex + direction;

      // Wrap around
      if (nextIndex < 0) nextIndex = this.items.length - 1;
      if (nextIndex >= this.items.length) nextIndex = 0;

      this.focusItem(nextIndex);
    }

    /**
     * Focus a specific item
     */
    focusItem(index) {
      const item = this.items[index];
      if (!item) return;

      const summary = item.querySelector('.product-faq__question');
      if (summary) {
        summary.focus();
      }
    }

    /**
     * Close other accordion items
     */
    closeOtherItems(currentItem) {
      this.items.forEach((item) => {
        if (item !== currentItem && item.open) {
          item.open = false;
          const summary = item.querySelector('.product-faq__question');
          if (summary) {
            summary.setAttribute('aria-expanded', 'false');
          }
        }
      });
    }

    /**
     * Animate the toggle with smooth height transition
     */
    animateToggle(item) {
      const answerInner = item.querySelector('.product-faq__answer-inner');
      if (!answerInner) return;

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) return;

      if (item.open) {
        // Opening animation
        item.classList.add('is-animating');
        answerInner.style.maxHeight = '0';
        answerInner.style.opacity = '0';

        // Read offsetHeight to trigger reflow before animation
        answerInner.offsetHeight;

        // Animate to full height
        requestAnimationFrame(() => {
          const height = answerInner.scrollHeight;
          answerInner.style.maxHeight = height + 'px';
          answerInner.style.opacity = '1';

          // Clean up after animation completes
          setTimeout(() => {
            item.classList.remove('is-animating');
            item.classList.add('is-open');
            answerInner.style.maxHeight = '';
          }, ANIMATION_DURATION);
        });
      } else {
        // Closing animation
        item.classList.remove('is-open');
        item.classList.add('is-animating');

        const height = answerInner.scrollHeight;
        answerInner.style.maxHeight = height + 'px';

        // Read offsetHeight to trigger reflow before animation
        answerInner.offsetHeight;

        requestAnimationFrame(() => {
          answerInner.style.maxHeight = '0';
          answerInner.style.opacity = '0';

          setTimeout(() => {
            item.classList.remove('is-animating');
            answerInner.style.maxHeight = '';
            answerInner.style.opacity = '';
          }, ANIMATION_DURATION);
        });
      }
    }

    /**
     * Track FAQ click for analytics
     */
    trackClick(item) {
      const summary = item.querySelector('.product-faq__question');
      const questionText = summary
        ? summary.querySelector('.product-faq__question-text')?.textContent?.trim()
        : '';

      // Dispatch custom event for analytics integration
      const event = new CustomEvent('faq:click', {
        bubbles: true,
        detail: {
          question: questionText,
          isOpen: item.open,
          timestamp: Date.now(),
        },
      });

      this.container.dispatchEvent(event);

      // Google Analytics 4 integration (if available)
      if (typeof gtag === 'function') {
        gtag('event', 'faq_interaction', {
          event_category: 'FAQ',
          event_label: questionText,
          value: item.open ? 1 : 0,
        });
      }

      // Google Analytics Universal (if available)
      if (typeof ga === 'function') {
        ga('send', 'event', 'FAQ', item.open ? 'open' : 'close', questionText);
      }
    }
  }

  /**
   * Initialize all FAQ accordions on the page
   */
  function initFaqAccordions() {
    const containers = document.querySelectorAll('.product-faq__accordion');
    containers.forEach((container) => new FaqAccordion(container));
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFaqAccordions);
  } else {
    initFaqAccordions();
  }

  // Re-initialize when Shopify section is loaded/reloaded (for theme editor)
  document.addEventListener('shopify:section:load', (event) => {
    if (event.target.querySelector('.product-faq__accordion')) {
      const container = event.target.querySelector('.product-faq__accordion');
      if (container) {
        new FaqAccordion(container);
      }
    }
  });

  // Export for external use
  window.FaqAccordion = FaqAccordion;
})();
