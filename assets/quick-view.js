/**
 * =============================================================================
 * QUICK VIEW MODAL - JavaScript Functionality
 * TechAura Colombia
 * Version: 1.0.0
 * =============================================================================
 * 
 * Handles:
 * - AJAX fetch product data from Shopify Product JSON endpoint
 * - Variant selection and price updates
 * - Cart integration using Shopify AJAX Cart API
 * - Keyboard accessibility (ESC to close, tab trapping)
 * - Body scroll lock when modal is open
 * - Event delegation for performance
 * =============================================================================
 */

(function() {
  'use strict';

  // Only initialize if modal exists
  const modal = document.getElementById('product-quick-view-modal');
  if (!modal) return;

  // ==========================================================================
  // CONFIGURATION & STATE
  // ==========================================================================

  const state = {
    isOpen: false,
    isLoading: false,
    productData: null,
    selectedVariant: null,
    quantity: 1,
    scrollPosition: 0,
    focusableElements: [],
    firstFocusableElement: null,
    lastFocusableElement: null,
    triggerElement: null
  };

  // Get localized strings
  let strings = {
    addToCart: 'AGREGAR AL CARRITO',
    adding: 'Agregando...',
    added: '¡Agregado!',
    soldOut: 'Agotado',
    unavailable: 'No disponible',
    selectOption: 'Seleccionar',
    loading: 'Cargando producto...',
    close: 'Cerrar',
    error: 'Error al agregar al carrito'
  };

  // Try to load localized strings
  try {
    const stringsEl = document.getElementById('quick-view-strings');
    if (stringsEl) {
      strings = { ...strings, ...JSON.parse(stringsEl.textContent) };
    }
  } catch (e) {
    console.warn('Quick View: Could not parse localized strings', e);
  }

  // ==========================================================================
  // DOM ELEMENTS
  // ==========================================================================

  const elements = {
    modal: modal,
    backdrop: modal.querySelector('.quick-view-modal__backdrop'),
    container: modal.querySelector('.quick-view-modal__container'),
    closeButtons: modal.querySelectorAll('[data-quick-view-close]'),
    loading: modal.querySelector('.quick-view-modal__loading'),
    content: modal.querySelector('.quick-view-modal__content'),
    mainImage: modal.querySelector('#quick-view-main-image'),
    thumbnailsContainer: modal.querySelector('.quick-view-modal__thumbnails'),
    title: modal.querySelector('#quick-view-title'),
    price: modal.querySelector('#quick-view-price'),
    comparePrice: modal.querySelector('#quick-view-compare-price'),
    description: modal.querySelector('#quick-view-description'),
    variantsContainer: modal.querySelector('#quick-view-variants'),
    quantityInput: modal.querySelector('#quick-view-quantity'),
    quantityButtons: modal.querySelectorAll('.quick-view-modal__quantity-btn'),
    addToCartBtn: modal.querySelector('#quick-view-add-to-cart'),
    detailsLink: modal.querySelector('#quick-view-details-link')
  };

  // ==========================================================================
  // UTILITY FUNCTIONS
  // ==========================================================================

  /**
   * Format price in COP currency
   */
  function formatMoney(cents) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    const value = parseInt(cents, 10);
    if (isNaN(value)) return '$0';
    
    // Format as Colombian Pesos
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value / 100);
  }

  /**
   * Strip HTML tags from string
   */
  function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  /**
   * Truncate text to specified words
   */
  function truncateWords(text, maxWords) {
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  }

  /**
   * Debounce function
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ==========================================================================
  // MODAL OPEN/CLOSE FUNCTIONS
  // ==========================================================================

  /**
   * Open the modal
   */
  function openModal(productHandle, triggerEl) {
    if (state.isOpen) return;

    state.triggerElement = triggerEl;
    state.scrollPosition = window.scrollY;

    // Lock body scroll
    document.body.style.setProperty('--scroll-position', `-${state.scrollPosition}px`);
    document.body.classList.add('quick-view-modal-open');

    // Show modal
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-loading');
    state.isOpen = true;

    // Fetch product data
    fetchProduct(productHandle);

    // Set up focus trap
    setupFocusTrap();

    // Focus on close button for better accessibility
    setTimeout(() => {
      const closeBtn = elements.container.querySelector('.quick-view-modal__close');
      if (closeBtn) {
        closeBtn.focus();
      } else {
        elements.container.focus();
      }
    }, 100);
  }

  /**
   * Close the modal
   */
  function closeModal() {
    if (!state.isOpen) return;

    // Hide modal
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('is-loading', 'has-sale-price');
    state.isOpen = false;

    // Restore body scroll
    document.body.classList.remove('quick-view-modal-open');
    window.scrollTo(0, state.scrollPosition);
    document.body.style.removeProperty('--scroll-position');

    // Return focus to trigger element
    if (state.triggerElement) {
      state.triggerElement.focus();
      state.triggerElement = null;
    }

    // Reset state
    resetModalContent();
  }

  /**
   * Reset modal content
   */
  function resetModalContent() {
    state.productData = null;
    state.selectedVariant = null;
    state.quantity = 1;

    elements.title.textContent = '';
    elements.price.textContent = '';
    elements.comparePrice.textContent = '';
    elements.description.textContent = '';
    elements.mainImage.src = '';
    elements.mainImage.alt = '';
    elements.thumbnailsContainer.innerHTML = '';
    elements.variantsContainer.innerHTML = '';
    elements.variantsContainer.style.display = 'none';
    elements.quantityInput.value = 1;

    // Reset add to cart button
    const btn = elements.addToCartBtn;
    btn.disabled = false;
    btn.classList.remove('is-loading', 'is-success', 'is-sold-out');
  }

  // ==========================================================================
  // FOCUS TRAP
  // ==========================================================================

  /**
   * Set up focus trap within modal
   */
  function setupFocusTrap() {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    state.focusableElements = Array.from(
      elements.container.querySelectorAll(focusableSelectors)
    ).filter(el => el.offsetParent !== null);

    state.firstFocusableElement = state.focusableElements[0];
    state.lastFocusableElement = state.focusableElements[state.focusableElements.length - 1];
  }

  /**
   * Handle tab key for focus trapping
   */
  function handleTabKey(e) {
    if (!state.isOpen) return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === state.firstFocusableElement) {
        e.preventDefault();
        state.lastFocusableElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === state.lastFocusableElement) {
        e.preventDefault();
        state.firstFocusableElement.focus();
      }
    }
  }

  // ==========================================================================
  // FETCH PRODUCT DATA
  // ==========================================================================

  /**
   * Fetch product data from Shopify JSON endpoint
   */
  async function fetchProduct(handle) {
    try {
      state.isLoading = true;
      modal.classList.add('is-loading');

      const response = await fetch(`/products/${handle}.js`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.status}`);
      }

      const product = await response.json();
      state.productData = product;

      // Render product data
      renderProduct(product);

      // Hide loading, show content
      modal.classList.remove('is-loading');
      state.isLoading = false;

      // Update focus trap with new content
      setupFocusTrap();

    } catch (error) {
      console.error('Quick View: Error fetching product', error);
      closeModal();
    }
  }

  // ==========================================================================
  // RENDER PRODUCT
  // ==========================================================================

  /**
   * Render product data in modal
   */
  function renderProduct(product) {
    // Title
    elements.title.textContent = product.title;

    // Description (truncated)
    const description = stripHtml(product.description);
    elements.description.textContent = truncateWords(description, 50);

    // Details link
    elements.detailsLink.href = product.url;

    // Images
    renderImages(product);

    // Variants
    if (product.variants.length > 1 || product.options.length > 1) {
      renderVariants(product);
    }

    // Select first available variant
    const firstAvailable = product.variants.find(v => v.available) || product.variants[0];
    selectVariant(firstAvailable);
  }

  /**
   * Get Shopify image URL with size transformation
   */
  function getSizedImageUrl(url, size) {
    if (!url) return '';
    // Remove existing size suffix if present, then add new one
    const baseUrl = url.replace(/(_\d+x\d+)?(\.[^.]+)(\?.*)?$/, '$2$3');
    return baseUrl.replace(/(\.[^.]+)(\?.*)?$/, `_${size}$1$2`);
  }

  /**
   * Render product images
   */
  function renderImages(product) {
    if (!product.images || product.images.length === 0) {
      // Use a data URI placeholder to avoid network request
      elements.mainImage.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PHJlY3QgZmlsbD0iI2Y4ZmFmYyIgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk0YTNiOCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiPlNpbiBpbWFnZW48L3RleHQ+PC9zdmc+';
      elements.mainImage.alt = product.title;
      return;
    }

    // Main image
    const mainImageSrc = getSizedImageUrl(product.images[0], '800x800');
    elements.mainImage.src = mainImageSrc;
    elements.mainImage.alt = product.title;

    // Thumbnails
    if (product.images.length > 1) {
      elements.thumbnailsContainer.innerHTML = product.images.map((image, index) => {
        const thumbSrc = getSizedImageUrl(image, '100x100');
        const fullSrc = getSizedImageUrl(image, '800x800');
        return `
          <button 
            type="button"
            class="quick-view-modal__thumbnail${index === 0 ? ' is-active' : ''}"
            data-image-index="${index}"
            data-image-src="${fullSrc}"
            aria-label="Ver imagen ${index + 1}"
          >
            <img src="${thumbSrc}" alt="Miniatura ${index + 1}" loading="lazy">
          </button>
        `;
      }).join('');
    }
  }

  /**
   * Render variant options
   */
  function renderVariants(product) {
    if (!product.options || product.options.length === 0) return;

    // Check if product has only default variant (no real options)
    if (product.variants.length === 1 && product.variants[0].title === 'Default Title') {
      return;
    }

    let html = '';

    product.options.forEach((option, optionIndex) => {
      // Get unique values for this option
      const values = [...new Set(product.variants.map(v => v.options[optionIndex]))];

      html += `
        <div class="quick-view-modal__variant-group" data-option-index="${optionIndex}">
          <span class="quick-view-modal__variant-label">${option}</span>
          <div class="quick-view-modal__variant-options">
            ${values.map(value => {
              // Check if any variant with this value is available
              const isAvailable = product.variants.some(v => 
                v.options[optionIndex] === value && v.available
              );
              return `
                <button 
                  type="button"
                  class="quick-view-modal__variant-option${!isAvailable ? ' is-disabled' : ''}"
                  data-option-index="${optionIndex}"
                  data-option-value="${value}"
                  ${!isAvailable ? 'aria-disabled="true"' : ''}
                >
                  ${value}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    });

    elements.variantsContainer.innerHTML = html;
    elements.variantsContainer.style.display = 'flex';
  }

  /**
   * Select a variant and update UI
   */
  function selectVariant(variant) {
    state.selectedVariant = variant;

    // Update price
    elements.price.textContent = formatMoney(variant.price);

    // Compare at price
    if (variant.compare_at_price && variant.compare_at_price > variant.price) {
      elements.comparePrice.textContent = formatMoney(variant.compare_at_price);
      modal.classList.add('has-sale-price');
    } else {
      elements.comparePrice.textContent = '';
      modal.classList.remove('has-sale-price');
    }

    // Update variant selection UI
    if (state.productData && state.productData.options) {
      variant.options.forEach((optionValue, index) => {
        const optionButtons = elements.variantsContainer.querySelectorAll(
          `[data-option-index="${index}"]`
        );
        optionButtons.forEach(btn => {
          if (btn.classList.contains('quick-view-modal__variant-options')) return;
          btn.classList.toggle('is-selected', btn.dataset.optionValue === optionValue);
        });
      });
    }

    // Update add to cart button state
    updateAddToCartButton(variant);

    // Update main image if variant has specific image
    if (variant.featured_image) {
      const imageSrc = variant.featured_image.src.replace(/\.([^\.]+)$/, '_800x800.$1');
      elements.mainImage.src = imageSrc;
      
      // Update thumbnail active state
      updateThumbnailActive(variant.featured_image.src);
    }
  }

  /**
   * Update the add to cart button based on variant availability
   */
  function updateAddToCartButton(variant) {
    const btn = elements.addToCartBtn;
    btn.classList.remove('is-loading', 'is-success', 'is-sold-out');

    if (!variant || !variant.available) {
      btn.disabled = true;
      btn.classList.add('is-sold-out');
    } else {
      btn.disabled = false;
    }
  }

  /**
   * Find variant by selected options
   */
  function findVariantByOptions() {
    const selectedOptions = [];
    const optionGroups = elements.variantsContainer.querySelectorAll('.quick-view-modal__variant-group');

    optionGroups.forEach(group => {
      const selectedBtn = group.querySelector('.quick-view-modal__variant-option.is-selected');
      if (selectedBtn) {
        selectedOptions.push(selectedBtn.dataset.optionValue);
      }
    });

    if (selectedOptions.length === 0) return null;

    return state.productData.variants.find(variant => {
      return selectedOptions.every((value, index) => variant.options[index] === value);
    });
  }

  /**
   * Update active thumbnail
   */
  function updateThumbnailActive(imageSrc) {
    const thumbnails = elements.thumbnailsContainer.querySelectorAll('.quick-view-modal__thumbnail');
    thumbnails.forEach(thumb => {
      const thumbSrc = thumb.dataset.imageSrc;
      // Compare base URLs (without size suffix)
      const thumbBase = thumbSrc.replace(/_\d+x\d+\./, '.');
      const imageBase = imageSrc.replace(/_\d+x\d+\./, '.');
      thumb.classList.toggle('is-active', thumbBase === imageBase);
    });
  }

  // ==========================================================================
  // ADD TO CART
  // ==========================================================================

  /**
   * Add current variant to cart
   */
  async function addToCart() {
    if (!state.selectedVariant || !state.selectedVariant.available) return;

    const btn = elements.addToCartBtn;
    btn.classList.add('is-loading');
    btn.disabled = true;

    try {
      const formData = {
        items: [{
          id: state.selectedVariant.id,
          quantity: state.quantity
        }]
      };

      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      const result = await response.json();

      // Show success state
      btn.classList.remove('is-loading');
      btn.classList.add('is-success');

      // Update cart UI if cart drawer or notification exists
      const cartDrawer = document.querySelector('cart-drawer');
      const cartNotification = document.querySelector('cart-notification');

      if (cartDrawer) {
        // Fetch updated cart and render
        const cartResponse = await fetch('/cart.js');
        const cartData = await cartResponse.json();
        
        // Publish cart update event for other components
        if (typeof publish === 'function') {
          publish('cart:update', { source: 'quick-view', cartData });
        }

        // Trigger cart drawer to refresh
        const refreshEvent = new CustomEvent('cart:refresh', { bubbles: true });
        document.dispatchEvent(refreshEvent);
      }

      if (cartNotification) {
        // Trigger cart notification
        const notificationEvent = new CustomEvent('cart:item-added', {
          bubbles: true,
          detail: { items: result.items }
        });
        document.dispatchEvent(notificationEvent);
      }

      // Update cart bubble count
      updateCartBubble();

      // Reset after delay and close modal
      setTimeout(() => {
        btn.classList.remove('is-success');
        btn.disabled = false;
        closeModal();
        
        // Open cart drawer if it exists and has open method
        if (cartDrawer && typeof cartDrawer.open === 'function') {
          try {
            cartDrawer.open();
          } catch (e) {
            console.warn('Quick View: Could not open cart drawer', e);
          }
        }
      }, 1500);

    } catch (error) {
      console.error('Quick View: Error adding to cart', error);
      btn.classList.remove('is-loading');
      btn.disabled = false;
      
      // Show error state on button briefly instead of alert
      btn.classList.add('is-error');
      const originalText = btn.querySelector('.quick-view-modal__add-to-cart-text');
      if (originalText) {
        const errorText = originalText.textContent;
        originalText.textContent = strings.error;
        setTimeout(() => {
          btn.classList.remove('is-error');
          originalText.textContent = errorText;
        }, 3000);
      }
    }
  }

  /**
   * Update cart bubble count
   */
  async function updateCartBubble() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      
      const bubbles = document.querySelectorAll('.cart-count-bubble');
      bubbles.forEach(bubble => {
        const countEl = bubble.querySelector('[aria-hidden="true"]') || bubble;
        if (cart.item_count > 0) {
          countEl.textContent = cart.item_count;
          bubble.classList.remove('hidden');
        }
      });
    } catch (e) {
      // Silently fail
    }
  }

  // ==========================================================================
  // QUANTITY HANDLERS
  // ==========================================================================

  /**
   * Update quantity
   */
  function updateQuantity(action) {
    let newQuantity = state.quantity;

    if (action === 'increase') {
      newQuantity++;
    } else if (action === 'decrease' && newQuantity > 1) {
      newQuantity--;
    }

    state.quantity = newQuantity;
    elements.quantityInput.value = newQuantity;
  }

  /**
   * Handle quantity input change
   */
  function handleQuantityChange(e) {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      value = 1;
    }
    state.quantity = value;
    elements.quantityInput.value = value;
  }

  // ==========================================================================
  // EVENT LISTENERS
  // ==========================================================================

  /**
   * Set up event listeners
   */
  function setupEventListeners() {
    // Close buttons
    elements.closeButtons.forEach(btn => {
      btn.addEventListener('click', closeModal);
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.isOpen) {
        closeModal();
      }
      if (e.key === 'Tab' && state.isOpen) {
        handleTabKey(e);
      }
    });

    // Thumbnail clicks (event delegation)
    elements.thumbnailsContainer.addEventListener('click', (e) => {
      const thumbnail = e.target.closest('.quick-view-modal__thumbnail');
      if (!thumbnail) return;

      // Update main image
      const imageSrc = thumbnail.dataset.imageSrc;
      elements.mainImage.src = imageSrc;

      // Update active state
      elements.thumbnailsContainer.querySelectorAll('.quick-view-modal__thumbnail').forEach(t => {
        t.classList.remove('is-active');
      });
      thumbnail.classList.add('is-active');
    });

    // Variant option clicks (event delegation)
    elements.variantsContainer.addEventListener('click', (e) => {
      const optionBtn = e.target.closest('.quick-view-modal__variant-option');
      if (!optionBtn || optionBtn.classList.contains('is-disabled')) return;

      const optionIndex = parseInt(optionBtn.dataset.optionIndex, 10);
      const optionValue = optionBtn.dataset.optionValue;

      // Update selection in same group
      const group = optionBtn.closest('.quick-view-modal__variant-group');
      group.querySelectorAll('.quick-view-modal__variant-option').forEach(btn => {
        btn.classList.remove('is-selected');
      });
      optionBtn.classList.add('is-selected');

      // Find and select matching variant
      const newVariant = findVariantByOptions();
      if (newVariant) {
        selectVariant(newVariant);
      }
    });

    // Quantity buttons
    elements.quantityButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        updateQuantity(btn.dataset.action);
      });
    });

    // Quantity input change
    elements.quantityInput.addEventListener('change', handleQuantityChange);

    // Add to cart button
    elements.addToCartBtn.addEventListener('click', addToCart);

    // Quick view trigger buttons (event delegation on document)
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-quick-view-trigger]');
      if (!trigger) return;

      e.preventDefault();
      e.stopPropagation();

      const productHandle = trigger.dataset.productHandle;
      if (productHandle) {
        openModal(productHandle, trigger);
      }
    });
  }

  // ==========================================================================
  // INITIALIZE
  // ==========================================================================

  /**
   * Initialize quick view functionality
   */
  function init() {
    setupEventListeners();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for external use if needed
  window.QuickView = {
    open: openModal,
    close: closeModal
  };

})();
