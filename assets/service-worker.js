/**
 * Service Worker — TechAuraz 2026
 * 
 * Hidden tip: Service workers enable:
 * 1. Offline fallback page (shows cached content when network fails)
 * 2. Asset caching (CSS, JS, fonts load from cache → faster repeat visits)
 * 3. Background sync for cart actions
 * 4. PWA installability requirement
 * 
 * Strategy: Stale-While-Revalidate for assets, Network-First for HTML
 */

var CACHE_NAME = 'techauraz-v1';
var OFFLINE_URL = '/offline';

// Assets to pre-cache on install
var PRE_CACHE = [
  '/',
];

// Install: pre-cache critical assets
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRE_CACHE);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

// Activate: clean old caches
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) { return key !== CACHE_NAME; })
            .map(function (key) { return caches.delete(key); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// Fetch: Network-first for HTML, Cache-first for assets
self.addEventListener('fetch', function (event) {
  var request = event.request;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Skip Shopify admin, checkout, and external domains
  var url = new URL(request.url);
  if (url.pathname.startsWith('/admin') ||
      url.pathname.startsWith('/checkout') ||
      url.pathname.startsWith('/cart') ||
      url.origin !== self.location.origin) return;

  // HTML pages: Network-first with offline fallback
  if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request).then(function (response) {
        // Cache successful HTML responses
        if (response.ok) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request, clone);
          });
        }
        return response;
      }).catch(function () {
        // Offline: serve from cache
        return caches.match(request).then(function (cached) {
          return cached || caches.match('/');
        });
      })
    );
    return;
  }

  // Static assets (CSS, JS, images, fonts): Stale-While-Revalidate
  if (/\.(css|js|woff2?|png|jpg|jpeg|webp|avif|svg|gif|ico)(\?|$)/.test(url.pathname) ||
      url.hostname === 'cdn.shopify.com') {
    event.respondWith(
      caches.match(request).then(function (cached) {
        var networkFetch = fetch(request).then(function (response) {
          if (response.ok) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(request, clone);
            });
          }
          return response;
        }).catch(function () {
          return cached; // Return stale if network fails
        });
        return cached || networkFetch;
      })
    );
    return;
  }
});
