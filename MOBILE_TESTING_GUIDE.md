# Mobile View Fixes - Testing Guide

## Pre-Testing Checklist

Before testing the mobile fixes, ensure:
- [ ] Changes have been deployed to the Shopify store
- [ ] Browser cache has been cleared
- [ ] Testing devices or simulators are ready
- [ ] Test URLs are accessible

## Testing Devices

### Priority Devices (Test First)
1. **iPhone 14 Pro** (393px × 852px)
2. **Samsung Galaxy S22** (360px × 800px)
3. **iPhone SE (2022)** (375px × 667px)
4. **Google Pixel 6** (412px × 915px)

### Secondary Devices
5. iPhone 14 Pro Max (430px × 932px)
6. Samsung Galaxy S21 Ultra (384px × 854px)
7. iPad Mini (768px × 1024px) - Should NOT show mobile fixes

## Test Scenarios

### 1. Hero/Slider Single Slide Display ✓
**Location:** Homepage hero section

**Test Steps:**
1. Navigate to homepage on mobile device
2. Observe the hero slider/banner

**Expected Results:**
- ✅ Only ONE slide is visible at a time
- ✅ No partial second slide showing
- ✅ Headline and subtext are fully visible (not cut off)
- ✅ Text has dark background overlay for readability
- ✅ CTA buttons are visible and touchable
- ✅ Slide indicators/dots are visible at bottom center
- ✅ Swiping left/right changes slides smoothly

**Screenshot:** Take screenshot showing single slide with full text visible

---

### 2. Product Grid 2-Column Layout ✓
**Location:** Featured collection section, collection pages

**Test Steps:**
1. Navigate to a collection page or featured collection section
2. Scroll through product listings

**Expected Results:**
- ✅ Products display in EXACTLY 2 columns
- ✅ Cards are evenly sized with consistent spacing
- ✅ Product titles show maximum 2 lines with ellipsis
- ✅ Prices are clearly visible and properly formatted
- ✅ Badges (Sale, New, etc.) are visible but compact
- ✅ Star ratings display correctly
- ✅ "Add to Cart" buttons are easily tappable (44px minimum)
- ✅ Product images are square (1:1 aspect ratio)
- ✅ No products overlap with WhatsApp FAB at bottom

**Screenshot:** Take screenshot showing 2-column grid with multiple rows

---

### 3. WhatsApp FAB Positioning ✓
**Location:** All pages with WhatsApp button

**Test Steps:**
1. Navigate to any page with products
2. Scroll to bottom of page
3. Observe WhatsApp floating button position

**Without Cookie Banner:**
- ✅ FAB is positioned at bottom-right (1rem from bottom and right)
- ✅ FAB doesn't overlap any product cards or content
- ✅ FAB is 56px × 56px and clearly visible
- ✅ Tapping FAB opens WhatsApp correctly

**With Cookie Banner:**
1. Clear cookies or trigger cookie banner
2. Observe WhatsApp FAB position when banner appears

- ✅ FAB automatically moves up when cookie banner appears
- ✅ FAB is always above cookie banner (not hidden)
- ✅ FAB position animates smoothly (0.3s transition)
- ✅ After dismissing cookie banner, FAB returns to original position

**Screenshot:** 
- Take screenshot with cookie banner visible showing FAB above it
- Take screenshot after dismissing banner showing FAB at bottom

---

### 4. Cookie Banner Display ✓
**Location:** Any page (first visit or after clearing cookies)

**Test Steps:**
1. Clear browser cookies
2. Visit the site
3. Observe cookie banner

**Expected Results:**
- ✅ Cookie banner appears at bottom of screen
- ✅ Banner has dark background with good contrast
- ✅ Text is readable (font-size: 1.3rem)
- ✅ Accept/Decline buttons are full-width and 44px tall
- ✅ Buttons are easily tappable
- ✅ Banner doesn't exceed 40vh in height
- ✅ If content is long, banner scrolls internally
- ✅ Banner has proper z-index (999) - stays above content but below FAB

**Screenshot:** Take screenshot showing cookie banner with buttons visible

---

### 5. Section Headings - No Clipping ✓
**Location:** All sections with titles (Featured Collection, Value Props, etc.)

**Test Steps:**
1. Navigate through homepage and various pages
2. Check all section headings and descriptions

**Expected Results:**
- ✅ All headings display completely (no cut-off text)
- ✅ Long headings wrap to multiple lines properly
- ✅ Text doesn't overflow beyond screen edges
- ✅ Decorative elements (stars, underlines) don't cause overflow
- ✅ Section descriptions are fully readable
- ✅ Font sizes scale appropriately (clamp function working)

**Screenshot:** Take screenshot of a section with a long heading showing proper wrapping

---

### 6. Header Alignment & No Overflow ✓
**Location:** Top of all pages

