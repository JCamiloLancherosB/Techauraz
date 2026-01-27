# QA Conversion Checklist - TechAura Theme

A manual testing checklist focused on **conversion-critical UI elements** to catch layout/visibility regressions before they hurt sales.

> **Purpose:** This checklist targets the specific UI pain points that directly impact user experience and conversions. Use it before each deploy or after major CSS/layout changes.

---

## 🏠 HOME PAGE

### Hero Section
- [ ] **Hero visible under header** — The hero image/slideshow is fully visible and not obscured by the sticky header or announcement bar
- [ ] **No CLS (Cumulative Layout Shift)** — Hero loads without causing visible layout shifts
- [ ] **CTA buttons above fold** — Primary call-to-action buttons are visible without scrolling on desktop (1280px+)
- [ ] **CTA contrast** — CTA buttons have sufficient color contrast (4.5:1 minimum) and are clearly clickable

### Benefits/USP Section
- [ ] **Benefits section readable** — Benefit icons/text are legible and not truncated
- [ ] **Proper spacing** — Benefits items are evenly spaced and don't overlap
- [ ] **Mobile wrap** — Benefits wrap correctly on mobile without horizontal scroll

### Category Navigation Cards
- [ ] **Cards aligned** — All category cards in the grid have equal heights and aligned content
- [ ] **Images consistent** — Category images have the same aspect ratio and don't stretch
- [ ] **Text truncation** — Category titles don't overflow or get clipped unexpectedly
- [ ] **Hover states** — Cards have consistent hover effects (lift, shadow, etc.)
- [ ] **Click area** — Entire card is clickable, not just the text/image

### Best Sellers / Featured Products
- [ ] **Product cards consistent** — All product cards have the same height regardless of title length
- [ ] **Price alignment** — Prices are aligned consistently across all cards in the row
- [ ] **Badge visibility** — Sale/New/Stock badges are visible and don't overlap important content
- [ ] **Add to Cart button** — Quick-add buttons are consistently positioned and accessible
- [ ] **Image aspect ratio** — Product images maintain consistent aspect ratio (no stretching)

### Newsletter Section
- [ ] **Form usable** — Newsletter email input is accessible and functional
- [ ] **Submit button** — Submit button is visible and clickable
- [ ] **Success/Error states** — Form shows proper feedback on submit
- [ ] **Mobile layout** — Form stacks properly on mobile without overflow

---

## 📦 PRODUCT DETAIL PAGE (PDP)

### Buy Box (Above the Fold)
- [ ] **Buy box above fold** — Product title, price, and Add to Cart button are visible without scrolling on desktop
- [ ] **Price prominent** — Price is clearly visible with appropriate font size and contrast
- [ ] **Variant selectors visible** — Size/color selectors are above fold when applicable
- [ ] **Stock status clear** — In stock/Out of stock status is clearly indicated

### Call-to-Action (CTA)
- [ ] **CTA button clear** — "Add to Cart" / "Buy Now" button is prominent, with clear text and high contrast
- [ ] **CTA size appropriate** — Button has adequate size (min 48px height) for easy clicking/tapping
- [ ] **CTA color stands out** — Button color differentiates from surrounding elements
- [ ] **Loading state** — Button shows loading indicator when clicked

### Sticky CTA (Mobile)
- [ ] **Sticky CTA works** — Sticky add-to-cart bar appears when scrolling past the main buy box
- [ ] **Doesn't obscure content** — Sticky bar doesn't cover important content or navigation
- [ ] **Price visible in sticky** — Price is shown in the sticky bar for quick reference
- [ ] **Button functional** — Sticky CTA button works and triggers add-to-cart

### Related Products Grid
- [ ] **Grid aligned** — Related/recommended products cards are aligned in a consistent grid
- [ ] **Card heights equal** — All related product cards have matching heights
- [ ] **No horizontal scroll** — Grid doesn't cause horizontal overflow on any viewport
- [ ] **Products relevant** — Products shown are contextually relevant (cross-sells)

---

## 🛒 ADD-TO-CART FLOW

