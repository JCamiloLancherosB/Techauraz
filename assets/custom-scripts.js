// ============================================
// CÓDIGO OPTIMIZADO PARA TECHAURA
// ============================================

// --- 1. Sticky Bar (OPTIMIZED - Cache layout measurements) ---
(function() {
  const stickyBar = document.getElementById('sticky-atc-bar');
  const productForm = document.querySelector('.product-form');

  if (!stickyBar || !productForm) return;

  let showBarThreshold = 0;
  let ticking = false;

  // Cache threshold after page load to avoid repeated layout reads
  function calculateThreshold() {
    // Batch DOM reads in a single requestAnimationFrame
    requestAnimationFrame(() => {
      showBarThreshold = productForm.offsetTop + productForm.offsetHeight;
    });
  }

  function toggleStickyBar() {
    const scrollY = window.scrollY;
    if (scrollY > showBarThreshold) {
      stickyBar.classList.add('visible');
    } else {
      stickyBar.classList.remove('visible');
    }
    ticking = false;
  }

  function requestStickyBarTick() {
    if (!ticking) {
      window.requestAnimationFrame(toggleStickyBar);
      ticking = true;
    }
  }

  // Calculate threshold on load and after window resize
  window.addEventListener('load', calculateThreshold);
  window.addEventListener('resize', calculateThreshold);
  calculateThreshold(); // Initial calculation

  window.addEventListener("scroll", requestStickyBarTick, { passive: true });
})();

// --- 2. Frequently Bought Together (OPTIMIZADO) ---
(function() {
  const fbtContainer = document.getElementById('frequently-bought-together');
  if (!fbtContainer) return;

  // Get product data from data attributes instead of Liquid
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
    
    // Use Shopify's formatMoney if available, otherwise simple fallback
    if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
      totalPriceEl.textContent = Shopify.formatMoney(newTotal, moneyFormat);
    } else {
      // Fallback: simple formatting (handles cents to dollars)
      const formatted = moneyFormat.replace('{{amount}}', (newTotal / 100).toFixed(2));
      totalPriceEl.textContent = formatted;
    }
  }

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateTotalPrice);
  });

  addAllButton.addEventListener('click', function() {
    if (!mainVariantId) return;
    
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
