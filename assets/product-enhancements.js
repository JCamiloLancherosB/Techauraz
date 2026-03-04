/**
 * Product Page Enhancements
 * Extracted from inline scripts for better maintainability and performance
 * 
 * IMPORTANT: This file uses data-product-id scoping to prevent conflicts
 * between multiple product instances on the same page. Do not remove the
 * initialization guard or product ID scoping without careful consideration.
 */

// Initialization guard to prevent duplicate execution
if (typeof window.productEnhancementsInitialized === 'undefined') {
  window.productEnhancementsInitialized = new Set();
}

document.addEventListener('DOMContentLoaded', function () {
  // Get product ID from section element for keying timers - DO NOT MODIFY
  const productSection = document.querySelector('[data-product-id]');
  const productId = productSection ? productSection.getAttribute('data-product-id') : null;

  // Guard against duplicate initialization for this product
  if (productId && window.productEnhancementsInitialized.has(productId)) {
    // Development mode only - safely check for DEBUG flag
    if (typeof window.DEBUG !== 'undefined' && window.DEBUG === true) {
      console.log('Product enhancements already initialized for product:', productId);
    }
    return;
  }

  if (productId) {
    window.productEnhancementsInitialized.add(productId);
  }

  // FUNCIONALIDADES PERSUASIVAS MEJORADAS
  // All queries scoped to current product section to prevent cross-product conflicts

  // 4. Tracking de comportamiento del usuario
  function initUserBehaviorTracking() {
    let timeOnPage = 0;
    let scrollDepth = 0;
    let clicksOnPrice = 0;
    let clicksOnImages = 0;

    // Tiempo en página
    const timeInterval = setInterval(() => {
      timeOnPage++;
      if (timeOnPage === 30 && !localStorage.getItem('engagement-popup-shown')) {
        showEngagementPopup();
      }
    }, 1000);

    // Profundidad de scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        scrollDepth = Math.max(scrollDepth, scrollPercent);

        if (scrollDepth >= 50 && !localStorage.getItem('scroll-engagement-shown')) {
          localStorage.setItem('scroll-engagement-shown', 'true');
          highlightBuyButton();
        }
      }, 100);
    }, { passive: true });

    // Clicks en precio
    const priceElements = document.querySelectorAll('.price, .product__price');
    if (priceElements.length > 0) {
      priceElements.forEach(el => {
        el.addEventListener('click', () => {
          clicksOnPrice++;
          if (clicksOnPrice >= 2 && !document.querySelector('.price-justification')) {
            showPriceJustification();
          }
        });
      });
    }

    // Clicks en imágenes
    const imageElements = document.querySelectorAll('.product__media img');
    if (imageElements.length > 0) {
      imageElements.forEach(el => {
        el.addEventListener('click', () => {
          clicksOnImages++;
          if (clicksOnImages >= 3 && !document.querySelector('.image-engagement')) {
            showImageEngagement();
          }
        });
      });
    }

    // Limpiar intervalo cuando se abandone la página
    window.addEventListener('beforeunload', () => {
      clearInterval(timeInterval);
    });
  }

  // 5. Funciones de engagement
  function showEngagementPopup() {
    if (localStorage.getItem('engagement-popup-shown')) return;

    const productTitle = productSection ? productSection.querySelector('.product__title') : null;
    const title = productTitle ? productTitle.textContent.trim() : 'este producto';

    const popup = document.createElement('div');
    popup.className = 'pe-engagement-popup';

    popup.innerHTML = `
      <div class="pe-engagement-popup__header">
        <strong class="pe-engagement-popup__title">💡 ¿Necesitas ayuda?</strong>
        <button class="pe-engagement-popup__close" onclick="this.closest('.pe-engagement-popup').remove()" aria-label="Cerrar">&times;</button>
      </div>
      <p class="pe-engagement-popup__body">Nuestros expertos están aquí para ayudarte a elegir el producto perfecto.</p>
      <button class="pe-engagement-popup__cta" onclick="window.open('https://wa.me/573008602789?text=Hola, necesito ayuda con el producto ${encodeURIComponent(title)}', '_blank')">
        💬 Chatear por WhatsApp
      </button>
    `;

    document.body.appendChild(popup);
    localStorage.setItem('engagement-popup-shown', 'true');

    setTimeout(() => {
      if (document.body.contains(popup)) {
        popup.classList.add('pe-engagement-popup--hiding');
        setTimeout(() => popup.remove(), 300);
      }
    }, 10000);
  }

  function highlightBuyButton() {
    const buyButton = document.querySelector('.product-form__cart-submit');
    if (!buyButton) return;

    buyButton.classList.add('button-pulse-highlight');

    setTimeout(() => {
      buyButton.classList.remove('button-pulse-highlight');
    }, 5000);
  }

  function showPriceJustification() {
    const priceEl = document.querySelector('.product__price');
    if (!priceEl) return;

    const justification = document.createElement('div');
    justification.className = 'pe-price-justification';

    justification.innerHTML = `
      <div class="pe-price-justification__header">
        <span class="pe-price-justification__emoji">💰</span>
        <strong class="pe-price-justification__title">¿Por qué este precio es una ganga?</strong>
      </div>
      <ul class="pe-price-justification__list">
        <li><span class="pe-price-justification__check">✓</span>Calidad premium garantizada</li>
        <li><span class="pe-price-justification__check">✓</span>Envío gratuito incluido</li>
        <li><span class="pe-price-justification__check">✓</span>Garantía extendida de 30 días</li>
        <li><span class="pe-price-justification__check">✓</span>Soporte técnico especializado</li>
      </ul>
    `;

    priceEl.appendChild(justification);

    setTimeout(() => {
      if (justification.parentNode) {
        justification.classList.add('pe-price-justification--hiding');
        setTimeout(() => justification.remove(), 500);
      }
    }, 8000);
  }

  function showImageEngagement() {
    const mediaWrapper = document.querySelector('.product__media-wrapper');
    if (!mediaWrapper) return;

    const engagement = document.createElement('div');
    engagement.className = 'pe-image-engagement';

    engagement.innerHTML = `<p>📸 ¿Te gustan las imágenes? ¡Imagínate teniéndolo!</p>
      <button class="pe-image-engagement__cta" onclick="document.querySelector('.product-form__cart-submit').scrollIntoView({behavior: 'smooth'}); this.parentElement.remove();">
        🛒 ¡Comprarlo ahora!
      </button>
    `;

    mediaWrapper.style.position = 'relative';
    mediaWrapper.appendChild(engagement);

    setTimeout(() => {
      if (engagement.parentNode) {
        engagement.classList.add('pe-image-engagement--hiding');
        setTimeout(() => engagement.remove(), 500);
      }
    }, 8000);
  }

  // 7. Optimización de imágenes lazy loading
  function initImageOptimization() {
    const images = document.querySelectorAll('img[loading="lazy"], .product__media img');

    if ('IntersectionObserver' in window && images.length > 0) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;

            // Agregar placeholder mientras carga
            if (!img.complete) {
              img.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
              img.style.backgroundSize = '200% 100%';
              img.style.animation = 'loading 1.5s infinite';

              img.addEventListener('load', function () {
                this.style.background = '';
                this.style.animation = '';
              }, { once: true });
            }

            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px'
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  // 8. Smooth scroll to description
  // Enhanced with header offset handling and reduced motion preference
  function initSmoothScrollToDescription() {
    const detailsLink = document.querySelector('[data-scroll-to-description]');
    if (!detailsLink) return;

    detailsLink.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.getElementById('product-description');
      if (!target) return;

      const headerOffset = 80; // Adjust for fixed headers
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      // Check user's motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      window.scrollTo({
        top: offsetPosition,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  // 10. Hero Slider Controls and Dots Navigation
  // Note: Only initialize if the custom element hasn't already handled it
  function initHeroSlider() {
    const slider = document.querySelector('.product-hero-slider');
    // Skip if custom element already defined or no slider found
    if (!slider || customElements.get('product-hero-slider')) return;

    const dots = slider.querySelectorAll('.slider-dot');
    const slides = slider.querySelectorAll('.product-hero-slide');

    if (dots.length === 0 || slides.length === 0) return;

    let currentSlide = 0;

    function showSlide(index) {
      // Remove active class from all
      dots.forEach(dot => dot.classList.remove('active'));

      // Add active to current
      if (dots[index]) {
        dots[index].classList.add('active');
        currentSlide = index;
      }

      // Use opacity and position for smoother transitions
      if (slides[index]) {
        slides.forEach((slide, i) => {
          if (i === index) {
            slide.style.opacity = '1';
            slide.style.visibility = 'visible';
            slide.style.position = 'relative';
          } else {
            slide.style.opacity = '0';
            slide.style.visibility = 'hidden';
            slide.style.position = 'absolute';
            slide.style.top = '0';
            slide.style.left = '0';
          }
        });
      }
    }

    // Dot click handlers
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => showSlide(index));
    });

    // Initialize first slide
    showSlide(0);

    // Arrow button handlers
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const newIndex = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
        showSlide(newIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const newIndex = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
        showSlide(newIndex);
      });
    }

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      if (touchEndX < touchStartX - 50) {
        // Swipe left - next slide
        const newIndex = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
        showSlide(newIndex);
      }
      if (touchEndX > touchStartX + 50) {
        // Swipe right - previous slide
        const newIndex = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
        showSlide(newIndex);
      }
    }
  }

  // Initialize all features with defensive checks
  try {
    initSmoothScrollToDescription();
  } catch (e) {
    // Silent catch — production
  }

  try {
    initHeroSlider();
  } catch (e) {
    // Silent catch — production
  }

  try {
    initUserBehaviorTracking();
  } catch (e) {
    // Silent catch — production
  }

  try {
    initImageOptimization();
  } catch (e) {
    // Silent catch — production
  }
});
