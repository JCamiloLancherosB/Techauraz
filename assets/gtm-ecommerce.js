/**
 * GTM Enhanced E-Commerce — TechAuraz 2026
 * 
 * Hidden tip: Google Ads Smart Bidding uses these events to optimize ROAS.
 * Without them, the algorithm is blind to conversion value.
 * 
 * Events implemented:
 * - view_item: When a product page loads
 * - add_to_cart: When user clicks "Add to Cart"
 * - begin_checkout: When user proceeds to checkout
 * - view_item_list: When collection page loads
 * 
 * All events follow GA4 enhanced e-commerce spec.
 */
(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];

  // ===== Helper: Extract product data from page =====
  function getProductFromMeta() {
    // Shopify populates meta tags with product data
    var meta = document.querySelector('meta[property="og:title"]');
    var priceMeta = document.querySelector('meta[property="product:price:amount"]');
    var currencyMeta = document.querySelector('meta[property="product:price:currency"]');
    var imgMeta = document.querySelector('meta[property="og:image"]');

    if (!priceMeta) return null;

    return {
      item_name: meta ? meta.content : document.title,
      item_id: location.pathname.split('/').pop(),
      price: parseFloat(priceMeta.content) || 0,
      currency: currencyMeta ? currencyMeta.content : 'COP',
      item_brand: 'TechAuraz',
      item_category: getCategory(),
      image_url: imgMeta ? imgMeta.content : '',
      quantity: 1
    };
  }

  function getCategory() {
    // Try to extract from breadcrumbs or product type
    var breadcrumb = document.querySelector('.breadcrumbs__link:nth-child(2), .breadcrumbs a:nth-child(2)');
    if (breadcrumb) return breadcrumb.textContent.trim();

    var type = document.querySelector('[data-product-type]');
    if (type) return type.dataset.productType;

    return 'Accesorios';
  }

  // ===== 1. view_item — Product page =====
  if (/\/products\//.test(location.pathname)) {
    // Wait for page to settle (after Shopify injects meta)
    setTimeout(function () {
      var product = getProductFromMeta();
      if (product) {
        window.dataLayer.push({
          event: 'view_item',
          ecommerce: {
            currency: product.currency,
            value: product.price,
            items: [product]
          }
        });
      }
    }, 500);
  }

  // ===== 2. view_item_list — Collection page =====
  if (/\/collections\//.test(location.pathname)) {
    setTimeout(function () {
      var cards = document.querySelectorAll('.card-wrapper, .product-card, [class*="card-product"]');
      var items = [];
      cards.forEach(function (card, i) {
        var link = card.querySelector('a[href*="/products/"]');
        var priceEl = card.querySelector('.price-item--regular, .price-item, .money');
        var titleEl = card.querySelector('.card__heading, .card-information__text, h3');

        if (link && titleEl) {
          items.push({
            item_name: titleEl.textContent.trim(),
            item_id: link.href.split('/products/').pop().split('?')[0],
            price: priceEl ? parseFloat(priceEl.textContent.replace(/[^\d.]/g, '')) || 0 : 0,
            currency: 'COP',
            item_brand: 'TechAuraz',
            item_list_name: document.title.split('|')[0].trim(),
            index: i
          });
        }
      });

      if (items.length > 0) {
        window.dataLayer.push({
          event: 'view_item_list',
          ecommerce: {
            item_list_name: document.title.split('|')[0].trim(),
            items: items.slice(0, 20) // Cap at 20 to avoid oversized events
          }
        });
      }
    }, 800);
  }

  // ===== 3. add_to_cart — Button click =====
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[type="submit"][name="add"], .product-form__submit, .quick-add__submit');
    if (!btn) return;

    // Extract product info from the form
    var form = btn.closest('form');
    var product = getProductFromMeta();

    // For quick-add, try to get from card
    if (!product && form) {
      var card = btn.closest('.card-wrapper, .product-card');
      if (card) {
        var titleEl = card.querySelector('.card__heading, h3');
        var priceEl = card.querySelector('.price-item--regular, .money');
        product = {
          item_name: titleEl ? titleEl.textContent.trim() : 'Unknown',
          price: priceEl ? parseFloat(priceEl.textContent.replace(/[^\d.]/g, '')) || 0 : 0,
          currency: 'COP',
          item_brand: 'TechAuraz',
          quantity: 1
        };
      }
    }

    if (product) {
      window.dataLayer.push({
        event: 'add_to_cart',
        ecommerce: {
          currency: product.currency || 'COP',
          value: product.price,
          items: [product]
        }
      });
    }
  }, { capture: true });

  // ===== 4. begin_checkout — Checkout button =====
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[name="checkout"], a[href*="/checkout"], .cart__checkout-button');
    if (!btn) return;

    // Get cart total from the page
    var totalEl = document.querySelector('.totals__total-value, .cart-drawer__footer .price, [data-cart-total]');
    var total = totalEl ? parseFloat(totalEl.textContent.replace(/[^\d.]/g, '')) || 0 : 0;

    window.dataLayer.push({
      event: 'begin_checkout',
      ecommerce: {
        currency: 'COP',
        value: total
      }
    });
  }, { capture: true });

  // ===== 5. Homepage engagement =====
  if (location.pathname === '/' || location.pathname === '') {
    window.dataLayer.push({
      event: 'page_view_enhanced',
      page_type: 'home',
      page_title: document.title,
      user_returning: document.cookie.indexOf('_shopify_s=') > -1
    });
  }
})();
