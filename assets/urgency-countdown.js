/**
 * Urgency Elements — TechAuraz Prompt 8
 * 
 * 1. Countdown timer with digit cards (DD:HH:MM:SS), flip animation
 * 2. Product views counter with pulsing dot
 * 3. Low-stock indicator with progress bar
 */
(function () {
  'use strict';

  /* =============================================================================
     1. COUNTDOWN TIMER — Digit card blocks with flip
     ============================================================================= */
  function initCountdown() {
    var countdownEl = document.querySelector('.countdown-timer');
    if (!countdownEl) return;

    var endDate = new Date(countdownEl.dataset.endDate);
    if (!endDate || isNaN(endDate.getTime())) return;

    var intervalId = null;

    function updateCountdown() {
      var now = new Date();
      var distance = endDate - now;

      if (distance < 0) {
        countdownEl.innerHTML = '<span class="urgency-value">¡Oferta terminada!</span>';
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        return;
      }

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      var daysEl = countdownEl.querySelector('[data-days]');
      var hoursEl = countdownEl.querySelector('[data-hours]');
      var minutesEl = countdownEl.querySelector('[data-minutes]');
      var secondsEl = countdownEl.querySelector('[data-seconds]');

      function updateDigit(el, val) {
        if (!el) return;
        var padded = String(val).padStart(2, '0');
        if (el.textContent !== padded) {
          el.classList.add('digit-flip');
          el.textContent = padded;
          setTimeout(function () { el.classList.remove('digit-flip'); }, 300);
        }
      }

      updateDigit(daysEl, days);
      updateDigit(hoursEl, hours);
      updateDigit(minutesEl, minutes);
      updateDigit(secondsEl, seconds);
    }

    updateCountdown();
    intervalId = setInterval(updateCountdown, 1000);
  }

  /* =============================================================================
     2. PRODUCT VIEWS COUNTER — Pulsing live dot, periodic updates
     ============================================================================= */
  function initViewsCounter() {
    var viewsEl = document.querySelector('.product-views-counter');
    if (!viewsEl) return;

    var countEl = viewsEl.querySelector('[data-views-count]');
    if (!countEl) return;

    // Initial count from data attribute or randomize 12-38
    var currentCount = parseInt(countEl.textContent, 10) || (Math.floor(Math.random() * 27) + 12);
    countEl.textContent = currentCount;

    // Update every 15-30 seconds (±1-3)
    function updateViews() {
      var delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
      currentCount = Math.max(5, currentCount + delta); // never below 5
      countEl.textContent = currentCount;
    }

    function scheduleUpdate() {
      var delay = (Math.floor(Math.random() * 16) + 15) * 1000; // 15-30s
      setTimeout(function () {
        updateViews();
        scheduleUpdate();
      }, delay);
    }

    scheduleUpdate();
  }

  /* =============================================================================
     3. LOW-STOCK INDICATOR — Below add-to-cart, progress bar
     ============================================================================= */
  function initLowStock() {
    var stockEl = document.querySelector('.low-stock-indicator');
    if (!stockEl) return;

    var countEl = stockEl.querySelector('[data-stock-count]');
    var barEl = stockEl.querySelector('.low-stock-indicator__bar-fill');

    if (!countEl) return;

    var stock = parseInt(countEl.textContent, 10);
    if (isNaN(stock) || stock >= 10) {
      stockEl.style.display = 'none';
      return;
    }

    // Show the indicator
    stockEl.style.display = '';

    // Update progress bar width (percentage of 10)
    if (barEl) {
      barEl.style.width = Math.max(5, (stock / 10) * 100) + '%';
    }
  }

  // Initialize all
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initCountdown();
      initViewsCounter();
      initLowStock();
    });
  } else {
    initCountdown();
    initViewsCounter();
    initLowStock();
  }
})();
