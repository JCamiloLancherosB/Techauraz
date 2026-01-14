/**
 * TechAuraz Mobile Fixes Handler
 * Handles dynamic positioning and interactions for mobile elements
 * Version: 1.0.0
 * Date: 2024-01-14
 */

(function() {
  'use strict';
  
  // Constants
  const MOBILE_BREAKPOINT = 749; // px
  const MIN_BOTTOM_PADDING = 100; // px
  
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
   * Handle WhatsApp FAB positioning based on cookie banner
   */
  function handleWhatsAppFABPosition() {
    const whatsappFAB = document.querySelector('.whatsapp-float, .whatsapp-button-float, [class*="whatsapp"][class*="float"]');
    
    if (!whatsappFAB) return;
    
    // Ensure proper z-index
    whatsappFAB.style.zIndex = '9999';
    
    // Update position based on cookie banner
    function updateFABPosition() {
      const cookieBannerHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--cookie-banner-height') || '0'
      );
      
      if (cookieBannerHeight > 0 && window.innerWidth <= MOBILE_BREAKPOINT) {
        // Mobile - adjust for cookie banner
        whatsappFAB.style.bottom = `calc(${cookieBannerHeight}px + 1rem)`;
      } else if (window.innerWidth <= MOBILE_BREAKPOINT) {
        // Mobile - no cookie banner
        whatsappFAB.style.bottom = '1rem';
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
    
    // Update when CSS variable changes
    const styleObserver = new MutationObserver(updateFABPosition);
    styleObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });
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
