# Testing Guide: UX/CRO and Performance Improvements

This guide explains how to test the new UX/CRO and performance improvements implemented in the Techauraz Shopify theme.

## Overview of Changes

The following improvements have been implemented:

1. **Hero Section** - Enhanced carousel with better performance
2. **Product Cards** - Added persuasion elements and better CTAs
3. **Free Shipping Bar** - Sticky high-contrast banner
4. **Testimonials** - New reusable section with navigation
5. **Performance** - Image optimizations and lazy loading

---

## 1. Testing Hero Section

### What Changed:
- First hero image is now preloaded for faster LCP
- Aspect-ratio CSS prevents layout shift (CLS)
- Existing autoplay, pause on hover, navigation maintained

### How to Test:

1. **Visit Homepage**
   - Go to the store homepage
   - Observe the hero carousel loads quickly without layout shift

2. **Verify Autoplay**
   - The carousel should automatically rotate slides every 5 seconds
   - Default setting from index.json: `"change_slides_speed": 5`

3. **Test Pause on Hover**
   - Hover over the carousel
   - Verify that autoplay pauses
   - Move mouse away, autoplay should resume

4. **Navigation Controls**
   - **Desktop**: Arrows and dots should be visible above the carousel
   - Click previous/next arrows to navigate
   - Click dots to jump to specific slides

5. **Mobile**
   - Swipe left/right to navigate slides
   - Touch controls should be responsive

### Performance Check:
- Use browser DevTools > Network tab
- Look for the preload of first hero image
- Use Lighthouse to check LCP score (should improve)

---

## 2. Testing Product Cards

### What Changed:
- Added "Ver todos los detalles" link below product info
- New badges: "Nuevo" (last 30 days), "Más vendido" (tag-based), discount %
- Product benefits (1-2 bullets) from description
- Enhanced CTA button with gradient and better contrast
- Optimized image loading (first 4 eager, rest lazy)

### How to Test:

1. **Visit Any Collection or Featured Products on Homepage**

2. **Check Product Badges** (top-left of product image):
   - **Nuevo**: Should appear on products published in last 30 days
   - **Más vendido**: Products with "bestseller" or "más vendido" tag
   - **Discount**: Shows percentage (e.g., "-20%") when on sale
   - **Stock**: Shows "¡Últimas X unidades!" for low stock

3. **Product Benefits**
   - Below the price, look for bullet points with star icons
   - Should show 1-2 short benefits from product description

4. **"Ver todos los detalles" Link**
   - Should appear at the bottom of each card
   - Text: "Ver todos los detalles →"
   - Click should navigate to product page

5. **CTA Button**
   - Button should have blue gradient background
   - Text should be white with good contrast
   - Hover should show enhanced shadow and slight movement

6. **Image Loading**
   - First 4 products: images load immediately (no lazy attribute)
   - Products 5+: lazy loaded (check Network tab for on-scroll loading)

### To Add Tags for Testing:
In Shopify Admin > Products > [Product] > Tags:
- Add "bestseller" or "más vendido" to test the badge

---

## 3. Testing Free Shipping Banner

### What Changed:
- Enhanced with high-contrast green gradient
- Made sticky at top of page (z-index: 100)
- Improved messaging for clarity
- Better accessibility

### How to Test:

