/**
 * TECHAURAZ HEADER DRAWER FIX
 * ===========================
 * Ensures hamburger menu works properly on mobile
 * This provides fallback support for the drawer menu in case
 * the default Shopify HeaderDrawer component fails to initialize.
 */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';
  
  var menuButton = document.querySelector('.header__icon--menu');
  var menuDrawer = document.querySelector('.menu-drawer-container, header-drawer');
  var closeButtons = document.querySelectorAll('.menu-drawer__close-button');
  var overlay = document.querySelector('.menu-drawer__overlay');
  var closeDrawer; // Will be defined if fallback is used
  
  // Check if the HeaderDrawer custom element is already handling this
  var headerDrawer = document.querySelector('header-drawer');
  var customElementDefined = typeof customElements !== 'undefined' && 
                             typeof customElements.get === 'function' && 
                             typeof customElements.get('header-drawer') !== 'undefined';
  
  if (headerDrawer && customElementDefined) {
    // Custom element is defined and handling the drawer
    // Only add supplementary handlers that enhance UX
    addEscapeKeyHandler(true);
    addResizeHandler(true);
    return;
  }
  
  if (!menuButton || !menuDrawer) {
    // Elements not found, cannot proceed with fallback
    return;
  }
  
  /**
   * Opens the drawer menu
   */
  function openDrawer() {
    menuDrawer.setAttribute('open', '');
    menuDrawer.classList.add('is-open');
    document.body.classList.add('menu-drawer-open');
    menuButton.setAttribute('aria-expanded', 'true');
    
    // Focus trap - focus first focusable element
    var firstFocusable = menuDrawer.querySelector('a, button, input');
    if (firstFocusable) {
      setTimeout(function() {
        firstFocusable.focus();
      }, 150);
    }
  }
  
  /**
   * Closes the drawer menu
   */
  closeDrawer = function() {
    menuDrawer.removeAttribute('open');
    menuDrawer.classList.remove('is-open');
    document.body.classList.remove('menu-drawer-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.focus();
  };
  
  /**
   * Checks if the drawer is currently open
   * @returns {boolean}
   */
  function isDrawerOpen() {
    return menuDrawer.hasAttribute('open') || menuDrawer.classList.contains('is-open');
  }
  
  // Toggle drawer on menu button click
  menuButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (isDrawerOpen()) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });
  
  // Close on close button click
  closeButtons.forEach(function(closeButton) {
    closeButton.addEventListener('click', function(e) {
      e.preventDefault();
      closeDrawer();
    });
  });
  
  // Close on overlay click
  if (overlay) {
    overlay.addEventListener('click', closeDrawer);
  }
  
  // Add handlers for fallback mode
  addEscapeKeyHandler(false, closeDrawer);
  addResizeHandler(false, closeDrawer);
  
  /**
   * Adds escape key handler for closing the drawer
   * @param {boolean} useCustomElement - Whether to use the custom element's close method
   * @param {Function} fallbackClose - Fallback close function
   */
  function addEscapeKeyHandler(useCustomElement, fallbackClose) {
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        var headerDrawerEl = document.querySelector('header-drawer');
        var drawer = headerDrawerEl ? headerDrawerEl.querySelector('details') : null;
        
        if (drawer) {
          var isOpen = drawer.hasAttribute('open') || drawer.classList.contains('menu-opening');
          if (isOpen) {
            if (useCustomElement && headerDrawerEl && typeof headerDrawerEl.closeMenuDrawer === 'function') {
              headerDrawerEl.closeMenuDrawer(e);
            } else if (fallbackClose) {
              fallbackClose();
            }
          }
        }
      }
    });
  }
  
  /**
   * Adds resize handler to close drawer on desktop
   * @param {boolean} useCustomElement - Whether to use the custom element's close method
   * @param {Function} fallbackClose - Fallback close function
   */
  function addResizeHandler(useCustomElement, fallbackClose) {
    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        if (window.innerWidth >= 990) {
          var headerDrawerEl = document.querySelector('header-drawer');
          var drawer = headerDrawerEl ? headerDrawerEl.querySelector('details') : null;
          
          if (drawer) {
            var isOpen = drawer.hasAttribute('open') || drawer.classList.contains('menu-opening');
            if (isOpen) {
              if (useCustomElement && headerDrawerEl && typeof headerDrawerEl.closeMenuDrawer === 'function') {
                headerDrawerEl.closeMenuDrawer(new Event('resize'));
              } else if (fallbackClose) {
                fallbackClose();
              }
            }
          }
        }
      }, 350);
    });
  }
});
