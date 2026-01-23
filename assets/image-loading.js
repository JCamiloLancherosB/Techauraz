/**
 * Image Loading Enhancement
 * Ensures smooth image loading with proper fade-in transitions
 */

(function() {
  'use strict';

  // Function to mark image as loaded
  function markImageAsLoaded(img) {
    img.classList.add('loaded');
    img.classList.add('image-opacity-full');
    
    // Also add class to parent media container to hide spinner
    const mediaContainer = img.closest('.card__media, .product__media');
    if (mediaContainer) {
      mediaContainer.classList.add('image-loaded');
    }
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
        img.classList.add('image-error');
        console.warn('Failed to load image:', img.src);
      });
    }
  }

  // Process all images on page (exclude slideshow/banner images to prevent interference)
  function processImages() {
    // Select product and card images
    const cardImages = document.querySelectorAll('.card__media img, .product__media img');
    
    // Select other images but filter out slideshow/banner ones
    const allMediaImages = document.querySelectorAll('.media img');
    const filteredMediaImages = Array.from(allMediaImages).filter(img => {
      return !img.closest('.banner__media') && !img.closest('.slideshow__media');
    });
    
    // Select lazy images but filter out slideshow/banner ones
    const allLazyImages = document.querySelectorAll('img[loading="lazy"]');
    const filteredLazyImages = Array.from(allLazyImages).filter(img => {
      return !img.closest('.banner__media') && !img.closest('.slideshow__media');
    });
    
    // Combine and deduplicate (Set works with DOM element references)
    const images = [...new Set([...cardImages, ...filteredMediaImages, ...filteredLazyImages])];
    
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
    let hasNewImages = false;
    
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach(function(node) {
          // Check if the added node or its children contain images
          if (node.nodeType === 1) { // Element node
            if (node.tagName === 'IMG' || node.querySelector('img')) {
              hasNewImages = true;
            }
          }
        });
      }
    });
    
    // Only process if we actually found new images
    if (hasNewImages) {
      processImages();
    }
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
