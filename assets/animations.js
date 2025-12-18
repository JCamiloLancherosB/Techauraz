const SCROLL_ANIMATION_TRIGGER_CLASSNAME = 'scroll-trigger';
const SCROLL_ANIMATION_OFFSCREEN_CLASSNAME = 'scroll-trigger--offscreen';
const SCROLL_ZOOM_IN_TRIGGER_CLASSNAME = 'animate--zoom-in';
const SCROLL_ANIMATION_CANCEL_CLASSNAME = 'scroll-trigger--cancel';

// Scroll in animation logic
function onIntersection(elements, observer) {
  elements.forEach((element, index) => {
    if (element.isIntersecting) {
      const elementTarget = element.target;
      if (elementTarget.classList.contains(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME)) {
        elementTarget.classList.remove(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME);
        if (elementTarget.hasAttribute('data-cascade'))
          elementTarget.setAttribute('style', `--animation-order: ${index};`);
      }
      observer.unobserve(elementTarget);
    } else {
      element.target.classList.add(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME);
      element.target.classList.remove(SCROLL_ANIMATION_CANCEL_CLASSNAME);
    }
  });
}

function initializeScrollAnimationTrigger(rootEl = document, isDesignModeEvent = false) {
  const animationTriggerElements = Array.from(rootEl.getElementsByClassName(SCROLL_ANIMATION_TRIGGER_CLASSNAME));
  if (animationTriggerElements.length === 0) return;

  if (isDesignModeEvent) {
    animationTriggerElements.forEach((element) => {
      element.classList.add('scroll-trigger--design-mode');
    });
    return;
  }

  const observer = new IntersectionObserver(onIntersection, {
    rootMargin: '0px 0px -50px 0px',
  });
  animationTriggerElements.forEach((element) => observer.observe(element));
}

// Zoom in animation logic - OPTIMIZED to reduce layout thrashing
function initializeScrollZoomAnimationTrigger() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const animationTriggerElements = Array.from(document.getElementsByClassName(SCROLL_ZOOM_IN_TRIGGER_CLASSNAME));

  if (animationTriggerElements.length === 0) return;

  const scaleAmount = 0.2 / 100;
  
  // Use WeakMap to avoid memory leaks when elements are removed from DOM
  const elementData = new WeakMap();
  
  animationTriggerElements.forEach((element) => {
    // Create element-specific state object
    const state = {
      isVisible: false,
      lastRatio: 0,
      ticking: false  // Per-element ticking flag
    };
    
    const observer = new IntersectionObserver((elements) => {
      elements.forEach((entry) => {
        state.isVisible = entry.isIntersecting;
      });
    });
    observer.observe(element);
    
    // Store element-specific data - WeakMap allows garbage collection
    elementData.set(element, state);

    // Initial value - batch DOM reads using requestAnimationFrame
    requestAnimationFrame(() => {
      const ratio = 1 + scaleAmount * percentageSeen(element);
      element.style.setProperty('--zoom-in-ratio', ratio);
      state.lastRatio = ratio;
    });

    // Use requestAnimationFrame instead of scroll listener for better performance
    window.addEventListener(
      'scroll',
      () => {
        const data = elementData.get(element);
        // Null check in case element was removed from DOM
        if (!data || !data.isVisible || data.ticking) return;
        
        data.ticking = true;
        requestAnimationFrame(() => {
          const ratio = 1 + scaleAmount * percentageSeen(element);
          // Only update if changed to reduce DOM writes
          if (Math.abs(ratio - data.lastRatio) > 0.001) {
            element.style.setProperty('--zoom-in-ratio', ratio);
            data.lastRatio = ratio;
          }
          data.ticking = false;
        });
      },
      { passive: true }
    );
  });
}

// OPTIMIZED: Batch DOM reads to prevent layout thrashing
function percentageSeen(element) {
  // Batch all reads together
  const viewportHeight = window.innerHeight;
  const scrollY = window.scrollY;
  const rect = element.getBoundingClientRect();
  const elementPositionY = rect.top + scrollY;
  // Use offsetHeight for integer precision needed for animation calculations
  const elementHeight = element.offsetHeight;

  if (elementPositionY > scrollY + viewportHeight) {
    // If we haven't reached the image yet
    return 0;
  } else if (elementPositionY + elementHeight < scrollY) {
    // If we've completely scrolled past the image
    return 100;
  }

  // When the image is in the viewport
  const distance = scrollY + viewportHeight - elementPositionY;
  let percentage = distance / ((viewportHeight + elementHeight) / 100);
  return Math.round(percentage);
}

window.addEventListener('DOMContentLoaded', () => {
  initializeScrollAnimationTrigger();
  initializeScrollZoomAnimationTrigger();
});

if (Shopify.designMode) {
  document.addEventListener('shopify:section:load', (event) => initializeScrollAnimationTrigger(event.target, true));
  document.addEventListener('shopify:section:reorder', () => initializeScrollAnimationTrigger(document, true));
}
