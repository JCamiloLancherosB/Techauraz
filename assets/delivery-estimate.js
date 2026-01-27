/**
 * =============================================================================
 * DELIVERY ESTIMATE MODULE
 * =============================================================================
 * Handles real-time countdown for cut-off shipping and delivery date estimates.
 * 
 * Features:
 * - Configurable cut-off time (default: 2:00 PM Colombia time)
 * - Excludes Sundays from business days calculation
 * - Shows honest "estimated/aprox." delivery dates
 * - Updates countdown timer every second
 * 
 * Usage: Initialize with DeliveryEstimate.init()
 */

(function() {
  'use strict';

  const DeliveryEstimate = {
    // Configuration (Colombia timezone: UTC-5)
    config: {
      cutoffHour: 14, // 2:00 PM (24h format)
      cutoffMinute: 0,
      minBusinessDays: 2,
      maxBusinessDays: 5,
      timezone: 'America/Bogota',
      locale: 'es-CO'
    },

    /**
     * Initialize the delivery estimate module
     */
    init: function() {
      const container = document.querySelector('.pdp-delivery-estimate');
      if (!container) return;

      this.container = container;
      this.countdownEl = container.querySelector('.delivery-estimate__countdown-time');
      this.cutoffMessageEl = container.querySelector('.delivery-estimate__cutoff-message');
      this.dateRangeEl = container.querySelector('.delivery-estimate__date-range');

      this.update();
      // Update every second for live countdown
      this.intervalId = setInterval(() => this.update(), 1000);
    },

    /**
     * Get current time in Colombia timezone
     */
    getNow: function() {
      return new Date(new Date().toLocaleString('en-US', { timeZone: this.config.timezone }));
    },

    /**
     * Check if a date is a Sunday
     */
    isSunday: function(date) {
      return date.getDay() === 0;
    },

    /**
     * Check if current time is before cut-off
     */
    isBeforeCutoff: function() {
      const now = this.getNow();
      const cutoffToday = new Date(now);
      cutoffToday.setHours(this.config.cutoffHour, this.config.cutoffMinute, 0, 0);
      
      // Also check it's not Sunday
      return now < cutoffToday && !this.isSunday(now);
    },

    /**
     * Get time remaining until cut-off
     */
    getTimeUntilCutoff: function() {
      const now = this.getNow();
      const cutoffToday = new Date(now);
      cutoffToday.setHours(this.config.cutoffHour, this.config.cutoffMinute, 0, 0);

      const diff = cutoffToday - now;
      if (diff <= 0) return null;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    },

    /**
     * Add business days to a date (excluding Sundays)
     */
    addBusinessDays: function(startDate, days) {
      const result = new Date(startDate);
      let added = 0;

      while (added < days) {
        result.setDate(result.getDate() + 1);
        // Skip Sundays (0 = Sunday)
        if (result.getDay() !== 0) {
          added++;
        }
      }

      return result;
    },

    /**
     * Format date for display
     */
    formatDate: function(date) {
      const options = { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short'
      };
      return date.toLocaleDateString(this.config.locale, options);
    },

    /**
     * Get the shipping start date
     * If before cutoff on a non-Sunday, shipping starts today
     * Otherwise, shipping starts next business day
     */
    getShippingStartDate: function() {
      const now = this.getNow();
      
      if (this.isBeforeCutoff()) {
        return now;
      }

      // If after cutoff or Sunday, find next business day
      const nextDay = new Date(now);
      nextDay.setDate(nextDay.getDate() + 1);
      
      // Skip Sunday if it falls on Sunday
      while (this.isSunday(nextDay)) {
        nextDay.setDate(nextDay.getDate() + 1);
      }
      
      return nextDay;
    },

    /**
     * Calculate estimated delivery date range
     */
    getDeliveryDateRange: function() {
      const shippingStart = this.getShippingStartDate();
      
      const minDate = this.addBusinessDays(shippingStart, this.config.minBusinessDays);
      const maxDate = this.addBusinessDays(shippingStart, this.config.maxBusinessDays);

      return {
        min: this.formatDate(minDate),
        max: this.formatDate(maxDate)
      };
    },

    /**
     * Pad number with leading zero
     */
    pad: function(num) {
      return String(num).padStart(2, '0');
    },

    /**
     * Update the display
     */
    update: function() {
      if (!this.container) return;

      const isBeforeCutoff = this.isBeforeCutoff();
      const timeRemaining = this.getTimeUntilCutoff();
      const dateRange = this.getDeliveryDateRange();

      // Update countdown section
      if (this.cutoffMessageEl && this.countdownEl) {
        if (isBeforeCutoff && timeRemaining) {
          this.cutoffMessageEl.classList.remove('delivery-estimate--hidden');
          this.countdownEl.textContent = 
            `${this.pad(timeRemaining.hours)}:${this.pad(timeRemaining.minutes)}:${this.pad(timeRemaining.seconds)}`;
        } else {
          this.cutoffMessageEl.classList.add('delivery-estimate--hidden');
        }
      }

      // Update date range
      if (this.dateRangeEl) {
        this.dateRangeEl.textContent = `${dateRange.min} - ${dateRange.max}`;
      }
    },

    /**
     * Clean up interval when needed
     */
    destroy: function() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DeliveryEstimate.init());
  } else {
    DeliveryEstimate.init();
  }

  // Expose for external access if needed
  window.DeliveryEstimate = DeliveryEstimate;
})();
