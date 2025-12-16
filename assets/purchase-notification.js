/* ============================================
   TECHAURAZ - Purchase Notification JavaScript
   Sistema de Notificaciones de Compra Reciente
   ============================================ */

class PurchaseNotification {
  constructor(options = {}) {
    this.options = {
      enabled: options.enabled !== false,
      delay: options.delay || 5000,
      displayDuration: options.displayDuration || 8000,
      maxNotifications: options.maxNotifications || 5,
      products: options.products || [],
      locations: options.locations || ['Colombia', 'Bogotá', 'Medellín', 'Cali', 'Barranquilla'],
      ...options
    };
    
    this.notificationQueue = [];
    this.currentNotification = null;
    this.notificationCount = 0;
    
    if (this.options.enabled) {
      this.init();
    }
  }

  init() {
    this.createNotificationContainer();
    this.startNotificationCycle();
  }

  /**
   * Crea el contenedor de notificaciones
   */
  createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'purchase-notifications';
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      z-index: 9998;
      max-width: 350px;
    `;
    document.body.appendChild(container);
  }

  /**
   * Inicia el ciclo de notificaciones
   */
  startNotificationCycle() {
    // Mostrar primera notificación después del delay inicial
    setTimeout(() => {
      this.showNotification();
      
      // Continuar mostrando notificaciones
      this.intervalId = setInterval(() => {
        if (this.notificationCount < this.options.maxNotifications) {
          this.showNotification();
        } else {
          clearInterval(this.intervalId);
        }
      }, this.options.delay + this.options.displayDuration);
    }, this.options.delay);
  }

  /**
   * Muestra una notificación
   */
  showNotification() {
    const data = this.generateNotificationData();
    const notification = this.createNotification(data);
    
    const container = document.getElementById('purchase-notifications');
    container.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    // Remover después del tiempo de visualización
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, this.options.displayDuration);

    this.notificationCount++;
  }

  /**
   * Genera datos de notificación
   */
  generateNotificationData() {
    const product = this.getRandomProduct();
    const location = this.getRandomLocation();
    const timeAgo = this.getRandomTimeAgo();
    
    return {
      productName: product.name,
      productImage: product.image,
      productUrl: product.url,
      location: location,
      timeAgo: timeAgo
    };
  }

  /**
   * Crea el elemento de notificación
   */
  createNotification(data) {
    const notification = document.createElement('div');
    notification.className = 'purchase-notification';
    notification.innerHTML = `
      <a href="${data.productUrl}" class="purchase-notification__link">
        <div class="purchase-notification__content">
          <div class="purchase-notification__image">
            <img src="${data.productImage}" alt="${data.productName}" loading="lazy">
          </div>
          <div class="purchase-notification__info">
            <div class="purchase-notification__badge">✓ Compra verificada</div>
            <p class="purchase-notification__text">
              <strong>Alguien en ${data.location}</strong> compró
            </p>
            <p class="purchase-notification__product">${data.productName}</p>
            <p class="purchase-notification__time">${data.timeAgo}</p>
          </div>
        </div>
        <button class="purchase-notification__close" aria-label="Cerrar notificación">
          ×
        </button>
      </a>
    `;

    // Agregar estilos inline para asegurar que se vean correctamente
    notification.style.cssText = `
      background: var(--bg-card, #16162a);
      border: 1px solid var(--border-glow, rgba(99, 102, 241, 0.5));
      border-radius: var(--radius-lg, 0.75rem);
      box-shadow: var(--shadow-lg, 0 10px 25px rgba(0, 0, 0, 0.5));
      margin-bottom: 1rem;
      overflow: hidden;
      transform: translateX(-120%);
      transition: transform 0.3s ease, opacity 0.3s ease;
      opacity: 0;
    `;

    notification.querySelector('.purchase-notification__link').style.cssText = `
      display: block;
      text-decoration: none;
      color: inherit;
      padding: 1rem;
      position: relative;
    `;

    notification.querySelector('.purchase-notification__content').style.cssText = `
      display: flex;
      gap: 1rem;
      align-items: center;
    `;

    notification.querySelector('.purchase-notification__image').style.cssText = `
      width: 60px;
      height: 60px;
      flex-shrink: 0;
      border-radius: 0.5rem;
      overflow: hidden;
      background: var(--bg-tertiary, #252542);
    `;

    notification.querySelector('.purchase-notification__image img').style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
    `;

    notification.querySelector('.purchase-notification__info').style.cssText = `
      flex: 1;
    `;

    notification.querySelector('.purchase-notification__badge').style.cssText = `
      display: inline-block;
      padding: 0.25rem 0.5rem;
      background: var(--success, #10b981);
      color: #fff;
      font-size: 0.7rem;
      font-weight: 600;
      border-radius: 9999px;
      margin-bottom: 0.5rem;
    `;

    notification.querySelector('.purchase-notification__text').style.cssText = `
      font-size: 0.85rem;
      color: var(--text-secondary, #94a3b8);
      margin: 0.25rem 0;
    `;

    notification.querySelector('.purchase-notification__product').style.cssText = `
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-primary, #f8fafc);
      margin: 0.25rem 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    `;

    notification.querySelector('.purchase-notification__time').style.cssText = `
      font-size: 0.75rem;
      color: var(--text-muted, #64748b);
      margin: 0.25rem 0;
    `;

    notification.querySelector('.purchase-notification__close').style.cssText = `
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: none;
      border: none;
      color: var(--text-muted, #64748b);
      font-size: 1.5rem;
      cursor: pointer;
      line-height: 1;
      padding: 0.25rem;
      opacity: 0.6;
      transition: opacity 0.2s ease;
    `;

    // Agregar clase show para animación
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .purchase-notification.show {
        transform: translateX(0) !important;
        opacity: 1 !important;
      }
      .purchase-notification__close:hover {
        opacity: 1 !important;
      }
    `;
    if (!document.getElementById('purchase-notification-styles')) {
      styleElement.id = 'purchase-notification-styles';
      document.head.appendChild(styleElement);
    }

    // Evento de cierre
    const closeBtn = notification.querySelector('.purchase-notification__close');
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    });

    return notification;
  }

  /**
   * Obtiene un producto aleatorio
   */
  getRandomProduct() {
    if (this.options.products.length === 0) {
      return {
        name: 'Audífonos Bluetooth',
        image: '/cdn/shop/files/default-product.jpg',
        url: '/products/audifonos-bluetooth'
      };
    }
    return this.options.products[Math.floor(Math.random() * this.options.products.length)];
  }

  /**
   * Obtiene una ubicación aleatoria
   */
  getRandomLocation() {
    return this.options.locations[Math.floor(Math.random() * this.options.locations.length)];
  }

  /**
   * Obtiene un tiempo aleatorio
   */
  getRandomTimeAgo() {
    const times = [
      'Hace 2 minutos',
      'Hace 5 minutos',
      'Hace 10 minutos',
      'Hace 15 minutos',
      'Hace 30 minutos',
      'Hace 1 hora',
      'Hace 2 horas'
    ];
    return times[Math.floor(Math.random() * times.length)];
  }

  /**
   * Detiene las notificaciones
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  /**
   * Destruye el sistema de notificaciones
   */
  destroy() {
    this.stop();
    const container = document.getElementById('purchase-notifications');
    if (container) {
      container.remove();
    }
  }
}

// Inicializar automáticamente si hay configuración en el tema
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPurchaseNotifications);
} else {
  initPurchaseNotifications();
}

function initPurchaseNotifications() {
  // Verificar si las notificaciones están habilitadas en la sección
  const notificationSection = document.querySelector('[data-purchase-notifications]');
  
  if (notificationSection) {
    const config = {
      enabled: notificationSection.dataset.enabled !== 'false',
      products: JSON.parse(notificationSection.dataset.products || '[]'),
      delay: parseInt(notificationSection.dataset.delay) || 5000,
      displayDuration: parseInt(notificationSection.dataset.displayDuration) || 8000,
      maxNotifications: parseInt(notificationSection.dataset.maxNotifications) || 5
    };
    
    window.purchaseNotifications = new PurchaseNotification(config);
  }
}

// Exportar para uso programático
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PurchaseNotification;
}
