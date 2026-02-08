# Techauraz Theme — Deployment & Testing Guide

Consolidated deployment procedures, testing checklists, and rollback plans for the Techauraz Shopify theme.

---

## Table of Contents

1. [Pre-Deployment Verification](#pre-deployment-verification)
2. [Testing Guide](#testing-guide)
3. [Deployment Steps](#deployment-steps)
4. [Post-Deployment Monitoring](#post-deployment-monitoring)
5. [Rollback Plan](#rollback-plan)
6. [Browser Compatibility](#browser-compatibility)
7. [Known Issues & Admin Configuration](#known-issues--admin-configuration)

---

## Pre-Deployment Verification

### 1. Code Quality

- [ ] No JavaScript console errors
- [ ] No CodeQL security vulnerabilities
- [ ] Code review feedback addressed
- [ ] CSS maintainability confirmed (inline styles moved to classes)
- [ ] Money formatting uses `Shopify.formatMoney` with fallback
- [ ] All Liquid templates have valid syntax
- [ ] CSS syntax validated (matching braces)

### 2. Functionality Testing

#### Images

- [ ] Collection pages: All product images visible
- [ ] Home page: All images visible with 4:5 aspect ratio
- [ ] Product detail page: Product images show with `contain` (full product visible)
- [ ] Related products: Images visible with `cover`
- [ ] No blank/invisible images anywhere

#### Header

- [ ] Desktop (>990px): Icons sized at ~22px
- [ ] Tablet (750–990px): Icons sized properly
- [ ] Mobile (<750px): Hamburger menu visible with 44px touch target
- [ ] Sticky header: Shrinks smoothly when scrolling down
- [ ] No icon overlaps in any viewport

#### JavaScript

- [ ] Browser console shows no errors on any page
- [ ] Frequently bought together widget works (if applicable)
- [ ] Clickable cards work without errors
- [ ] Sticky add-to-cart bar functions correctly

#### Cart Drawer

- [ ] Opens correctly
- [ ] COD message displays prominently
- [ ] Checkout button shows "🏠 Checkout - Paga en Casa"
- [ ] Free shipping progress bar works
- [ ] Cart calculations correct

#### Metafield Styling (warm_cro)

- [ ] Create test product with metafield: `techauraz.theme_style = warm_cro`
- [ ] Verify warm colors apply to: product title, background, CTA buttons, badges
- [ ] Verify layout remains unchanged

### 3. Responsive Testing

#### Mobile (<750px)

- [ ] Images visible in 2-column grid
- [ ] Header compact (56px height)
- [ ] Hamburger menu works
- [ ] Cart drawer functional
- [ ] Product page layout proper
- [ ] No horizontal scrollbar
- [ ] Touch targets adequate (min 44px)

#### Tablet (750–990px)

- [ ] Images visible in 3-column grid
- [ ] Header medium size (64px)
- [ ] All functionality works

#### Desktop (>990px)

- [ ] Images visible in 4-column grid
- [ ] Header full size (72px, shrinks to 60px on scroll)
- [ ] All functionality works
- [ ] Sticky header shrink animation smooth

### 4. Browser Compatibility

- [ ] Chrome/Edge (latest): Full functionality
- [ ] Firefox (latest): Full functionality
- [ ] Safari (iOS 14+): Full functionality
- [ ] Safari (macOS): Full functionality

### 5. Performance

- [ ] Time to First Byte (TTFB): < 1s
- [ ] First Contentful Paint (FCP): < 2s
- [ ] Largest Contentful Paint (LCP): < 3s
- [ ] No layout shifts (CLS near 0)
- [ ] Images load progressively
- [ ] No lazy loading blocking above-fold images
- [ ] Aspect ratios prevent layout shift

### 6. Accessibility

- [ ] Header icons have 44px minimum touch target
- [ ] All interactive elements keyboard accessible
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators visible

---

## Testing Guide

### Test 1: Liquid Syntax Error Fix

**What was fixed:** Invalid comment syntax (`{#---`) in `sections/main-product.liquid` → proper Liquid syntax (`{%- comment -%}`)

**How to test:**
1. Navigate to any product detail page
2. **Expected:** Page loads without errors, no Liquid parsing errors, product information displays correctly

**Pass Criteria:**
- ✅ No 500 errors or Liquid parsing errors
- ✅ Product page displays normally
- ✅ All product information visible

---

### Test 2: Cookie Notice

**Changes:** Created `assets/component-cookie-notice.css` with centered positioning (max-width 600px), proper z-index, mobile-responsive

#### Desktop (990px+):
1. Clear cookies and refresh any page
2. **Expected:** Cookie notice appears centered at bottom after 1 second, max 600px width
3. Click "Aceptar" → notice fades out; refresh → notice does not reappear

#### Mobile (<750px):
1. Clear cookies and open site on mobile
2. **Expected:** Cookie notice appears near bottom with 1rem margins, buttons stack properly, doesn't overlap WhatsApp button

**Pass Criteria:**
- ✅ Centered (desktop) or margined (mobile)
- ✅ Compact, not full width
- ✅ No "Shopify" text visible
- ✅ Smooth fade-in/fade-out
- ✅ Buttons work; preference remembered
- ✅ No z-index conflicts

---

### Test 3: Product Card Badges

**Changes:** Font size 0.7rem → 1.1rem, white border, text-shadow, color-coded badges (Green=Nuevo, Red=Promoción, Purple=Bestseller, Orange+pulse=Stock Warning)

**How to test:**
1. Navigate to collection pages or homepage
2. Verify badges appear top-left on product images
3. Check text readability, contrast, and color coding

**Responsive:**
- Desktop (990px+): Font 1.1rem
- Mobile (<750px): Font 1rem, smaller padding

**Pass Criteria:**
- ✅ Badges visible and readable on all product images
- ✅ No text overflow or clipping
- ✅ Consistent color coding
- ✅ Smooth pulse animation on stock warnings

---

### Test 4: Icon Sizing

**Changes:**
- Header SVGs: unified to 20px × 20px
- Product card benefit icons: 12px (10px mobile)
- Product card trust indicator icons: 12px (10px mobile)

**How to test:**
1. Header: Verify search/account/cart icons are same size (20px), centered in 44px touch targets
2. Product cards: Benefit and trust icons small (12px), aligned with text, reducing to 10px on mobile

**Pass Criteria:**
- ✅ Header icons visually same size
- ✅ Card icons smaller and less cluttered
- ✅ Proper aspect ratio (not stretched)
- ✅ Mobile icons appropriately smaller

---

### Test 5: Banner Functionality

1. Navigate to homepage or banner pages
2. **Expected:** Images load, buttons clickable and styled, alt text present

**Pass Criteria:**
- ✅ Banner displays correctly at all sizes
- ✅ Buttons visible, clickable, hover states work
- ✅ Images have proper alt text
- ✅ Content alignment matches admin configuration

---

### Test 6: Product Detail Page

#### Desktop (990px+):
1. Navigate to any product page
2. **Expected:** Images and info side-by-side (50/50), proper padding, no layout shift, sticky sidebar works

#### Tablet (750–989px):
- Two-column layout, readable without horizontal scroll

#### Mobile (<750px):
- Image gallery above info, proper padding, full-width and readable

**Pass Criteria:**
- ✅ Proper grid on desktop
- ✅ No FOUC
- ✅ Responsive behavior correct
- ✅ Mobile stacks properly

---

### Test 7: Responsive Design Verification

Test at these specific widths:
- 375px (iPhone SE)
- 414px (iPhone Pro Max)
- 768px (iPad)
- 1024px (iPad Pro)
- 1440px (Desktop)
- 1920px (Large Desktop)

**At each size, check:**
- Cookie notice positioning and size
- Product card badge sizing
- Icon sizes in header and cards
- Product detail page layout
- Banner alignment

**Pass Criteria:**
- ✅ No horizontal scroll at any width
- ✅ All text readable
- ✅ Touch targets adequate on mobile (min 44px)
- ✅ Images scale properly
- ✅ Consistent breakpoint behavior

---

## Deployment Steps

### 1. Backup

```bash
# Download current theme as backup
# In Shopify Admin > Online Store > Themes
# Click "..." > Download theme file
```

### 2. Upload Changes

```bash
# Option A: Via Shopify CLI (Recommended)
shopify theme push

# Option B: Via Git (if using GitHub integration)
git push origin main

# Option C: Manual upload
# Upload modified files through Shopify admin
```

### 3. Test in Theme Preview

- [ ] Preview theme before publishing
- [ ] Test all functionality in preview mode
- [ ] Verify no breaking changes

### 4. Publish

- [ ] Publish theme
- [ ] Monitor for 10 minutes after publish
- [ ] Check for any errors in browser console
- [ ] Verify cart functionality working

### 5. Post-Deployment Monitoring

- [ ] Check analytics for unusual drop in metrics
- [ ] Monitor error logging (if available)
- [ ] Check customer support for issues
- [ ] Test checkout process end-to-end

---

## Post-Deployment Monitoring

### Success Metrics to Monitor

#### User Experience
- Reduced bounce rate on homepage
- Increased time on product pages
- Higher add-to-cart rate
- Better mobile engagement

#### Technical
- No console errors
- No layout shift issues
- Maintained page load speed
- Improved accessibility score

---

## Rollback Plan

### Quick Rollback (Shopify Admin)

1. Go to **Shopify Admin → Online Store → Themes**
2. Find previous theme version in "Theme library"
3. Click **"Actions" → "Publish"**

### Git Rollback

```bash
# Revert a specific commit
git revert <commit-hash>

# Or reset to a previous commit
git reset --hard <previous-commit>
git push origin main --force
```

### Selective File Rollback

If only specific features are problematic, revert individual files (in order of impact):

1. `layout/theme.liquid` — If site-wide JS errors
2. `assets/base.css` — If images broken
3. `assets/custom-scripts.js` — If widget errors
4. `snippets/cart-drawer.liquid` — If cart broken
5. `sections/main-product.liquid` — If PDP broken

```bash
git checkout <previous-commit> -- <file-path>
```

### UX/CRO Fixes Rollback

To roll back UX/CRO fixes specifically:

1. Remove `ux-cro-fixes.css` from the theme
2. Remove the stylesheet link from `layout/theme.liquid`:
   ```liquid
   <link rel="preload" href="{{ 'ux-cro-fixes.css' | asset_url }}" as="style" onload="this.onload=null;this.rel='stylesheet'">
   <noscript><link rel="stylesheet" href="{{ 'ux-cro-fixes.css' | asset_url }}"></noscript>
   ```
3. Revert `assets/component-slideshow.css` and `sections/featured-collection.liquid` to previous versions

---

## Browser Compatibility

### Supported Browsers

| Browser | Support Level |
|---------|--------------|
| Chrome (latest) | Full |
| Firefox (latest) | Full |
| Safari (latest) | Full |
| Edge (latest) | Full |
| Safari iOS (mobile) | Full |
| Chrome Android (mobile) | Full |
| IE11 | Degraded (basic functionality only) |
| Safari < 14 | May not support all CSS features |

### CSS Features Used

| Feature | Support | Fallback |
|---------|---------|----------|
| Flexbox | Widely supported | — |
| CSS Grid | Modern browsers | — |
| `object-fit` | IE11+ with polyfill | — |
| CSS custom properties | IE not supported | Graceful degradation |
| `scroll-behavior: smooth` | Modern browsers | Graceful degradation |
| `aspect-ratio` | Modern browsers | Images may not maintain ratio in IE11 |
| `backdrop-filter` | WebKit + modern | Solid fallback background |

### What to Verify Per Browser

- Cookie notice displays and functions
- Product card badges render correctly
- Icons display at proper sizes
- CSS animations work (or gracefully degrade)
- No console errors

---

## Known Issues & Admin Configuration

### Issues NOT in Code

1. **Duplicate "Correo electrónico"**
   - Not in theme code
   - Check Shopify admin: Theme → Customize → Header section (remove duplicate email signup/contact blocks)

2. **Cookie Notice "Shopify" Text**
   - No "Shopify" text in code
   - If present, check: Shopify admin → Online Store → Preferences → Privacy, or a third-party app

### Expected Behavior Notes

1. `aspect-ratio` requires modern browser (CSS `aspect-ratio` support)
2. Warm CRO styling requires manual metafield setup per product
3. COD cart note optional fields not yet implemented (Phase 2)

---

## Automated Checks Completed

- ✅ **Code Review:** Passed
- ✅ **Security Scan (CodeQL):** 0 vulnerabilities
- ✅ **Syntax Check:** All Liquid templates valid

---

## Deployment Sign-Off

- [ ] All pre-deployment tests passed
- [ ] Backup created
- [ ] Deployment completed successfully
- [ ] Post-deployment monitoring completed
- [ ] No critical issues detected

**Deployed by:** _________________  
**Date:** _________________  
**Theme Version:** Premium Tech Dark v2024.1

---

## Related Documentation

- [DEPLOYMENT_SUMMARY.md](./deployment/DEPLOYMENT_SUMMARY.md) — Fix summaries for hero carousel, cookie notice, header overflow, product card typography, and product details button
- [CHANGELOG.md](./CHANGELOG.md) — Full change history
- [CSS_ARCHITECTURE.md](./CSS_ARCHITECTURE.md) — CSS architecture reference

---

## Contact

For questions or issues:
- Create an issue in the GitHub repository (tags: `layout`, `styling`, `bug-fix`)
- Include screenshots and browser/device info

**Theme Developer:** GitHub Copilot  
**Last Updated:** December 2024  
**Repository:** JCamiloLancherosB/Techauraz
