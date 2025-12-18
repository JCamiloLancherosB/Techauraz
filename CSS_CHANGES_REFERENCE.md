# Quick Reference Guide - CSS Changes for Home & Product Page Fixes

## File: assets/component-slideshow.css

### Change 1: Slideshow Banner Container
```css
/* BEFORE */
slideshow-component .slideshow.banner {
  flex-direction: row;
  flex-wrap: nowrap;
  margin: 0;
  gap: 0;
  overflow: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
}

/* AFTER */
slideshow-component .slideshow.banner {
  flex-direction: row;
  flex-wrap: nowrap;
  margin: 0;
  gap: 0;
  overflow: hidden;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  width: 100%;              /* ADDED */
  max-width: 100vw;         /* ADDED */
}
```

### Change 2: Slideshow Images
```css
/* BEFORE */
.slideshow__media img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  object-position: center;
  max-height: 720px;
  max-width: 100%;
}

/* AFTER */
.slideshow__media img {
  width: 100%;
  height: 100%;              /* CHANGED from auto */
  min-height: 400px;         /* ADDED */
  display: block;
  object-fit: cover;
  object-position: center;
  /* max-height removed */
  /* max-width removed */
}
```

### Change 3: Responsive Slideshow Heights
```css
/* BEFORE */
@media screen and (min-width: 750px) {
  .slideshow__media img {
    max-height: 900px;
  }
}

/* AFTER */
@media screen and (min-width: 750px) {
  .slideshow__media {
    height: 600px;
  }
  
  .slideshow__media img {
    min-height: 600px;
  }
  
  .banner--medium .slideshow__media,
  .banner--medium .slideshow__media img {
    height: 500px;
    min-height: 500px;
  }
  
  .banner--large .slideshow__media,
  .banner--large .slideshow__media img {
    height: 720px;
    min-height: 720px;
  }
  
  .banner--small .slideshow__media,
  .banner--small .slideshow__media img {
    height: 400px;
    min-height: 400px;
  }
}
```

---

## File: assets/ux-cro-fixes.css

### Change 1: Cookie Notice - Desktop Centered
```css
/* BEFORE */
@media screen and (min-width: 750px) {
  .cookie-notice {
    position: fixed !important;
    bottom: 20px !important;
    right: 20px !important;
    left: auto !important;
    transform: none !important;
    max-width: 420px !important;
    /* ... */
  }
}

/* AFTER */
@media screen and (min-width: 750px) {
  .cookie-notice {
    bottom: 90px !important;        /* CHANGED - above WhatsApp */
    left: 50% !important;           /* CHANGED - centered */
    transform: translateX(-50%) !important; /* ADDED */
    max-width: 600px !important;    /* CHANGED */
    width: auto !important;
    min-width: 500px !important;    /* CHANGED */
    /* ... */
  }
}
```

### Change 2: Product Card Typography - Desktop
```css
/* ADDED - Desktop larger font sizes */
@media screen and (min-width: 750px) {
  .card .price,
  .card-information .price {
    font-size: 1.75rem !important;   /* UP from 1.4rem */
    /* ... */
  }
  
  .card__heading,
  .card__heading.h5 {
    font-size: 1.5rem !important;    /* UP from 1.2rem */
    /* ... */
  }
  
  .card__description {
    font-size: 1.05rem !important;   /* UP from 0.9rem */
    /* ... */
  }
  
  .card__benefit-text {
    font-size: 0.95rem !important;   /* ADDED */
    /* ... */
  }
}
```

---

## File: assets/techauraz-master.css

### Change: Header Overflow Fix
```css
/* BEFORE */
.header,
.header-wrapper,
.section-header,
.title-wrapper,
.title-wrapper-with-link {
  overflow-x: hidden;
  overflow-y: visible;
  max-width: 100vw;
}

/* AFTER */
.header,
.header-wrapper,
.section-header,
#shopify-section-header,        /* ADDED */
.title-wrapper,
.title-wrapper-with-link {
  overflow: visible !important;   /* ADDED */
  overflow-x: hidden !important;  /* ADDED !important */
  overflow-y: visible !important; /* ADDED !important */
  max-width: 100vw;
  height: auto !important;        /* ADDED */
  max-height: none !important;    /* ADDED */
}
```

