/**
 * =============================================================================
 * TESTIMONIALS CAROUSEL JAVASCRIPT
 * =============================================================================
 * Handles carousel functionality for the testimonials section
 * 
 * Features:
 * - Auto-rotate every 5 seconds (configurable)
 * - Pause on hover
 * - Touch/swipe support for mobile devices
 * - Keyboard navigation (arrow keys)
 * - WCAG 2.1 AA accessibility compliant
 */

(function() {
  'use strict';

  // Constants
  const TRANSITION_DURATION = 500; // ms - matches CSS transition

  class TestimonialsCarousel {
    constructor(element) {
      this.section = element;
      this.sectionId = element.dataset.sectionId;
      this.autoplay = element.dataset.autoplay === 'true';
      this.autoplaySpeed = (parseInt(element.dataset.autoplaySpeed, 10) || 5) * 1000;
      
      // DOM elements
      this.track = element.querySelector('.testimonials-carousel__track');
      this.cards = Array.from(element.querySelectorAll('.testimonials-carousel__card'));
      this.prevBtn = element.querySelector('.testimonials-carousel__nav--prev');
      this.nextBtn = element.querySelector('.testimonials-carousel__nav--next');
      this.dots = Array.from(element.querySelectorAll('.testimonials-carousel__dot'));
      this.autoplayToggle = element.querySelector('.testimonials-carousel__autoplay-toggle');
      
      // State
      this.currentIndex = 0;
      this.totalSlides = this.cards.length;
      this.autoplayTimer = null;
      this.isPaused = false;
      this.userPaused = false;
      this.isAnimating = false;
      this.isDestroyed = false;
      
      // Touch handling
      this.touchStartX = 0;
      this.touchEndX = 0;
      this.touchThreshold = 50;
      this.isDragging = false;
      
      // Resize handling
      this.resizeTimeout = null;
      
      // Get visible count from data attribute
      this.visibleCount = parseInt(this.track?.dataset.visibleCount, 10) || 3;
      
      // Bound event handlers for cleanup
      this.boundHandleMouseMove = (e) => this.handleMouseMove(e);
      this.boundHandleMouseUp = (e) => this.handleMouseUp(e);
      this.boundHandleVisibilityChange = () => this.handleVisibilityChange();
      this.boundHandleResize = () => this.handleResize();
      
      // Initialize
      this.init();
    }

    init() {
      if (!this.track || this.totalSlides === 0) return;

      this.bindEvents();
      this.updateCarousel();
      
      if (this.autoplay && this.totalSlides > 1) {
        this.startAutoplay();
      }

      // Set initial ARIA states
      this.updateAccessibility();
    }

    bindEvents() {
      // Navigation buttons
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => this.prev());
      }
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => this.next());
      }

      // Dot navigation
      this.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => this.goToSlide(index));
      });

      // Autoplay toggle button
      if (this.autoplayToggle) {
        this.autoplayToggle.addEventListener('click', () => this.toggleAutoplay());
      }

      // Pause on hover
      this.section.addEventListener('mouseenter', () => this.pauseAutoplay());
      this.section.addEventListener('mouseleave', () => this.resumeAutoplay());

      // Touch events for swipe
      this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
      this.track.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
      this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e));

      // Mouse drag support (using bound methods for cleanup)
      this.track.addEventListener('mousedown', (e) => this.handleMouseDown(e));
      document.addEventListener('mousemove', this.boundHandleMouseMove);
      document.addEventListener('mouseup', this.boundHandleMouseUp);

      // Keyboard navigation
      this.section.addEventListener('keydown', (e) => this.handleKeydown(e));

      // Pause autoplay when tab is hidden (for accessibility/performance)
      document.addEventListener('visibilitychange', this.boundHandleVisibilityChange);

      // Handle focus for accessibility
      this.cards.forEach((card, index) => {
        card.addEventListener('focus', () => {
          this.goToSlide(index);
          this.pauseAutoplay();
        });
      });

      // Handle window resize with debouncing
      window.addEventListener('resize', this.boundHandleResize);
    }

    handleVisibilityChange() {
      if (document.hidden) {
        this.pauseAutoplay();
      } else {
        this.resumeAutoplay();
      }
    }

    handleResize() {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      this.resizeTimeout = setTimeout(() => {
        if (!this.isDestroyed) {
          this.updateCarousel();
        }
      }, 100);
    }

    // Navigation methods
    next() {
      if (this.isAnimating) return;
      
      const maxIndex = this.getMaxIndex();
      if (this.currentIndex < maxIndex) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0; // Loop back to start
      }
      this.updateCarousel();
      this.resetAutoplay();
    }

    prev() {
      if (this.isAnimating) return;
      
      const maxIndex = this.getMaxIndex();
      if (this.currentIndex > 0) {
        this.currentIndex--;
      } else {
        this.currentIndex = maxIndex; // Loop to end
      }
      this.updateCarousel();
      this.resetAutoplay();
    }

    goToSlide(index) {
      if (this.isAnimating || index === this.currentIndex) return;
      
      const maxIndex = this.getMaxIndex();
      this.currentIndex = Math.max(0, Math.min(index, maxIndex));
      this.updateCarousel();
      this.resetAutoplay();
    }

    getMaxIndex() {
      // Calculate max index based on visible count and total slides
      const effectiveVisibleCount = this.getEffectiveVisibleCount();
      return Math.max(0, this.totalSlides - effectiveVisibleCount);
    }

    getEffectiveVisibleCount() {
      // Adjust visible count based on screen width
      const windowWidth = window.innerWidth;
      if (windowWidth <= 768) {
        return 1;
      } else if (windowWidth <= 1024) {
        return Math.min(2, this.visibleCount);
      }
      return this.visibleCount;
    }

    updateCarousel() {
      if (!this.track || this.isDestroyed) return;

      this.isAnimating = true;

      // Calculate the translation amount
      const cardWidth = this.cards[0]?.offsetWidth || 0;
      const gap = parseInt(getComputedStyle(this.track).gap, 10) || 24;
      const translateX = -this.currentIndex * (cardWidth + gap);

      this.track.style.transform = `translateX(${translateX}px)`;

      // Update dots
      this.updateDots();
      
      // Update navigation buttons
      this.updateNavButtons();
      
      // Update accessibility
      this.updateAccessibility();

      // Reset animating flag after transition (using constant for consistency with CSS)
      setTimeout(() => {
        if (!this.isDestroyed) {
          this.isAnimating = false;
        }
      }, TRANSITION_DURATION);
    }

    updateDots() {
      this.dots.forEach((dot, index) => {
        const isActive = index === this.currentIndex;
        dot.classList.toggle('testimonials-carousel__dot--active', isActive);
        dot.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    }

    updateNavButtons() {
      const maxIndex = this.getMaxIndex();
      
      // Buttons are always enabled for infinite loop, but visually indicate boundaries
      if (this.prevBtn) {
        this.prevBtn.disabled = false;
      }
      if (this.nextBtn) {
        this.nextBtn.disabled = false;
      }
    }

    updateAccessibility() {
      // Update focus management for keyboard navigation
      // Note: We use aria-current instead of aria-hidden to allow screen reader users
      // to navigate through all testimonials
      const effectiveVisibleCount = this.getEffectiveVisibleCount();
      this.cards.forEach((card, index) => {
        const isCurrentlyVisible = index >= this.currentIndex && index < this.currentIndex + effectiveVisibleCount;
        // Set tabindex to make visible cards focusable
        card.setAttribute('tabindex', isCurrentlyVisible ? '0' : '-1');
        // Use aria-current to indicate active slides without hiding content
        card.setAttribute('aria-current', isCurrentlyVisible ? 'true' : 'false');
      });

      // Announce slide change to screen readers
      this.announceSlideChange();
    }

    announceSlideChange() {
      // Create or update live region for screen readers
      let liveRegion = this.section.querySelector('.testimonials-carousel__live-region');
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.className = 'testimonials-carousel__live-region visually-hidden';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        this.section.appendChild(liveRegion);
      }
      
      const effectiveVisibleCount = this.getEffectiveVisibleCount();
      liveRegion.textContent = `Mostrando testimonio ${this.currentIndex + 1} de ${this.totalSlides}`;
    }

    // Autoplay methods
    startAutoplay() {
      if (!this.autoplay || this.totalSlides <= 1) return;
      
      this.stopAutoplay();
      this.autoplayTimer = setInterval(() => {
        if (!this.isPaused) {
          this.next();
        }
      }, this.autoplaySpeed);
    }

    stopAutoplay() {
      if (this.autoplayTimer) {
        clearInterval(this.autoplayTimer);
        this.autoplayTimer = null;
      }
    }

    pauseAutoplay() {
      this.isPaused = true;
    }

    resumeAutoplay() {
      if (!this.userPaused) {
        this.isPaused = false;
      }
    }

    toggleAutoplay() {
      if (this.userPaused) {
        // Resume
        this.userPaused = false;
        this.isPaused = false;
        this.startAutoplay();
        this.updateAutoplayToggle(true);
      } else {
        // Pause
        this.userPaused = true;
        this.isPaused = true;
        this.stopAutoplay();
        this.updateAutoplayToggle(false);
      }
    }

    updateAutoplayToggle(isPlaying) {
      if (!this.autoplayToggle) return;
      var pauseIcon = this.autoplayToggle.querySelector('.testimonials-carousel__pause-icon');
      var playIcon = this.autoplayToggle.querySelector('.testimonials-carousel__play-icon');
      if (isPlaying) {
        this.autoplayToggle.setAttribute('aria-label', 'Pausar rotación automática');
        this.autoplayToggle.dataset.playing = 'true';
        if (pauseIcon) pauseIcon.style.display = '';
        if (playIcon) playIcon.style.display = 'none';
      } else {
        this.autoplayToggle.setAttribute('aria-label', 'Reanudar rotación automática');
        this.autoplayToggle.dataset.playing = 'false';
        if (pauseIcon) pauseIcon.style.display = 'none';
        if (playIcon) playIcon.style.display = '';
      }
    }

    resetAutoplay() {
      if (this.autoplay && !this.userPaused) {
        this.startAutoplay();
      }
    }

    // Touch/Swipe handling
    handleTouchStart(e) {
      this.touchStartX = e.touches[0].clientX;
      this.isDragging = true;
      this.pauseAutoplay();
    }

    handleTouchMove(e) {
      if (!this.isDragging) return;
      this.touchEndX = e.touches[0].clientX;
      
      // Prevent vertical scrolling when swiping horizontally
      const diff = Math.abs(this.touchStartX - this.touchEndX);
      if (diff > 10) {
        e.preventDefault();
      }
    }

    handleTouchEnd(e) {
      if (!this.isDragging) return;
      
      this.isDragging = false;
      const diff = this.touchStartX - this.touchEndX;

      if (Math.abs(diff) > this.touchThreshold) {
        if (diff > 0) {
          this.next(); // Swipe left = next
        } else {
          this.prev(); // Swipe right = previous
        }
      }

      this.resumeAutoplay();
    }

    // Mouse drag handling
    handleMouseDown(e) {
      // Only handle left mouse button
      if (e.button !== 0) return;
      
      this.touchStartX = e.clientX;
      this.isDragging = true;
      this.track.style.cursor = 'grabbing';
      this.pauseAutoplay();
      e.preventDefault();
    }

    handleMouseMove(e) {
      if (!this.isDragging) return;
      this.touchEndX = e.clientX;
    }

    handleMouseUp(e) {
      if (!this.isDragging) return;
      
      this.isDragging = false;
      this.track.style.cursor = '';
      
      const diff = this.touchStartX - this.touchEndX;

      if (Math.abs(diff) > this.touchThreshold) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }

      this.resumeAutoplay();
    }

    // Keyboard navigation
    handleKeydown(e) {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.prev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.next();
          break;
        case 'Home':
          e.preventDefault();
          this.goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          this.goToSlide(this.getMaxIndex());
          break;
      }
    }

    // Cleanup
    destroy() {
      this.isDestroyed = true;
      this.stopAutoplay();
      
      // Clear resize timeout
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = null;
      }
      
      // Remove document-level event listeners
      document.removeEventListener('mousemove', this.boundHandleMouseMove);
      document.removeEventListener('mouseup', this.boundHandleMouseUp);
      document.removeEventListener('visibilitychange', this.boundHandleVisibilityChange);
      window.removeEventListener('resize', this.boundHandleResize);
    }
  }

  // Initialize all testimonials carousels on page load
  function initCarousels() {
    const carousels = document.querySelectorAll('.testimonials-carousel');
    carousels.forEach((carousel) => {
      if (!carousel.dataset.initialized) {
        carousel.carouselInstance = new TestimonialsCarousel(carousel);
        carousel.dataset.initialized = 'true';
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousels);
  } else {
    initCarousels();
  }

  // Re-initialize on Shopify section refresh (for theme editor)
  document.addEventListener('shopify:section:load', (e) => {
    const section = e.target.querySelector('.testimonials-carousel');
    if (section && !section.dataset.initialized) {
      section.carouselInstance = new TestimonialsCarousel(section);
      section.dataset.initialized = 'true';
    }
  });

  // Clean up on section unload
  document.addEventListener('shopify:section:unload', (e) => {
    const section = e.target.querySelector('.testimonials-carousel');
    if (section && section.carouselInstance) {
      section.carouselInstance.destroy();
    }
  });

})();
