/**
 * =============================================================================
 * HEADER SCROLL HANDLER
 * =============================================================================
 * Mobile header hide/show on scroll + desktop sticky header shrink
 * Consolidated into a single scroll listener for performance optimization
 */

(function() {
  'use strict';

  // Query header element once and reuse
  const header = document.querySelector('.section-header, .header-wrapper');
  if (!header) return;
  
  // Shared state for scroll handling
  let lastY = window.scrollY || 0;
  let ticking = false;
  
  function isMobileLike() {
    return window.matchMedia('(max-width: 989.98px)').matches;
  }
  
  /* =============================================================================
     MOBILE HEADER HIDE/SHOW ON SCROLL
     ============================================================================= */
  function handleMobileHeaderVisibility(y) {
    if (!isMobileLike()) {
      header.classList.remove('header--hide');
      header.classList.remove('header--show');
      return;
    }
    
    const delta = y - lastY;
    
    const menuOpen = document.querySelector('.menu-drawer[open]') ||
                    document.querySelector('.header__submenu[open]') ||
                    document.querySelector('.predictive-search[open]');
    
    if (menuOpen) {
      header.classList.remove('header--hide');
      header.classList.add('header--show');
      return;
    }
    
    if (delta < -4) {
      header.classList.remove('header--hide');
      header.classList.add('header--show');
    } else if (delta > 4 && y > 100) {
      header.classList.remove('header--show');
      header.classList.add('header--hide');
    }
  }
  
  /* =============================================================================
     STICKY HEADER SHRINK ON SCROLL
     ============================================================================= */
  function handleHeaderShrink(y) {
    // Add 'scrolled' class when scrolled down more than 50px
    if (y > 50) {
      header.classList.add('scrolled');
      document.body.classList.add('scrolled-past-header');
    } else {
      header.classList.remove('scrolled');
      document.body.classList.remove('scrolled-past-header');
    }
  }
  
  /* =============================================================================
     UNIFIED SCROLL HANDLER
     ============================================================================= */
  function onScroll() {
    const y = window.scrollY || 0;
    
    // Handle both behaviors in one frame
    handleMobileHeaderVisibility(y);
    handleHeaderShrink(y);
    
    lastY = y;
    ticking = false;
  }
  
  function onResize() {
    if (!isMobileLike()) {
      header.style.transform = '';
      header.classList.remove('header--hide');
      header.classList.remove('header--show');
    } else {
      header.classList.add('header--show');
    }
  }
  
  // Single scroll listener for both behaviors (performance optimized)
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  
  window.addEventListener('resize', onResize);
  
  // Initialize on load
  onResize();
  onScroll(); // Initial state check
})();
