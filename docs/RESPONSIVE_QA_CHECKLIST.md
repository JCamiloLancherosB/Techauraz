# Responsive QA Checklist - Techauraz Theme

A comprehensive manual testing checklist for verifying responsive behavior and horizontal overflow prevention across all key pages.

**Version:** 1.0.0  
**Date:** 2026-01-28  
**Related Files:** `assets/ui-ux-responsive-fixes.css`, `docs/qa-checklist.md`

---

## 📐 Target Breakpoints

| Breakpoint | Device Examples | Grid Columns |
|------------|-----------------|--------------|
| 360px | iPhone SE, small Android | 1 column |
| 390px | iPhone 12/13/14 | 1-2 columns |
| 414px | iPhone 6+/7+/8+ Plus | 2 columns |
| 768px | iPad Mini, tablets | 2-3 columns |
| 1024px | iPad Pro, small laptops | 3-4 columns |
| 1280px | Desktop monitors | 4-5 columns |
| 1440px | Large monitors | 5 columns |

---

## 🚫 No Horizontal Overflow Verification

### Pre-Test Setup
- [ ] Open browser DevTools
- [ ] Enable device emulation or responsive design mode
- [ ] Test at each target breakpoint width

### Quick Overflow Check Method
```
1. Set viewport to target width (e.g., 360px)
2. Check if horizontal scrollbar appears
3. Use DevTools to highlight elements extending beyond viewport:
   - Elements panel → Right-click → "Scroll into view"
   - Or add temporary CSS: * { outline: 1px solid red; }
```

---

## 🏠 HOME PAGE

### 360px - Small Mobile

#### Hero/Slideshow
- [ ] Hero image fills viewport width (no gap left/right)
- [ ] Hero text is readable, no word overflow
- [ ] Slideshow controls are visible and tappable (44px touch target)
- [ ] No horizontal scroll from slideshow

#### Categories Section
- [ ] Category cards fit viewport
- [ ] Category carousel scrolls horizontally within bounds
- [ ] No overflow from category images

#### Featured Collections / Carousels
- [ ] Product cards display in 1 column
- [ ] Card images fit container
- [ ] Card titles truncate properly (2 lines max)
- [ ] Quick-add button fits within card
- [ ] Sale/New badges don't overflow card edges
- [ ] Carousel arrows (if visible) don't cause overflow

#### Newsletter Section
- [ ] Form input fits viewport width
- [ ] Submit button is full width
- [ ] No overflow from form elements

#### Footer
- [ ] Footer columns stack vertically
- [ ] Social icons fit in one row
- [ ] Payment icons don't overflow

### 390px - iPhone Standard

- [ ] All 360px checks pass
- [ ] 2-column grid displays correctly (where applicable)
- [ ] Grid gaps are proportional

### 414px - Larger Mobile

- [ ] All previous checks pass
- [ ] Cards have proper spacing
- [ ] Images maintain aspect ratio

### 768px - Tablet

#### Hero/Slideshow
- [ ] Hero maintains aspect ratio
- [ ] Text overlay is properly positioned
- [ ] Slideshow navigation arrows visible

#### Categories Section
- [ ] Categories display in 2-3 column grid
- [ ] Card spacing is even

#### Featured Collections
- [ ] Product grid shows 2-3 columns
- [ ] Cards have consistent heights
- [ ] Quick-add buttons properly positioned

#### Newsletter Section
- [ ] Form displays inline (input + button)
- [ ] Form width is appropriate for tablet

### 1024px - Small Desktop

- [ ] Full desktop layout appears
- [ ] 3-4 column product grids
- [ ] Sidebar filters (if applicable) don't overflow
- [ ] Header navigation items fit

### 1280px - Standard Desktop

- [ ] 4-5 column product grids
- [ ] Content centered with proper margins
- [ ] No stretched elements

### 1440px - Large Desktop

- [ ] Content contained with max-width
- [ ] Side margins are proportional
- [ ] Full-bleed sections span full width

---

## 📦 PDP (Product Detail Page)

### 360px - Small Mobile

#### Gallery Section
- [ ] Main product image fits viewport
- [ ] Image carousel scrolls without overflow
- [ ] Thumbnails (if visible) scroll horizontally within bounds
- [ ] Zoom functionality doesn't cause overflow

#### Product Info / Buy Box
- [ ] Product title wraps properly
- [ ] Price displays without overflow
- [ ] Variant selectors (size/color) fit container
- [ ] Quantity input is appropriately sized
- [ ] Add to Cart button is full width
- [ ] Buy Now button fits without overflow

#### CTAs and Buttons
- [ ] All buttons have 44px minimum height
- [ ] Button text doesn't overflow
- [ ] Secondary actions (wishlist, share) fit

#### Product Description
- [ ] Accordion/tabs fit viewport
- [ ] Long text wraps properly
- [ ] Tables (if any) scroll horizontally

