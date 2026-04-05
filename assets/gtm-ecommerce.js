/**
 * GTM Enhanced E-Commerce + FB Pixel — TechAuraz 2026
 * 
 * Hidden tip: Google Ads Smart Bidding uses these events to optimize ROAS.
 * Without them, the algorithm is blind to conversion value.
 * 
 * GA4 Events implemented:
 * - view_item: When a product page loads
 * - view_item_list: When collection page loads
 * - add_to_cart: When user clicks "Add to Cart"
 * - remove_from_cart: When user removes item from cart
 * - begin_checkout: When user proceeds to checkout
 * - purchase: When order is confirmed (thank-you page)
 * - page_view_enhanced: Homepage with returning user flag
 * 
 * FB Pixel Events implemented:
 * - ViewContent: Product page view
 * - AddToCart: Add to cart click
 * - InitiateCheckout: Checkout button click
 * - Purchase: Order confirmation
 * 
 * All events follow GA4 enhanced e-commerce spec.
 * FB Pixel events use waitForFBQ() to handle deferred loading.
 * Updated: 2026-04-04
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

  // ===== 6. purchase — Order confirmation / Thank-you page =====
  // Shopify exposes order data on the thank-you page via Shopify.checkout
  if (/\/thank[-_]?you|\/orders\//.test(location.pathname) || document.querySelector('[data-checkout-payment-due]')) {
    setTimeout(function () {
      var checkout = window.Shopify && window.Shopify.checkout;
      if (checkout) {
        var items = [];
        if (checkout.line_items) {
          checkout.line_items.forEach(function (item, i) {
            items.push({
              item_name: item.title || item.product_title || '',
              item_id: String(item.product_id || ''),
              item_variant: item.variant_title || '',
              price: parseFloat(item.price) || 0,
              currency: checkout.currency || 'COP',
              item_brand: 'TechAuraz',
              quantity: item.quantity || 1,
              index: i
            });
          });
        }

        var purchaseValue = parseFloat(checkout.total_price || checkout.payment_due || 0);

        window.dataLayer.push({
          event: 'purchase',
          ecommerce: {
            transaction_id: String(checkout.order_id || checkout.token || ''),
            value: purchaseValue,
            currency: checkout.currency || 'COP',
            tax: parseFloat(checkout.total_tax || 0),
            shipping: parseFloat(checkout.shipping_rate && checkout.shipping_rate.price || 0),
            items: items
          }
        });

        // FB Pixel: Purchase event
        if (typeof fbq === 'function') {
          fbq('track', 'Purchase', {
            value: purchaseValue,
            currency: checkout.currency || 'COP',
            content_ids: items.map(function (i) { return i.item_id; }),
            content_type: 'product',
            num_items: items.length
          });
        }
      }
    }, 1000);
  }

  // ===== 7. remove_from_cart — Cart quantity changes =====
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('cart-remove-button a, .cart-item__remove, [data-cart-remove]');
    if (!btn) return;

    var card = btn.closest('.cart-item, tr[id*="CartItem"]');
    if (card) {
      var titleEl = card.querySelector('.cart-item__name, .cart-item__details a');
      var priceEl = card.querySelector('.price, .cart-item__price .money');
      window.dataLayer.push({
        event: 'remove_from_cart',
        ecommerce: {
          currency: 'COP',
          items: [{
            item_name: titleEl ? titleEl.textContent.trim() : 'Unknown',
            price: priceEl ? parseFloat(priceEl.textContent.replace(/[^\d.]/g, '')) || 0 : 0,
            item_brand: 'TechAuraz',
            quantity: 1
          }]
        }
      });
    }
  }, { capture: true });

  // ===== 8. FB Pixel Standard Events (fire alongside GTM) =====
  // These fire AFTER FB Pixel has loaded (3.5s or interaction delay)
  function waitForFBQ(callback) {
    if (typeof fbq === 'function') { callback(); return; }
    var checks = 0;
    var interval = setInterval(function () {
      checks++;
      if (typeof fbq === 'function') { clearInterval(interval); callback(); }
      if (checks > 60) clearInterval(interval); // Give up after 30s
    }, 500);
  }

  // FB: ViewContent — Product page
  if (/\/products\//.test(location.pathname)) {
    waitForFBQ(function () {
      var product = getProductFromMeta();
      if (product) {
        fbq('track', 'ViewContent', {
          content_name: product.item_name,
          content_ids: [product.item_id],
          content_type: 'product',
          value: product.price,
          currency: product.currency || 'COP'
        });
      }
    });
  }

  // FB: AddToCart — Click handler (uses same selector as GTM)
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[type="submit"][name="add"], .product-form__submit, .quick-add__submit');
    if (!btn) return;

    waitForFBQ(function () {
      var product = getProductFromMeta();
      if (!product) {
        var card = btn.closest('.card-wrapper, .product-card');
        if (card) {
          var titleEl = card.querySelector('.card__heading, h3');
          var priceEl = card.querySelector('.price-item--regular, .money');
          product = {
            item_name: titleEl ? titleEl.textContent.trim() : 'Unknown',
            item_id: 'unknown',
            price: priceEl ? parseFloat(priceEl.textContent.replace(/[^\d.]/g, '')) || 0 : 0,
            currency: 'COP'
          };
        }
      }
      if (product) {
        fbq('track', 'AddToCart', {
          content_name: product.item_name,
          content_ids: [product.item_id],
          content_type: 'product',
          value: product.price,
          currency: product.currency || 'COP'
        });
      }
    });
  }, { capture: true });

  // FB: InitiateCheckout — Checkout button click
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[name="checkout"], a[href*="/checkout"], .cart__checkout-button');
    if (!btn) return;

    waitForFBQ(function () {
      var totalEl = document.querySelector('.totals__total-value, .cart-drawer__footer .price, [data-cart-total]');
      var total = totalEl ? parseFloat(totalEl.textContent.replace(/[^\d.]/g, '')) || 0 : 0;
      fbq('track', 'InitiateCheckout', {
        value: total,
        currency: 'COP'
      });
    });
  }, { capture: true });

})();
