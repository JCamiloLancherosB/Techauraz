/**
 * =============================================================================
 * DELIVERY ESTIMATE MODULE
 * =============================================================================
 * Computes and displays dynamic delivery date range: "Llega entre {min} y {max}"
 * 
 * Features:
 * - Configurable via data attributes on .ta-delivery-estimate element
 * - Cut-off time: 2:00 PM America/Bogota (configurable)
 * - Business days = Mon-Fri only (excludes Sat/Sun)
 * - Locale-aware date formatting (es-CO, short month style)
 * - Fallback text when JS is disabled (noscript in Liquid)
 * 
 * Data attributes:
 * - data-min-days: Minimum delivery business days (default: 2)
 * - data-max-days: Maximum delivery business days (default: 5)
 * - data-cutoff-hour: Cut-off hour in 24h format (default: 14)
 * - data-timezone: IANA timezone (default: America/Bogota)
 * - data-locale: Locale for date formatting (default: es-CO)
 * 
 * Usage: Auto-initializes on DOMContentLoaded
 */

(function() {
  'use strict';

  // Prevent multiple initializations
  if (window.DeliveryEstimate && window.DeliveryEstimate.initialized) {
    return;
  }

  const DeliveryEstimate = {
    initialized: false,
    container: null,
    config: null,

    /**
     * Initialize the delivery estimate module
     */
    init: function() {
      // Prevent multiple initializations
      if (this.initialized) return;

      const container = document.querySelector('.ta-delivery-estimate');
      if (!container) return;

      this.container = container;
      this.dateRangeEl = container.querySelector('.ta-delivery-estimate__date-range');

      // Read configuration from data attributes
      this.config = {
        minBusinessDays: parseInt(container.dataset.minDays, 10) || 2,
        maxBusinessDays: parseInt(container.dataset.maxDays, 10) || 5,
        cutoffHour: parseInt(container.dataset.cutoffHour, 10) || 14,
        timezone: container.dataset.timezone || 'America/Bogota',
        locale: container.dataset.locale || 'es-CO'
      };

      this.update();
      this.initialized = true;
    },

    /**
     * Get current time in the configured timezone
     * Uses toLocaleString for timezone conversion - widely supported across browsers
     */
    getNow: function() {
      try {
        return new Date(new Date().toLocaleString('en-US', { timeZone: this.config.timezone }));
      } catch (e) {
        // Fallback to local time if timezone conversion fails
        return new Date();
      }
    },

    /**
     * Check if a date is a weekend (Saturday or Sunday)
     */
    isWeekend: function(date) {
      const day = date.getDay();
      return day === 0 || day === 6; // Sunday = 0, Saturday = 6
    },

    /**
     * Check if current time is before cut-off
     * Returns true if:
     * - Current time is before cutoff hour AND it's a weekday (Mon-Fri)
     */
    isBeforeCutoff: function() {
      const now = this.getNow();
      const cutoffToday = new Date(now);
      cutoffToday.setHours(this.config.cutoffHour, 0, 0, 0);

      // Before cutoff AND not a weekend
      return now < cutoffToday && !this.isWeekend(now);
    },

    /**
     * Get the starting date for delivery calculation
     * If before cutoff on a weekday → start = today
     * Else start = next calendar day (then we add business days from there)
     */
    getStartDate: function() {
      const now = this.getNow();

      if (this.isBeforeCutoff()) {
        return now;
      }

      // After cutoff or on weekend, start from next calendar day
      const nextDay = new Date(now);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay;
    },

    /**
     * Add business days to a date (Mon-Fri only, skipping Sat/Sun)
     */
    addBusinessDays: function(startDate, days) {
      const result = new Date(startDate);
      let added = 0;

      while (added < days) {
        result.setDate(result.getDate() + 1);
        // Only count weekdays (Mon=1 to Fri=5)
        if (!this.isWeekend(result)) {
          added++;
        }
      }

      return result;
    },

    /**
     * Format date for display using Intl.DateTimeFormat
     * Returns format like "30 ene" (day + short month)
     */
    formatDate: function(date) {
      try {
        const options = {
          day: 'numeric',
          month: 'short'
        };
        return date.toLocaleDateString(this.config.locale, options);
      } catch (e) {
        // Fallback formatting
        const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        return date.getDate() + ' ' + months[date.getMonth()];
      }
    },

    /**
     * Calculate estimated delivery date range
     */
    getDeliveryDateRange: function() {
      const startDate = this.getStartDate();

      const minDate = this.addBusinessDays(startDate, this.config.minBusinessDays);
      const maxDate = this.addBusinessDays(startDate, this.config.maxBusinessDays);

      return {
        min: this.formatDate(minDate),
        max: this.formatDate(maxDate)
      };
    },

    /**
     * Update the display with calculated delivery dates
     */
    update: function() {
      if (!this.container || !this.dateRangeEl) return;

      const dateRange = this.getDeliveryDateRange();
      
      // Update the text to show "Llega entre {min} y {max}"
      this.dateRangeEl.textContent = 'Llega entre ' + dateRange.min + ' y ' + dateRange.max;
    },

    /**
     * Clean up (for SPA navigation)
     */
    destroy: function() {
      this.initialized = false;
      this.container = null;
      this.dateRangeEl = null;
      this.config = null;
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      DeliveryEstimate.init();
    });
  } else {
    DeliveryEstimate.init();
  }

  // Expose for external access if needed
  window.DeliveryEstimate = DeliveryEstimate;
})();
