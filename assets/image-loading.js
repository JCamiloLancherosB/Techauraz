/**
 * Image Loading Enhancement
 * Ensures smooth image loading with proper fade-in transitions
 */

(function() {
  'use strict';

  // Function to mark image as loaded
  function markImageAsLoaded(img) {
    img.classList.add('loaded');
    img.style.opacity = '1';
  }

  // Function to handle image load
  function handleImageLoad(img) {
    if (img.complete && img.naturalHeight !== 0) {
      markImageAsLoaded(img);
    } else {
      img.addEventListener('load', function() {
        markImageAsLoaded(img);
      });
      
      img.addEventListener('error', function() {
        // Handle error gracefully
        img.style.opacity = '0.5';
        console.warn('Failed to load image:', img.src);
      });
    }
  }

  // Process all images on page
  function processImages() {
    const images = document.querySelectorAll('.card__media img, .product__media img, .media img, img[loading="lazy"]');
    
    images.forEach(function(img) {
      // If image has src, process it
      if (img.src && img.src !== '') {
        handleImageLoad(img);
      } else {
        // Wait for src to be set
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
              if (img.src && img.src !== '') {
                handleImageLoad(img);
                observer.disconnect();
              }
            }
          });
        });
        
        observer.observe(img, {
          attributes: true,
          attributeFilter: ['src']
        });
      }
    });
  }

  // Intersection Observer for lazy loading optimization
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // If image has data-src, load it
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          handleImageLoad(img);
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // Observe images with data-src
    document.querySelectorAll('img[data-src]').forEach(function(img) {
      imageObserver.observe(img);
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processImages);
  } else {
    processImages();
  }

  // Re-process when new content is added (e.g., infinite scroll)
  const contentObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        processImages();
      }
    });
  });

  if (document.body) {
    contentObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      contentObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }

})();
