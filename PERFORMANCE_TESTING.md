# Performance Testing and Validation Guide

## Overview
This guide provides step-by-step instructions for testing the performance optimizations implemented on techauraz.com.

## Prerequisites

### Required Tools
1. **Chrome DevTools** (built into Chrome browser)
2. **Lighthouse** (built into Chrome DevTools)
3. **WebPageTest** (https://www.webpagetest.org)
4. **Chrome User Experience Report** (CrUX) via PageSpeed Insights

### Optional Tools
1. **Lighthouse CI** for automated testing
2. **Chrome Extension: Web Vitals**
3. **Chrome Extension: DebugBear**

## Testing Checklist

### Before Testing
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Use incognito/private mode for consistent results
- [ ] Disable browser extensions that might interfere
- [ ] Use consistent network throttling settings
- [ ] Test from mobile device or use mobile emulation

## Test Procedures

### 1. Lighthouse Performance Audit

#### Desktop Test
```bash
# Open Chrome DevTools (F12)
# Navigate to Lighthouse tab
# Settings:
# - Mode: Navigation
# - Device: Desktop
# - Categories: Performance
# - Throttling: Simulated throttling (4x CPU slowdown)
```

**Steps**:
1. Open https://techauraz.com in Chrome
2. Press F12 to open DevTools
3. Click "Lighthouse" tab
4. Select "Performance" category
5. Choose "Desktop" device
6. Click "Analyze page load"
7. Wait for report to generate

**Target Scores**:
- Performance: ≥ 90
- LCP: < 2.5s
- TBT: < 200ms
- CLS: < 0.1

#### Mobile Test
```bash
# Same as desktop but:
# - Device: Mobile
# - Throttling: Simulated 4G
```

**Target Scores**:
- Performance: ≥ 75
- LCP: < 2.5s
- TBT: < 300ms
- CLS: < 0.1

**Save Results**:
1. Click "Save report" (💾 icon)
2. Save as HTML for comparison
3. Take screenshot for documentation

### 2. Core Web Vitals Testing

#### Using PageSpeed Insights
1. Go to https://pagespeed.web.dev/
2. Enter: https://techauraz.com
3. Click "Analyze"
4. Wait for both Field Data (CrUX) and Lab Data (Lighthouse)

**Review Metrics**:

**Field Data (Real User Data)**:
- LCP: < 2.5s (Good), 2.5-4.0s (Needs Improvement), > 4.0s (Poor)
- FID/INP: < 200ms (Good), 200-500ms (Needs Improvement), > 500ms (Poor)
- CLS: < 0.1 (Good), 0.1-0.25 (Needs Improvement), > 0.25 (Poor)

**Lab Data**:
- Same targets as Lighthouse above

#### Using Chrome DevTools Performance Panel
1. Open DevTools (F12)
2. Click "Performance" tab
3. Click Record (●)
4. Reload page (Ctrl+R)
5. Click Stop after page loads
6. Analyze:
   - Long Tasks (> 50ms)
   - Main thread activity
   - Layout shifts
   - Network waterfall

**Look For**:
- ✅ GTM/FB Pixel load after 5-6 seconds
- ✅ No long tasks blocking main thread in first 3s
- ✅ CSS loads asynchronously (via preload)
- ✅ Images lazy load below fold
- ✅ No layout shifts during load

### 3. WebPageTest

#### Test Configuration
1. Go to https://www.webpagetest.org
2. Enter URL: https://techauraz.com
3. Settings:
   - Test Location: "Bogota, Colombia" (or nearest)
   - Browser: Chrome
   - Connection: Mobile 3G or 4G
   - Number of Tests: 3 (median result)
   - Repeat View: First View and Repeat View

4. Advanced Settings:
   - Capture Video: ✅
   - Capture Screenshots: ✅
   - Disable JavaScript: ❌
   - Ignore SSL Errors: ❌

**Analyze Results**:

**Waterfall**:
- Check first 3-5 resources loaded
- Verify hero image loads early
- Verify GTM/FB load after 5s
- Check for render-blocking resources

**Film Strip**:
- Verify hero appears within 2.5s
- Check for layout shifts
- Confirm smooth loading progression

**Metrics**:
- First Byte: < 600ms
- Start Render: < 1.5s
- LCP: < 2.5s
- TBT: < 300ms
- Speed Index: < 3.5s

**Content Breakdown**:
- Total Size: < 2MB
- Requests: < 50
- JavaScript: < 400KB (gzipped)
- CSS: < 100KB (gzipped)
- Images: < 800KB

### 4. Mobile Device Testing

#### Real Device Test (Recommended)
1. Open Chrome on Android device
2. Navigate to: chrome://inspect/#devices
3. Connect device via USB
4. Inspect and run Lighthouse on device

#### Chrome DevTools Mobile Emulation
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select device: "iPhone 12 Pro" or "Pixel 5"
4. Set throttling: "Slow 3G" or "Fast 3G"
5. Reload and observe:
   - Load time
   - Scroll performance
   - Touch responsiveness

**Test Interactions**:
- [ ] Scroll smoothness (60fps)
- [ ] Button tap responsiveness
- [ ] Image lazy loading
- [ ] WhatsApp button animation
- [ ] Header show/hide on scroll

### 5. Network Performance

#### Check Resource Loading
1. DevTools → Network tab
2. Reload page
3. Sort by "Size" (largest first)
4. Review:

**JavaScript**:
- global.js: Should load with defer
- GTM: Should load after ~5s
- FB Pixel: Should load after ~6s
- Other scripts: All deferred or async

**CSS**:
- base.css: Async loaded via preload
- Product CSS: Only on product pages
- Animations CSS: Only if enabled

**Images**:
- Hero: Preloaded with high priority
- Product cards: Lazy loaded
- Below-fold: Loading="lazy"

**Fonts**:
- Loaded with font-display: swap
- Preloaded if critical

#### Check Compression
1. Network tab → Right-click header → Enable "Content-Encoding" column
2. Verify all text resources show "br" or "gzip"

### 6. Layout Shift Detection

#### Visual Test
1. Open page in Chrome
2. Watch for content moving during load
3. Enable "Layout Shift Regions" in DevTools:
   - DevTools → ⋮ → More tools → Rendering
   - Check "Layout Shift Regions"
4. Reload page and watch for blue highlights

**Common Shift Causes**:
- Images without width/height
- Ads or dynamic content
- Fonts loading late
- CSS loading late

**Expected**: CLS score < 0.05

### 7. Third-Party Script Analysis

#### Using DevTools Performance
1. Record performance profile
2. Filter by: "Loading" and "Scripting"
3. Check timestamps for:
   - GTM load: ~5 seconds after page load
   - FB Pixel: ~6 seconds after page load
   - Scripts don't block main thread in first 3s

#### Using Request Blocking
1. DevTools → Network
2. Right-click → Block request domain
3. Block: www.googletagmanager.com
4. Reload and measure performance difference
5. Unblock and compare

**Target**: Blocking third-parties should improve LCP by 20-40%

## Regression Testing

### After Code Changes
Run this quick test suite:

1. **Smoke Test** (2 minutes):
   ```bash
   # Lighthouse mobile performance score
   lighthouse https://techauraz.com --only-categories=performance --preset=mobile
   ```
   Target: Score ≥ 70

2. **Visual Test** (1 minute):
   - Load home page
   - Check hero loads quickly
   - Verify no layout shifts
   - Test scroll smoothness

3. **Network Test** (2 minutes):
   - Check DevTools Network tab
   - Verify third-party timing (5-6s)
   - Confirm CSS async loading
   - Check image lazy loading

### Monthly Audit
1. Run full Lighthouse audit (desktop + mobile)
2. Run WebPageTest from 3 locations
3. Check Google Search Console Core Web Vitals
4. Review field data trends
5. Document any regressions

## Performance Budget Monitoring

### Set Up Alerts
Track these metrics over time:

| Metric | Budget | Alert If |
|--------|--------|----------|
| LCP | < 2.5s | > 3.0s |
| FID/INP | < 200ms | > 300ms |
| CLS | < 0.05 | > 0.1 |
| Total Size | < 2MB | > 2.5MB |
| Requests | < 50 | > 60 |
| Lighthouse Score | ≥ 75 | < 70 |

### Google Search Console
1. Go to Search Console
2. Navigate to "Core Web Vitals"
3. Review:
   - Mobile performance
   - Desktop performance
   - URLs needing improvement
4. Monthly comparison

## Common Issues and Diagnostics

### Issue: High LCP

**Diagnose**:
1. Lighthouse → View Trace → Find LCP element
2. Check if hero image is preloaded
3. Verify image format (WebP/AVIF)
4. Check image size (should be < 100KB)

**Fix**:
- Add preload for LCP image
- Optimize image size/format
- Remove render-blocking resources

### Issue: High TBT

**Diagnose**:
1. Performance panel → Main thread flame chart
2. Look for long tasks (> 50ms) in yellow/red
3. Identify JavaScript causing blockage

**Fix**:
- Defer non-critical scripts
- Use code-splitting
- Optimize heavy computations
- Use web workers for heavy tasks

### Issue: Layout Shifts

**Diagnose**:
1. Enable "Layout Shift Regions"
2. Record what elements shift
3. Check if images have dimensions
4. Verify font loading strategy

**Fix**:
- Add width/height to images
- Reserve space for dynamic content
- Use font-display: optional
- Inline critical CSS

### Issue: Slow Third-Party Scripts

**Diagnose**:
1. Performance panel → Network
2. Find slow third-party requests
3. Check timing (should be > 5s for GTM/FB)

**Fix**:
- Increase delay timer
- Use requestIdleCallback
- Consider removing non-essential scripts
- Use facade pattern for heavy scripts

## Reporting Results

### Create Performance Report

**Template**:
```markdown
## Performance Test Results - [Date]

### Environment
- Device: [Desktop/Mobile/Real Device]
- Network: [4G/3G/Cable]
- Location: [Test Location]

### Lighthouse Scores
- Performance: XX / 100
- LCP: X.Xs
- TBT: XXXms
- CLS: 0.0XX

### Core Web Vitals (Field Data)
- LCP: X.Xs (Good/Needs Improvement/Poor)
- INP: XXms (Good/Needs Improvement/Poor)
- CLS: 0.0XX (Good/Needs Improvement/Poor)

### Optimizations Validated
- [x] Third-party scripts load after 5-6s
- [x] Hero image preloaded
- [x] CSS loads asynchronously
- [x] Images lazy load below fold
- [x] No major layout shifts

### Issues Found
1. [Description of any issues]

### Recommendations
1. [Any optimization suggestions]

### Screenshots
[Attach Lighthouse report screenshot]
[Attach WebPageTest filmstrip]
```

### Share Results
1. Save Lighthouse report as HTML
2. Export WebPageTest results
3. Create comparison chart (before/after)
4. Document in repository
5. Share with team

## Automated Testing (Optional)

### Lighthouse CI
```bash
# Install
npm install -g @lhci/cli

# Configure .lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["https://techauraz.com"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.75}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "total-blocking-time": ["error", {"maxNumericValue": 300}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}]
      }
    }
  }
}

# Run
lhci autorun
```

### GitHub Actions
Create `.github/workflows/performance.yml`:
```yaml
name: Performance Test
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://techauraz.com
          uploadArtifacts: true
```

## Resources

- [Lighthouse Scoring Guide](https://web.dev/performance-scoring/)
- [Web Vitals](https://web.dev/vitals/)
- [WebPageTest Documentation](https://docs.webpagetest.org/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
