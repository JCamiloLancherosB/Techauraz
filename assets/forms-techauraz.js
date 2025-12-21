// ===== TECHAURAZ FORM VALIDATION =====
// Form validation helper
(function() {
  'use strict';

  // Get translation for error messages (from data attributes or defaults)
  const errorMessages = {
    required: document.documentElement.getAttribute('data-form-required-error') || 'Este campo es requerido',
    email: document.documentElement.getAttribute('data-form-email-error') || 'Ingresa un correo válido'
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
      errorEl.innerHTML = `<span class="form-error__icon">⚠️</span><span>${message}</span>`;
      input.parentNode.appendChild(errorEl);
    } else {
      errorEl.querySelector('span:last-child').textContent = message;
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
    
    // Validate all forms on submit
    const forms = document.querySelectorAll('form');
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
  
  // Newsletter success handling
  function handleNewsletterSuccess() {
    const successMessages = document.querySelectorAll('.newsletter-form__success.is-visible');
    successMessages.forEach(msg => {
      // Success message is already visible via Liquid, just ensure proper styling
      msg.style.display = 'flex';
    });
  }
  
  // Check for newsletter success on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleNewsletterSuccess);
  } else {
    handleNewsletterSuccess();
  }
})();