### Cart Notification Overlay
- [ ] **Overlay works** — Cart notification appears when item is added
- [ ] **Doesn't push layout** — Notification overlay doesn't cause page content to shift or move
- [ ] **Animation smooth** — Notification slides/fades in smoothly without jank
- [ ] **Auto-dismiss** — Notification auto-closes after a few seconds (if applicable)
- [ ] **Close button** — Manual close button works if present

### Cart Drawer (if enabled)
- [ ] **Opens correctly** — Cart drawer slides in from the correct side
- [ ] **Shows added item** — Newly added product is visible in the drawer
- [ ] **Total updates** — Cart total reflects the new item immediately
- [ ] **Checkout CTA visible** — Checkout button is prominent in the drawer
- [ ] **Focus trap** — Keyboard focus stays within the drawer when open
- [ ] **Close on overlay click** — Clicking outside the drawer closes it
- [ ] **No body scroll** — Background page doesn't scroll when drawer is open

---

## 📱 MOBILE-SPECIFIC CHECKS (375px viewport)

### Header Stack
- [ ] **Header height correct** — Header doesn't take up excessive vertical space
- [ ] **Content not hidden** — No content is hidden behind the sticky header
- [ ] **Touch targets** — All header icons have minimum 44x44px touch targets

### Product Grids
- [ ] **2-column grid** — Product grids show 2 columns on mobile (not 1 or 3)
- [ ] **Cards don't overflow** — Cards fit within viewport without horizontal scroll
- [ ] **Prices readable** — Price text is large enough to read without zooming

### Forms
- [ ] **No zoom on focus** — Input fields don't trigger iOS zoom (min 16px font)
- [ ] **Buttons full width** — Primary action buttons span full width on mobile

---

## 🔧 REGRESSION GUARDRAILS

### CSS Variable Consistency
Use `?debug_ui=1` URL parameter to verify these values match expectations:

| Variable | Expected Desktop | Expected Mobile |
|----------|------------------|-----------------|
| `--tech-topbar-h` | 40px | 40px |
| `--tech-header-h` | 80px | 64px |
| `--tech-stack-h` | 120px | 104px |

### Sticky/Fixed Element Check
With `?debug_ui=1` enabled:
- [ ] All sticky/fixed elements are outlined
- [ ] No unexpected fixed elements
- [ ] Z-index stacking order is correct (header > overlays > content)

---

## ✅ Sign-Off

| Section | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Home - Hero | ☐ | ☐ | |
| Home - Benefits | ☐ | ☐ | |
| Home - Categories | ☐ | ☐ | |
| Home - Best Sellers | ☐ | ☐ | |
| Home - Newsletter | ☐ | ☐ | |
| PDP - Buy Box | ☐ | ☐ | |
| PDP - CTA | ☐ | ☐ | |
| PDP - Sticky CTA | N/A | ☐ | |
| PDP - Related Products | ☐ | ☐ | |
| Add to Cart - Notification | ☐ | ☐ | |
| Add to Cart - Drawer | ☐ | ☐ | |

**Tester:** _______________  
**Date:** _______________  
**Browser/Device:** _______________  
**Theme Version:** _______________

---

## 📝 Common Issues & Fixes

### Hero Hidden Behind Header
**Symptom:** Part of the hero is cut off by the sticky header  
**Check:** Ensure `padding-top` or `margin-top` equals `var(--tech-stack-h)`

### Cards Misaligned
**Symptom:** Product cards have different heights  
**Check:** Ensure `display: flex` with `flex-direction: column` and fixed image container height

### Layout Shift on Add-to-Cart
**Symptom:** Page jumps when cart notification appears  
**Check:** Notification should use `position: fixed` or `position: absolute`, not affect document flow

### Sticky CTA Covers Content
**Symptom:** Sticky bar hides product description or footer  
**Check:** Add `padding-bottom` to main content equal to sticky bar height

---

**Last Updated:** 2026-01-27  
**Version:** 1.0  
**Related Files:** `layout/theme.liquid`, `assets/debug-ui.css`, `assets/debug-ui.js`
