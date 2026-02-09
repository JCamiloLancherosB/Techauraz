# Visual System Unification - Testing Checklist

## Overview
This document outlines the comprehensive testing checklist for the visual system unification implemented in December 2024. The changes primarily focus on dark theme consistency, rating visibility, and UI polish across product pages and cards.

## Changes Summary

### New Asset
- **File**: `assets/visual-system-unified-2024.css`
- **Size**: ~17KB
- **Purpose**: Comprehensive dark theme palette, rating visibility fixes, and UI refinements

### Modified Files
1. `sections/main-product.liquid` - Added CSS include
2. `snippets/card-product.liquid` - Added CSS include
3. `sections/featured-product.liquid` - Added CSS include
4. `sections/main-collection-product-grid.liquid` - Added CSS include
5. `sections/related-products.liquid` - Added CSS include
6. `sections/featured-collection.liquid` - Added CSS include

## Testing Checklist

### 1. Rating Stars Visibility ⭐ (CRITICAL)

#### Product Cards
- [ ] Stars are visible on dark card backgrounds
- [ ] Filled stars appear in amber (#fbbf24)
- [ ] Empty stars appear in subtle gray (rgba(148, 163, 184, 0.3))
- [ ] Rating text is readable (#cbd5e1)
- [ ] Rating count is readable (#94a3b8)
- [ ] Stars have proper drop-shadow for depth

#### Product Detail Page
- [ ] Stars are larger and more prominent
- [ ] Stars are visible against product page background
- [ ] Rating information displays correctly below stars
- [ ] Stars scale appropriately on mobile

#### Collection Pages
- [ ] Stars appear consistently across all product grids
- [ ] Hover states don't affect star visibility
- [ ] Stars align properly with other card elements

### 2. Dark Theme Palette 🎨

#### Card Backgrounds
- [ ] Cards have consistent gradient background (slate tones)
- [ ] Background transitions smoothly on hover
- [ ] Card borders are subtle but visible (rgba(148, 163, 184, 0.2))
- [ ] Hover state shows amber border (rgba(251, 191, 36, 0.6))
- [ ] Shadow effects create proper depth

#### Text Contrast
- [ ] Product titles are cream-colored (#fef3c7) and readable
- [ ] Hover state changes title to amber (#fbbf24)
- [ ] Descriptions are light gray (#cbd5e1) and readable
- [ ] All text meets WCAG AA contrast requirements

#### Product Page
- [ ] Info container has consistent dark background
- [ ] Product title is prominent and readable
- [ ] Description text has proper line-height and color
- [ ] Media wrapper matches the overall theme

### 3. Badge System 🏷️

#### Badge Colors and Styles
- [ ] "Nuevo" badge: Emerald gradient with white text
- [ ] "En Oferta" badge: Amber gradient with dark text
- [ ] Discount percentage badge: Red gradient with white text
- [ ] "Más vendido" badge: Purple gradient with white text
- [ ] Stock warning badge: Orange gradient with animation
- [ ] "Agotado" badge: Gray gradient

#### Badge Functionality
- [ ] All badges have proper borders
- [ ] Backdrop-filter creates glass effect
- [ ] Badges don't overlap or overflow
- [ ] Text is never truncated
- [ ] Mobile: Badges scale appropriately
- [ ] Stock badge animates (pulse effect)
- [ ] Animation respects prefers-reduced-motion

### 4. Trust Indicators & Status Chips ✓

#### Card Trust Indicators
- [ ] "Envío rápido" chip displays correctly
- [ ] "En stock" chip displays correctly
- [ ] Chips have green accent (rgba(16, 185, 129))
- [ ] Checkmark icon appears before text
- [ ] Chips have subtle background and border
- [ ] Backdrop-filter creates depth

#### Product Page Trust Elements
- [ ] Trust badges section styled consistently
- [ ] Individual badges have proper spacing
- [ ] Icons and text align properly
- [ ] Section matches overall theme

### 5. Price Display 💰

#### Card Prices
- [ ] Regular price is bright green (#10b981)
- [ ] Font weight is bold (800)
- [ ] Font size is prominent (1.8rem desktop, 1.6rem mobile)
- [ ] Text shadow provides depth
- [ ] Sale price (strikethrough) is visible but subdued

#### Product Page Prices
- [ ] Larger font size (2.4rem)
- [ ] Same green accent maintained
- [ ] Compare-at price properly styled
- [ ] Price updates work correctly with variants

#### Contrast and Readability
- [ ] Green is readable on dark backgrounds
- [ ] No accessibility issues with color choice
- [ ] Mobile: Prices remain readable at smaller sizes

### 6. Links and Interactive Elements 🔗

#### "Ver todos los detalles" Link
- [ ] Link color is blue (#60a5fa) and visible
- [ ] Hover state lightens color (#93c5fd)
- [ ] Underline appears on hover
- [ ] Background highlight appears on hover
- [ ] Focus-visible state shows outline

#### Other Links
- [ ] Card links don't interfere with overlay
- [ ] Hover states work properly
- [ ] Focus states are visible for keyboard navigation
- [ ] All links meet accessibility standards

### 7. Layout and Spacing 📐

#### Line Clamping
- [ ] Product titles clamp to 2 lines
- [ ] Descriptions clamp to 2 lines
- [ ] Ellipsis appears for overflow text
- [ ] No awkward text cutoffs
- [ ] Consistent card heights in grids

#### Spacing Consistency
- [ ] Card information section has consistent gaps (0.6rem)
- [ ] Elements don't overlap
- [ ] Margins and paddings are uniform
- [ ] Mobile: Spacing scales appropriately

#### Shadows and Elevation
- [ ] Cards have layered shadow (depth + ambient)
- [ ] Hover elevation increases shadow
- [ ] Shadow colors match theme (dark with amber hint)
- [ ] No jarring shadow transitions

### 8. Buttons and CTAs 🔘

#### Primary Buttons
- [ ] Amber gradient background (#f59e0b → #d97706)
- [ ] Dark text for contrast (#0f172a)
- [ ] Font weight is bold (700)
- [ ] Min-height 48px (WCAG touch target)
- [ ] Hover: Lightens and elevates
- [ ] Focus: Visible outline (#fbbf24)
- [ ] Uppercase with letter-spacing

#### Secondary Buttons
- [ ] Dark semi-transparent background
- [ ] Light text (#e2e8f0)
- [ ] Subtle border (rgba(148, 163, 184, 0.4))
- [ ] Hover: Amber accent
- [ ] Backdrop-filter for glass effect

#### Mobile Optimization
- [ ] Buttons fill width on small screens
- [ ] Font sizes scale appropriately
- [ ] Touch targets remain 44px minimum

### 9. Product Page Specific Elements 🛍️

#### Countdown Timer
- [ ] Red gradient background (alert style)
- [ ] Cream-colored values (#fef3c7)
- [ ] Pale red text (#fca5a5)
- [ ] Proper border and backdrop-filter
- [ ] Animation works (if applicable)

#### Trust Section
- [ ] Section has consistent dark background
- [ ] Badges align properly
- [ ] Icons render correctly
- [ ] Text is readable

### 10. Responsive Design 📱

#### Mobile (< 749px)
- [ ] Cards: min-height 400px
- [ ] Information padding: 1rem 1.2rem
- [ ] Badge font-size: 0.95rem
- [ ] Price font-size: 1.6rem
- [ ] Button font-size: 1.3rem
- [ ] Trust indicators scale properly
- [ ] No horizontal overflow

#### Tablet (750px - 989px)
- [ ] Cards: min-height 450px
- [ ] Proper spacing and sizing
- [ ] Grid layout works correctly

#### Desktop (> 990px)
- [ ] Cards: Standard sizing
- [ ] Hover effects work smoothly
- [ ] All elements properly spaced

### 11. Accessibility ♿

#### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Focus-visible states are clear
- [ ] Tab order is logical
- [ ] No focus traps

#### Color Contrast
- [ ] All text meets WCAG AA (4.5:1 for normal, 3:1 for large)
- [ ] Rating stars are clearly visible
- [ ] Badges have sufficient contrast
- [ ] Links are distinguishable

#### High Contrast Mode
- [ ] Cards have thicker borders
- [ ] Badges have bolder fonts
- [ ] Stars are more prominent

#### Reduced Motion
- [ ] Animations are disabled or minimal
- [ ] No vestibular issues
- [ ] Transitions are instant
- [ ] Stock badge animation stops

### 12. Cross-Browser Testing 🌐

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS)
- [ ] Safari (iOS)
- [ ] Chrome (Android)

#### Specific Checks
- [ ] Backdrop-filter works (or has fallback)
- [ ] Gradients render correctly
- [ ] Text-shadow displays properly
- [ ] CSS Grid/Flexbox layouts work
- [ ] Will-change doesn't cause issues

### 13. Performance ⚡

#### CSS File
- [ ] File loads without errors
- [ ] No console warnings
- [ ] Styles apply correctly
- [ ] No FOUC (Flash of Unstyled Content)

#### Rendering
- [ ] No layout shifts (CLS)
- [ ] Smooth animations (60fps)
- [ ] GPU acceleration works (will-change)
- [ ] No janky scrolling

#### Network
- [ ] CSS file size is reasonable (~17KB)
- [ ] Gzip/Brotli compression works
- [ ] Cached properly on repeat visits

### 14. Integration Testing 🔧

#### Card Component
- [ ] Works in collection grids
- [ ] Works in featured collections
- [ ] Works in related products
- [ ] Works in search results
- [ ] Quick-add functionality preserved

#### Product Page
- [ ] Variant selection works
- [ ] Add to cart works
- [ ] Media gallery works
- [ ] Reviews display correctly
- [ ] All sections render properly

#### Existing Features
- [ ] Quick-add modal works
- [ ] Product filters work
- [ ] Sorting works
- [ ] Pagination works
- [ ] No JavaScript errors

### 15. Edge Cases 🔍

#### Product Cards
- [ ] Products without images
- [ ] Products without ratings
- [ ] Products with long titles
- [ ] Products with multiple badges
- [ ] Out of stock products
- [ ] Products on sale

#### Product Page
- [ ] Products with many variants
- [ ] Products with no reviews
- [ ] Products with media galleries
- [ ] Products with long descriptions

## Manual Testing Procedure

1. **Clear browser cache** to ensure fresh CSS loads
2. Navigate to **Collection page** (e.g., /collections/all)
3. Check **product cards** for rating visibility and styling
4. Test **hover states** on multiple cards
5. Navigate to **Product detail page**
6. Verify **rating stars** are prominent and visible
7. Check **all badges** display correctly
8. Test **button interactions** (hover, focus)
9. Verify **prices** are readable
10. Test on **mobile device** or responsive mode
11. Navigate to **Related products** section
12. Test **Featured collection** on homepage
13. Use **keyboard navigation** to test accessibility
14. Enable **high contrast mode** in OS
15. Enable **prefers-reduced-motion** in browser

## Known Issues

*(Document any known issues here)*

- None currently identified

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari 14+
- Chrome Android 90+

## Notes

- The CSS uses modern features like `backdrop-filter`, `-webkit-line-clamp`, and CSS gradients
- Fallbacks are provided where necessary
- All changes are purely CSS-based with no JavaScript modifications
- Existing functionality should remain completely intact
- The CSS file can be toggled off by removing the stylesheet include

## Success Criteria

All items in sections 1-6 must pass for the implementation to be considered successful:
1. ✅ Rating stars visible everywhere
2. ✅ Dark theme consistent across all components
3. ✅ Badges follow unified accent system
4. ✅ Trust indicators styled properly
5. ✅ Prices highly visible and readable
6. ✅ Links have proper contrast and interactions

## Rollback Plan

If critical issues are found:
1. Remove `{{ 'visual-system-unified-2024.css' | asset_url | stylesheet_tag }}` from affected files
2. Clear theme cache in Shopify admin
3. Test to verify rollback successful

## Sign-Off

- [ ] Visual design review completed
- [ ] Functionality testing completed
- [ ] Accessibility testing completed
- [ ] Mobile testing completed
- [ ] Cross-browser testing completed
- [ ] Performance impact assessed
- [ ] Ready for production deployment
