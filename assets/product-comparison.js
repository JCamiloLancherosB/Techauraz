/**
 * =============================================================================
 * PRODUCT COMPARISON FEATURE
 * TechAura Electronics Store - Colombia
 * =============================================================================
 * 
 * Features:
 * - localStorage persistence for comparison list
 * - Maximum 4 products limit with user notification
 * - Floating comparison bar at bottom
 * - Share comparison via URL parameters
 * - Integration with product cards
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    maxProducts: 4,
    storageKey: 'techauraz_comparison_list',
    notificationDuration: 3000,
    comparisonPagePath: '/pages/comparar'
  };

  // Translations (Spanish default, fallback to English)
  const TRANSLATIONS = {
    es: {
      productAdded: 'Producto agregado a comparación',
      productRemoved: 'Producto eliminado de comparación',
      maxReached: 'Máximo 4 productos para comparar',
      compareProducts: 'Comparar productos',
      clearAll: 'Limpiar',
      productsSelected: '{count} producto(s) seleccionado(s)',
      linkCopied: 'Enlace copiado al portapapeles',
      copyError: 'Error al copiar el enlace'
    },
    en: {
      productAdded: 'Product added to comparison',
      productRemoved: 'Product removed from comparison',
      maxReached: 'Maximum 4 products to compare',
      compareProducts: 'Compare products',
      clearAll: 'Clear all',
      productsSelected: '{count} product(s) selected',
      linkCopied: 'Link copied to clipboard',
      copyError: 'Error copying link'
    }
  };

  // Get current language (default Spanish for Colombia)
  const getLang = () => {
    const htmlLang = document.documentElement.lang || 'es';
    return htmlLang.startsWith('es') ? 'es' : 'en';
  };

  const t = (key) => {
    const lang = getLang();
    return TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key] || key;
  };

  // Product Comparison Manager
  class ProductComparison {
    constructor() {
      this.products = [];
      this.floatingBar = null;
      this.notification = null;
      this.init();
    }

    init() {
      this.loadFromStorage();
      this.loadFromURL();
      this.createFloatingBar();
      this.createNotification();
      this.bindEvents();
      this.updateUI();
    }

    // Storage Operations
    loadFromStorage() {
      try {
        const stored = localStorage.getItem(CONFIG.storageKey);
        if (stored) {
          this.products = JSON.parse(stored);
        }
      } catch (e) {
        console.warn('ProductComparison: Error loading from storage', e);
        this.products = [];
      }
    }

    saveToStorage() {
      try {
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(this.products));
      } catch (e) {
        console.warn('ProductComparison: Error saving to storage', e);
      }
    }

    // URL Operations (for sharing)
    loadFromURL() {
      const params = new URLSearchParams(window.location.search);
      const compareParam = params.get('compare');
      if (compareParam) {
        const handles = compareParam.split(',').filter(h => h.trim());
        if (handles.length > 0) {
          // Merge URL handles with stored ones, keeping unique
          handles.forEach(handle => {
            if (!this.products.some(p => p.handle === handle)) {
              // Add as placeholder - will be populated when data is available
              this.products.push({
                handle: handle,
                id: null,
                title: handle,
                url: `/products/${handle}`,
                image: null,
                price: null,
                compareAtPrice: null,
                available: true
              });
            }
          });
          // Trim to max products
          this.products = this.products.slice(0, CONFIG.maxProducts);
          this.saveToStorage();
        }
      }
    }

    getShareURL() {
      const handles = this.products.map(p => p.handle).join(',');
      const baseURL = window.location.origin + CONFIG.comparisonPagePath;
      return `${baseURL}?compare=${encodeURIComponent(handles)}`;
    }

    // Product Operations
    addProduct(productData) {
      if (this.products.length >= CONFIG.maxProducts) {
        this.showNotification(t('maxReached'), 'error');
        return false;
      }

      if (this.products.some(p => p.handle === productData.handle)) {
        return false; // Already in comparison
      }

      this.products.push({
        id: productData.id,
        handle: productData.handle,
        title: productData.title,
        url: productData.url,
        image: productData.image,
        price: productData.price,
        compareAtPrice: productData.compareAtPrice,
        available: productData.available
      });

      this.saveToStorage();
      this.updateUI();
      this.showNotification(t('productAdded'), 'success');
      return true;
    }

    removeProduct(handle) {
      const index = this.products.findIndex(p => p.handle === handle);
      if (index > -1) {
        this.products.splice(index, 1);
        this.saveToStorage();
        this.updateUI();
        this.showNotification(t('productRemoved'));
        return true;
      }
      return false;
    }

    clearAll() {
      this.products = [];
      this.saveToStorage();
      this.updateUI();
    }

    isInComparison(handle) {
      return this.products.some(p => p.handle === handle);
    }

    getCount() {
      return this.products.length;
    }

    // UI Creation
    createFloatingBar() {
      if (document.querySelector('.comparison-bar')) return;

      this.floatingBar = document.createElement('div');
      this.floatingBar.className = 'comparison-bar';
      this.floatingBar.setAttribute('role', 'region');
      this.floatingBar.setAttribute('aria-label', t('compareProducts'));
      this.floatingBar.innerHTML = `
        <div class="comparison-bar__inner">
          <div class="comparison-bar__products" aria-live="polite"></div>
          <span class="comparison-bar__count"></span>
          <div class="comparison-bar__actions">
            <button type="button" class="comparison-bar__btn comparison-bar__btn--secondary" data-comparison-clear>
              ${t('clearAll')}
            </button>
            <a href="${CONFIG.comparisonPagePath}" class="comparison-bar__btn comparison-bar__btn--primary" data-comparison-view>
              ${t('compareProducts')}
            </a>
          </div>
        </div>
      `;
      document.body.appendChild(this.floatingBar);
    }

    createNotification() {
      if (document.querySelector('.comparison-notification')) return;

      this.notification = document.createElement('div');
      this.notification.className = 'comparison-notification';
      this.notification.setAttribute('role', 'status');
      this.notification.setAttribute('aria-live', 'polite');
      document.body.appendChild(this.notification);
    }

    // UI Updates
    updateUI() {
      this.updateFloatingBar();
      this.updateCompareButtons();
      this.updateComparisonTable();
    }

    updateFloatingBar() {
      if (!this.floatingBar) return;

      const count = this.getCount();
      const productsContainer = this.floatingBar.querySelector('.comparison-bar__products');
      const countElement = this.floatingBar.querySelector('.comparison-bar__count');

      if (count > 0) {
        this.floatingBar.classList.add('is-visible');

        // Update products preview
        productsContainer.innerHTML = this.products.map(product => `
          <div class="comparison-bar__product" title="${this.escapeHTML(product.title)}">
            ${product.image ? `<img src="${product.image}" alt="${this.escapeHTML(product.title)}" loading="lazy">` : ''}
            <button type="button" class="comparison-bar__remove" data-comparison-remove="${product.handle}" aria-label="Quitar ${this.escapeHTML(product.title)}">
              ×
            </button>
          </div>
        `).join('');

        // Update count text
        countElement.textContent = t('productsSelected').replace('{count}', count);
      } else {
        this.floatingBar.classList.remove('is-visible');
      }
    }

    updateCompareButtons() {
      document.querySelectorAll('[data-compare-button]').forEach(button => {
        const handle = button.dataset.productHandle;
        const isActive = this.isInComparison(handle);
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', isActive.toString());
      });

      // Update counter badges
      document.querySelectorAll('[data-compare-counter]').forEach(counter => {
        const count = this.getCount();
        counter.textContent = count;
        counter.style.display = count > 0 ? 'flex' : 'none';
      });
    }

    updateComparisonTable() {
      // This is called when on the comparison page to refresh the table
      const tableContainer = document.querySelector('[data-comparison-table-container]');
      if (tableContainer && typeof window.renderComparisonTable === 'function') {
        window.renderComparisonTable(this.products);
      }
    }

    // Notification
    showNotification(message, type = 'info') {
      if (!this.notification) return;

      this.notification.textContent = message;
      this.notification.className = 'comparison-notification';
      if (type) {
        this.notification.classList.add(`comparison-notification--${type}`);
      }
      this.notification.classList.add('is-visible');

      setTimeout(() => {
        this.notification.classList.remove('is-visible');
      }, CONFIG.notificationDuration);
    }

    // Event Binding
    bindEvents() {
      // Delegate click events
      document.addEventListener('click', (e) => {
        // Compare button on product cards
        const compareBtn = e.target.closest('[data-compare-button]');
        if (compareBtn) {
          e.preventDefault();
          e.stopPropagation();
          this.handleCompareButtonClick(compareBtn);
          return;
        }

        // Remove from floating bar
        const removeBtn = e.target.closest('[data-comparison-remove]');
        if (removeBtn) {
          e.preventDefault();
          const handle = removeBtn.dataset.comparisonRemove;
          this.removeProduct(handle);
          return;
        }

        // Clear all button
        const clearBtn = e.target.closest('[data-comparison-clear]');
        if (clearBtn) {
          e.preventDefault();
          this.clearAll();
          return;
        }

        // Share button
        const shareBtn = e.target.closest('[data-comparison-share]');
        if (shareBtn) {
          e.preventDefault();
          this.copyShareURL();
          return;
        }

        // Remove from comparison table
        const tableRemoveBtn = e.target.closest('[data-table-remove]');
        if (tableRemoveBtn) {
          e.preventDefault();
          const handle = tableRemoveBtn.dataset.tableRemove;
          this.removeProduct(handle);
          return;
        }
      });

      // Listen for custom events (for AJAX-loaded content)
      document.addEventListener('comparison:add', (e) => {
        if (e.detail && e.detail.product) {
          this.addProduct(e.detail.product);
        }
      });

      document.addEventListener('comparison:remove', (e) => {
        if (e.detail && e.detail.handle) {
          this.removeProduct(e.detail.handle);
        }
      });
    }

    handleCompareButtonClick(button) {
      const handle = button.dataset.productHandle;
      
      if (this.isInComparison(handle)) {
        this.removeProduct(handle);
      } else {
        const productData = {
          id: button.dataset.productId,
          handle: handle,
          title: button.dataset.productTitle,
          url: button.dataset.productUrl,
          image: button.dataset.productImage,
          price: button.dataset.productPrice,
          compareAtPrice: button.dataset.productComparePrice,
          available: button.dataset.productAvailable !== 'false'
        };
        this.addProduct(productData);
      }
    }

    copyShareURL() {
      const url = this.getShareURL();
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
          .then(() => this.showNotification(t('linkCopied'), 'success'))
          .catch(() => this.fallbackCopy(url));
      } else {
        this.fallbackCopy(url);
      }
    }

    fallbackCopy(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        document.execCommand('copy');
        this.showNotification(t('linkCopied'), 'success');
      } catch (e) {
        this.showNotification(t('copyError'), 'error');
      }
      
      document.body.removeChild(textarea);
    }

    // Utility
    escapeHTML(str) {
      if (!str) return '';
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.productComparison = new ProductComparison();
    });
  } else {
    window.productComparison = new ProductComparison();
  }

  // Expose for external use
  window.ProductComparison = ProductComparison;

})();
