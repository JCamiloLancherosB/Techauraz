/* =============================================================================
   SOCIAL PROOF TOAST — TechAura Prompt 8
   
   Floating purchase notifications that show real-time social proof.
   Rotates through realistic Colombian buyer data.
   Auto-dismiss after 4s, rate-limited, max 5 per session.
   ============================================================================= */

(function () {
    'use strict';

    // Configuration
    var CONFIG = {
        initialDelayMin: 8000,  // 8-12s before first toast (randomized)
        initialDelayMax: 12000,
        intervalMin: 25000,     // 25-40s between toasts (randomized)
        intervalMax: 40000,
        displayDuration: 4000,  // 4s visible
        maxToasts: 5,           // stop after 5 toasts per session
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
            '    <span class="ta-social-toast__verified">Compra verificada</span>',
            '  </div>',
            '</div>'
        ].join('');
        document.body.appendChild(toastEl);

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
            imgContainer.innerHTML = '<img src="' + product.image + '" alt="" width="48" height="48" loading="lazy">';
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

    function randBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function scheduleNext() {
        var delay = randBetween(CONFIG.intervalMin, CONFIG.intervalMax);
        setTimeout(function () {
            showToast();
            if (toastCount < CONFIG.maxToasts) {
                scheduleNext();
            }
        }, delay);
    }

    function init() {
        // Don't show on checkout or cart pages
        if (location.pathname.includes('/checkout') || location.pathname.includes('/cart')) return;

        collectProducts();
        if (products.length === 0) return;

        createToastContainer();

        // Start rotation with randomized initial delay
        var initialDelay = randBetween(CONFIG.initialDelayMin, CONFIG.initialDelayMax);
        setTimeout(function () {
            showToast();
            if (toastCount < CONFIG.maxToasts) {
                scheduleNext();
            }
        }, initialDelay);
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 2000);
    }
})();
