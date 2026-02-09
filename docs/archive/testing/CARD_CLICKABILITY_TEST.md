# Card Clickability Testing Guide

## Changes Made
1. Added full-card overlay link in `snippets/card-product.liquid`
2. Created `assets/card-clickable-fix.css` with stretched link pattern
3. Included new CSS in `layout/theme.liquid`

## What to Test

### Desktop Testing (990px+)

#### Full Card Clickability
1. ✅ Hover over product card image → Should see hover effects (card lift, border glow)
2. ✅ Click anywhere on card image → Should navigate to product page
3. ✅ Click on product description text → Should navigate to product page
4. ✅ Click on price area → Should navigate to product page
5. ✅ Hover shows cursor: pointer on entire card area

#### Interactive Elements Remain Functional
1. ✅ Click "Quick Add" button → Should open variant selector or add to cart (NOT go to product page)
2. ✅ Click on quantity controls (if visible) → Should change quantity (NOT go to product page)
3. ✅ Click "Ver todos los detalles" link → Should navigate to product page
4. ✅ All buttons should be clickable and work as expected

#### Title Display (Desktop)
1. ✅ Product titles should display up to 3 lines
2. ✅ No unwanted truncation on short titles (1-2 lines)
3. ✅ Ellipsis (...) only appears after 3 full lines
4. ✅ Title text is readable and properly sized
5. ✅ Title color changes to amber (#fbbf24) on hover

### Tablet Testing (750px - 989px)

#### Full Card Clickability
1. ✅ Touch anywhere on card → Should navigate to product page
2. ✅ Touch targets are at least 44x44px

#### Interactive Elements
1. ✅ "Quick Add" button is tappable and functional
2. ✅ Other buttons remain above overlay and work correctly

#### Title Display (Tablet)
1. ✅ Product titles should display up to 2 lines
2. ✅ Font size is readable (1.5rem)
3. ✅ Text wraps properly

### Mobile Testing (< 750px)

#### Full Card Clickability
1. ✅ Tap anywhere on card → Should navigate to product page
2. ✅ All touch targets at least 44x44px

#### Interactive Elements
1. ✅ "Quick Add" button is easily tappable
2. ✅ Quick Add works without navigating to product page
3. ✅ Modal opener buttons work correctly

#### Title Display (Mobile)
1. ✅ Product titles should display up to 2 lines
2. ✅ Font size is 1.4rem (readable on small screens)
3. ✅ No horizontal overflow

### Keyboard Navigation & Accessibility

#### Focus States
1. ✅ Press Tab → Overlay link should receive focus with amber outline
2. ✅ Press Tab again → Should focus on Quick Add button
3. ✅ Focus outline is visible (2px solid #fbbf24)
4. ✅ Focus outline has proper offset (3px)

#### Screen Reader
1. ✅ Overlay link reads product title (aria-label set)
2. ✅ Visually hidden text provides context
3. ✅ Buttons are properly labeled

#### Keyboard Actions
1. ✅ Press Enter on focused overlay link → Navigate to product page
2. ✅ Press Enter on focused Quick Add → Trigger add to cart action

### Edge Cases to Test

#### Long Product Titles
1. ✅ Test with 50+ character title
2. ✅ Test with multi-word long title
3. ✅ Verify ellipsis appears correctly
4. ✅ No layout breaking

#### Cards Without Images
1. ✅ Card is still clickable
2. ✅ Overlay covers placeholder area

#### Multiple Badges
1. ✅ Badges remain visible
2. ✅ Badges don't interfere with clickability
3. ✅ Badges have proper z-index (2)

#### Sold Out Products
1. ✅ Card is clickable
2. ✅ "Sold Out" badge visible
3. ✅ Quick Add disabled but card link works

### Visual Regression Testing

#### Hover Effects
1. ✅ Card lifts 4px on hover (`translateY(-4px)`)
2. ✅ Border color changes to amber with 50% opacity
3. ✅ Box shadow appears with amber glow
4. ✅ Product image scales to 1.05
5. ✅ Title color changes to amber (#fbbf24)

#### Default State
1. ✅ No visual changes from original design
2. ✅ All existing styles preserved
3. ✅ No layout shifts or jumps

### Cross-Browser Testing

#### Chrome/Edge
- [ ] Full card clickable
- [ ] Interactive elements work
- [ ] Hover effects smooth
- [ ] Focus states visible

#### Firefox
- [ ] Full card clickable
- [ ] Interactive elements work
- [ ] Hover effects smooth
- [ ] Focus states visible

#### Safari (Desktop & iOS)
- [ ] Full card clickable
- [ ] Interactive elements work
- [ ] Hover/touch effects work
- [ ] Focus states visible

## Known Issues to Watch For

### Potential Issues
- [ ] Overlay blocking interactive elements (should not happen - z-index: 2)
- [ ] Double navigation on title click (should not happen - title also has z-index: 2)
- [ ] Focus outline cut off (should not happen - proper offset set)
- [ ] Title truncation too aggressive (fixed with new CSS)

### CSS Conflicts
- [ ] Check if other CSS overrides `.card-wrapper { position: relative; }`
- [ ] Verify no other elements have higher z-index than 2 inside card-wrapper
- [ ] Ensure no other CSS removes cursor: pointer

## Success Criteria

All of the following must be true:
1. ✅ Entire card area is clickable and navigates to product page
2. ✅ Quick Add button remains functional (does NOT navigate away)
3. ✅ All interactive elements (buttons, forms) work correctly
4. ✅ Product titles display properly (3 lines desktop, 2 lines mobile)
5. ✅ No unwanted truncation of short titles
6. ✅ Keyboard navigation works correctly
7. ✅ Screen readers announce content properly
8. ✅ Hover effects are smooth and visually appealing
9. ✅ Focus states are visible and meet accessibility standards
10. ✅ No layout breaking or visual regressions

## Testing Checklist

- [ ] Desktop (1920x1080) - Chrome
- [ ] Desktop (1920x1080) - Firefox
- [ ] Desktop (1920x1080) - Safari
- [ ] Tablet (768x1024) - Chrome
- [ ] Tablet (768x1024) - Safari iOS
- [ ] Mobile (375x667) - Chrome
- [ ] Mobile (375x667) - Safari iOS
- [ ] Keyboard navigation tested
- [ ] Screen reader tested (NVDA/VoiceOver)

## Reporting Issues

If issues are found, include:
1. Device/Browser/OS
2. Screen resolution
3. Steps to reproduce
4. Expected vs Actual behavior
5. Screenshot or screen recording
6. Console errors (if any)

---

**Test Date**: _____________  
**Tested By**: _____________  
**Status**: [ ] Pass [ ] Fail [ ] Needs Review  
**Issues Found**: _____________  
**Notes**: _____________
