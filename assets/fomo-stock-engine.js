/* ═══════════════════════════════════════════════════════════════
   FOMO STOCK DEPLETION ENGINE — Phase 3 Revenue Protocol
   ═══════════════════════════════════════════════════════════════
   
   Stateful "decreasing stock" counter using sessionStorage.
   - Initializes random stock (4–9) per product ID
   - Depletes by 1 at random intervals (15–35s)
   - Floor: never below 2 (maintains purchase urgency)
   - Micro-animation on each decrement (pulse + red flash)
   
   Target element: [data-fomo-stock-count]
   Product ID from: [data-fomo-product-id]
   
   ~1.2KB unminified · Zero dependencies · Mobile-first
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── Config ────────────────────────────────────────── */
    var STOCK_MIN_INIT = 4;
    var STOCK_MAX_INIT = 9;
    var STOCK_FLOOR = 2;
    var TIMER_MIN_MS = 15000;
    var TIMER_MAX_MS = 35000;
    var STORAGE_PREFIX = 'ta_fomo_stock_';
    var PULSE_CLASS = 'fomo-stock--pulse';
    var PULSE_DURATION = 600; /* ms — matches CSS animation */

    /* ── DOM ────────────────────────────────────────────── */
    var container = document.querySelector('[data-fomo-product-id]');
    if (!container) return;

    var productId = container.getAttribute('data-fomo-product-id');
    var countEl = container.querySelector('[data-fomo-stock-count]');
    if (!productId || !countEl) return;

    var storageKey = STORAGE_PREFIX + productId;

    /* ── Helpers ────────────────────────────────────────── */
    function randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getStock() {
        var stored = sessionStorage.getItem(storageKey);
        if (stored !== null) {
            var val = parseInt(stored, 10);
            if (!isNaN(val) && val >= STOCK_FLOOR) return val;
        }
        /* First visit: initialize random stock */
        var initial = randInt(STOCK_MIN_INIT, STOCK_MAX_INIT);
        sessionStorage.setItem(storageKey, initial);
        return initial;
    }

    function setStock(val) {
        sessionStorage.setItem(storageKey, val);
    }

    /* ── Render ─────────────────────────────────────────── */
    function renderStock(value) {
        countEl.textContent = value;
    }

    /* ── Micro-Animation ────────────────────────────────── */
    function triggerPulse() {
        countEl.classList.remove(PULSE_CLASS);
        /* Force reflow to restart animation */
        void countEl.offsetWidth;
        countEl.classList.add(PULSE_CLASS);
        setTimeout(function () {
            countEl.classList.remove(PULSE_CLASS);
        }, PULSE_DURATION);
    }

    /* ── Depletion Loop ─────────────────────────────────── */
    function scheduleDepletion() {
        var delay = randInt(TIMER_MIN_MS, TIMER_MAX_MS);

        setTimeout(function () {
            var current = getStock();
            if (current > STOCK_FLOOR) {
                var next = current - 1;
                setStock(next);
                renderStock(next);
                triggerPulse();
            }
            /* Schedule next depletion (even if we hit floor — keeps timer alive for future) */
            scheduleDepletion();
        }, delay);
    }

    /* ── Initialize ─────────────────────────────────────── */
    var initialStock = getStock();
    renderStock(initialStock);
    scheduleDepletion();
})();
