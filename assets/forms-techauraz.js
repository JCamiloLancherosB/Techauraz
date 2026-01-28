// ===== TECHAURAZ FORM VALIDATION =====
// Form validation helper with newsletter AJAX support
(function() {
  'use strict';

  // Get translation for error messages (from data attributes or English defaults)
  const errorMessages = {
    required: document.documentElement.getAttribute('data-form-required-error') || 'This field is required',
    email: document.documentElement.getAttribute('data-form-email-error') || 'Please enter a valid email',
    serverError: document.documentElement.getAttribute('data-form-server-error') || 'Something went wrong. Please try again.',
    newsletterSuccess: document.documentElement.getAttribute('data-newsletter-success') || 'Thanks for subscribing!'
  };

  // Email validation
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  // Show error
  function showError(input, message) {
    input.classList.add('form-input--error', 'field__input--error');
    input.classList.remove('form-input--success', 'field__input--success');
    
    let errorEl = input.parentNode.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'form-error';
      
      const iconSpan = document.createElement('span');
      iconSpan.className = 'form-error__icon';
      iconSpan.textContent = '⚠️';
      
      const messageSpan = document.createElement('span');
      messageSpan.textContent = message;
      
      errorEl.appendChild(iconSpan);
      errorEl.appendChild(messageSpan);
      input.parentNode.appendChild(errorEl);
    } else {
      const messageSpan = errorEl.querySelector('span:last-child');
      if (messageSpan) {
        messageSpan.textContent = message;
      }
    }
    
    setTimeout(() => errorEl.classList.add('is-visible'), 10);
  }
  
  // Show success
  function showSuccess(input) {
    input.classList.remove('form-input--error', 'field__input--error');
    input.classList.add('form-input--success', 'field__input--success');
    
    const errorEl = input.parentNode.querySelector('.form-error');
    if (errorEl) {
      errorEl.classList.remove('is-visible');
    }
  }
  
  // Clear validation
  function clearValidation(input) {
    input.classList.remove('form-input--error', 'form-input--success', 'field__input--error', 'field__input--success');
    const errorEl = input.parentNode.querySelector('.form-error');
    if (errorEl) {
      errorEl.classList.remove('is-visible');
    }
  }
  
  // Validate input
  function validateInput(input) {
    const value = input.value.trim();
    const isRequired = input.required || input.hasAttribute('aria-required');
    const type = input.type;
    
    if (isRequired && !value) {
      showError(input, errorMessages.required);
      return false;
    } else if (type === 'email' && value && !isValidEmail(value)) {
      showError(input, errorMessages.email);
      return false;
    } else if (value) {
      showSuccess(input);
      return true;
    } else {
      clearValidation(input);
      return true;
    }
  }
  
  // Initialize validation for all form inputs
  function initFormValidation() {
    // Select all form inputs and textareas
    const inputs = document.querySelectorAll('.form-input, .form-textarea, .field__input, .text-area');
    
    inputs.forEach(input => {
      // Validate on blur
      input.addEventListener('blur', function() {
        validateInput(this);
      });
      
      // Clear error on input
      input.addEventListener('input', function() {
        if (this.classList.contains('form-input--error') || this.classList.contains('field__input--error')) {
          clearValidation(this);
        }
      });
    });
    
    // Validate all forms on submit (excluding newsletter forms which have their own handler)
    const forms = document.querySelectorAll('form:not(.newsletter-form):not(.ta-conv-newsletter)');
    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        const formInputs = this.querySelectorAll('.form-input, .form-textarea, .field__input, .text-area');
        let isValid = true;
        
        formInputs.forEach(input => {
          if (!validateInput(input)) {
            isValid = false;
          }
        });
        
        if (!isValid) {
          e.preventDefault();
          // Focus first error field
          const firstError = this.querySelector('.form-input--error, .field__input--error');
          if (firstError) {
            firstError.focus();
          }
        }
      });
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormValidation);
  } else {
    initFormValidation();
  }

  // =============================================================================
  // NEWSLETTER FORM HANDLING - AJAX submission with UX states
  // =============================================================================
  
  /**
   * Newsletter form controller
   * Handles AJAX submission, loading states, success/error feedback
   */
  class NewsletterFormHandler {
    constructor(form) {
      this.form = form;
      this.emailInput = form.querySelector('input[type="email"]');
      this.submitButton = form.querySelector('button[type="submit"]');
      this.isSubmitting = false;
      this.formId = form.id || 'newsletter-form';
      
      // Get or create message containers
      this.successMessage = this.getOrCreateSuccessMessage();
      this.errorMessage = this.getOrCreateErrorMessage();
      
      // Store original button content
      this.originalButtonContent = this.submitButton ? this.submitButton.innerHTML : '';
      
      this.init();
    }
    
    init() {
      if (!this.form || !this.emailInput || !this.submitButton) {
        return;
      }
      
      this.form.addEventListener('submit', this.handleSubmit.bind(this));
      this.emailInput.addEventListener('input', this.handleInput.bind(this));
      this.emailInput.addEventListener('blur', this.handleBlur.bind(this));
    }
    
    getOrCreateSuccessMessage() {
      let successEl = this.form.querySelector('.newsletter-form__message--success');
      if (!successEl) {
        successEl = document.createElement('div');
        successEl.className = 'newsletter-form__message newsletter-form__message--success form__message';
        successEl.setAttribute('role', 'status');
        successEl.setAttribute('aria-live', 'polite');
        successEl.setAttribute('tabindex', '-1');
        successEl.style.display = 'none';
        this.form.appendChild(successEl);
      }
      return successEl;
    }
    
    getOrCreateErrorMessage() {
      let errorEl = this.form.querySelector('.newsletter-form__message--error');
      if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'newsletter-form__message newsletter-form__message--error form__message';
        errorEl.setAttribute('role', 'alert');
        errorEl.setAttribute('aria-live', 'assertive');
        errorEl.style.display = 'none';
        this.form.appendChild(errorEl);
      }
      return errorEl;
    }
    
    handleInput() {
      // Clear error state on input
      this.hideMessages();
      if (this.emailInput.classList.contains('field__input--error')) {
        this.emailInput.classList.remove('field__input--error');
        this.emailInput.removeAttribute('aria-invalid');
      }
    }
    
    handleBlur() {
      // Validate on blur
      const email = this.emailInput.value.trim();
      if (email && !isValidEmail(email)) {
        this.showFieldError(errorMessages.email);
      }
    }
    
    async handleSubmit(event) {
      event.preventDefault();
      
      // Prevent duplicate submissions
      if (this.isSubmitting) {
        return;
      }
      
      const email = this.emailInput.value.trim();
      
      // Client-side validation
      if (!email) {
        this.showFieldError(errorMessages.required);
        this.emailInput.focus();
        return;
      }
      
      if (!isValidEmail(email)) {
        this.showFieldError(errorMessages.email);
        this.emailInput.focus();
        return;
      }
      
      // Start loading state
      this.setLoadingState(true);
      this.hideMessages();
      
      try {
        const formData = new FormData(this.form);
        const response = await fetch(this.form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'text/html,application/xhtml+xml'
          }
        });
        
        // Shopify returns 200 for both success and validation errors
        // We need to check the response HTML for error indicators
        const html = await response.text();
        
        if (response.ok) {
          // Check if response contains error messages
          const hasError = html.includes('form--error') || 
                          html.includes('errors') ||
                          html.includes('class="error"');
          
          if (hasError) {
            // Extract error message if available, otherwise use generic
            this.showErrorMessage(errorMessages.email);
          } else {
            // Success!
            this.showSuccessMessage();
            this.emailInput.value = '';
            
            // Track newsletter signup event
            this.trackSignup(email);
          }
        } else {
          this.showErrorMessage(errorMessages.serverError);
        }
      } catch (error) {
        console.error('Newsletter submission error:', error);
        this.showErrorMessage(errorMessages.serverError);
      } finally {
        this.setLoadingState(false);
      }
    }
    
    setLoadingState(isLoading) {
      this.isSubmitting = isLoading;
      this.submitButton.disabled = isLoading;
      this.form.classList.toggle('newsletter-form--loading', isLoading);
      
      if (isLoading) {
        this.submitButton.innerHTML = '<span class="newsletter-loading-spinner" aria-hidden="true"></span><span class="visually-hidden">Loading...</span>';
        this.submitButton.setAttribute('aria-busy', 'true');
      } else {
        this.submitButton.innerHTML = this.originalButtonContent;
        this.submitButton.removeAttribute('aria-busy');
      }
    }
    
    showFieldError(message) {
      this.emailInput.classList.add('field__input--error');
      this.emailInput.setAttribute('aria-invalid', 'true');
      this.emailInput.setAttribute('aria-describedby', this.formId + '-error');
      
      this.errorMessage.id = this.formId + '-error';
      this.errorMessage.innerHTML = '<svg aria-hidden="true" focusable="false" class="icon icon-error" viewBox="0 0 13 13" style="width:16px;height:16px;vertical-align:middle;margin-right:6px;"><circle cx="6.5" cy="6.5" r="5.5" fill="#EB001B" stroke="#EB001B" stroke-width="0.7"/><path d="M5.87413 3.52832L5.97439 7.57216H7.02713L7.12739 3.52832H5.87413ZM6.50076 9.66091C6.88091 9.66091 7.18169 9.37267 7.18169 9.00504C7.18169 8.63742 6.88091 8.34917 6.50076 8.34917C6.12061 8.34917 5.81982 8.63742 5.81982 9.00504C5.81982 9.37267 6.12061 9.66091 6.50076 9.66091Z" fill="white"/></svg>' + message;
      this.errorMessage.style.display = 'flex';
      this.errorMessage.classList.add('is-visible');
    }
    
    showErrorMessage(message) {
      this.errorMessage.innerHTML = '<svg aria-hidden="true" focusable="false" class="icon icon-error" viewBox="0 0 13 13" style="width:16px;height:16px;vertical-align:middle;margin-right:6px;"><circle cx="6.5" cy="6.5" r="5.5" fill="#EB001B" stroke="#EB001B" stroke-width="0.7"/><path d="M5.87413 3.52832L5.97439 7.57216H7.02713L7.12739 3.52832H5.87413ZM6.50076 9.66091C6.88091 9.66091 7.18169 9.37267 7.18169 9.00504C7.18169 8.63742 6.88091 8.34917 6.50076 8.34917C6.12061 8.34917 5.81982 8.63742 5.81982 9.00504C5.81982 9.37267 6.12061 9.66091 6.50076 9.66091Z" fill="white"/></svg>' + message;
      this.errorMessage.style.display = 'flex';
      this.errorMessage.classList.add('is-visible');
    }
    
    showSuccessMessage() {
      const successText = this.form.getAttribute('data-success-message') || errorMessages.newsletterSuccess;
      this.successMessage.innerHTML = '<svg aria-hidden="true" focusable="false" class="icon icon-success" viewBox="0 0 13 13" style="width:16px;height:16px;vertical-align:middle;margin-right:6px;"><path d="M6.5 12.35C9.73087 12.35 12.35 9.73086 12.35 6.5C12.35 3.26913 9.73087 0.65 6.5 0.65C3.26913 0.65 0.65 3.26913 0.65 6.5C0.65 9.73086 3.26913 12.35 6.5 12.35Z" fill="#428445" stroke="white" stroke-width="0.7"/><path d="M5.53271 8.66357L9.25213 4.68197" stroke="white"/><path d="M4.10645 6.7688L6.13766 8.62553" stroke="white"/></svg>' + successText;
      this.successMessage.style.display = 'flex';
      this.successMessage.classList.add('is-visible');
      
      // Focus success message for screen readers
      this.successMessage.focus();
    }
    
    hideMessages() {
      this.successMessage.style.display = 'none';
      this.successMessage.classList.remove('is-visible');
      this.errorMessage.style.display = 'none';
      this.errorMessage.classList.remove('is-visible');
      this.emailInput.removeAttribute('aria-describedby');
    }
    
    trackSignup(email) {
      // Dispatch custom event for analytics
      window.dispatchEvent(new CustomEvent('newsletterSignup', {
        detail: { email: email, formId: this.formId }
      }));
      
      // Google Analytics tracking (if available)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'newsletter_signup', {
          'event_category': 'Newsletter',
          'event_label': 'Footer Signup'
        });
      }
    }
  }
  
  // Initialize newsletter forms
  function initNewsletterForms() {
    const newsletterForms = document.querySelectorAll('.newsletter-form, .ta-conv-newsletter, .footer__newsletter form');
    newsletterForms.forEach(form => {
      // Skip if already initialized
      if (form.hasAttribute('data-newsletter-initialized')) {
        return;
      }
      form.setAttribute('data-newsletter-initialized', 'true');
      new NewsletterFormHandler(form);
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewsletterForms);
  } else {
    initNewsletterForms();
  }
  
  // Re-init on Shopify section render (for theme editor)
  document.addEventListener('shopify:section:load', function(event) {
    const newsletterForms = event.target.querySelectorAll('.newsletter-form, .ta-conv-newsletter');
    newsletterForms.forEach(form => {
      form.removeAttribute('data-newsletter-initialized');
      new NewsletterFormHandler(form);
    });
  });
  
  // Expose for external use
  window.TechaurazForms = window.TechaurazForms || {};
  window.TechaurazForms.NewsletterFormHandler = NewsletterFormHandler;
  window.TechaurazForms.initNewsletterForms = initNewsletterForms;
})();
