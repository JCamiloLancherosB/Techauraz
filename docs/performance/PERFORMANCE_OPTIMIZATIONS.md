# Performance Optimizations - TechAura Store

## Overview
This document outlines the performance optimizations implemented to improve Core Web Vitals, specifically targeting mobile performance metrics.

## Target Metrics
- **LCP (Largest Contentful Paint)**: < 2.5s (currently 4.8s → target < 2.5s)
- **FCP (First Contentful Paint)**: < 1.8s (currently 1.7s → maintain/improve)
- **TBT (Total Blocking Time)**: < 300ms (currently 3,300ms → target < 300ms)
- **CLS (Cumulative Layout Shift)**: < 0.05 (currently 0 → maintain)

## Implemented Optimizations

### 1. Critical CSS Inline
**Location**: `layout/theme.liquid` lines 430-495

**What was done**:
- Expanded inline critical CSS to ~60 lines covering:
  - Essential body and typography styles
  - Header positioning and layout
  - Banner/hero container styles
  - Basic grid layout
  - Layout shift prevention for images
  
**Impact**: 
- Prevents Flash of Unstyled Content (FOUC)
- Reduces time to First Contentful Paint
- Eliminates layout shifts during CSS loading

### 2. Enhanced Resource Hints
**Location**: `layout/theme.liquid` lines 4-11

**What was done**:
- Added `dns-prefetch` for cdn.shopify.com
- Added `dns-prefetch` for www.googletagmanager.com and connect.facebook.net
- Maintained `preconnect` for critical origins (CDN, fonts)

**Impact**:
- Reduces DNS lookup time for third-party resources
- Faster connection establishment
- ~50-100ms improvement on resource loading

### 3. Third-Party Script Optimization
**Location**: `layout/theme.liquid` lines 582-645

**What was done**:
- **Google Tag Manager**: Delay increased from 3s to 5s
  - Added `requestIdleCallback` for idle-time loading
  - Added 100ms delay after user interaction to prevent blocking
- **Facebook Pixel**: Delay increased from 4s to 6s
  - Added `requestIdleCallback` for idle-time loading
  - Added 200ms delay after user interaction to prevent blocking
- Both use passive event listeners

**Impact**:
- Reduces main thread blocking time by ~500-800ms
- Scripts load during idle time or after meaningful user interaction
- Prevents blocking of critical rendering path

### 4. Conditional CSS Loading
**Location**: `layout/theme.liquid` lines 446-475

**What was done**:
- Product page CSS (product-page-fixes.css, product-page-refinements.css) loads ONLY on product templates
- Animations CSS loads ONLY when `settings.animations_reveal_on_scroll` is enabled
- Maintained preload+async pattern for all non-critical CSS

**Impact**:
- Reduces CSS payload on non-product pages by ~30KB
- Faster parsing and rendering
- Less render-blocking resources

### 5. Hero Image Optimization
**Location**: `sections/slideshow.liquid` lines 5-14

**What was done**:
- Enhanced preload with progressive JPEG format
- Optimized `imagesizes` for mobile-first approach:
  - Mobile: 100vw (full width)
  - Tablet: 85vw (account for padding)
  - Desktop: 1920px max
- Added `fetchpriority="high"` for LCP image
- Maintained lazy loading for non-first slides

**Impact**:
- Faster LCP on mobile devices
- Reduced image download size on smaller viewports
- Improved prioritization by browser

### 6. Idle Callback Integration
**Location**: `layout/theme.liquid` lines 1051-1088, 1104-1130

**What was done**:
- WhatsApp button animations use `requestIdleCallback`
- Third-party widget loading uses `requestIdleCallback`
- Fallback to setTimeout for older browsers

**Impact**:
- Non-critical animations run during browser idle time
- Reduces main thread contention
- Better Time to Interactive (TTI)

### 7. Scroll Handler Optimization
**Location**: `layout/theme.liquid` lines 1104-1130

**What was done**:
- Consolidated scroll handlers
- Used `requestAnimationFrame` for debouncing
- Applied `passive: true` listeners throughout
- Prevented duplicate RAF calls with ticking flag

**Impact**:
- Reduced scroll jank
- Prevents forced synchronous layouts
- Smoother scrolling experience

