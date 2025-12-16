// ============================================
// CÓDIGO OPTIMIZADO PARA TECHAURA
// ============================================

// --- 1. Sticky Bar (OPTIMIZADO CON THROTTLE) ---
(function() {
  const stickyBar = document.getElementById('sticky-atc-bar');
  const productForm = document.querySelector('.product-form');

  if (!stickyBar || !productForm) return;

  const showBarThreshold = productForm.offsetTop + productForm.offsetHeight;
  let ticking = false;

  function toggleStickyBar() {
    const scrollY = window.scrollY;
    if (scrollY > showBarThreshold) {
      stickyBar.classList.add('visible');
    } else {
      stickyBar.classList.remove('visible');
    }
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      window.requestAnimationFrame(toggleStickyBar);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true });
})();

// --- 2. Frequently Bought Together (OPTIMIZADO) ---
(function() {
  const fbtContainer = document.getElementById('frequently-bought-together');
  if (!fbtContainer) return;

  // Get dynamic data from data attributes
  const mainProductPrice = parseInt(fbtContainer.dataset.mainPrice || '0', 10);
  const mainVariantId = parseInt(fbtContainer.dataset.mainVariantId || '0', 10);
  const moneyFormat = fbtContainer.dataset.moneyFormat || '${{amount}}';
  
  const checkboxes = fbtContainer.querySelectorAll('.fbt-checkbox');
  const totalPriceEl = document.getElementById('fbt-total-price');
  const addAllButton = document.getElementById('fbt-add-all-to-cart');

  if (!totalPriceEl || !addAllButton) return;

  function updateTotalPrice() {
    let newTotal = mainProductPrice;
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        newTotal += parseInt(checkbox.dataset.price, 10);
      }
    });
    
    if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
      totalPriceEl.textContent = Shopify.formatMoney(newTotal, moneyFormat);
    } else {
      totalPriceEl.textContent = (newTotal / 100).toFixed(2);
    }
  }

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateTotalPrice);
  });

  addAllButton.addEventListener('click', function() {
    let itemsToAdd = [{
      id: mainVariantId,
      quantity: 1
    }];

    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        itemsToAdd.push({
          id: parseInt(checkbox.dataset.variantId, 10),
          quantity: 1
        });
      }
    });
    
    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: itemsToAdd })
    })
    .then(response => response.json())
    .then(() => window.location.href = '/cart')
    .catch(error => console.error('Error:', error));
  });

  updateTotalPrice();
})();

// --- 3. Tarjetas Clickeables (OPTIMIZADO - SIN REFLOW) ---
(function() {
  // Usar IntersectionObserver para cargar solo las tarjetas visibles
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const productLink = card.querySelector('.card__heading a, .full-unstyled-link');
        
        if (productLink && !card.hasAttribute('data-clickable')) {
          const productUrl = productLink.href;
          
          // Hacer clickeable sin agregar elementos extra
          card.style.cursor = 'pointer';
          card.setAttribute('data-clickable', 'true');
          
          card.addEventListener('click', function(e) {
            // Ignorar clicks en botones y badges
            if (e.target.closest('.quick-add__submit, button, .card__badge')) {
              return;
            }
            window.location.href = productUrl;
          });
          
          observer.unobserve(card);
        }
      }
    });
  }, { rootMargin: '50px' });

  // Observar todas las tarjetas
  document.querySelectorAll('.card-wrapper').forEach(card => {
    observer.observe(card);
  });
})();