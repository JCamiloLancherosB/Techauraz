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

  // 2. Agregar indicador de entrega y pago (info honesta, sin countdown falso)
  function addUrgencyIndicator() {
    // Scope query to current product section
    const trustElement = productSection ? productSection.querySelector('.trust-indicators') : null;
    const existingUrgency = productSection ? productSection.querySelector('.urgency-indicator') : null;
    if (!trustElement || existingUrgency) return;
    
    const urgencyDiv = document.createElement('div');
    urgencyDiv.className = 'urgency-indicator';
    // Mensaje honesto de entrega y pago contra entrega
    urgencyDiv.innerHTML = '🚚 Envío 2–5 días hábiles | 💳 Pago contra entrega disponible';
    
    trustElement.parentNode.insertBefore(urgencyDiv, trustElement.nextSibling);
  }

  // 3. Contador de urgencia dinámico - DESHABILITADO
  // NOTA: Esta función ha sido deshabilitada porque mostraba un countdown
  // falso que dañaba la confianza del cliente.
  // Para información de entrega real, use el snippet pdp-delivery-estimate.liquid
  function initUrgencyTimer() {
    // Función deshabilitada intencionalmente.
    // Los countdowns falsos de "oferta termina" han sido eliminados.
    return;
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
  // DESHABILITADO: Esta función mostraba mensajes ficticios/aleatorios
  // que dañan la confianza del cliente.
  // 
  // Para mostrar social proof real, use la sección "Social Proof Real"
  // (product-views-counter.liquid) que muestra:
  // - Stock bajo basado en inventario real de Shopify
  // - Contador de reseñas basado en reseñas reales de Shopify
  function initSocialProof() {
    // Función deshabilitada intencionalmente.
    // Los mensajes ficticios de compras recientes han sido eliminados
    // para mejorar la percepción de confianza del cliente.
    //
    // Si necesita social proof real, considere:
    // 1. Integrar con la API de pedidos de Shopify
    // 2. Usar un servicio de analytics verificado
    // 3. Mostrar reseñas reales de clientes
    return;
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

  // 9. Countdown Timer - DESHABILITADO
  // NOTA: Esta función ha sido deshabilitada porque mostraba un countdown
  // falso de 6 horas que se reinicia perpetuamente, lo cual daña la confianza.
  // Para información de entrega real, use el snippet pdp-delivery-estimate.liquid
  // que muestra un cut-off honesto basado en la hora real.
  function initCountdownTimer() {
    // Función deshabilitada intencionalmente.
    // Los countdowns falsos han sido eliminados.
    // Si necesita un countdown real, use la sección countdown-timer.liquid
    // con una fecha de fin real configurada por el administrador.
    return;
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
