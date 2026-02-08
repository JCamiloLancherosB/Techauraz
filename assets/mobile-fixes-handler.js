/**
 * TechAuraz Mobile Fixes Handler
 * Handles dynamic positioning and interactions for mobile elements
 * Version: 1.1.0
 * Date: 2024-01-14
 * Updated: 2024-01-27 - Added sticky CTA collision handling
 */

(function() {
  'use strict';
  
  // Constants
  const MOBILE_BREAKPOINT = 749; // px
  const MIN_BOTTOM_PADDING = 100; // px
  const STICKY_CTA_HEIGHT = 110; // px - approximate height of sticky CTA with benefits
  const KEYBOARD_DETECTION_THRESHOLD = 100; // px - viewport shrinks more than this likely means keyboard is open
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    handleCookieBannerPosition();
    handleWhatsAppFABPosition();
    handleProductGridSpacing();
    handleStickyCTACollisions();
    handleIOSViewport();
  }
  
  /**
   * Handle cookie banner visibility and update CSS variable for height
   */
  function handleCookieBannerPosition() {
    const cookieBanner = document.querySelector('.cookie-banner, .cookie-notice, #cookie-banner');
    
    if (!cookieBanner) return;
    
    // Update CSS variable with cookie banner height
    function updateCookieBannerHeight() {
      const isVisible = cookieBanner.offsetHeight > 0 && 
                       !cookieBanner.hasAttribute('hidden') &&
                       cookieBanner.style.display !== 'none';
      
      if (isVisible) {
        const height = cookieBanner.offsetHeight;
        document.documentElement.style.setProperty('--cookie-banner-height', `${height}px`);
        document.body.classList.add('cookie-visible');
      } else {
        document.documentElement.style.setProperty('--cookie-banner-height', '0px');
        document.body.classList.remove('cookie-visible');
      }
    }
    
    // Initial update
    updateCookieBannerHeight();
    
    // Watch for changes to cookie banner
    const observer = new MutationObserver(updateCookieBannerHeight);
    observer.observe(cookieBanner, {
      attributes: true,
      attributeFilter: ['style', 'hidden', 'class']
    });
    
    // Also watch for when cookie banner buttons are clicked
    const cookieButtons = cookieBanner.querySelectorAll('button, a[href="#"]');
    cookieButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Delay to allow for animations
        setTimeout(updateCookieBannerHeight, 300);
      });
    });
  }
  
  /**
   * Handle WhatsApp FAB positioning based on cookie banner and sticky CTA
   */
  function handleWhatsAppFABPosition() {
    const whatsappFAB = document.querySelector('.whatsapp-float, .whatsapp-button-float, [class*="whatsapp"][class*="float"]');
    
    if (!whatsappFAB) return;
    
    // Ensure proper z-index
    whatsappFAB.style.zIndex = '9999';
    
    // Update position based on cookie banner and sticky CTA
    function updateFABPosition() {
      const cookieBannerHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--cookie-banner-height') || '0'
      );
      
      // Check if sticky CTA is visible (check both body class and element class)
      const stickyCTAElement = document.querySelector('.sticky-cta-bar--visible, [data-sticky-cta].sticky-cta-bar--visible');
      const stickyCTAActive = document.body.classList.contains('sticky-cta-active') || stickyCTAElement !== null;
      
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        let bottomOffset = 16; // Base 1rem
        
        // Add cookie banner offset if visible
        if (cookieBannerHeight > 0) {
          bottomOffset += cookieBannerHeight;
        }
        
        // Add sticky CTA offset if visible
        if (stickyCTAActive) {
          bottomOffset += STICKY_CTA_HEIGHT;
        }
        
        whatsappFAB.style.bottom = `${bottomOffset}px`;
      } else {
        // Desktop
        whatsappFAB.style.bottom = '1.5rem';
      }
    }
    
    // Initial update
    updateFABPosition();
    
    // Update on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateFABPosition, 100);
    });
    
    // Update when CSS variable changes (cookie banner)
    const styleObserver = new MutationObserver(updateFABPosition);
    styleObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });
    
    // Update when sticky-cta-active class changes on body
    const bodyObserver = new MutationObserver(updateFABPosition);
    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
  
  /**
   * Handle sticky CTA collisions with cart drawer and search
   * Hides sticky CTA when modal/drawer elements are open
   */
  function handleStickyCTACollisions() {
    // Skip on desktop but allow reinit on resize
    const stickyCTA = document.querySelector('.sticky-cta-bar, [data-sticky-cta]');
    if (!stickyCTA) return;
    
    function checkCollisions() {
      // Skip collision handling on desktop
      if (window.innerWidth > MOBILE_BREAKPOINT) return;
      
      const cartDrawer = document.querySelector('.cart-drawer, cart-drawer');
      const searchModal = document.querySelector('.search-modal');
      const predictiveSearch = document.querySelector('.predictive-search, [data-predictive-search]');
      
      // Check if cart drawer is open
      const cartDrawerOpen = cartDrawer && (
        cartDrawer.classList.contains('is-open') ||
        cartDrawer.classList.contains('active') ||
        cartDrawer.hasAttribute('open') ||
        document.body.classList.contains('cart-drawer-open')
      );
      
      // Check if search is active
      const searchActive = (
        (searchModal && searchModal.classList.contains('is-open')) ||
        (predictiveSearch && (
          predictiveSearch.classList.contains('predictive-search--active') ||
          predictiveSearch.hasAttribute('open')
        )) ||
        document.body.classList.contains('search-active')
      );
      
      // Hide sticky CTA if any modal/drawer is open
      if (cartDrawerOpen || searchActive) {
        stickyCTA.style.pointerEvents = 'none';
        stickyCTA.style.opacity = '0';
        stickyCTA.style.transform = 'translateY(100%)';
      } else {
        // Clear inline styles to let CSS classes control visibility
        stickyCTA.style.pointerEvents = '';
        stickyCTA.style.opacity = '';
        stickyCTA.style.transform = '';
      }
    }
    
    // Initial check
    checkCollisions();
    
    // Watch body for class changes (cart-drawer-open, search-active, etc.)
    // This single observer covers most state changes
    const bodyObserver = new MutationObserver(checkCollisions);
    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    // Listen for custom events that might indicate drawer/modal state changes
    document.addEventListener('cart:open', checkCollisions);
    document.addEventListener('cart:close', checkCollisions);
    document.addEventListener('search:open', checkCollisions);
    document.addEventListener('search:close', checkCollisions);
    
    // Recheck on resize (e.g., crossing mobile breakpoint)
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkCollisions, 100);
    });
  }
  
  /**
   * Handle iOS viewport changes (keyboard, safe areas, notch)
   * Uses visualViewport API to dynamically adjust fixed elements
   */
  function handleIOSViewport() {
    if (!window.visualViewport) return;

    function updateViewport() {
      if (window.innerWidth > MOBILE_BREAKPOINT) return;

      // Set CSS custom property for actual viewport height (accounts for iOS keyboard/chrome)
      var viewportHeight = window.visualViewport.height;
      document.documentElement.style.setProperty('--viewport-height', viewportHeight + 'px');

      // Adjust fixed bottom elements when keyboard is open (viewport shrinks)
      var heightDiff = window.innerHeight - viewportHeight;
      var stickyCTA = document.querySelector('.sticky-cta-bar');
      if (stickyCTA && heightDiff > KEYBOARD_DETECTION_THRESHOLD) {
        // Keyboard is likely open, hide sticky CTA to avoid overlap
        stickyCTA.style.transform = 'translateY(100%)';
      } else if (stickyCTA) {
        // Clear inline style so CSS classes control visibility
        stickyCTA.style.transform = '';
      }
    }

    window.visualViewport.addEventListener('resize', updateViewport);
    window.visualViewport.addEventListener('scroll', updateViewport);
    updateViewport();
  }

  /**
   * Ensure product grid has proper spacing on mobile
   */
  function handleProductGridSpacing() {
    if (window.innerWidth > MOBILE_BREAKPOINT) return; // Only for mobile
    
    const productGrids = document.querySelectorAll(
      '.product-grid.grid, .collection .grid:not(.slider--mobile):not(.slider), .featured-collection .grid:not(.slider--mobile):not(.slider)'
    );
    
    productGrids.forEach(grid => {
      // Ensure grid doesn't have slider classes on mobile
      if (grid.classList.contains('slider') || grid.classList.contains('slider--mobile')) {
        return; // Skip sliders
      }
      
      // Force grid display
      grid.style.display = 'grid';
      grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
      grid.style.gap = '1rem';
      
      // Add extra bottom padding for WhatsApp FAB
      const section = grid.closest('.section');
      if (section) {
        const computedStyle = window.getComputedStyle(section);
        const currentPaddingBottom = parseInt(computedStyle.paddingBottom) || 0;
        
        // Only add extra padding if not already sufficient
        if (currentPaddingBottom < MIN_BOTTOM_PADDING) {
          section.style.paddingBottom = `calc(${currentPaddingBottom}px + 8rem)`;
        }
      }
    });
  }
  
  /**
   * Fix slideshow double image issue by ensuring single slide display
   */
  function fixSlideshowDisplay() {
    if (window.innerWidth > MOBILE_BREAKPOINT) return; // Only for mobile
    
    const slideshows = document.querySelectorAll('slideshow-component .slideshow.slider');
    
    slideshows.forEach(slideshow => {
      // Force flex display
      slideshow.style.display = 'flex';
      slideshow.style.flexWrap = 'nowrap';
      slideshow.style.overflowX = 'auto';
      slideshow.style.scrollSnapType = 'x mandatory';
      
      // Ensure each slide takes full width
      const slides = slideshow.querySelectorAll('.slideshow__slide, .slider__slide');
      slides.forEach(slide => {
        slide.style.minWidth = '100%';
        slide.style.width = '100%';
        slide.style.maxWidth = '100%';
        slide.style.flex = '0 0 100%';
        slide.style.flexShrink = '0';
      });
    });
  }
  
  // Run slideshow fix on load and resize
  fixSlideshowDisplay();
  
  let slideshowResizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(slideshowResizeTimeout);
    slideshowResizeTimeout = setTimeout(fixSlideshowDisplay, 100);
  });
  
  // Re-run fixes when sections are loaded/reloaded (for Shopify theme editor)
  if (window.Shopify && window.Shopify.designMode) {
    document.addEventListener('shopify:section:load', init);
    document.addEventListener('shopify:section:reorder', init);
  }
  
})();