1. **Locate the Banner**
   - Should appear at the top of pages where included
   - Background: Green gradient (#059669 to #047857)
   - Text: White, bold

2. **Check Sticky Behavior**
   - Scroll down the page
   - If `enable_sticky` is true in section settings, banner should stick to top
   - Should remain visible during scroll

3. **Verify Content**
   - Default text: "Envío gratis en pedidos > $[threshold] | Entrega rápida"
   - Icon: 🚚 emoji
   - Should have subtle shimmer animation

4. **Responsive Design**
   - **Desktop**: Full text visible, centered
   - **Mobile**: Text may wrap, smaller font size

### To Configure:
In Shopify Theme Editor:
- Sections > Free Shipping Banner
- Settings available:
  - `enable_sticky`: Make banner stick on scroll
  - `free_shipping_threshold`: Minimum amount (default: 100000 COP)
  - `show_contraentrega`: Show delivery info

---

## 4. Testing Testimonials Section

### What Changed:
- Created new reusable `testimonials.liquid` section
- Avatar support with fallback to initials
- Displays: rating stars, quote, name, type
- Navigation: arrows + dots
- Responsive design

### How to Test:

1. **Add Testimonials Section**
   - In Theme Editor, add "Testimonials" section to a page
   - Or use existing testimonials on homepage if already configured

2. **Verify Testimonial Display**
   Each testimonial card should show:
   - ⭐ Rating stars (1-5, color: gold)
   - Quote in italics
   - Avatar (if image provided) or circle with initial
   - Author name (bold)
   - Author type (smaller, gray)

3. **Navigation Controls**
   - **Arrows**: Click left/right to navigate
   - **Dots**: Click any dot to jump to that testimonial
   - Active dot should be highlighted (blue)
   - Arrows should disable at start/end

4. **Responsive Behavior**
   - **Desktop**: 3 columns (33.333% each), max 450px width
   - **Tablet**: 2 columns (50% each)
   - **Mobile**: 1 column (100%), swipeable

5. **Optional "Ver más reseñas" Button**
   - If `show_view_all` is enabled in settings
   - Button appears centered below slider
   - Links to URL specified in `view_all_link` setting

### To Configure in Theme Editor:
- Settings:
  - `title`: Section heading
  - `show_view_all`: Show "Ver más" button
  - `view_all_link`: URL for button
- Blocks: Add multiple "Testimonio" blocks
  - `rating`: 1-5 stars
  - `testimonial_text`: Quote
  - `author_name`: Customer name
  - `author_type`: e.g., "Cliente verificado"
  - `author_image`: Optional photo

---

## 5. Performance Testing

### Metrics to Check:

Use **Chrome DevTools > Lighthouse** to audit performance:

1. **Largest Contentful Paint (LCP)**
   - Target: < 2.5s
   - First hero image is preloaded
   - Should see improvement from baseline

2. **Cumulative Layout Shift (CLS)**
   - Target: < 0.1 (ideally 0)
   - Aspect-ratio set on all images prevents shift
   - No layout jumps during load

3. **Image Loading**
   - Network tab > Filter by images
   - First hero: Loaded immediately (priority: high)
   - First 4 products: Eager loaded
   - Remaining products: Lazy loaded on scroll

4. **Script Loading**
   - All scripts should have `defer` attribute
   - Check Network tab > JS filter
   - Scripts load after HTML parsing

### Tools:
- **Chrome DevTools**: Network, Performance, Lighthouse tabs
- **WebPageTest**: https://www.webpagetest.org/
- **PageSpeed Insights**: https://pagespeed.web.dev/

---

## 6. Browser Compatibility Testing

Test in the following browsers:

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

### Key Features to Verify:
- Hero carousel navigation
- Product card hover effects
- Sticky free shipping banner
- Testimonials slider
- Image lazy loading
- Aspect ratio support

---

## 7. Accessibility Testing

### Checklist:

1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Enter/Space to activate buttons
   - Arrow keys for sliders (where applicable)

2. **Screen Reader**
   - Hero: Proper aria-labels on carousel
   - Products: Alt text on images
   - Testimonials: Rating announced correctly
   - All buttons have descriptive labels

3. **Color Contrast**
   - Free shipping banner: White on green (high contrast)
   - CTA buttons: White on blue gradient (high contrast)
   - All text readable

4. **Focus Indicators**
   - All interactive elements show focus ring
   - Focus order is logical

### Tools:
- **WAVE**: https://wave.webaim.org/
- **axe DevTools**: Browser extension
- **Screen reader**: NVDA (Windows), VoiceOver (Mac/iOS)

---

## 8. Common Issues and Solutions

### Issue: "Nuevo" badge not showing
- **Solution**: Check that product was published within last 30 days
- Verify `published_at` timestamp in product admin

### Issue: "Más vendido" badge not showing
- **Solution**: Add tag "bestseller" or "más vendido" to product
- Tags are case-insensitive

### Issue: Product benefits not showing
- **Solution**: Ensure product has description text
- Benefits extracted from first 2 sentences

### Issue: Hero image not preloading
- **Solution**: Verify slideshow is first section (index 0)
- Check that first slide has an image set

### Issue: Free shipping banner not sticky
- **Solution**: Enable `enable_sticky` in section settings
- Check that page doesn't have conflicting z-index

### Issue: Testimonials slider not working
- **Solution**: Ensure multiple testimonial blocks are added
- Check browser console for JavaScript errors
- Verify slider-component is defined

---

## 9. Regression Testing

Verify these existing features still work:

- ✅ Add to cart functionality
- ✅ Quick view modal
- ✅ Product variant selection
- ✅ Search functionality
- ✅ Mobile menu
- ✅ Cart drawer
- ✅ Checkout process
- ✅ Filters on collection pages

---

## 10. Performance Baseline Comparison

### Before Changes:
Document current metrics for comparison:
- LCP: ____
- CLS: ____
- Total page size: ____
- Number of requests: ____

### After Changes:
Expected improvements:
- LCP: Faster (hero preloaded)
- CLS: Lower/zero (aspect-ratio on images)
- Page size: Similar (optimized images)
- Requests: Similar (lazy loading reduces initial)

---

## Summary Checklist

Use this quick checklist for a complete test:

- [ ] Hero carousel auto-plays and pauses on hover
- [ ] Hero navigation (arrows, dots) works
- [ ] Product badges display correctly (Nuevo, Más vendido, discount)
- [ ] Product benefits show as bullets
- [ ] "Ver todos los detalles" link navigates to product page
- [ ] CTA buttons have high contrast and hover effect
- [ ] Free shipping banner is visible and sticky (if enabled)
- [ ] Testimonials section displays with proper formatting
- [ ] Testimonials navigation (arrows, dots) works
- [ ] First 4 product images load immediately
- [ ] Remaining images lazy load on scroll
- [ ] No layout shifts during page load (CLS = 0)
- [ ] All interactive elements keyboard accessible
- [ ] Screen reader announces content correctly
- [ ] Mobile responsive on all screen sizes
- [ ] No JavaScript console errors

---

## Reporting Issues

If you find any issues during testing:

1. **Document the issue**:
   - What happened vs. what was expected
   - Steps to reproduce
   - Browser and device info
   - Screenshots/videos if applicable

2. **Check console**:
   - Open DevTools > Console
   - Note any errors or warnings

3. **Create a detailed bug report** with:
   - Title: Brief description
   - Description: Full details
   - Environment: Browser, device, OS
   - Steps to reproduce
   - Expected vs actual behavior
   - Console errors
   - Screenshots

---

## Additional Resources

- **Shopify Liquid Documentation**: https://shopify.dev/docs/api/liquid
- **Web Vitals**: https://web.dev/vitals/
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Shopify Theme Kit**: For local development testing

---

**Testing completed by**: _______________
**Date**: _______________
**Overall status**: ✅ Pass / ❌ Fail
**Notes**: _______________________________________________
