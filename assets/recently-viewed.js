/**
 * Recently Viewed Products
 * 
 * Manages the storage and display of recently viewed products using localStorage.
 * Features:
 * - Stores up to 20 products (configurable)
 * - FIFO (first in, first out) when limit reached
 * - Clears products older than 30 days
 * - Syncs across browser tabs using storage event
 * - Handles localStorage quota exceeded errors
 * - Detects incognito/private mode
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'techauraz_recently_viewed';
  const MAX_PRODUCTS = 20;
  const EXPIRY_DAYS = 30;
  const EXPIRY_MS = EXPIRY_DAYS * 24 * 60 * 60 * 1000;

  /**
   * Check if localStorage is available and functional
   * @returns {boolean}
   */
  function isLocalStorageAvailable() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Check if running in incognito/private mode
   * In many browsers, localStorage works but has limited quota in private mode
   * @returns {boolean}
   */
  function isPrivateMode() {
    try {
      // Try to use localStorage with larger data to detect limited quota
      const testKey = '__private_test__';
      localStorage.setItem(testKey, new Array(100).join('test'));
      localStorage.removeItem(testKey);
      return false;
    } catch (e) {
      return true;
    }
  }

  /**
   * Get recently viewed products from localStorage
   * @returns {Array}
   */
  function getRecentlyViewed() {
    if (!isLocalStorageAvailable()) return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      
      const products = JSON.parse(data);
      const now = Date.now();
      
      // Filter out expired products
      const validProducts = products.filter(product => {
        const age = now - (product.timestamp || 0);
        return age < EXPIRY_MS;
      });
      
      // If some products were expired, update storage
      if (validProducts.length !== products.length) {
        saveRecentlyViewed(validProducts);
      }
      
      return validProducts;
    } catch (e) {
      console.warn('Error reading recently viewed products:', e);
      return [];
    }
  }

  /**
   * Save recently viewed products to localStorage
   * @param {Array} products
   */
  function saveRecentlyViewed(products) {
    if (!isLocalStorageAvailable() || isPrivateMode()) return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        // Remove oldest products and try again
        const reducedProducts = products.slice(-Math.floor(MAX_PRODUCTS / 2));
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedProducts));
        } catch (retryError) {
          console.warn('Unable to save recently viewed products:', retryError);
        }
      } else {
        console.warn('Error saving recently viewed products:', e);
      }
    }
  }

  /**
   * Add a product to recently viewed
   * @param {Object} product - Product data
   */
  function addProduct(product) {
    if (!product || !product.handle) return;
    
    const products = getRecentlyViewed();
    
    // Remove existing entry for this product (to move it to the front)
    const filtered = products.filter(p => p.handle !== product.handle);
    
    // Add new product at the beginning with timestamp
    const newProduct = {
      handle: product.handle,
      title: product.title || '',
      image: product.image || '',
      price: product.price || '',
      compareAtPrice: product.compareAtPrice || '',
      url: product.url || `/products/${product.handle}`,
      timestamp: Date.now()
    };
    
    filtered.unshift(newProduct);
    
    // Trim to max products (FIFO)
    const trimmed = filtered.slice(0, MAX_PRODUCTS);
    
    saveRecentlyViewed(trimmed);
    
    // Dispatch event for other tabs and components
    window.dispatchEvent(new CustomEvent('recentlyViewedUpdated', {
      detail: { products: trimmed }
    }));
  }

  /**
   * Track product view on product page
   */
  function trackProductView() {
    // Only track on product pages
    if (!window.location.pathname.includes('/products/')) return;
    
    // Get product data from the page
    const productData = window.productData || window.ShopifyAnalytics?.meta?.product;
    
    if (productData) {
      addProduct({
        handle: productData.handle,
        title: productData.title,
        image: productData.featured_image || productData.images?.[0],
        price: productData.price,
        compareAtPrice: productData.compare_at_price,
        url: window.location.pathname
      });
      return;
    }
    
    // Fallback: Try to extract from JSON-LD structured data
    const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    if (jsonLdScript) {
      try {
        const data = JSON.parse(jsonLdScript.textContent);
        if (data['@type'] === 'Product') {
          const handle = window.location.pathname.split('/products/')[1]?.split('?')[0];
          if (handle) {
            addProduct({
              handle: handle,
              title: data.name,
              image: data.image,
              price: data.offers?.price,
              url: window.location.pathname
            });
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
  }

  /**
   * Recently Viewed Section Component
   */
  class RecentlyViewedSection extends HTMLElement {
    constructor() {
      super();
      this.carousel = null;
      this.prevBtn = null;
      this.nextBtn = null;
      this.wrapper = null;
    }

    connectedCallback() {
      this.init();
    }

    init() {
      this.currentHandle = this.dataset.currentProduct || '';
      this.maxDisplay = parseInt(this.dataset.maxDisplay, 10) || 10;
      this.autoHide = this.dataset.autoHide === 'true';
      
      this.render();
      this.setupScrollSync();
      
      // Listen for updates from other tabs
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          this.render();
        }
      });
      
      // Listen for updates from same page
      window.addEventListener('recentlyViewedUpdated', () => {
        this.render();
      });
    }

    getProducts() {
      let products = getRecentlyViewed();
      
      // Exclude current product if on product page
      if (this.currentHandle) {
        products = products.filter(p => p.handle !== this.currentHandle);
      }
      
      // Limit to max display
      return products.slice(0, this.maxDisplay);
    }

    render() {
      const products = this.getProducts();
      const container = this.querySelector('[data-recently-viewed-content]');
      
      if (!container) return;
      
      // Auto-hide if empty and auto-hide is enabled
      if (products.length === 0) {
        if (this.autoHide) {
          this.classList.add('is-hidden');
        } else {
          container.innerHTML = this.renderEmptyState();
        }
        return;
      }
      
      this.classList.remove('is-hidden');
      container.innerHTML = this.renderCarousel(products);
      
      // Setup carousel controls
      this.carousel = this.querySelector('[data-recently-viewed-carousel]');
      this.wrapper = this.querySelector('[data-recently-viewed-wrapper]');
      this.prevBtn = this.querySelector('[data-recently-viewed-prev]');
      this.nextBtn = this.querySelector('[data-recently-viewed-next]');
      
      if (this.carousel) {
        this.setupNavigation();
        this.updateScrollState();
      }
      
      // Trigger animation
      if (this.dataset.animate !== undefined) {
        requestAnimationFrame(() => {
          this.classList.add('is-visible');
        });
      }
    }

    renderEmptyState() {
      const emptyText = this.dataset.emptyText || 'No has visto productos recientemente';
      return `
        <div class="recently-viewed__empty">
          <span class="recently-viewed__empty-icon">👀</span>
          <p class="recently-viewed__empty-text">${this.escapeHtml(emptyText)}</p>
        </div>
      `;
    }

    renderCarousel(products) {
      const items = products.map(product => this.renderProductCard(product)).join('');
      
      return `
        <div class="recently-viewed__carousel-wrapper" data-recently-viewed-wrapper>
          <button type="button" class="recently-viewed__nav recently-viewed__nav--prev" data-recently-viewed-prev aria-label="Anterior">
            <svg viewBox="0 0 14 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 9L1 5L7 1"/>
              <path d="M13 5H1"/>
            </svg>
          </button>
          <ul class="recently-viewed__carousel" data-recently-viewed-carousel role="list">
            ${items}
          </ul>
          <button type="button" class="recently-viewed__nav recently-viewed__nav--next" data-recently-viewed-next aria-label="Siguiente">
            <svg viewBox="0 0 14 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M7 1L13 5L7 9"/>
              <path d="M1 5H13"/>
            </svg>
          </button>
        </div>
      `;
    }

    renderProductCard(product) {
      const hasComparePrice = product.compareAtPrice && product.compareAtPrice > product.price;
      const priceClass = hasComparePrice ? 'recently-viewed__product-price--sale' : '';
      
      // Format price (assuming cents, divide by 100)
      const formatPrice = (price) => {
        if (!price) return '';
        const numPrice = typeof price === 'number' ? price : parseFloat(price);
        if (isNaN(numPrice)) return price;
        // Check if price is in cents (common in Shopify)
        const displayPrice = numPrice > 1000 ? numPrice / 100 : numPrice;
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(displayPrice);
      };
      
      const priceHtml = product.price ? `
        <span class="recently-viewed__product-price ${priceClass}">${formatPrice(product.price)}</span>
        ${hasComparePrice ? `<span class="recently-viewed__product-compare-price">${formatPrice(product.compareAtPrice)}</span>` : ''}
      ` : '';
      
      const imageHtml = product.image ? `
        <img 
          src="${this.escapeHtml(this.getOptimizedImageUrl(product.image, 400))}" 
          alt="${this.escapeHtml(product.title)}"
          class="recently-viewed__product-image"
          loading="lazy"
          width="400"
          height="400"
        >
      ` : `
        <div class="recently-viewed__product-placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
        </div>
      `;
      
      return `
        <li class="recently-viewed__item">
          <a href="${this.escapeHtml(product.url)}" class="recently-viewed__product-card">
            <div class="recently-viewed__product-image-wrapper">
              ${imageHtml}
            </div>
            <div class="recently-viewed__product-info">
              <h3 class="recently-viewed__product-title">${this.escapeHtml(product.title)}</h3>
              <div class="recently-viewed__product-pricing">
                ${priceHtml}
              </div>
            </div>
          </a>
        </li>
      `;
    }

    getOptimizedImageUrl(url, width) {
      if (!url) return '';
      // Handle Shopify CDN URLs
      if (url.includes('cdn.shopify.com')) {
        return url.replace(/(_\d+x\d+)?(\.[a-z]+)(\?.*)?$/i, `_${width}x$2`);
      }
      return url;
    }

    escapeHtml(str) {
      if (!str) return '';
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    setupNavigation() {
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => this.scroll('prev'));
      }
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => this.scroll('next'));
      }
      
      if (this.carousel) {
        this.carousel.addEventListener('scroll', () => this.updateScrollState());
      }
    }

    scroll(direction) {
      if (!this.carousel) return;
      
      const scrollAmount = this.carousel.offsetWidth * 0.8;
      const newScrollLeft = direction === 'next' 
        ? this.carousel.scrollLeft + scrollAmount 
        : this.carousel.scrollLeft - scrollAmount;
      
      this.carousel.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }

    updateScrollState() {
      if (!this.carousel || !this.wrapper) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = this.carousel;
      const canScrollLeft = scrollLeft > 5;
      const canScrollRight = scrollLeft < scrollWidth - clientWidth - 5;
      
      // Update navigation buttons
      if (this.prevBtn) {
        this.prevBtn.disabled = !canScrollLeft;
      }
      if (this.nextBtn) {
        this.nextBtn.disabled = !canScrollRight;
      }
      
      // Update fade effect classes
      this.wrapper.classList.toggle('has-scroll-left', canScrollLeft);
      this.wrapper.classList.toggle('has-scroll-right', canScrollRight);
    }

    setupScrollSync() {
      // Listen for storage changes from other tabs
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          this.render();
        }
      });
    }
  }

  // Register custom element
  if (!customElements.get('recently-viewed-section')) {
    customElements.define('recently-viewed-section', RecentlyViewedSection);
  }

  // Track product view on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackProductView);
  } else {
    trackProductView();
  }

  // Expose API for external use
  window.RecentlyViewed = {
    get: getRecentlyViewed,
    add: addProduct,
    clear: () => {
      if (isLocalStorageAvailable()) {
        localStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new CustomEvent('recentlyViewedUpdated', {
          detail: { products: [] }
        }));
      }
    }
  };

})();
