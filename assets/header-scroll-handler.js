/**
 * =============================================================================
 * HEADER SCROLL HANDLER
 * =============================================================================
 * Mobile header hide/show on scroll + desktop sticky header shrink
 * Extracted from inline scripts in theme.liquid
 */

(function() {
  'use strict';

  // Query header element once and reuse
  const header = document.querySelector('.section-header, .header-wrapper');
  if (!header) return;
  
  /* =============================================================================
     MOBILE HEADER HIDE/SHOW ON SCROLL
     ============================================================================= */
  function isMobileLike() {
    return window.matchMedia('(max-width: 989.98px)').matches;
  }
  
  let lastY = window.scrollY || 0;
  let ticking = false;
  
  function onScroll() {
    if (!isMobileLike()) {
      header.classList.remove('header--hide');
      header.classList.remove('header--show');
      lastY = window.scrollY || 0;
      ticking = false;
      return;
    }
    
    const y = window.scrollY || 0;
    const delta = y - lastY;
    
    const menuOpen = document.querySelector('.menu-drawer[open]') ||
                    document.querySelector('.header__submenu[open]') ||
                    document.querySelector('.predictive-search[open]');
    
    if (menuOpen) {
      header.classList.remove('header--hide');
      header.classList.add('header--show');
      lastY = y;
      ticking = false;
      return;
    }
    
    if (delta < -4) {
      header.classList.remove('header--hide');
      header.classList.add('header--show');
    } else if (delta > 4 && y > 100) {
      header.classList.remove('header--show');
      header.classList.add('header--hide');
    }
    
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
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  
  window.addEventListener('resize', onResize);
  onResize();

  /* =============================================================================
     STICKY HEADER SHRINK ON SCROLL
     =============================================================================
     Uses the same header element from above
     ============================================================================= */
  let lastScrollY = 0;
  let scrollTicking = false;
  
  function updateHeaderOnScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    
    // Add 'scrolled' class when scrolled down more than 50px
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScrollY = scrollY;
    scrollTicking = false;
  }
  
  function requestTick() {
    if (!scrollTicking) {
      window.requestAnimationFrame(updateHeaderOnScroll);
      scrollTicking = true;
    }
  }
  
  window.addEventListener('scroll', requestTick, { passive: true });
  updateHeaderOnScroll(); // Initial check
})();
