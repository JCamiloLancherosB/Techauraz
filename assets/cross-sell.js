/* ============================================
   TECHAURAZ - Cross-Sell JavaScript
   Funcionalidad de Cross-sell y Upsell
   ============================================ */

class CrossSell {
  constructor() {
    this.init();
  }

  init() {
    this.initBundleDeals();
    this.initFrequentlyBought();
    this.initQuickAdd();
  }

  /**
   * Inicializa Bundle Deals
   */
  initBundleDeals() {
    const bundleButtons = document.querySelectorAll('.bundle-deal__action .btn');
    
    bundleButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        const bundleEl = button.closest('.bundle-deal');
        const productIds = bundleEl.dataset.productIds?.split(',') || [];
        
        if (productIds.length === 0) return;
        
        this.addBundleToCart(productIds, button);
      });
    });
  }

  /**
   * Inicializa Frequently Bought Together
   */
  initFrequentlyBought() {
    const checkboxes = document.querySelectorAll('.frequently-bought__checkbox');
    const addButton = document.querySelector('.frequently-bought__action .btn');
    
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateFrequentlyBoughtTotal();
        const card = checkbox.closest('.frequently-bought__item').querySelector('.frequently-bought__item-card');
        card.classList.toggle('selected', checkbox.checked);
      });
    });

    if (addButton) {
      addButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const selectedIds = this.getSelectedProducts();
        if (selectedIds.length > 0) {
          await this.addMultipleToCart(selectedIds, addButton);
        }
      });
    }

    // Inicializar total
    this.updateFrequentlyBoughtTotal();
  }

  /**
   * Inicializa Quick Add de Cross-sell Items
   */
  initQuickAdd() {
    const quickAddButtons = document.querySelectorAll('.cross-sell-item__action .btn');
    
    quickAddButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        const item = button.closest('.cross-sell-item');
        const variantId = item.dataset.variantId;
        
        if (variantId) {
          await this.addToCart(variantId, 1, button);
        }
      });
    });
  }

  /**
   * Obtiene productos seleccionados en Frequently Bought
   */
  getSelectedProducts() {
    const checkboxes = document.querySelectorAll('.frequently-bought__checkbox:checked');
    return Array.from(checkboxes).map(cb => ({
      id: cb.value,
      quantity: 1
    }));
  }

  /**
   * Actualiza el total de Frequently Bought Together
   */
  updateFrequentlyBoughtTotal() {
    const checkboxes = document.querySelectorAll('.frequently-bought__checkbox:checked');
    let total = 0;
    
    checkboxes.forEach(checkbox => {
      const item = checkbox.closest('.frequently-bought__item');
      const priceEl = item.querySelector('.frequently-bought__item-price');
      const price = parseFloat(priceEl.dataset.price || 0);
      total += price;
    });

    const totalEl = document.querySelector('.frequently-bought__total-price');
    if (totalEl) {
      const currency = totalEl.dataset.currency || '$';
      totalEl.textContent = `${currency}${this.formatPrice(total)}`;
    }
  }

  /**
   * Agrega un bundle completo al carrito
   */
  async addBundleToCart(productIds, button) {
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Agregando...';

    try {
      const items = productIds.map(id => ({
        id: id.trim(),
        quantity: 1
      }));

      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items })
      });

      if (response.ok) {
        button.textContent = '✓ Agregado';
        this.showSuccessNotification('Bundle agregado al carrito');
        this.updateCartCount();
        
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 2000);
      } else {
        throw new Error('Error al agregar bundle');
      }
    } catch (error) {
      console.error('Error:', error);
      button.textContent = 'Error';
      this.showErrorNotification('No se pudo agregar al carrito');
      
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 2000);
    }
  }

  /**
   * Agrega múltiples productos al carrito
   */
  async addMultipleToCart(items, button) {
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Agregando...';

    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items })
      });

      if (response.ok) {
        button.textContent = '✓ Agregados';
        this.showSuccessNotification(`${items.length} productos agregados al carrito`);
        this.updateCartCount();
        
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 2000);
      } else {
        throw new Error('Error al agregar productos');
      }
    } catch (error) {
      console.error('Error:', error);
      button.textContent = 'Error';
      this.showErrorNotification('No se pudieron agregar los productos');
      
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 2000);
    }
  }

  /**
   * Agrega un solo producto al carrito
   */
  async addToCart(variantId, quantity, button) {
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Agregando...';

    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: variantId,
          quantity: quantity
        })
      });

      if (response.ok) {
        button.textContent = '✓ Agregado';
        this.showSuccessNotification('Producto agregado al carrito');
        this.updateCartCount();
        
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 2000);
      } else {
        throw new Error('Error al agregar producto');
      }
    } catch (error) {
      console.error('Error:', error);
      button.textContent = 'Error';
      this.showErrorNotification('No se pudo agregar al carrito');
      
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 2000);
    }
  }

  /**
   * Actualiza el contador del carrito y el drawer
   */
  async updateCartCount() {
    try {
      const response = await fetch(`${window.routes.cart_url}?section_id=cart-icon-bubble`);
      const sectionHtml = await response.text();
      const parsed = new DOMParser().parseFromString(sectionHtml, 'text/html');
      const sourceEl = parsed.querySelector('.shopify-section');
      const targetEl = document.getElementById('cart-icon-bubble');

      if (targetEl && sourceEl) {
        targetEl.innerHTML = sourceEl.innerHTML;
      }

      // Publish cart update event to refresh cart drawer contents
      if (typeof publish === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
        const cartResponse = await fetch('/cart.js');
        const cartData = await cartResponse.json();
        publish(PUB_SUB_EVENTS.cartUpdate, { source: 'cross-sell', cartData: cartData });
      }
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  }

  /**
   * Muestra notificación de éxito
   */
  showSuccessNotification(message) {
    this.showNotification(message, 'success');
  }

  /**
   * Muestra notificación de error
   */
  showErrorNotification(message) {
    this.showNotification(message, 'error');
  }

  /**
   * Muestra notificación genérica
   */
  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${type === 'success' ? 'var(--success)' : 'var(--error)'};
      color: #fff;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      z-index: 9999;
      animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('slide-out-animation');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  /**
   * Formatea precio
   */
  formatPrice(price) {
    // Price is already in cents in Shopify, divide by 100
    return (price / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CrossSell();
  });
} else {
  new CrossSell();
}

// Reinicializar cuando Shopify carga secciones en el theme editor
if (Shopify && Shopify.designMode) {
  document.addEventListener('shopify:section:load', () => {
    new CrossSell();
  });
}
