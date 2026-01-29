/**
 * Sticky Add-to-Cart Bar JavaScript
 * 
 * Features:
 * - Intersection Observer to detect main add-to-cart button visibility
 * - Syncs quantity selector with main page selector
 * - Handles variant changes (updates price, availability)
 * - Smooth scroll to top when thumbnail is clicked
 * - Respects user's reduced-motion preferences
 * - Includes haptic feedback on successful add-to-cart (if supported)
 * 
 * Mobile-only activation (< 768px viewport)
 */

class StickyAddToCartBar {
  constructor(element) {
    this.element = element;
    this.isVisible = false;
    this.quantity = 1;
    this.currentVariantId = element.dataset.variantId;
    
    // DOM Elements
    this.thumbnail = element.querySelector('[data-sticky-thumbnail]');
    this.priceContainer = element.querySelector('[data-sticky-price]');
    this.addButton = element.querySelector('[data-sticky-add-btn]');
    this.qtyValue = element.querySelector('[data-qty-value]');
    this.qtyDecrease = element.querySelector('[data-qty-decrease]');
    this.qtyIncrease = element.querySelector('[data-qty-increase]');
    
    // External elements
    this.mainAddToCartButton = null;
    this.mainQuantityInput = null;
    this.productForm = null;
    
    // Intersection Observer
    this.observer = null;
    
    // Reduced motion preference
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Bind methods
    this.handleIntersection = this.handleIntersection.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleThumbnailClick = this.handleThumbnailClick.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.handleQtyDecrease = this.handleQtyDecrease.bind(this);
    this.handleQtyIncrease = this.handleQtyIncrease.bind(this);
    this.handleVariantChange = this.handleVariantChange.bind(this);
    this.handleMainQuantityChange = this.handleMainQuantityChange.bind(this);
    
    // Debounce timeout
    this.resizeTimeout = null;
    
    this.init();
  }
  
  init() {
    // Only activate on mobile
    if (!this.isMobile()) {
      this.element.style.display = 'none';
      window.addEventListener('resize', this.handleResize);
      return;
    }
    
    // Show element (but keep it hidden below viewport via CSS)
    this.element.style.display = 'block';
    
    // Find main product form elements
    this.findMainElements();
    
    // Setup Intersection Observer
    this.setupIntersectionObserver();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Sync initial quantity
    this.syncQuantityFromMain();
    
    // Listen for resize
    window.addEventListener('resize', this.handleResize);
  }
  
  isMobile() {
    return window.innerWidth < 768;
  }
  
  findMainElements() {
    // Find main add-to-cart button with multiple fallback selectors
    const buttonSelectors = [
      '.product-form__submit[id^="ProductSubmitButton-"]',
      '[id^="ProductSubmitButton-"]',
      '.product-form__submit',
      'product-form button[type="submit"]',
      '[name="add"]'
    ];
    
    for (const selector of buttonSelectors) {
      this.mainAddToCartButton = document.querySelector(selector);
      if (this.mainAddToCartButton) break;
    }
    
    // Find main quantity input
    const qtySelectors = [
      '.product-form__input[name="quantity"]',
      'quantity-input input',
      'input[name="quantity"]'
    ];
    
    for (const selector of qtySelectors) {
      this.mainQuantityInput = document.querySelector(selector);
      if (this.mainQuantityInput) break;
    }
    
    // Find product form
    this.productForm = document.querySelector('product-form, .product-form, form[action*="/cart/add"]');
  }
  
  setupIntersectionObserver() {
    if (!this.mainAddToCartButton) {
      console.warn('StickyAddToCartBar: Main add-to-cart button not found');
      return;
    }
    
    const options = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0 // Trigger when any part is visible/hidden
    };
    
    this.observer = new IntersectionObserver(this.handleIntersection, options);
    this.observer.observe(this.mainAddToCartButton);
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      const mainButtonVisible = entry.isIntersecting;
      
