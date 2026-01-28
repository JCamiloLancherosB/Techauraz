/**
 * Urgency Elements - Countdown Timer
 * Moved from inline script in sections/urgency-elements.liquid
 * Initializes countdown timer using data-end-date attribute.
 * This script is loaded with defer, so DOM is ready when it executes.
 */
(function() {
  'use strict';

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
        // Clear interval to prevent memory leak
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
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
    intervalId = setInterval(updateCountdown, 1000);
  }

  // Script is loaded with defer, so DOM is already parsed
  initCountdown();
})();