**Test Steps:**
1. Navigate to any page
2. Observe header/navigation bar
3. Try scrolling horizontally (shouldn't be possible)

**Expected Results:**
- ✅ No horizontal scrolling is possible
- ✅ Logo is visible and not cut off
- ✅ Logo max-width is 50% to prevent overflow
- ✅ Menu icon (hamburger) is visible and 44px × 44px
- ✅ Cart icon is visible and 44px × 44px
- ✅ All header elements fit within viewport
- ✅ Header spacing is consistent (1rem padding)

**Screenshot:** Take screenshot of header showing all elements properly aligned

---

### 7. Pagination & Controls ✓
**Location:** Collection pages with multiple pages, slider controls

**Test Steps:**
1. Navigate to a collection with pagination
2. Check slider/carousel controls

**Expected Results:**
- ✅ Pagination buttons are 40px × 40px (tappable)
- ✅ Current page is highlighted
- ✅ Pagination has 8rem bottom padding (for FAB clearance)
- ✅ Slider dots are visible (8px diameter, 10px when active)
- ✅ Prev/next arrows are visible and tappable
- ✅ Slider dots are centered at bottom of slider

**Screenshot:** Take screenshot showing pagination controls

---

### 8. Touch Target Size ✓
**Location:** All interactive elements

**Test Steps:**
1. Navigate through the site
2. Try tapping various buttons, links, and controls

**Expected Results:**
- ✅ All buttons are minimum 44px × 44px
- ✅ All links within text have adequate tap padding
- ✅ Form inputs are large enough to tap easily
- ✅ Card elements are fully tappable (entire card, not just title)
- ✅ Slider controls meet 44px minimum
- ✅ Header icons meet 44px minimum

**Test Method:** Try tapping with thumb - should be easy without mistakes

---

### 9. iOS Safe Area (Notched Devices) ✓
**Location:** All pages on iPhone X and newer

**Test Steps:**
1. Test on iPhone with notch (X, 11, 12, 13, 14)
2. Observe header, footer, and fixed elements

**Expected Results:**
- ✅ Header doesn't hide behind notch
- ✅ WhatsApp FAB respects safe area insets
- ✅ Cookie banner respects safe area insets
- ✅ No content is hidden by screen curves

**Screenshot:** Take screenshot on notched device showing proper spacing

---

### 10. Reduced Motion Accessibility ✓
**Location:** All pages

**Test Steps:**
1. Enable "Reduce Motion" in device settings:
   - iOS: Settings > Accessibility > Motion > Reduce Motion
   - Android: Settings > Accessibility > Remove animations
2. Navigate through the site

**Expected Results:**
- ✅ Animations are minimal or instant
- ✅ Transitions are very short (0.01ms)
- ✅ Smooth scrolling is disabled
- ✅ Site remains functional without animations

---

## Browser Testing

Test on multiple mobile browsers:

### iOS Browsers
- [ ] Safari (primary)
- [ ] Chrome iOS
- [ ] Firefox iOS

### Android Browsers
- [ ] Chrome Android (primary)
- [ ] Samsung Internet
- [ ] Firefox Android

## Performance Testing

### Lighthouse Mobile Audit
1. Open Chrome DevTools
2. Run Lighthouse audit for mobile
3. Check scores:
   - [ ] Performance: 80+ (target: 90+)
   - [ ] Accessibility: 90+ (target: 95+)
   - [ ] Best Practices: 90+
   - [ ] SEO: 90+

### Key Metrics
- [ ] Largest Contentful Paint (LCP): < 2.5s
- [ ] First Input Delay (FID): < 100ms
- [ ] Cumulative Layout Shift (CLS): < 0.1

## Regression Testing

Ensure no desktop functionality was broken:

1. **Desktop View (>749px)**
   - [ ] Hero slider works correctly
   - [ ] Product grid shows 3-4 columns (not 2)
   - [ ] WhatsApp FAB is at bottom-right with larger size
   - [ ] Header shows full navigation menu
   - [ ] Section headings are larger
   - [ ] Touch target size rules don't apply

2. **Tablet View (750px - 989px)**
   - [ ] 2-column product grid (as per design)
   - [ ] Hero slider works correctly
   - [ ] Header layout is appropriate

## Known Issues to Watch For

During testing, watch for these potential issues:

1. **Slider Double Image**
   - If you see two slides partially visible, screenshot and report
   - Check browser console for JavaScript errors

2. **FAB Overlap**
   - If WhatsApp FAB overlaps product cards, measure the gap
   - Check if `--mobile-fab-bottom-clearance` is being applied

3. **Text Overflow**
   - If any text is cut off, note the specific element
   - Check if proper word-wrap rules are applied

4. **Horizontal Scrolling**
   - If you can scroll horizontally, identify the overflowing element
   - Check viewport width calculations

## Bug Report Template

If you find issues, use this template:

```
**Issue:** [Brief description]
**Location:** [Page/section where issue occurs]
**Device:** [Device model and OS version]
**Browser:** [Browser and version]
**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshot:** [Attach screenshot]

**Additional Notes:**
[Any other relevant information]
```

## Test Completion Checklist

After completing all tests:

- [ ] All 10 test scenarios passed
- [ ] Tested on at least 3 different mobile devices
- [ ] Tested on at least 2 different browsers
- [ ] All screenshots captured and saved
- [ ] No critical issues found
- [ ] Any minor issues documented with bug reports
- [ ] Performance metrics meet targets
- [ ] No desktop regression issues
- [ ] Team notified of test completion

## Final Verification

Before marking testing complete:

1. **Visual Review**
   - Compare screenshots against original requirements
   - Verify all issues from problem statement are resolved

2. **User Experience Review**
   - Site feels responsive and professional on mobile
   - No frustrating interactions or layout issues
   - Shopping flow is smooth and intuitive

3. **Cross-Reference**
   - All items from MOBILE_FIXES_SUMMARY.md are verified
   - Documentation matches actual implementation

## Contact for Issues

If issues are found during testing:
- Create GitHub issue with bug report template
- Tag with `mobile`, `bug`, and `priority` labels
- Assign to development team for resolution

---

**Testing Guide Version:** 1.0.0  
**Last Updated:** January 14, 2024  
**Next Review:** After deployment or when issues are reported
