# UI QA Checklist - Techauraz Theme

A comprehensive manual testing checklist for verifying UI quality, accessibility, and performance across all key pages.

---

## 📋 Pre-Flight Checks

Before testing, ensure:
- [ ] Browser DevTools open (Console tab for errors)
- [ ] Network tab ready to monitor requests
- [ ] Lighthouse ready for accessibility audits
- [ ] Screen reader available (VoiceOver, NVDA, or JAWS)

---

## 🏠 HOME PAGE

### Desktop (1280px+)

#### Header
- [ ] Logo visible and clickable
- [ ] Navigation menu items accessible via Tab key
- [ ] Search icon opens search modal
- [ ] Cart icon shows item count badge
- [ ] Account icon links to account page
- [ ] Menu drawer opens/closes with keyboard (Enter/Escape)
- [ ] No horizontal overflow/scroll

#### Hero/Slideshow
- [ ] Hero images load without CLS (no layout shift)
- [ ] Slideshow controls accessible via keyboard
- [ ] CTA buttons have sufficient contrast (4.5:1 minimum)
- [ ] Slideshow dots/arrows have :focus-visible styles
- [ ] Autoplay respects prefers-reduced-motion

#### Product Sections
- [ ] Product cards are keyboard navigable
- [ ] Quick-add buttons have visible focus states
- [ ] Product images maintain aspect ratio
- [ ] "View All" links are accessible

#### Footer
- [ ] Newsletter form is keyboard accessible
- [ ] Social links have visible focus states
- [ ] Footer navigation links work

### Mobile (375px)

#### Header
- [ ] Hamburger menu visible
- [ ] Menu drawer opens/closes correctly
- [ ] Search works in mobile view
- [ ] Cart icon accessible
- [ ] No horizontal scroll

#### Content
- [ ] Hero fits viewport width
- [ ] No content overflows horizontally
- [ ] Touch targets are minimum 44x44px
- [ ] Product grid adapts to viewport
- [ ] CTA buttons are full-width on mobile

---

## 📦 COLLECTION PAGE

### Desktop (1280px+)

#### Filters
- [ ] Filter sidebar/drawer keyboard accessible
- [ ] Checkboxes have visible focus states
- [ ] Price range slider is keyboard accessible
- [ ] Clear filters button works
- [ ] Filter count displays correctly

#### Product Grid
- [ ] Products display in correct columns
- [ ] Pagination is keyboard navigable
- [ ] Sort dropdown is accessible
- [ ] No layout shift when images load

#### Cards
- [ ] Full card is clickable
- [ ] Quick-add button accessible
- [ ] Sale badges visible with good contrast
- [ ] Price displays correctly

### Mobile (375px)

- [ ] Filter button visible and working
- [ ] Filter drawer opens/closes with keyboard
- [ ] Products display in 1-2 column grid
- [ ] No horizontal overflow
- [ ] Infinite scroll (if enabled) works correctly

---

## 🛍️ PRODUCT DETAIL PAGE (PDP)

### Desktop (1280px+)

#### Gallery
- [ ] Main image loads without CLS
- [ ] Thumbnail navigation keyboard accessible
- [ ] Zoom functionality works (if enabled)
- [ ] Image gallery respects aspect ratios

#### Product Info
- [ ] Title and price visible above fold
- [ ] Variant selectors keyboard accessible
- [ ] Quantity input accessible
- [ ] Add to cart button prominent and accessible
- [ ] Out of stock state clearly indicated

#### Interactive Elements
- [ ] Accordion/tabs keyboard navigable
- [ ] Description expands correctly
- [ ] Related products section accessible

### Mobile (375px)

- [ ] Gallery swipe works
- [ ] Sticky add-to-cart (if enabled) doesn't overlap content
- [ ] All form elements accessible
- [ ] Buy button is full-width
- [ ] No horizontal scroll

---

## 🛒 CART (Page & Drawer)

### Cart Drawer

