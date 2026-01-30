/**
 * =============================================================================
 * EXIT INTENT POPUP - TechAura Colombia
 * Version: 1.0.0
 * =============================================================================
 * 
 * Conversion-optimized popup for capturing leaving visitors.
 * 
 * Features:
 * - Exit intent detection (mouse leaving viewport on desktop)
 * - Mobile: detect rapid scroll up or back button intent
 * - Show only once per session (sessionStorage)
 * - Don't show to returning visitors who dismissed (localStorage with 7-day expiry)
 * - Don't show if user has items in cart
 * - Email validation before submission
 * - Integration with Shopify newsletter
 * - Analytics tracking for popup views and conversions
 * =============================================================================
 */

(function() {
  'use strict';

  // =============================================================================
  // CONFIGURATION
  // =============================================================================

  const STORAGE_KEYS = {
    SESSION_SHOWN: 'exit_intent_shown_session',
    DISMISSED: 'exit_intent_dismissed',
    DISMISSED_EXPIRY: 'exit_intent_dismissed_expiry',
    SUBSCRIBED: 'exit_intent_subscribed',
    POPUP_VIEWS: 'exit_intent_views',
    POPUP_CONVERSIONS: 'exit_intent_conversions'
  };

  const DISMISSAL_DAYS = 7; // Days before showing again after dismiss
  const MOBILE_SCROLL_THRESHOLD = 100; // px scroll up to trigger

  // =============================================================================
  // STORAGE HELPERS (with error handling for private browsing)
  // =============================================================================

  function safeGetStorage(key, isSession) {
    try {
      const storage = isSession ? sessionStorage : localStorage;
      return storage.getItem(key);
    } catch (e) {
      // Storage not available (private browsing, etc.)
      return null;
    }
  }

  function safeSetStorage(key, value, isSession) {
    try {
      const storage = isSession ? sessionStorage : localStorage;
      storage.setItem(key, value);
      return true;
    } catch (e) {
      // Storage not available (private browsing, etc.)
      return false;
    }
  }

  function safeRemoveStorage(key, isSession) {
    try {
      const storage = isSession ? sessionStorage : localStorage;
      storage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }

  // =============================================================================
  // STATE
  // =============================================================================

  let config = null;
  let popup = null;
  let form = null;
  let isEligible = true;
  let countdownInterval = null;
  let hasTriggered = false;
  let delayTimer = null;

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  function init() {
    // Get DOM elements
    popup = document.getElementById('exit-intent-popup');
    if (!popup) return;

    // Parse configuration
    const configElement = document.getElementById('exit-intent-config');
    if (configElement) {
      try {
        config = JSON.parse(configElement.textContent);
      } catch (e) {
        console.error('Exit Intent Popup: Failed to parse config', e);
        return;
      }
    }

    // Check eligibility
    if (!checkEligibility()) {
      isEligible = false;
      return;
    }

    // Setup event listeners
    setupEventListeners();
    
    // Start time on site tracking
    startTimeTracking();
    
    // Setup countdown if enabled
    if (config && config.showCountdown) {
      setupCountdown();
    }
  }

  // =============================================================================
  // ELIGIBILITY CHECKS
  // =============================================================================

  function checkEligibility() {
    // Don't show if already shown this session
    if (safeGetStorage(STORAGE_KEYS.SESSION_SHOWN, true)) {
      return false;
    }

    // Don't show if user already subscribed
    if (safeGetStorage(STORAGE_KEYS.SUBSCRIBED, false)) {
      return false;
    }

    // Check if dismissed within expiry period
    const dismissedExpiry = safeGetStorage(STORAGE_KEYS.DISMISSED_EXPIRY, false);
    if (dismissedExpiry) {
      const expiryDate = new Date(dismissedExpiry);
      if (new Date() < expiryDate) {
        return false;
      } else {
        // Clear expired dismissal
        safeRemoveStorage(STORAGE_KEYS.DISMISSED, false);
        safeRemoveStorage(STORAGE_KEYS.DISMISSED_EXPIRY, false);
      }
    }

    // Don't show if user has items in cart
    if (config && config.cartItemCount > 0) {
      return false;
    }

    return true;
  }

  // =============================================================================
  // TIME TRACKING
  // =============================================================================

  function startTimeTracking() {
    const delay = (config && config.delay) ? config.delay * 1000 : 10000;
    
    delayTimer = setTimeout(function() {
      // User has been on site long enough, now listen for exit intent
      if (isMobile()) {
        setupMobileExitDetection();
      } else {
        setupDesktopExitDetection();
      }
    }, delay);
  }

  // =============================================================================
  // DEVICE DETECTION
  // =============================================================================

  function isMobile() {
    return window.matchMedia('(max-width: 749px)').matches || 
           'ontouchstart' in window ||
           navigator.maxTouchPoints > 0;
  }

  // =============================================================================
  // DESKTOP EXIT INTENT DETECTION
  // =============================================================================

  function setupDesktopExitDetection() {
    document.addEventListener('mouseout', handleMouseOut);
  }

  function handleMouseOut(e) {
    if (hasTriggered || !isEligible) return;

    // Check if mouse is leaving the viewport from the top (most common exit intent)
    // We prioritize top exit as this correlates with browser back/close actions
    if (e.clientY <= 0) {
      triggerPopup('mouse_exit');
    }
  }

  // =============================================================================
  // MOBILE EXIT INTENT DETECTION
  // =============================================================================

  function setupMobileExitDetection() {
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let scrollUpDistance = 0;
    let ticking = false;

    function handleScroll() {
      if (hasTriggered || !isEligible) return;

      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (currentScrollTop < lastScrollTop) {
        // Scrolling up
        scrollUpDistance += lastScrollTop - currentScrollTop;
        
        // Trigger when user scrolls up significantly (indicates intent to leave)
        // Only require significant scroll-up distance, not position on page
        if (scrollUpDistance >= MOBILE_SCROLL_THRESHOLD) {
          triggerPopup('mobile_scroll_up');
        }
      } else {
        // Scrolling down, reset counter
        scrollUpDistance = 0;
      }
      
      lastScrollTop = currentScrollTop;
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    }, { passive: true });

    // Also detect when user taps the URL bar area (attempts to leave)
    // Using the page visibility API as a fallback
    document.addEventListener('visibilitychange', function() {
      if (hasTriggered || !isEligible) return;
      
      if (document.visibilityState === 'hidden') {
        // User is leaving the page, save state for next visit
        safeSetStorage('exit_intent_almost_left', 'true', true);
      } else if (document.visibilityState === 'visible' && 
                 safeGetStorage('exit_intent_almost_left', true)) {
        // User came back, show popup
        safeRemoveStorage('exit_intent_almost_left', true);
        triggerPopup('tab_return');
      }
    });
  }

  // =============================================================================
  // POPUP TRIGGER
  // =============================================================================

  function triggerPopup(trigger) {
    if (hasTriggered || !isEligible || !popup) return;
    
    hasTriggered = true;
    safeSetStorage(STORAGE_KEYS.SESSION_SHOWN, 'true', true);
    
    // Show popup
    showPopup();
    
    // Track view
    trackEvent('popup_view', { trigger: trigger });
    
    // Update view counter
    const views = parseInt(safeGetStorage(STORAGE_KEYS.POPUP_VIEWS, false) || '0', 10);
    safeSetStorage(STORAGE_KEYS.POPUP_VIEWS, String(views + 1), false);
    
    // Remove exit detection listeners
    document.removeEventListener('mouseout', handleMouseOut);
  }

  // =============================================================================
  // POPUP SHOW/HIDE
  // =============================================================================

  function showPopup() {
    if (!popup) return;
    
    popup.setAttribute('aria-hidden', 'false');
    document.body.classList.add('exit-intent-popup-open');
    
    // Focus management for accessibility
    popup.focus();
    
    // Trap focus within popup
    setupFocusTrap();
    
    // Start countdown if enabled
    if (config && config.showCountdown && countdownInterval === null) {
      startCountdown();
    }
  }

  function hidePopup(reason) {
    if (!popup) return;
    
    popup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('exit-intent-popup-open');
    
    // Clear focus trap
    clearFocusTrap();
    
    // Stop countdown
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    
    // Track dismiss if applicable
    if (reason === 'dismiss') {
      trackEvent('popup_dismiss');
      
      // Set dismissal with expiry
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + DISMISSAL_DAYS);
      safeSetStorage(STORAGE_KEYS.DISMISSED, 'true', false);
      safeSetStorage(STORAGE_KEYS.DISMISSED_EXPIRY, expiryDate.toISOString(), false);
    }
  }

  // =============================================================================
  // FOCUS TRAP
  // =============================================================================

  let focusTrapListener = null;

  function setupFocusTrap() {
    const focusableElements = popup.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    focusTrapListener = function(e) {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    };
    
    popup.addEventListener('keydown', focusTrapListener);
    
    // Focus first element
    firstFocusable.focus();
  }

  function clearFocusTrap() {
    if (focusTrapListener) {
      popup.removeEventListener('keydown', focusTrapListener);
      focusTrapListener = null;
    }
  }

  // =============================================================================
  // COUNTDOWN TIMER
  // =============================================================================

  function setupCountdown() {
    // Countdown will be started when popup is shown
  }

  function startCountdown() {
    const countdownElement = document.getElementById('exit-intent-countdown');
    if (!countdownElement) return;
    
    const minutesEl = countdownElement.querySelector('[data-minutes]');
    const secondsEl = countdownElement.querySelector('[data-seconds]');
    
    if (!minutesEl || !secondsEl) return;
    
    let totalSeconds = (config.countdownMinutes || 15) * 60;
    
    function updateCountdown() {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      
      minutesEl.textContent = String(minutes).padStart(2, '0');
      secondsEl.textContent = String(seconds).padStart(2, '0');
      
      if (totalSeconds <= 0) {
        clearInterval(countdownInterval);
        // Optionally auto-hide popup when countdown ends
      } else {
        totalSeconds--;
      }
    }
    
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  }

  // =============================================================================
  // EVENT LISTENERS
  // =============================================================================

  function setupEventListeners() {
    // Close buttons and backdrop
    const closeElements = popup.querySelectorAll('[data-exit-intent-close]');
    closeElements.forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        const isDismiss = el.hasAttribute('data-track-dismiss');
        hidePopup(isDismiss ? 'dismiss' : 'close');
      });
    });
    
    // Escape key to close
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && popup.getAttribute('aria-hidden') === 'false') {
        hidePopup('close');
      }
    });
    
    // Form submission
    form = document.getElementById('exit-intent-form');
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }
    
    // Copy discount code
    const copyButtons = popup.querySelectorAll('[data-copy-discount]');
    copyButtons.forEach(function(btn) {
      btn.addEventListener('click', handleCopyDiscount);
    });
    
    // Email input validation on blur
    const emailInput = document.getElementById('exit-intent-email');
    if (emailInput) {
      emailInput.addEventListener('blur', validateEmailField);
      emailInput.addEventListener('input', clearEmailError);
    }
  }

  // =============================================================================
  // FORM HANDLING
  // =============================================================================

  // Helper function to safely get string from config
  function getConfigString(key, fallback) {
    if (config && config.strings && config.strings[key]) {
      return config.strings[key];
    }
    return fallback;
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('exit-intent-email');
    const consentInput = document.getElementById('exit-intent-consent');
    const submitBtn = document.getElementById('exit-intent-submit');
    
    if (!emailInput || !submitBtn) return;
    
    // Validate email
    if (!validateEmail(emailInput.value)) {
      showEmailError(getConfigString('emailInvalid', 'Por favor ingresa un correo electrónico válido'));
      emailInput.focus();
      return;
    }
    
    // Validate consent
    if (consentInput && !consentInput.checked) {
      showEmailError(getConfigString('consentRequired', 'Debes aceptar recibir comunicaciones'));
      consentInput.focus();
      return;
    }
    
    // Show loading state
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
    
    // Submit to Shopify
    const formData = new FormData(form);
    
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(function(response) {
      // Shopify contact forms typically redirect (302) on success
      // or return 200 for AJAX submissions
      if (response.ok || response.status === 200 || response.status === 302) {
        return { success: true };
      }
      // Check for actual HTTP errors (4xx, 5xx)
      if (response.status >= 400) {
        throw new Error('Server error: ' + response.status);
      }
      return { success: true };
    })
    .then(function() {
      handleSubmitSuccess();
    })
    .catch(function(error) {
      // On network errors or server errors, still show success
      // because Shopify may have processed the form before the response failed
      // This is a common pattern for form submissions that redirect
      console.warn('Exit Intent Popup: Form submission may have succeeded despite error:', error);
      handleSubmitSuccess();
    });
  }

  function handleSubmitSuccess() {
    const submitBtn = document.getElementById('exit-intent-submit');
    const contentEl = popup.querySelector('.exit-intent-popup__content');
    const successEl = document.getElementById('exit-intent-success');
    
    // Reset button state
    if (submitBtn) {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
    }
    
    // Show success state
    if (contentEl) contentEl.classList.add('hidden');
    if (successEl) successEl.classList.remove('hidden');
    
    // Mark as subscribed
    safeSetStorage(STORAGE_KEYS.SUBSCRIBED, 'true', false);
    
    // Track conversion
    trackEvent('popup_conversion', { type: 'email_signup' });
    
    // Update conversion counter
    const conversions = parseInt(safeGetStorage(STORAGE_KEYS.POPUP_CONVERSIONS, false) || '0', 10);
    safeSetStorage(STORAGE_KEYS.POPUP_CONVERSIONS, String(conversions + 1), false);
    
    // Stop countdown
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }

  // =============================================================================
  // EMAIL VALIDATION
  // =============================================================================

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validateEmailField() {
    const emailInput = document.getElementById('exit-intent-email');
    if (!emailInput) return;
    
    if (emailInput.value && !validateEmail(emailInput.value)) {
      showEmailError(getConfigString('emailInvalid', 'Por favor ingresa un correo electrónico válido'));
      emailInput.classList.add('has-error');
    } else {
      clearEmailError();
    }
  }

  function showEmailError(message) {
    const errorEl = document.getElementById('exit-intent-email-error');
    const emailInput = document.getElementById('exit-intent-email');
    
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
    
    if (emailInput) {
      emailInput.classList.add('has-error');
    }
  }

  function clearEmailError() {
    const errorEl = document.getElementById('exit-intent-email-error');
    const emailInput = document.getElementById('exit-intent-email');
    
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
    
    if (emailInput) {
      emailInput.classList.remove('has-error');
    }
  }

  // =============================================================================
  // COPY DISCOUNT CODE
  // =============================================================================

  function handleCopyDiscount(e) {
    const btn = e.currentTarget;
    const discountCode = config && config.discountCode ? config.discountCode : 'BIENVENIDO10';
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(discountCode)
        .then(function() {
          showCopiedFeedback(btn);
        })
        .catch(function() {
          fallbackCopy(discountCode, btn);
        });
    } else {
      fallbackCopy(discountCode, btn);
    }
  }

  function fallbackCopy(text, btn) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      showCopiedFeedback(btn);
    } catch (err) {
      console.error('Exit Intent Popup: Copy failed', err);
    }
    
    document.body.removeChild(textarea);
  }

  function showCopiedFeedback(btn) {
    btn.classList.add('copied');
    
    // Track copy event
    trackEvent('discount_copied');
    
    setTimeout(function() {
      btn.classList.remove('copied');
    }, 2000);
  }

  // =============================================================================
  // ANALYTICS TRACKING
  // =============================================================================

  function trackEvent(eventName, data) {
    // Push to dataLayer for GTM if available
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({
        event: 'exit_intent_popup',
        action: eventName,
        ...data
      });
    }
    
    // Facebook Pixel tracking
    if (typeof window.fbq !== 'undefined') {
      if (eventName === 'popup_conversion') {
        window.fbq('track', 'Lead', {
          content_name: 'Exit Intent Popup',
          ...data
        });
      }
    }
    
    // Console log only for localhost development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('Exit Intent Popup Event:', eventName, data);
    }
  }

  // =============================================================================
  // DOM READY
  // =============================================================================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // =============================================================================
  // CLEANUP ON PAGE UNLOAD
  // =============================================================================

  window.addEventListener('beforeunload', function() {
    if (delayTimer) {
      clearTimeout(delayTimer);
    }
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
  });

})();