      // Show sticky bar when main button is NOT visible
      if (!mainButtonVisible && !this.isVisible) {
        this.show();
      } else if (mainButtonVisible && this.isVisible) {
        this.hide();
      }
    });
  }
  
  show() {
    if (!this.isMobile()) return;
    
    this.isVisible = true;
    this.element.classList.add('sticky-add-to-cart--visible');
    this.element.setAttribute('aria-hidden', 'false');
    document.body.classList.add('sticky-add-to-cart-active');
    
    // Sync quantity when showing
    this.syncQuantityFromMain();
  }
  
  hide() {
    this.isVisible = false;
    this.element.classList.remove('sticky-add-to-cart--visible');
    this.element.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('sticky-add-to-cart-active');
  }
  
  setupEventListeners() {
    // Thumbnail click - scroll to top
    if (this.thumbnail) {
      this.thumbnail.addEventListener('click', this.handleThumbnailClick);
    }
    
    // Add to cart button
    if (this.addButton) {
      this.addButton.addEventListener('click', this.handleAddToCart);
    }
    
    // Quantity controls
    if (this.qtyDecrease) {
      this.qtyDecrease.addEventListener('click', this.handleQtyDecrease);
    }
    if (this.qtyIncrease) {
      this.qtyIncrease.addEventListener('click', this.handleQtyIncrease);
    }
    
    // Listen for variant changes (custom event from product form)
    document.addEventListener('variant:change', this.handleVariantChange);
    
    // Also listen for Shopify's built-in variant change event
    document.addEventListener('shopify:product:variant-change', this.handleVariantChange);
    
    // Listen for main quantity input changes
    if (this.mainQuantityInput) {
      this.mainQuantityInput.addEventListener('change', this.handleMainQuantityChange);
      this.mainQuantityInput.addEventListener('input', this.handleMainQuantityChange);
    }
  }
  
  handleThumbnailClick(e) {
    e.preventDefault();
    
    // Smooth scroll to top of product section
    const productSection = document.querySelector('#MainProduct, .product, section[data-section]');
    
    if (productSection) {
      const scrollBehavior = this.prefersReducedMotion ? 'auto' : 'smooth';
      productSection.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: this.prefersReducedMotion ? 'auto' : 'smooth' });
    }
  }
  
  handleAddToCart(e) {
    e.preventDefault();
    
    if (this.addButton.disabled) return;
    
    // Show loading state
    this.addButton.classList.add('sticky-add-to-cart__button--loading');
    
    // Sync quantity to main form before submitting
    if (this.mainQuantityInput) {
      this.mainQuantityInput.value = this.quantity;
      
      // Dispatch change event to notify main form
      this.mainQuantityInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    // Click the main add to cart button
    if (this.mainAddToCartButton) {
      // Small delay to ensure quantity is synced
      setTimeout(() => {
        this.mainAddToCartButton.click();
        
        // Show success state briefly
        setTimeout(() => {
          this.addButton.classList.remove('sticky-add-to-cart__button--loading');
          this.addButton.classList.add('sticky-add-to-cart__button--success');
          
          // Haptic feedback (if supported)
          this.triggerHapticFeedback();
          
          // Remove success state after animation
          setTimeout(() => {
            this.addButton.classList.remove('sticky-add-to-cart__button--success');
          }, 1500);
        }, 500);
      }, 50);
    } else {
      // Fallback: submit via AJAX if no main button found
      this.submitViaAjax();
    }
  }
  
  submitViaAjax() {
    const formData = {
      id: this.currentVariantId,
      quantity: this.quantity
    };
    
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Add to cart failed');
      }
      return response.json();
    })
    .then(() => {
      this.addButton.classList.remove('sticky-add-to-cart__button--loading');
      this.addButton.classList.add('sticky-add-to-cart__button--success');
      this.triggerHapticFeedback();
      
      // Dispatch cart update event
      document.dispatchEvent(new CustomEvent('cart:updated'));
      
      // Update cart drawer or counter if exists
      this.updateCartUI();
      
      setTimeout(() => {
        this.addButton.classList.remove('sticky-add-to-cart__button--success');
      }, 1500);
    })
    .catch(error => {
      console.error('Add to cart error:', error);
      this.addButton.classList.remove('sticky-add-to-cart__button--loading');
      // Could show error state here
    });
  }
  
  updateCartUI() {
    // Try to update cart count bubble
    const cartCountBubble = document.querySelector('.cart-count-bubble, [data-cart-count]');
    if (cartCountBubble) {
      fetch('/cart.js')
        .then(res => res.json())
        .then(cart => {
          const count = cart.item_count;
          cartCountBubble.textContent = count;
          cartCountBubble.style.display = count > 0 ? 'flex' : 'none';
        });
    }
  }
  
  triggerHapticFeedback() {
    // Use Vibration API if available (mostly Android)
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }
  
  handleQtyDecrease() {
    if (this.quantity > 1) {
      this.quantity--;
      this.updateQuantityDisplay();
      this.syncQuantityToMain();
    }
  }
  
  handleQtyIncrease() {
    this.quantity++;
    this.updateQuantityDisplay();
    this.syncQuantityToMain();
  }
  
  updateQuantityDisplay() {
    if (this.qtyValue) {
      this.qtyValue.textContent = this.quantity;
    }
    
    // Update decrease button state
    if (this.qtyDecrease) {
      this.qtyDecrease.disabled = this.quantity <= 1;
    }
  }
  
  syncQuantityFromMain() {
    if (this.mainQuantityInput) {
      const mainQty = parseInt(this.mainQuantityInput.value, 10);
      if (!isNaN(mainQty) && mainQty > 0) {
        this.quantity = mainQty;
        this.updateQuantityDisplay();
      }
    }
  }
  
  syncQuantityToMain() {
    if (this.mainQuantityInput) {
      this.mainQuantityInput.value = this.quantity;
      this.mainQuantityInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
  
  handleMainQuantityChange() {
    this.syncQuantityFromMain();
  }
  
  handleVariantChange(event) {
    const variant = event.detail?.variant;
    if (!variant) return;
    
    // Update current variant ID
    this.currentVariantId = variant.id;
    this.element.dataset.variantId = variant.id;
    
    // Update price display
    this.updatePriceDisplay(variant.price, variant.compare_at_price);
    
    // Update button state
    this.updateButtonState(variant.available);
    
    // Update thumbnail if variant has a specific image
    if (variant.featured_image) {
      this.updateThumbnail(variant.featured_image);
    }
  }
  
  updatePriceDisplay(price, compareAtPrice) {
    if (!this.priceContainer) return;
    
    this.priceContainer.innerHTML = '';
    
    if (compareAtPrice && compareAtPrice > price) {
      const salePriceSpan = document.createElement('span');
      salePriceSpan.className = 'sticky-add-to-cart__price-sale';
      salePriceSpan.textContent = this.formatMoney(price);
      
      const comparePriceSpan = document.createElement('span');
      comparePriceSpan.className = 'sticky-add-to-cart__price-compare';
      comparePriceSpan.textContent = this.formatMoney(compareAtPrice);
      
      this.priceContainer.appendChild(salePriceSpan);
      this.priceContainer.appendChild(comparePriceSpan);
    } else {
      const regularPriceSpan = document.createElement('span');
      regularPriceSpan.className = 'sticky-add-to-cart__price-regular';
      regularPriceSpan.textContent = this.formatMoney(price);
      
      this.priceContainer.appendChild(regularPriceSpan);
    }
  }
  
  updateButtonState(isAvailable) {
    if (!this.addButton) return;
    
    const textSpan = this.addButton.querySelector('.sticky-add-to-cart__btn-text');
    
    if (isAvailable) {
      this.addButton.disabled = false;
      this.addButton.removeAttribute('aria-disabled');
      if (textSpan) textSpan.textContent = 'Agregar';
      this.addButton.setAttribute('aria-label', 'Agregar al carrito');
    } else {
      this.addButton.disabled = true;
      this.addButton.setAttribute('aria-disabled', 'true');
      if (textSpan) textSpan.textContent = 'Agotado';
      this.addButton.setAttribute('aria-label', 'Producto agotado');
    }
  }
  
  updateThumbnail(featuredImage) {
    if (!this.thumbnail || !featuredImage) return;
    
    const img = this.thumbnail.querySelector('img');
    if (img && featuredImage.src) {
      // Create URL with appropriate size
      const newSrc = featuredImage.src.replace(/\.(jpg|jpeg|png|gif|webp)/i, '_120x120.$1');
      img.src = newSrc;
      img.alt = featuredImage.alt || '';
    }
  }
  
  formatMoney(priceValue) {
    if (typeof priceValue === 'number') {
      // Try Shopify.formatMoney if available
      try {
        if (typeof Shopify !== 'undefined' && typeof Shopify.formatMoney === 'function') {
          return Shopify.formatMoney(priceValue);
        }
      } catch (e) {
        console.warn('Shopify.formatMoney failed, using fallback', e);
      }
      
      // Fallback formatting
      const currency = (typeof Shopify !== 'undefined' && Shopify.currency && Shopify.currency.active)
        ? Shopify.currency.active
        : 'COP';
      const locale = 'es-CO';
      
      try {
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(priceValue / 100);
      } catch (e) {
        return '$' + Math.round(priceValue / 100).toLocaleString();
      }
    }
    
    return priceValue;
  }
  
  handleResize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    this.resizeTimeout = setTimeout(() => {
      if (this.isMobile()) {
        // Show element and re-setup if needed
        if (this.element.style.display === 'none') {
          this.element.style.display = 'block';
          this.findMainElements();
          this.setupIntersectionObserver();
        }
      } else {
        // Hide on desktop
        this.hide();
        this.element.style.display = 'none';
      }
    }, 150);
  }
  
  destroy() {
    // Clear timeout
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    // Disconnect observer
    if (this.observer) {
      this.observer.disconnect();
    }
    
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('variant:change', this.handleVariantChange);
    document.removeEventListener('shopify:product:variant-change', this.handleVariantChange);
    
    if (this.thumbnail) {
      this.thumbnail.removeEventListener('click', this.handleThumbnailClick);
    }
    if (this.addButton) {
      this.addButton.removeEventListener('click', this.handleAddToCart);
    }
    if (this.qtyDecrease) {
      this.qtyDecrease.removeEventListener('click', this.handleQtyDecrease);
    }
    if (this.qtyIncrease) {
      this.qtyIncrease.removeEventListener('click', this.handleQtyIncrease);
    }
    if (this.mainQuantityInput) {
      this.mainQuantityInput.removeEventListener('change', this.handleMainQuantityChange);
      this.mainQuantityInput.removeEventListener('input', this.handleMainQuantityChange);
    }
    
    // Remove body class
    document.body.classList.remove('sticky-add-to-cart-active');
    
    // Remove instance reference
    if (this.element._stickyAddToCartInstance === this) {
      delete this.element._stickyAddToCartInstance;
    }
  }
}