- [ ] Opens on add-to-cart
- [ ] Closes with Escape key
- [ ] Focus trapped inside drawer when open
- [ ] Close button has visible focus state
- [ ] Quantity +/- buttons accessible
- [ ] Remove item button accessible
- [ ] Checkout button prominent
- [ ] Overlay click closes drawer

### Cart Page

- [ ] Line items display correctly
- [ ] Quantity updates work
- [ ] Remove item works
- [ ] Cart total updates dynamically
- [ ] Continue shopping link accessible
- [ ] Checkout button accessible
- [ ] Empty cart state displays correctly

### Mobile

- [ ] Cart drawer slides in from right
- [ ] Touch-friendly quantity controls
- [ ] Checkout button full-width
- [ ] No horizontal scroll

---

## ♿ ACCESSIBILITY CHECKLIST

### Keyboard Navigation
- [ ] All interactive elements reachable via Tab
- [ ] Tab order is logical (left-to-right, top-to-bottom)
- [ ] Skip to content link present
- [ ] No keyboard traps (except modals)
- [ ] Escape closes modals/drawers
- [ ] Focus returns to trigger on modal close

### Focus Visibility
- [ ] Links show :focus-visible outline
- [ ] Buttons show :focus-visible outline
- [ ] Cards show :focus-visible outline
- [ ] Form inputs show :focus-visible outline
- [ ] Focus ring has minimum 3:1 contrast

### ARIA & Semantics
- [ ] Images have alt text
- [ ] Form fields have labels
- [ ] Buttons have accessible names
- [ ] Modals have role="dialog"
- [ ] Drawers announce open/close state
- [ ] Heading hierarchy is logical (h1 → h2 → h3)

### Color Contrast
- [ ] Body text meets 4.5:1 ratio
- [ ] Large text meets 3:1 ratio
- [ ] CTA button text meets 4.5:1 ratio
- [ ] Links distinguishable from text
- [ ] Error states not color-only

### Motion & Animation
- [ ] Animations respect prefers-reduced-motion
- [ ] No excessive motion on scroll
- [ ] Carousels have pause controls

---

## ⚡ PERFORMANCE SANITY CHECKS

### Layout Stability (CLS)
- [ ] Header height is reserved (no shift on load)
- [ ] Hero/slideshow has min-height set
- [ ] Images have width/height or aspect-ratio
- [ ] Fonts have fallback (no FOUT/FOIT causing shifts)
- [ ] Lazy-loaded images have placeholder space

### No Horizontal Scroll
- [ ] Home page: no overflow-x
- [ ] Collection page: no overflow-x
- [ ] PDP: no overflow-x
- [ ] Cart: no overflow-x
- [ ] Test at 320px viewport width

### Lighthouse Accessibility
- [ ] Run Lighthouse on Home page (target: 90+)
- [ ] Run Lighthouse on Collection page (target: 90+)
- [ ] Run Lighthouse on PDP (target: 90+)
- [ ] Run Lighthouse on Cart page (target: 90+)
- [ ] Document any new issues

---

## ✅ Sign-Off

| Page | Desktop | Mobile | Accessibility | Performance |
|------|---------|--------|---------------|-------------|
| Home | ☐ Pass | ☐ Pass | ☐ Pass | ☐ Pass |
| Collection | ☐ Pass | ☐ Pass | ☐ Pass | ☐ Pass |
| PDP | ☐ Pass | ☐ Pass | ☐ Pass | ☐ Pass |
| Cart | ☐ Pass | ☐ Pass | ☐ Pass | ☐ Pass |

**Tester:** _______________  
**Date:** _______________  
**Browser/Device:** _______________

---

## 📝 Notes

### Known Issues
_Document any known issues that won't be fixed:_

1. _Issue description_
2. _Issue description_

### Testing Tools Used
- Browser: Chrome/Firefox/Safari
- Screen Reader: VoiceOver/NVDA
- Lighthouse version: ___
- axe DevTools: Yes/No

---

**Last Updated:** 2026-01-26  
**Version:** 1.0  
**Related Files:** `assets/techauraz-tokens.css`, `assets/base.css`, `docs/QA_CHECKLIST.md`