#### Related Products
- [ ] Product cards display in 1 column
- [ ] Cards don't overflow viewport
- [ ] Carousel controls within bounds

### 768px - Tablet

#### Gallery Section
- [ ] Two-column layout (gallery + info)
- [ ] Gallery thumbnails visible
- [ ] Gallery doesn't overlap with product info

#### Product Info
- [ ] Product info takes appropriate width
- [ ] Form elements properly sized

#### Related Products
- [ ] 2-3 column grid
- [ ] Cards properly spaced

### 1024px+ Desktop

#### Gallery Section
- [ ] Gallery zoom works properly
- [ ] Thumbnail navigation visible
- [ ] Gallery images don't exceed container

#### Product Info
- [ ] Sticky add-to-cart (if enabled) doesn't overflow
- [ ] All form elements visible

#### Related Products
- [ ] 4 column grid
- [ ] Carousel navigation visible

---

## 🛒 Cart Drawer

### All Breakpoints

- [ ] Drawer slides in from right
- [ ] Drawer doesn't extend beyond viewport
- [ ] Close button is accessible (44px touch target)
- [ ] Cart items display properly
- [ ] Quantity +/- buttons fit
- [ ] Remove button accessible
- [ ] Checkout button visible
- [ ] Total calculation visible

### Mobile Specific (≤749px)

- [ ] Drawer takes full width (or appropriate mobile width)
- [ ] Items are vertically stacked
- [ ] Checkout button is full width
- [ ] Cart drawer respects safe areas (notch, home indicator)

### Overlay Behavior

- [ ] Overlay click closes drawer
- [ ] Escape key closes drawer
- [ ] Focus trapped inside drawer

---

## 🍪 Cookie Banner

### All Breakpoints

- [ ] Banner appears at bottom of viewport
- [ ] Banner doesn't cause horizontal overflow
- [ ] Text is readable
- [ ] Accept/Reject buttons visible
- [ ] Buttons have proper touch targets (44px)

### Mobile Specific

- [ ] Banner respects safe area (bottom notch)
- [ ] Buttons stack vertically if needed
- [ ] Close/dismiss action accessible

### Stacking with Other Elements

- [ ] Cookie banner doesn't overlap WhatsApp button
- [ ] Cookie banner doesn't overlap sticky CTA
- [ ] Proper z-index hierarchy maintained

---

## 💬 WhatsApp Button (Floating)

### All Breakpoints

- [ ] Button positioned in corner (typically bottom-right)
- [ ] Button doesn't cause horizontal overflow
- [ ] Button has proper touch target (44px minimum)
- [ ] Button visible but not obstructing content

### Mobile Specific

- [ ] Button respects safe area (right and bottom)
- [ ] Button moves up when cookie banner is visible
- [ ] Button moves up when sticky CTA is visible
- [ ] Triple stacking (cookie + CTA + WhatsApp) all visible

### Interaction

- [ ] Button click opens WhatsApp/chat
- [ ] Button tooltip (if any) doesn't overflow

---

## 📱 Sticky CTA Bar (Mobile PDP)

### Mobile Only (≤749px)

- [ ] Sticky CTA appears on PDP scroll
- [ ] CTA bar fits viewport width
- [ ] Product thumbnail visible
- [ ] Price display fits
- [ ] Add to Cart button visible
- [ ] Bar respects safe area (bottom)

### Coordination

- [ ] Bar hides when cart drawer opens
- [ ] Bar adjusts position when cookie banner visible
- [ ] WhatsApp button adjusts position

### Desktop (≥750px)

- [ ] Sticky CTA bar is hidden

---

## ✅ Sign-Off Checklist

### Per Breakpoint

| Breakpoint | Home | PDP | Cart Drawer | Cookie | WhatsApp | Overflow |
|------------|------|-----|-------------|--------|----------|----------|
| 360px | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ None |
| 390px | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ None |
| 414px | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ None |
| 768px | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ None |
| 1024px | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ None |
| 1280px | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ None |
| 1440px | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ None |

### Summary

- [ ] No horizontal overflow at any tested breakpoint
- [ ] All critical CTAs are accessible (touch targets ≥44px)
- [ ] Floating elements (cart, cookie, WhatsApp) properly coordinated
- [ ] Grids adapt appropriately per breakpoint
- [ ] Images contained within their containers

---

## 🐛 Issue Tracking

### Known Issues
_Document any known issues that won't be fixed in this release:_

1. _______________
2. _______________

### Regressions Found
_Document any regressions introduced by changes:_

1. _______________
2. _______________

---

## 📝 Testing Notes

**Tester:** _______________  
**Date:** _______________  
**Browser:** _______________  
**Device / Emulation:** _______________

**Additional Notes:**

---

**Last Updated:** 2026-01-28  
**Version:** 1.0.0