/**
 * Initialize StickyAddToCartBar
 * @param {HTMLElement} element - The sticky bar element
 * @returns {StickyAddToCartBar|null} The instance or null
 */
function initStickyAddToCartBar(element) {
  if (!element) return null;
  
  // Destroy existing instance if present
  if (element._stickyAddToCartInstance) {
    element._stickyAddToCartInstance.destroy();
  }
  
  // Create new instance and store reference
  const instance = new StickyAddToCartBar(element);
  element._stickyAddToCartInstance = instance;
  return instance;
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const stickyBar = document.querySelector('[data-sticky-add-to-cart]');
  if (stickyBar) {
    initStickyAddToCartBar(stickyBar);
  }
});

// Re-initialize on Shopify section load (theme editor)
document.addEventListener('shopify:section:load', (event) => {
  const stickyBar = event.target.querySelector('[data-sticky-add-to-cart]');
  if (stickyBar) {
    initStickyAddToCartBar(stickyBar);
  }
});

// Clean up on Shopify section unload (theme editor)
document.addEventListener('shopify:section:unload', (event) => {
  const stickyBar = event.target.querySelector('[data-sticky-add-to-cart]');
  if (stickyBar && stickyBar._stickyAddToCartInstance) {
    stickyBar._stickyAddToCartInstance.destroy();
  }
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StickyAddToCartBar, initStickyAddToCartBar };
}
