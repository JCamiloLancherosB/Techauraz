# Quick Testing Guide - UI/UX Refinements

## Pre-Testing Setup
1. Deploy theme to Shopify store or preview environment
2. Clear browser cache
3. Test on multiple devices/browsers

---

## Desktop Testing (1920x1080)

### Header
1. ✅ Header spans full width
2. ✅ Logo visible and clickable
3. ✅ Navigation menu accessible
4. ✅ Search icon opens modal
5. ✅ Account icon links correctly
6. ✅ Cart icon shows count badge
7. ✅ All icons have amber focus outline on Tab

### Product Cards (Home/Collection)
1. ✅ Cards display in grid (3-4 columns)
2. ✅ Card heights are consistent
3. ✅ Hover shows amber border glow
4. ✅ Hover shows secondary image (if enabled)
5. ✅ Badges visible (Sale/New/Shipping)
6. ✅ Title text wraps to 2 lines max
7. ✅ Price visible in green
8. ✅ Quick-add button has amber gradient
9. ✅ Quick-add button hover effect works

### Cart
1. ✅ Add to cart from product page
2. ✅ Cart drawer opens (if drawer enabled)
3. ✅ Checkout button has amber gradient
4. ✅ Checkout button hover effect
5. ✅ All cart buttons have proper focus states

---

## Tablet Testing (768x1024)

### Header
1. ✅ Header maintains spacing
2. ✅ All controls clickable
3. ✅ Touch targets are 44x44px minimum

### Product Cards
1. ✅ Cards display in 2-3 columns
2. ✅ Spacing looks good
3. ✅ Quick-add buttons tappable
4. ✅ Badges legible

### Cart
1. ✅ Cart drawer functional
2. ✅ Buttons easily tappable

---

## Mobile Testing (375x667)

### Header
1. ✅ Hamburger menu icon visible
2. ✅ Hamburger opens drawer
3. ✅ Menu drawer scrollable
4. ✅ Close button works
5. ✅ Search, account, cart icons visible
6. ✅ All icons at least 44x44px

### Product Cards
1. ✅ Cards display in 2 columns (or 1 on very small)
2. ✅ Card content readable
3. ✅ Badges visible but not overwhelming
4. ✅ Quick-add button 44px height
5. ✅ Quick-add button text readable

### Cart
1. ✅ Add to cart works
2. ✅ Cart drawer opens full screen
3. ✅ Quantity controls work
4. ✅ Checkout button prominent
5. ✅ Checkout button 52px height

---

## Keyboard Navigation Testing

### Tab Order
1. ✅ Tab through header (logo → nav → search → account → cart)
2. ✅ Tab through product cards (title → quick-add)
3. ✅ Focus visible with amber outline
4. ✅ Focus offset looks good (2px)

### Keyboard Shortcuts
1. ✅ ESC closes search modal
2. ✅ ESC closes cart drawer
3. ✅ ESC closes menu drawer
4. ✅ Enter activates buttons
5. ✅ Enter activates links
6. ✅ Arrow keys in dropdowns (if applicable)

---

## Color/Accessibility Testing

### Visual
1. ✅ Amber color feels warm but professional
2. ✅ Headings have warm cream color
3. ✅ Body text readable (light slate)
4. ✅ Links visible (amber)
5. ✅ Buttons stand out (amber gradient)
6. ✅ Badges legible with shadows

### Contrast
1. ✅ Body text contrast ratio ≥ 4.5:1
2. ✅ Heading contrast ratio ≥ 4.5:1
3. ✅ Button text contrast ratio ≥ 4.5:1
4. ✅ Focus outline contrast ratio ≥ 3:1

### Screen Reader
1. ✅ Navigate with screen reader enabled
2. ✅ ARIA labels read correctly
3. ✅ Images have alt text
4. ✅ Buttons have descriptive labels
5. ✅ Status messages announced

---

## Functional Testing

### Quick-Add (Simple Product)
1. ✅ Click quick-add button
2. ✅ Loading spinner appears
3. ✅ Product added to cart
4. ✅ Cart notification/drawer shows

### Quick-Add (Variant Product)
1. ✅ Click quick-add button
2. ✅ Variant picker opens (or default variant added)
3. ✅ Select variant
4. ✅ Product added to cart

### Search
1. ✅ Click search icon
2. ✅ Search modal opens
3. ✅ Type query
4. ✅ Results appear (if predictive search enabled)
5. ✅ Submit search works
6. ✅ Close button works

### Cart Drawer
1. ✅ Add product to cart
2. ✅ Drawer slides in
3. ✅ Product listed
4. ✅ Quantity controls work
5. ✅ Remove item works
6. ✅ Checkout button navigates

---

## Cross-Browser Testing

### Chrome (Latest)
- [ ] All features working
- [ ] Gradients render correctly
- [ ] Transforms smooth
- [ ] Focus states visible

### Firefox (Latest)
- [ ] All features working
- [ ] Gradients render correctly
- [ ] Transforms smooth
- [ ] Focus states visible

### Safari (Latest)
- [ ] All features working
- [ ] Gradients render correctly
- [ ] Transforms smooth
- [ ] Focus states visible
- [ ] iOS Safari tested

### Edge (Latest)
- [ ] All features working
- [ ] Gradients render correctly
- [ ] Transforms smooth
- [ ] Focus states visible

---

## Performance Check

### Page Load
1. ✅ Hero/banner loads quickly
2. ✅ Header renders immediately
3. ✅ Cards load progressively
4. ✅ Images lazy load
5. ✅ No layout shift (CLS)

### Interactions
1. ✅ Hover effects smooth
2. ✅ Drawer animations smooth
3. ✅ Button transitions smooth
4. ✅ No janky scrolling

---

## Issues to Watch For

### Common Issues
- [ ] Cards with different heights (should be normalized)
- [ ] Badges overlapping text
- [ ] Buttons too small on mobile
- [ ] Focus outline cut off
- [ ] Hover effects not working
- [ ] Gradients not rendering
- [ ] Text contrast too low
- [ ] Touch targets too small

### Edge Cases
- [ ] Very long product titles
- [ ] Products without images
- [ ] Products with many variants
- [ ] Empty cart state
- [ ] Sold out products
- [ ] Sale products without compare price

---

## Sign-Off Checklist

After testing, verify:
- [ ] All header controls functional
- [ ] Cards consistent and conversion-focused
- [ ] Buttons accessible and styled properly
- [ ] Palette feels warm and welcoming
- [ ] No broken layouts on mobile
- [ ] Quick-add works with/without variants
- [ ] Cart drawer fully functional
- [ ] Search modal functional
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

---

## Reporting Issues

If you find issues, report with:
1. Device/browser used
2. Screen size
3. Steps to reproduce
4. Expected vs actual behavior
5. Screenshot if visual issue

---

**Testing Period**: December 21-22, 2024  
**Tester**: [Your Name]  
**Status**: [In Progress / Complete]  
**Issues Found**: [Number]  
**Critical Issues**: [Number]