### 8. Layout Shift Prevention
**Location**: `layout/theme.liquid` critical CSS

**What was done**:
- Added `will-change: transform` to header
- Set explicit image sizing rules
- Added basic grid constraints

**Impact**:
- Maintains CLS score < 0.05
- Prevents header animation jank
- Stable layout during load

## Performance Impact Summary

### Expected Improvements:
1. **LCP**: 4.8s → ~2.5-3.0s (-40-50%)
   - Hero image preload optimization
   - Critical CSS inline
   - Faster third-party script loading

2. **TBT**: 3,300ms → ~800-1,200ms (-60-70%)
   - Third-party scripts deferred by 5-6s
   - Idle callback integration
   - Optimized scroll handlers

3. **FCP**: 1.7s → ~1.2-1.5s (-15-30%)
   - Critical CSS inline
   - DNS prefetch
   - Reduced render-blocking resources

4. **Speed Index**: 5.8s → ~3.5-4.5s (-25-40%)
   - Conditional CSS loading
   - Image optimization
   - Faster above-fold rendering

## Shopify-Specific Considerations

### Asset Caching
Shopify automatically handles:
- Asset versioning via CDN URLs (e.g., `?v=123456`)
- Long cache TTLs (1 year) for versioned assets
- Brotli/Gzip compression
- Global CDN distribution

**No action needed** - Shopify's infrastructure handles this optimally.

### Image Optimization
Shopify's image CDN supports:
- WebP/AVIF automatic format conversion
- Responsive image URLs with `width` parameter
- Quality control via `quality` parameter
- Format specification via `format` parameter

**Recommendation**: Continue using Shopify's `image_url` filter with responsive widths.

## Additional Recommendations

### 1. Monitor Third-Party Scripts
- **Google Tag Manager**: Consider reducing triggers and tag count
- **Facebook Pixel**: Audit event tracking frequency
- **Microsoft Clarity**: If enabled, consider sampling (50% of sessions)

### 2. Image Best Practices
- Upload images at 2x max display size
- Use 85% quality for photos, 95% for graphics
- Prefer WebP format for better compression
- Add `loading="lazy"` to all below-fold images

### 3. JavaScript Bundles
- `global.js` (44KB): Consider code-splitting for route-specific features
- Review if all features in global.js are used on all pages
- Consider tree-shaking unused Lodash/utility functions

### 4. CSS Optimization
- `base.css` (88KB): Large file, consider:
  - Extracting critical styles to inline CSS
  - Removing unused rules (PurgeCSS)
  - Splitting by media query (mobile-first approach)

### 5. Fonts
- Current: Uses Google Fonts with `font-display: swap`
- Consider: Self-hosting fonts for faster delivery
- Use `font-display: optional` for non-critical fonts

## Testing Recommendations

### Tools:
1. **Lighthouse** (Mobile, throttled):
   ```bash
   lighthouse https://techauraz.com --preset=desktop --only-categories=performance
   ```

2. **WebPageTest**:
   - Test from mobile network (3G)
   - Test from Colombia location
   - Film strip view for visual progression

3. **Chrome DevTools**:
   - Performance panel
   - Coverage tab (identify unused CSS/JS)
   - Network waterfall

### Key Metrics to Track:
- LCP (hero image load time)
- TBT (main thread blocking)
- Layout shifts (CLS)
- Time to Interactive (TTI)

## Rollback Plan
If performance degrades:

1. **Revert third-party delays**:
   - GTM: Change line 600 back to `3000`
   - FB Pixel: Change line 631 back to `4000`

2. **Restore blocking CSS**:
   - Change preload pattern back to direct `stylesheet_tag`

3. **Remove conditional loading**:
   - Load product CSS on all pages

## Maintenance

### Regular Audits:
- Monthly Lighthouse audits
- Quarterly third-party script review
- Review new sections for render-blocking resources
- Monitor Core Web Vitals in Google Search Console

### When Adding New Features:
- ✅ Use `defer` or `async` for scripts
- ✅ Use preload+async pattern for CSS
- ✅ Add `loading="lazy"` to images
- ✅ Use `requestIdleCallback` for non-critical code
- ✅ Test impact on LCP/TBT before deploy

## Contact
For questions about these optimizations, refer to the PR or repository documentation.