---

## File: assets/product-page-fixes.css

### Change: Product Description Enhanced Visibility
```css
/* BEFORE */
.product__description,
.product-description-wrapper {
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
  margin: 1.5rem 0;
  color: #cbd5e1;
  line-height: 1.6;
}

/* AFTER - Desktop */
@media screen and (min-width: 750px) {
  .product__description,
  .product-description-wrapper {
    font-size: 1.125rem !important;     /* ADDED - larger text */
    line-height: 1.75 !important;       /* ADDED - more spacing */
    color: #e2e8f0 !important;          /* CHANGED - better contrast */
    padding: 2rem;                      /* ADDED - more padding */
    background: rgba(15, 23, 42, 0.5);  /* ADDED - background */
    border-radius: 12px;                /* ADDED - rounded */
    border: 1px solid rgba(148, 163, 184, 0.2); /* ADDED - border */
  }
}
```

---

## File: sections/main-product.liquid

### Change 1: Product Description ID
```liquid
<!-- BEFORE -->
<div class="product__description rte quick-add-hidden" {{ block.shopify_attributes }}>
  {{ product.description }}
</div>

<!-- AFTER -->
<div id="product-description" class="product__description rte quick-add-hidden" {{ block.shopify_attributes }}>
  {{ product.description }}
</div>
```

### Change 2: View Details Button Behavior
```liquid
<!-- BEFORE -->
<a href="{{ product.url }}" class="link product__view-details animate-arrow">
  {{ 'products.product.view_full_details' | t }}
  {% render 'icon-arrow' %}
</a>

<!-- AFTER -->
<a href="#product-description" class="link product__view-details animate-arrow" onclick="event.preventDefault(); document.querySelector('.product__description')?.scrollIntoView({ behavior: 'smooth', block: 'start' });">
  {{ 'products.product.view_full_details' | t }}
  {% render 'icon-arrow' %}
</a>
```

---

## Summary of Measurements

### Font Size Increases (Desktop)
- Product Card Title: **1.2rem → 1.5rem** (+25%)
- Product Card Price: **1.4rem → 1.75rem** (+25%)
- Product Card Description: **0.9rem → 1.05rem** (+17%)
- Product Page Description: **default → 1.125rem** (new size)

### Cookie Notice Position
- Desktop: **Bottom-right (20px) → Bottom-center (90px from bottom)**
- Width: **420px max → 600px max** (centered)

### Slideshow Images
- Height behavior: **auto → 100%** (with min-height constraints)
- Object-fit: **cover** (maintained)
- Container width: **Added explicit 100% and max-width: 100vw**

---

## Browser Testing Checklist

### Desktop (1920x1080)
- [ ] Hero slider shows one image at full width
- [ ] Cookie notice centered at bottom, above WhatsApp
- [ ] No header scrollbar
- [ ] Product card text is clearly readable
- [ ] "Ver todos los detalles" scrolls to description

### Desktop (1366x768)
- [ ] Same checks as above
- [ ] Responsive breakpoints work correctly

### Tablet (768x1024)
- [ ] Typography scales appropriately
- [ ] Cookie notice displays correctly
- [ ] Slideshow works properly

### Mobile (375x667)
- [ ] Mobile font sizes are appropriate
- [ ] Cookie notice doesn't overflow
- [ ] Touch interactions work

---

## Performance Notes

- All changes use pure CSS (no JavaScript except scroll behavior)
- No new HTTP requests added
- No images added
- Changes are minimal and targeted
- Backward compatible with existing styles

---

## Files Modified Summary

1. **assets/component-slideshow.css** - Slideshow single-image display
2. **assets/ux-cro-fixes.css** - Cookie notice + product card typography
3. **assets/techauraz-master.css** - Header overflow fix
4. **assets/product-page-fixes.css** - Product description visibility
5. **sections/main-product.liquid** - Button behavior + description ID

Total: 5 files modified
