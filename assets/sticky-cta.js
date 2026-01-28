/**
 * Sticky CTA Bar JavaScript
 * Extracted from sections/sticky-mobile-cta.liquid for better maintainability
 * 
 * Features:
 * - Shows when primary CTA scrolls out of viewport
 * - Coordinates with WhatsApp and cookie banner
 * - Handles Buy Now vs Add to Cart action intentionally
 * - Updates on variant changes
 * - Mobile-only activation (< 750px viewport)
 */

class StickyCTABar {
  constructor(element) {
    this.element = element;
    this.buyButton = element.querySelector('[data-sticky-buy]');
    this.priceContainer = element.querySelector('[data-sticky-price]');
    this.handleVariantChange = this.handleVariantChange.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    
    // Find primary CTA elements - multiple fallback selectors
    this.submitButton = this.findPrimaryButton();
    this.buyNowButton = this.findBuyNowButton();
    
    this.init();
  }
  
  findPrimaryButton() {
    const selectors = [
      '.product-form__submit[id^="ProductSubmitButton-"]',
      '[id^="ProductSubmitButton-"]',
      '.product-form__submit',
      '[name="add"]'
    ];
    
    for (const selector of selectors) {
      const button = document.querySelector(selector);
      if (button) return button;
    }
    return null;
  }
  
  findBuyNowButton() {
    return document.querySelector('.shopify-payment-button__button') ||
           document.querySelector('.tech-cta-primary .shopify-payment-button__button');
  }

  init() {
    // Only activate on mobile
    if (window.innerWidth >= 750) {
      this.element.style.display = 'none';
      return;
    }
    
    // Show/hide based on scroll position
    this.handleScroll();
    window.addEventListener('scroll', this.handleScroll, { passive: true });
    
    // Handle buy button click - triggers Buy Now by default
    if (this.buyButton) {
      this.buyButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleBuyClick();
      });
    }

    document.addEventListener('variant:change', this.handleVariantChange);
    
    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth >= 750) {
          this.hideStickyBar();
        } else {
          this.handleScroll();
        }
      }, 150);
    });
    
    window.addEventListener('pagehide', () => this.destroy());
  }
  
  handleBuyClick() {
    const action = this.buyButton.dataset.action || 'buy-now';
    let targetButton;
    
    if (action === 'buy-now') {
      // Try Buy Now (accelerated checkout) first
      targetButton = this.buyNowButton || this.submitButton;
    } else {
      // Add to Cart action
      targetButton = this.submitButton;
    }
    
    if (targetButton && typeof targetButton.click === 'function') {
      // Scroll to product form for user context
      const productForm = document.querySelector('product-form, .product-form');
      if (productForm) {
        productForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      // Small delay to allow scroll before triggering action
      setTimeout(() => {
        targetButton.click();
      }, 100);
    } else {
      console.error('Sticky CTA: No valid target button found');
    }
  }

  destroy() {
    document.removeEventListener('variant:change', this.handleVariantChange);
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleVariantChange(event) {
    if (!event.detail || !event.detail.variant) return;
    
    const variant = event.detail.variant;
    
    // Update price display
    if (this.priceContainer && variant.price !== undefined) {
      this.updatePriceDisplay(variant.price, variant.compare_at_price);
    }
    
    // Update button state
    if (this.buyButton) {
      this.updateButtonState(variant.available);
    }
  }
  
  updatePriceDisplay(price, compareAtPrice) {
    this.priceContainer.innerHTML = '';

    if (compareAtPrice && compareAtPrice > price) {
      const salePriceSpan = document.createElement('span');
      salePriceSpan.className = 'sticky-cta-bar__price-sale';
      salePriceSpan.textContent = this.formatMoney(price);

      const comparePriceSpan = document.createElement('span');
      comparePriceSpan.className = 'sticky-cta-bar__price-compare';
      comparePriceSpan.textContent = this.formatMoney(compareAtPrice);

      this.priceContainer.appendChild(salePriceSpan);
      this.priceContainer.appendChild(comparePriceSpan);
    } else {
      const regularPriceSpan = document.createElement('span');
      regularPriceSpan.className = 'sticky-cta-bar__price-regular';
      regularPriceSpan.textContent = this.formatMoney(price);

      this.priceContainer.appendChild(regularPriceSpan);
    }
  }
  
  updateButtonState(isAvailable) {
    const textSpan = this.buyButton.querySelector('.sticky-cta-bar__text');
    // Get button text from data attribute if available, otherwise use default
    const buyButtonText = this.element.dataset.buyButtonText || 'Comprar ahora';
    
    if (isAvailable) {
      this.buyButton.disabled = false;
      this.buyButton.removeAttribute('aria-disabled');
      if (textSpan) textSpan.textContent = buyButtonText;
      this.buyButton.setAttribute('aria-label', 'Comprar ahora');
    } else {
      this.buyButton.disabled = true;
      this.buyButton.setAttribute('aria-disabled', 'true');
      if (textSpan) textSpan.textContent = 'Agotado';
      this.buyButton.setAttribute('aria-label', 'Producto agotado');
    }
  }

  formatMoney(priceValue) {
    if (typeof priceValue === 'number') {
      try {
        if (typeof Shopify !== 'undefined' && typeof Shopify.formatMoney === 'function') {
          return Shopify.formatMoney(priceValue);
        }
      } catch (e) {
        console.warn('Shopify.formatMoney failed, using fallback', e);
      }

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

  handleScroll() {
    if (window.innerWidth >= 750) {
      this.hideStickyBar();
      return;
    }
    
    const scrollPosition = window.scrollY;
    const mainButton = this.submitButton;
    const footer = document.querySelector('footer');
    const footerRect = footer ? footer.getBoundingClientRect() : null;
    const footerVisible = footerRect ? footerRect.top < window.innerHeight : false;
    const mainButtonVisible = mainButton
      ? mainButton.getBoundingClientRect().top < window.innerHeight && mainButton.getBoundingClientRect().bottom > 0
      : false;

    // Show sticky CTA only when:
    // 1. Scrolled past threshold (200px)
    // 2. Main CTA is NOT in viewport
    // 3. Footer is NOT visible
    if (scrollPosition > 200 && !mainButtonVisible && !footerVisible) {
      this.showStickyBar();
    } else {
      this.hideStickyBar();
    }
  }
  
  showStickyBar() {
    this.element.style.display = 'block';
    this.element.classList.add('sticky-cta-bar--visible');
    this.element.setAttribute('aria-hidden', 'false');
    document.body.classList.add('sticky-cta-active');
  }
  
  hideStickyBar() {
    this.element.classList.remove('sticky-cta-bar--visible');
    this.element.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('sticky-cta-active');
    // Delay hiding to allow transition
    setTimeout(() => {
      if (!this.element.classList.contains('sticky-cta-bar--visible')) {
        this.element.style.display = 'none';
      }
    }, 250);
  }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const stickyBar = document.querySelector('[data-sticky-cta]');
  if (stickyBar && window.innerWidth < 750) {
    new StickyCTABar(stickyBar);
  }
});

// Re-initialize on Shopify section load (theme editor)
document.addEventListener('shopify:section:load', (event) => {
  const stickyBar = event.target.querySelector('[data-sticky-cta]');
  if (stickyBar && window.innerWidth < 750) {
    new StickyCTABar(stickyBar);
  }
});
