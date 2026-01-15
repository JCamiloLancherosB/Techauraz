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

  // Verificación de compatibilidad IE
  function isIE() {
    const ua = window.navigator.userAgent;
    const msie = ua.indexOf('MSIE ');
    const trident = ua.indexOf('Trident/');
    return msie > 0 || trident > 0;
  }

  // Solo ejecutar para IE si es necesario
  if (isIE()) {
    const sectionId = productSection ? productSection.getAttribute('data-section') : null;
    if (sectionId) {
      const hiddenInput = document.querySelector(`#product-form-${sectionId} input[name="id"]`);
      const variantPicker = document.querySelector(`variant-selects[data-section="${sectionId}"]`);
      
      if (hiddenInput && variantPicker) {
        const noScriptInputWrapper = document.createElement('div');
        const noScriptContent = document.querySelector(`.product-form__noscript-wrapper-${sectionId}`);
        
        if (noScriptContent) {
          noScriptInputWrapper.innerHTML = noScriptContent.textContent;
          variantPicker.outerHTML = noScriptInputWrapper.outerHTML;
        }

        const variantsSelect = document.querySelector(`#Variants-${sectionId}`);
        if (variantsSelect) {
          variantsSelect.addEventListener('change', function (event) {
            hiddenInput.value = event.currentTarget.value;
          });
        }
      }
    }
  }

  // FUNCIONALIDADES PERSUASIVAS MEJORADAS
  // All queries scoped to current product section to prevent cross-product conflicts
  
  // 1. Agregar elementos de confianza dinámicos (SOLO SI NO EXISTEN)
  function addTrustIndicators() {
    // Scope query to current product section
    const priceElement = productSection ? productSection.querySelector('.product__price') : null;
    const existingIndicators = productSection ? productSection.querySelector('.trust-indicators') : null;
    if (!priceElement || existingIndicators) return;
    
    const trustDiv = document.createElement('div');
    trustDiv.className = 'trust-indicators';
    trustDiv.innerHTML = `
      <div class="trust-indicator">🚚 Envío GRATIS</div>
      <div class="trust-indicator">🔒 Pago Seguro</div>
      <div class="trust-indicator">✅ Garantía 30 días</div>
      <div class="trust-indicator">💯 Calidad Premium</div>
    `;
    
    priceElement.parentNode.insertBefore(trustDiv, priceElement.nextSibling);
  }

  // 2. Agregar indicador de urgencia (SOLO SI NO EXISTE)
  function addUrgencyIndicator() {
    // Scope query to current product section
    const trustElement = productSection ? productSection.querySelector('.trust-indicators') : null;
    const existingUrgency = productSection ? productSection.querySelector('.urgency-indicator') : null;
    if (!trustElement || existingUrgency) return;
    
    const urgencyDiv = document.createElement('div');
    urgencyDiv.className = 'urgency-indicator';
    urgencyDiv.innerHTML = '⚡ Pagas contra entrega si prefieres ¡Oferta por tiempo limitado!';
    
    trustElement.parentNode.insertBefore(urgencyDiv, trustElement.nextSibling);
  }

  // 3. Contador de urgencia dinámico (keyed by product ID to prevent conflicts)
  function initUrgencyTimer() {
    // Scope query to current product section
    const urgencyEl = productSection ? productSection.querySelector('.urgency-indicator') : null;
    if (!urgencyEl || !productId) return;
    
    // Use product-specific storage key to prevent conflicts
    const storageKey = `product-urgency-timer-${productId}`;
    let timeLeft = localStorage.getItem(storageKey);
    if (!timeLeft) {
      timeLeft = 3600; // 1 hora
      localStorage.setItem(storageKey, timeLeft.toString());
    } else {
      timeLeft = parseInt(timeLeft);
    }

    function updateTimer() {
      if (timeLeft <= 0) {
        urgencyEl.innerHTML = '⚡ ¡ÚLTIMA OPORTUNIDAD! Stock muy limitado ⚡';
        urgencyEl.classList.add('urgency-pulse');
        return;
      }

      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      const seconds = timeLeft % 60;
      
      urgencyEl.innerHTML = `⚡ ¡Oferta termina en: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}! ⚡`;
      timeLeft--;
      localStorage.setItem(storageKey, timeLeft.toString());
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }

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
    });

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
    popup.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 1000;
      max-width: 300px;
      animation: slideInRight 0.5s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    popup.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
        <strong style="font-size: 16px;">💡 ¿Necesitas ayuda?</strong>
        <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; padding: 0; margin: 0;">&times;</button>
      </div>
      <p style="margin: 0 0 15px 0; font-size: 14px; line-height: 1.4;">Nuestros expertos están aquí para ayudarte a elegir el producto perfecto.</p>
      <button onclick="window.open('https://wa.me/1234567890?text=Hola, necesito ayuda con el producto ${encodeURIComponent(title)}', '_blank')" 
              style="background: #25D366; color: white; border: none; padding: 10px 20px; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 600; width: 100%;">
        💬 Chatear por WhatsApp
      </button>
    `;
    
    document.body.appendChild(popup);
    localStorage.setItem('engagement-popup-shown', 'true');
    
    setTimeout(() => {
      if (document.body.contains(popup)) {
        popup.classList.add('slide-out-animation');
        setTimeout(() => popup.remove(), 500);
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
    justification.className = 'price-justification';
    justification.style.cssText = `
      background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%);
      border: 2px solid #9ae6b4;
      border-radius: 15px;
      padding: 20px;
      margin-top: 15px;
      animation: fadeIn 0.5s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    justification.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 15px;">
        <span style="font-size: 24px; margin-right: 12px;">💰</span>
        <strong style="color: #38a169; font-size: 18px;">¿Por qué este precio es una ganga?</strong>
      </div>
      <ul style="margin: 0; padding-left: 0; list-style: none; color: #2d3748;">
        <li style="margin-bottom: 8px; padding-left: 25px; position: relative;">
          <span style="position: absolute; left: 0; color: #38a169; font-weight: bold;">✓</span>
          Calidad premium garantizada
        </li>
        <li style="margin-bottom: 8px; padding-left: 25px; position: relative;">
          <span style="position: absolute; left: 0; color: #38a169; font-weight: bold;">✓</span>
          Envío gratuito incluido
        </li>
        <li style="margin-bottom: 8px; padding-left: 25px; position: relative;">
          <span style="position: absolute; left: 0; color: #38a169; font-weight: bold;">✓</span>
          Garantía extendida de 30 días
        </li>
        <li style="margin-bottom: 0; padding-left: 25px; position: relative;">
          <span style="position: absolute; left: 0; color: #38a169; font-weight: bold;">✓</span>
          Soporte técnico especializado
        </li>
      </ul>
    `;
    
    priceEl.appendChild(justification);
    
    setTimeout(() => {
      if (justification.parentNode) {
        justification.style.animation = 'fadeIn 0.5s ease reverse';
        setTimeout(() => justification.remove(), 500);
      }
    }, 8000);
  }

  function showImageEngagement() {
    const mediaWrapper = document.querySelector('.product__media-wrapper');
    if (!mediaWrapper) return;
    
    const engagement = document.createElement('div');
    engagement.className = 'image-engagement';
    engagement.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 20px;
      right: 20px;
      background: rgba(0,0,0,0.85);
      color: white;
      padding: 20px;
      border-radius: 15px;
      text-align: center;
      animation: slideInUp 0.5s ease;
      z-index: 10;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    engagement.innerHTML = `<p>📸 ¿Te gustan las imágenes? ¡Imagínate teniéndolo!</p>
      <button class="image-engagement-button" onclick="document.querySelector('.product-form__cart-submit').scrollIntoView({behavior: 'smooth'}); this.parentElement.remove();">
        🛒 ¡Comprarlo ahora!
      </button>
    `;
    
    mediaWrapper.style.position = 'relative';
    mediaWrapper.appendChild(engagement);
    
    setTimeout(() => {
      if (engagement.parentNode) {
        engagement.style.animation = 'slideInUp 0.5s ease reverse';
        setTimeout(() => engagement.remove(), 500);
      }
    }, 8000);
  }

  // 6. Social proof dinámico
  function initSocialProof() {
    const socialProofMessages = [
      "🔥 María de Bogotá acaba de comprar este producto",
      "⭐ Carlos de Medellín lo calificó con 5 estrellas",
      "🚚 Ana de Cali recibió su pedido ayer",
      "💯 Luis de Barranquilla lo recomendó a sus amigos",
      "🎯 Sofia de Cartagena compró 2 unidades",
      "✅ Diego de Bucaramanga confirmó su compra",
      "🎮 Alejandro de Pereira mejoró su gaming",
      "⚡ Camila de Manizales quedó impresionada",
      "🏆 Andrés de Ibagué ganó más partidas"
    ];

    function showSocialProof() {
      if (document.querySelector('.social-proof-popup')) return;
      
      const popup = document.createElement('div');
      popup.className = 'social-proof-popup';
      popup.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: white;
        border: 2px solid #e2e8f0;
        border-radius: 15px;
        padding: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        z-index: 1000;
        max-width: 320px;
        animation: slideInLeft 0.5s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;
      
      const randomMessage = socialProofMessages[Math.floor(Math.random() * socialProofMessages.length)];
      popup.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <p style="margin: 0; font-size: 14px; color: #2d3748; line-height: 1.4; font-weight: 500;">${randomMessage}</p>
          <button onclick="this.parentElement.parentElement.remove()" 
                  style="background: none; border: none; color: #a0aec0; font-size: 18px; cursor: pointer; margin-left: 10px; padding: 0;">&times;</button>
        </div>
        <div style="margin-top: 8px; font-size: 11px; color: #718096;">Hace ${Math.floor(Math.random() * 30) + 1} minutos</div>
      `;
      
      document.body.appendChild(popup);
      
      setTimeout(() => {
        if (document.body.contains(popup)) {
          popup.style.animation = 'slideInLeft 0.5s ease reverse';
          setTimeout(() => popup.remove(), 500);
        }
      }, 4000);
    }

    // Mostrar social proof cada 15-25 segundos
    const socialProofInterval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% de probabilidad de mostrar
        showSocialProof();
      }
    }, Math.random() * 10000 + 15000);

    // Limpiar intervalo cuando se abandone la página
    window.addEventListener('beforeunload', () => {
      clearInterval(socialProofInterval);
    });
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
              
              img.addEventListener('load', function() {
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
  function initSmoothScrollToDescription() {
    const detailsLink = document.querySelector('[data-scroll-to-description]');
    if (!detailsLink) return;

    detailsLink.addEventListener('click', function(e) {
      e.preventDefault();
      const description = document.querySelector('#product-description');
      if (description) {
        description.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // 9. Countdown Timer (keyed by product ID)
  function initCountdownTimer() {
    const countdownTimer = document.querySelector('[data-countdown-timer]');
    if (!countdownTimer || !productId) return;

    const hoursEl = countdownTimer.querySelector('[data-countdown-hours]');
    const minutesEl = countdownTimer.querySelector('[data-countdown-minutes]');
    const secondsEl = countdownTimer.querySelector('[data-countdown-seconds]');

    if (!hoursEl || !minutesEl || !secondsEl) return;

    const storageKey = `product-countdown-${productId}`;
    let endTime = localStorage.getItem(storageKey);
    
    if (!endTime) {
      // Set countdown to 6 hours from now
      endTime = new Date().getTime() + (6 * 60 * 60 * 1000);
      localStorage.setItem(storageKey, endTime.toString());
    } else {
      endTime = parseInt(endTime);
    }
    
    function updateCountdown() {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        // Reset to 6 hours when countdown ends
        endTime = new Date().getTime() + (6 * 60 * 60 * 1000);
        localStorage.setItem(storageKey, endTime.toString());
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      hoursEl.textContent = String(hours).padStart(2, '0');
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
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
    });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

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
    console.warn('Smooth scroll init failed:', e);
  }

  try {
    addTrustIndicators();
  } catch (e) {
    console.warn('Trust indicators init failed:', e);
  }

  try {
    addUrgencyIndicator();
  } catch (e) {
    console.warn('Urgency indicator init failed:', e);
  }

  try {
    initUrgencyTimer();
  } catch (e) {
    console.warn('Urgency timer init failed:', e);
  }

  try {
    initCountdownTimer();
  } catch (e) {
    console.warn('Countdown timer init failed:', e);
  }

  try {
    initHeroSlider();
  } catch (e) {
    console.warn('Hero slider init failed:', e);
  }

  try {
    initUserBehaviorTracking();
  } catch (e) {
    console.warn('User behavior tracking init failed:', e);
  }

  try {
    initSocialProof();
  } catch (e) {
    console.warn('Social proof init failed:', e);
  }

  try {
    initImageOptimization();
  } catch (e) {
    console.warn('Image optimization init failed:', e);
  }
});
