# Header Visibility Fix - Testing Guide

## Overview
This document provides testing instructions for the header visibility fixes implemented to resolve issues where the sticky header was overlapping the announcement bar and first content sections.

## Changes Summary

### Files Modified (4 total)
1. **assets/ui-ux-responsive-fixes.css** - Main fix file
2. **assets/techauraz-custom-ui.css** - Announcement bar z-index
3. **assets/base.css** - Announcement bar z-index consistency
4. **sections/header.liquid** - Header sticky positioning

### Key Implementation Details

#### 1. CSS Variables Added
```css
:root {
  --tech-header-offset: 64px; /* Mobile */
}

@media screen and (min-width: 750px) {
  :root {
    --tech-header-offset: 68px; /* Tablet */
  }
}

@media screen and (min-width: 990px) {
  :root {
    --tech-header-offset: 72px; /* Desktop */
  }
}
```

#### 2. Z-Index Hierarchy (Proper Stacking Order)
- **Modals/Drawers**: z-index 200+ (Topmost)
- **Announcement Bar**: z-index 101 (Above header)
- **Header**: z-index 100 (Below announcement, above content)
- **Sticky Benefits**: z-index 98 (Below header)
- **WhatsApp Float**: z-index 95
- **Regular Content**: z-index 0-9

#### 3. Main Content Offset
```css
main {
  padding-top: var(--tech-header-offset);
}
```

#### 4. Scroll Padding
```css
body {
  scroll-padding-top: var(--tech-header-offset);
}
```

## Testing Instructions

### Test Pages
1. **Homepage**: `/`
2. **Product Page**: `/products/power-bank-transparente-670-20-000-mah`

### Test Scenarios

#### Scenario 1: Announcement Bar Visibility
**Expected Result**: Announcement bar (blue bar with "Envío GRATIS") is fully visible and NOT covered by the header.

**Steps**:
1. Navigate to homepage
2. Check if announcement bar is visible at the top
3. Scroll down slowly
4. Verify announcement bar stays visible and header doesn't overlap it

**Success Criteria**:
- ✅ Announcement bar text is fully readable
- ✅ No part of announcement bar is hidden under header
- ✅ Both elements stick properly on scroll

#### Scenario 2: Hero Section / First Content Visibility
**Expected Result**: First section (hero/image banner) starts below the header, not hidden underneath.

**Steps**:
1. Navigate to homepage
2. Check the hero section
3. Verify top of hero image/content is not cut off by header

**Success Criteria**:
- ✅ Hero section starts below header
- ✅ No content is hidden behind header
- ✅ Proper spacing between header and hero

#### Scenario 3: Sticky Header Behavior
**Expected Result**: Header maintains stable height and position while scrolling.

**Steps**:
1. Load any page
2. Scroll down the page
3. Observe header behavior

**Success Criteria**:
- ✅ No "jumping" or height changes
- ✅ Smooth transition
- ✅ Header stays at top

#### Scenario 4: Menu Text Legibility
**Expected Result**: Menu items have good contrast and are easily readable.

**Steps**:
1. View header on homepage
2. Hover over menu items
3. Check text readability

**Success Criteria**:
- ✅ Menu text is dark (not white on white)
- ✅ Hover states show clear color change (#2563eb blue)
- ✅ Underline appears on hover

#### Scenario 5: Drawer/Modal Functionality
**Expected Result**: Cart drawer, menu drawer, and search modal work correctly and appear above header.

**Steps**:
1. Click cart icon - cart drawer should slide in from right
2. Click menu icon (mobile) - menu drawer should slide in from left
3. Click search icon - search modal should appear

**Success Criteria**:
- ✅ Drawers/modals appear above header (z-index 200)
- ✅ No visual glitches
- ✅ Proper overlay/backdrop

#### Scenario 6: Product Page Benefits Bar
**Expected Result**: Benefits bar on product page is not hidden under header.

**Steps**:
1. Navigate to `/products/power-bank-transparente-670-20-000-mah`
2. Check if benefits bar is visible
3. Scroll and observe behavior

**Success Criteria**:
- ✅ Benefits bar is fully visible
- ✅ Not covered by header
- ✅ Proper spacing

### Responsive Testing

#### Mobile (360px × 800px)
- Test on Chrome DevTools mobile emulation
- Viewport: 360px wide
- Expected header offset: 64px

**Checklist**:
- [ ] Announcement bar visible
- [ ] Header sticky works
- [ ] Menu drawer opens correctly
- [ ] No content hidden under header

#### Tablet (750px × 1024px)
- Test on iPad simulation
- Expected header offset: 68px

**Checklist**:
- [ ] Announcement bar visible
- [ ] Header sticky works
- [ ] Desktop menu visible
- [ ] No content hidden under header

#### Desktop (1440px × 900px)
- Test on desktop viewport
- Expected header offset: 72px

**Checklist**:
- [ ] Announcement bar visible
- [ ] Header sticky works
- [ ] Menu items readable with good hover states
- [ ] No content hidden under header

## Browser Testing
Test on the following browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Known Issues & Edge Cases

### Edge Case: Overlay Headers
If header has class `.header-wrapper--overlay`, the main padding is reset to 0:
```css
.header-wrapper--overlay + main {
  padding-top: 0;
}
```
This is intentional for transparent headers over hero images.

### Edge Case: Sticky Benefits Banner
If a benefits banner has `.free-shipping-banner--sticky`, it will stick below the header with z-index: 98.

## Rollback Instructions
If issues are found, revert commit by:
```bash
git revert fc20144
git push origin copilot/fix-header-visibility-issues
```

## Success Metrics
✅ All test scenarios pass
✅ No visual regressions
✅ All responsive breakpoints work
✅ Drawers/modals function correctly

## Screenshots Needed
Please capture screenshots of:
1. Homepage - announcement bar + header (desktop)
2. Homepage - announcement bar + header (mobile)
3. Product page - top section with header
4. Hover state on menu items
5. Cart drawer open (z-index verification)

## Additional Notes
- The `--tech-header-offset` variable is the primary control for header spacing
- The `--tech-header-height` variable is kept for backward compatibility
- Z-index hierarchy must be maintained: Modals(200+) > Announcement(101) > Header(100) > Content(0-9)
