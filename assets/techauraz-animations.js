/**
 * =============================================================================
 * TECHAURAZ SCROLL ANIMATIONS
 * Version: 1.0.0
 * Created: 2026-01-28
 * =============================================================================
 * 
 * Scroll animation observer for elements with .animate-on-scroll class.
 * Uses IntersectionObserver for performant scroll-based animations.
 * 
 * Features:
 * - Fade-in and slide-up animation on scroll
 * - Respects prefers-reduced-motion accessibility setting
 * - Single observation (animates once, stays visible)
 * - Configurable threshold and root margin
 * 
 * Usage:
 * Add class="animate-on-scroll" to any element you want to animate on scroll.
 * The element will fade in and slide up when it enters the viewport.
 * 
 * =============================================================================
 */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';
  
  // Respect reduced motion preferences for accessibility
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Make all animated elements visible immediately without animation
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(function(el) {
      el.classList.add('is-visible');
    });
    return;
  }
  
  // Select all elements with the animate-on-scroll class
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  // Exit early if no animated elements exist
  if (animatedElements.length === 0) {
    return;
  }
  
  // Check if IntersectionObserver is supported
  if (!window.IntersectionObserver) {
    // Fallback: make all elements visible immediately
    animatedElements.forEach(function(el) {
      el.classList.add('is-visible');
    });
    return;
  }
  
  // Create IntersectionObserver with optimized settings
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        // Add visible class to trigger animation
        entry.target.classList.add('is-visible');
        // Stop observing once animated (animation only happens once)
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,  // Trigger when 10% of element is visible
    rootMargin: '0px 0px -50px 0px'  // Trigger after element enters viewport by 50px (smooth reveal)
  });
  
  // Observe all animated elements
  animatedElements.forEach(function(el) {
    observer.observe(el);
  });
});
