/* =============================================================================
   SOCIAL PROOF TOAST — TechAura 2030
   
   Floating purchase notifications that show real-time social proof.
   Rotates through realistic Colombian buyer data.
   Auto-dismiss, rate-limited, mobile-optimized.
   ============================================================================= */

(function () {
    'use strict';

    // Configuration
    var CONFIG = {
        initialDelay: 12000,    // 12s before first toast
        interval: 35000,        // 35s between toasts
        displayDuration: 6000,  // 6s visible
        maxToasts: 20,          // stop after N toasts per session
    };

    // Realistic Colombian buyer data
    var NAMES = [
        'María', 'Carlos', 'Laura', 'Andrés', 'Valentina', 'Sebastián',
        'Daniela', 'Santiago', 'Camila', 'Diego', 'Isabella', 'Juan',
        'Sofía', 'Alejandro', 'Natalia', 'Felipe', 'Mariana', 'David',
        'Paula', 'Nicolás', 'Ana', 'Miguel', 'Juliana', 'Esteban'
    ];

    var CITIES = [
        'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena',
        'Bucaramanga', 'Pereira', 'Santa Marta', 'Manizales', 'Ibagué',
        'Villavicencio', 'Cúcuta', 'Neiva', 'Armenia', 'Pasto',
        'Montería', 'Popayán', 'Tunja', 'Sincelejo', 'Valledupar'
    ];

    var TIMES = [
        'hace 2 min', 'hace 5 min', 'hace 8 min', 'hace 12 min',
        'hace 15 min', 'hace 20 min', 'hace 25 min', 'hace 30 min',
        'hace 1 hora', 'hace 2 horas'
    ];

    var toastCount = 0;
    var toastEl = null;
    var products = [];

    function rand(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function collectProducts() {
        var cards = document.querySelectorAll('.card-wrapper.product-card-wrapper');
        cards.forEach(function (card) {
            var title = card.querySelector('.card__heading, .card-information__text a');
            var img = card.querySelector('.card__media img, .media img');
            var price = card.querySelector('.price-item--regular, .price-item--sale');
            if (title && img) {
                products.push({
                    title: (title.textContent || '').trim().substring(0, 40),
                    image: img.getAttribute('src') || img.getAttribute('data-srcset')?.split(' ')[0] || '',
                    price: price ? price.textContent.trim() : '',
                });
            }
        });
    }

    function createToastContainer() {
        toastEl = document.createElement('div');
        toastEl.className = 'ta-social-toast';
        toastEl.setAttribute('role', 'status');
        toastEl.setAttribute('aria-live', 'polite');
        toastEl.innerHTML = [
            '<div class="ta-social-toast__inner">',
            '  <button class="ta-social-toast__close" aria-label="Cerrar">&times;</button>',
            '  <div class="ta-social-toast__image"></div>',
            '  <div class="ta-social-toast__content">',
            '    <p class="ta-social-toast__message"></p>',
            '    <p class="ta-social-toast__detail"></p>',
            '  </div>',
            '</div>'
        ].join('');
        document.body.appendChild(toastEl);

        // Close button
        toastEl.querySelector('.ta-social-toast__close').addEventListener('click', function () {
            hideToast();
        });
    }

    function showToast() {
        if (toastCount >= CONFIG.maxToasts || products.length === 0) return;

        var product = rand(products);
        var name = rand(NAMES);
        var city = rand(CITIES);
        var time = rand(TIMES);

        // Update content
        var imgContainer = toastEl.querySelector('.ta-social-toast__image');
        if (product.image) {
            imgContainer.innerHTML = '<img src="' + product.image + '" alt="" width="56" height="56" loading="lazy">';
        }
        toastEl.querySelector('.ta-social-toast__message').textContent =
            name + ' de ' + city + ' compró';
        toastEl.querySelector('.ta-social-toast__detail').textContent =
            product.title + ' · ' + time;

        // Show
        toastEl.classList.add('ta-social-toast--visible');
        toastCount++;

        // Auto-hide
        setTimeout(hideToast, CONFIG.displayDuration);
    }

    function hideToast() {
        if (toastEl) {
            toastEl.classList.remove('ta-social-toast--visible');
        }
    }

    function init() {
        // Don't show on checkout or cart pages
        if (location.pathname.includes('/checkout') || location.pathname.includes('/cart')) return;

        collectProducts();
        if (products.length === 0) return;

        createToastContainer();

        // Start rotation
        setTimeout(function () {
            showToast();
            setInterval(showToast, CONFIG.interval);
        }, CONFIG.initialDelay);
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 2000);
    }
})();
