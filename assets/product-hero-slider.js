/**
 * Product Hero Slider
 * Custom slider functionality for product page image gallery
 */

class ProductHeroSlider extends HTMLElement {
  constructor() {
    super();
    
    this.slider = this;
    this.slides = Array.from(this.querySelectorAll('.product-hero-slide'));
    this.prevButton = this.querySelector('.slider-prev');
    this.nextButton = this.querySelector('.slider-next');
    this.dots = Array.from(this.querySelectorAll('.slider-dot'));
    
    this.currentSlide = 0;
    this.autoplayInterval = null;
    this.autoplayDelay = 5000; // 5 seconds
    
    if (this.slides.length <= 1) {
      // Hide navigation if only one slide
      if (this.prevButton) this.prevButton.style.display = 'none';
      if (this.nextButton) this.nextButton.style.display = 'none';
      return;
    }
    
    this.init();
  }
  
  init() {
    // Show first slide
    this.showSlide(0);
    
    // Add event listeners
    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => this.previousSlide());
    }
    
    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => this.nextSlide());
    }
    
    // Dots navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Keyboard navigation
    this.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.previousSlide();
      } else if (e.key === 'ArrowRight') {
        this.nextSlide();
      }
    });
    
    // Touch/swipe support
    this.initTouchSupport();
    
    // Autoplay (optional - commented out by default)
    // this.startAutoplay();
    
    // Pause autoplay on hover
    this.addEventListener('mouseenter', () => this.stopAutoplay());
    this.addEventListener('mouseleave', () => this.startAutoplay());
  }
  
  showSlide(index) {
    // Ensure index is within bounds
    if (index < 0) {
      index = this.slides.length - 1;
    } else if (index >= this.slides.length) {
      index = 0;
    }
    
    this.currentSlide = index;
    
    // Hide all slides
    this.slides.forEach((slide, i) => {
      if (i === index) {
        slide.style.display = 'block';
        slide.style.opacity = '0';
        // Fade in animation
        requestAnimationFrame(() => {
          slide.style.transition = 'opacity 0.3s ease';
          slide.style.opacity = '1';
        });
      } else {
        slide.style.display = 'none';
      }
    });
    
    // Update dots
    this.dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  nextSlide() {
    this.showSlide(this.currentSlide + 1);
    this.stopAutoplay(); // Stop autoplay after manual interaction
  }
  
  previousSlide() {
    this.showSlide(this.currentSlide - 1);
    this.stopAutoplay(); // Stop autoplay after manual interaction
  }
  
  goToSlide(index) {
    this.showSlide(index);
    this.stopAutoplay(); // Stop autoplay after manual interaction
  }
  
  startAutoplay() {
    if (this.autoplayInterval) return;
    
    // Uncomment to enable autoplay
    // this.autoplayInterval = setInterval(() => {
    //   this.nextSlide();
    // }, this.autoplayDelay);
  }
  
  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
  
  handleSwipe(touchStartX, touchEndX) {
    const swipeThreshold = 50; // minimum distance for swipe
    
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left - next slide
      this.nextSlide();
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right - previous slide
      this.previousSlide();
    }
  }
  
  initTouchSupport() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    this.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    this.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    }, { passive: true });
  }
  
  disconnectedCallback() {
    this.stopAutoplay();
  }
}

// Register custom element with unique name to avoid conflicts
if (!customElements.get('product-hero-slider')) {
  customElements.define('product-hero-slider', ProductHeroSlider);
}

// Alternative approach: Add functionality to existing slideshow-component
document.addEventListener('DOMContentLoaded', () => {
  const productSlider = document.querySelector('.product-hero-slider');
  
  if (!productSlider) return;
  
  const slides = Array.from(productSlider.querySelectorAll('.product-hero-slide'));
  const prevButton = productSlider.querySelector('.slider-prev');
  const nextButton = productSlider.querySelector('.slider-next');
  const dots = Array.from(productSlider.querySelectorAll('.slider-dot'));
  
  let currentSlide = 0;
  
  function showSlide(index) {
    if (index < 0) {
      index = slides.length - 1;
    } else if (index >= slides.length) {
      index = 0;
    }
    
    currentSlide = index;
    
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.style.display = 'block';
        slide.style.opacity = '0';
        requestAnimationFrame(() => {
          slide.style.transition = 'opacity 0.3s ease';
          slide.style.opacity = '1';
        });
      } else {
        slide.style.display = 'none';
      }
    });
    
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('active');
        dot.removeAttribute('aria-current');
      }
    });
  }
  
  // Initialize - show first slide
  if (slides.length > 0) {
    showSlide(0);
  }
  
  // Navigation
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      showSlide(currentSlide - 1);
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      showSlide(currentSlide + 1);
    });
  }
  
  // Dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
    });
  });
  
  // Keyboard navigation
  if (productSlider) {
    productSlider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showSlide(currentSlide - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        showSlide(currentSlide + 1);
      }
    });
  }
  
  // Touch support
  let touchStartX = 0;
  let touchEndX = 0;
  
  productSlider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  productSlider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    
    const swipeThreshold = 50;
    
    if (touchEndX < touchStartX - swipeThreshold) {
      showSlide(currentSlide + 1);
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
      showSlide(currentSlide - 1);
    }
  }, { passive: true });
});
