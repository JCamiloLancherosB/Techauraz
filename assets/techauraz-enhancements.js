/**
 * =============================================================================
 * TECHAURAZ HEADER ENHANCEMENTS
 * =============================================================================
 * Handles sticky header with shrink-on-scroll behavior
 */

(function() {
  'use strict';

  // Sticky header shrink on scroll
  const header = document.querySelector('.header');
  
  if (!header) return;

  let lastScrollTop = 0;
  let ticking = false;

  function updateHeader() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class when user scrolls down more than 50px
    if (scrollTop > 50) {
      header.classList.add('scrolled');
      document.body.classList.add('scrolled-past-header');
    } else {
      header.classList.remove('scrolled');
      document.body.classList.remove('scrolled-past-header');
    }
    
    lastScrollTop = scrollTop;
    ticking = false;
  }

  function requestHeaderTick() {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  // Listen for scroll events
  window.addEventListener("scroll", requestHeaderTick, { passive: true });
  
  // Check initial state
  updateHeader();
})();

/**
 * =============================================================================
 * IMAGE LAZY LOADING HANDLER
 * =============================================================================
 * Adds loaded class to images when they finish loading
 */

(function() {
  'use strict';

  const images = document.querySelectorAll('img[loading="lazy"]');
  
  images.forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', function() {
        this.classList.add('loaded');
      });
    }
  });
})();

/**
 * =============================================================================
 * METAFIELD THEME STYLE HANDLER
 * =============================================================================
 * Applies theme style overrides based on product metafield
 */

(function() {
  'use strict';

  const productContainer = document.querySelector('.product');
  if (!productContainer) return;

  // Get theme style from data attribute (set in Liquid)
  const themeStyle = productContainer.dataset.themeStyle;
  
  if (themeStyle === 'warm_cro') {
    productContainer.classList.add('pdp--warm');
  }
})();

/**
 * =============================================================================
 * TESTIMONIALS SLIDER COMPONENT
 * =============================================================================
 * Extracted from sections/testimonials.liquid
 * Handles slider navigation and scroll behavior for testimonials section
 */

if (!customElements.get('slider-component')) {
  customElements.define('slider-component', class SliderComponent extends HTMLElement {
    constructor() {
      super();
      this.slider = this.querySelector('.slider');
      this.sliderItems = this.querySelectorAll('.testimonial-card');
      this.prevButton = this.querySelector('.slider-button--prev');
      this.nextButton = this.querySelector('.slider-button--next');
      this.sliderControlButtons = this.querySelectorAll('.slider-counter__link');

      if (!this.slider || !this.nextButton) return;

      this.initPages();
      this.prevButton?.addEventListener('click', this.onButtonClick.bind(this));
      this.nextButton?.addEventListener('click', this.onButtonClick.bind(this));
      this.slider.addEventListener('scroll', this.update.bind(this));

      this.sliderControlButtons.forEach((link, index) => {
        link.addEventListener('click', () => {
          const slidePosition = this.sliderItems[index].offsetLeft;
          this.slider.scrollTo({ left: slidePosition, behavior: 'smooth' });
        });
      });
    }

    initPages() {
      this.sliderItemsToShow = Array.from(this.sliderItems).filter(el => el.clientWidth > 0);
      if (this.sliderItemsToShow.length < 2) return;
      this.sliderItemOffset = this.sliderItemsToShow[1].offsetLeft - this.sliderItemsToShow[0].offsetLeft;
      this.update();
    }

    update() {
      if (!this.slider) return;
      const currentPage = Math.round(this.slider.scrollLeft / this.sliderItemOffset);
      
      this.sliderControlButtons.forEach((button, index) => {
        if (index === currentPage) {
          button.classList.add('slider-counter__link--active');
        } else {
          button.classList.remove('slider-counter__link--active');
        }
      });

      if (this.prevButton) {
        this.prevButton.disabled = this.slider.scrollLeft <= 0;
      }
      if (this.nextButton) {
        const maxScroll = this.slider.scrollWidth - this.slider.clientWidth;
        this.nextButton.disabled = this.slider.scrollLeft >= maxScroll - 5;
      }
    }

    onButtonClick(event) {
      event.preventDefault();
      const direction = event.currentTarget.name === 'next' ? 1 : -1;
      this.slider.scrollBy({ left: direction * this.sliderItemOffset, behavior: 'smooth' });
    }
  });
}
