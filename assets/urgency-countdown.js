/**
 * Urgency Elements - Countdown Timer
 * Moved from inline script in sections/urgency-elements.liquid
 * Initializes countdown timer using data-end-date attribute.
 */
(function() {
  'use strict';

  function initCountdown() {
    var countdownEl = document.querySelector('.countdown-timer');
    if (!countdownEl) return;
    
    var endDate = new Date(countdownEl.dataset.endDate);
    if (!endDate || isNaN(endDate.getTime())) return;
    
    function updateCountdown() {
      var now = new Date();
      var distance = endDate - now;
      
      if (distance < 0) {
        countdownEl.innerHTML = '<span class="urgency-value">¡Oferta terminada!</span>';
        return;
      }
      
      var hours = Math.floor(distance / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      var hoursEl = countdownEl.querySelector('[data-hours]');
      var minutesEl = countdownEl.querySelector('[data-minutes]');
      var secondsEl = countdownEl.querySelector('[data-seconds]');
      
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCountdown);
  } else {
    initCountdown();
  }
})();
