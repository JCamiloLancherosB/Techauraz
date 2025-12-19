# TechAura Theme Deployment Checklist

## Pre-Deployment Verification

### 1. Code Quality
- [x] No JavaScript console errors
- [x] No CodeQL security vulnerabilities
- [x] Code review feedback addressed
- [x] CSS maintainability improved (inline styles moved to classes)
- [x] Money formatting uses Shopify.formatMoney with fallback

### 2. Functionality Testing

#### Images
- [ ] Collection pages: All product images visible
- [ ] Home page: All images visible with 4:5 aspect ratio
- [ ] Product detail page: Product images show with contain (full product visible)
- [ ] Related products: Images visible with cover
- [ ] No blank/invisible images anywhere

#### Header
- [ ] Desktop (>990px): Icons sized at ~22px
- [ ] Tablet (750-990px): Icons sized properly
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
- [ ] Create test product with metafield:
  ```
  Namespace: techauraz
  Key: theme_style
  Value: warm_cro
  ```
- [ ] Verify warm colors apply to:
  - Product title (dark text)
  - Background (warm tones)
  - CTA buttons (orange gradient)
  - Badges (orange gradient)
- [ ] Verify layout remains unchanged

### 3. Responsive Testing

#### Mobile (<750px)
- [ ] Images visible in 2-column grid
- [ ] Header compact (56px height)
- [ ] Hamburger menu works
- [ ] Cart drawer functional
- [ ] Product page layout proper

#### Tablet (750-990px)
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

#### Page Load
- [ ] Time to First Byte (TTFB): < 1s
- [ ] First Contentful Paint (FCP): < 2s
- [ ] Largest Contentful Paint (LCP): < 3s
- [ ] No layout shifts (CLS near 0)

#### Images
- [ ] Images load progressively
- [ ] No lazy loading blocking above-fold images
- [ ] Aspect ratios prevent layout shift

### 6. Accessibility
- [ ] Header icons have 44px minimum touch target
- [ ] All interactive elements keyboard accessible
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators visible

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

## Rollback Plan

If issues occur after deployment:

### Quick Rollback
1. In Shopify Admin > Online Store > Themes
2. Find previous theme version
3. Click "Actions" > "Publish"

### Selective Rollback
If only specific features are problematic, revert individual files:

**Critical Files (revert in order of impact)**:
1. `layout/theme.liquid` - If site-wide JS errors
2. `assets/base.css` - If images broken
3. `assets/custom-scripts.js` - If widget errors
4. `snippets/cart-drawer.liquid` - If cart broken
5. `sections/main-product.liquid` - If PDP broken

### Git Rollback
```bash
# Revert to specific commit
git revert a7405b3

# Or reset to previous commit
git reset --hard 85762f8
git push origin main --force
```

## Known Issues & Limitations

### Expected Behavior
1. **Aspect Ratio**: Requires modern browser (CSS `aspect-ratio` support)
   - Fallback: Images may not maintain exact ratio in IE11
2. **Warm CRO**: Requires manual metafield setup per product
3. **COD Cart Note**: Optional fields not yet implemented (Phase 2)

### Browser-Specific
1. **IE11**: Degraded experience (basic functionality only)
2. **Safari < 14**: May not support all CSS features

## Support Contacts

**Theme Developer**: GitHub Copilot  
**Last Updated**: December 16, 2024  
**Documentation**: See THEME_FIXES_2024.md  
**Code Review**: Completed with all feedback addressed  
**Security Scan**: Passed (CodeQL - 0 alerts)

## Additional Resources

- **Main Documentation**: THEME_FIXES_2024.md
- **Implementation Summary**: IMPLEMENTATION_SUMMARY.md
- **Improvements Log**: IMPROVEMENTS.md
- **README**: README.md

---

## Deployment Sign-off

- [ ] All pre-deployment tests passed
- [ ] Backup created
- [ ] Deployment completed successfully
- [ ] Post-deployment monitoring completed
- [ ] No critical issues detected

**Deployed by**: _________________  
**Date**: _________________  
**Time**: _________________  
**Theme Version**: Premium Tech Dark v2024.1
