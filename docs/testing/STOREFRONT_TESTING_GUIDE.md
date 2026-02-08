# Storefront Polish Testing Guide

## Quick Reference

This guide provides step-by-step manual testing procedures to verify all storefront polish refinements are working correctly across desktop, tablet, and mobile devices.

## Testing Priority: High Impact Areas

1. **Mobile Product Grid** (2-column layout)
2. **Hero Carousel** (single slide visibility)  
3. **Color Consistency** (dark theme on all sections)
4. **Cookie Banner + WhatsApp FAB** (no overlap)
5. **Section Alignment** (centered, proper spacing)

---

## Desktop Testing (1920x1080, 1366x768, 1440x900)

### Homepage

#### Hero/Slideshow Section
- [ ] Slideshow displays properly (full bleed or contained based on settings)
- [ ] Text overlay has dark background with blur effect
- [ ] Headline and subtext are fully readable
- [ ] CTA buttons are properly styled with hover effects
- [ ] Navigation dots/counter positioned at bottom center
- [ ] Prev/next buttons visible and functional
- [ ] Active dot shows amber color (#fbbf24)
- [ ] Smooth transitions between slides

#### Trust Badges Section
- [ ] Icons and text properly aligned
- [ ] Dark theme applied
- [ ] Responsive grid layout

#### Featured Collection Sections
- [ ] Section title properly styled (gradient text effect from section inline styles)
- [ ] Title has decorative star and underline
- [ ] Description centered with max-width 700px
- [ ] Product cards in grid (3-5 columns based on settings)
- [ ] All cards have equal height
- [ ] Card hover effects working (border, shadow, transform)
- [ ] Product images load with proper aspect ratio
- [ ] Rating stars visible (amber color)
- [ ] Badges (Sale, New, Shipping) properly positioned
- [ ] Quick-add buttons styled and functional
- [ ] Prices clearly visible

#### Benefits Conversion Section
- [ ] Section heading centered and properly styled
- [ ] 4-column grid layout (or as configured)
- [ ] Dark background gradient applied
- [ ] Icons clearly visible
- [ ] Benefit titles use warm cream color (#fef3c7)
- [ ] Benefit descriptions use slate color
- [ ] Hover effects on cards (border, shadow, transform)
- [ ] Cards have equal height
- [ ] Proper spacing between cards (2rem)

#### Custom Reviews Slider
- [ ] Slider displays horizontally
- [ ] Individual review cards properly styled
- [ ] Stars visible and properly colored
- [ ] Smooth horizontal scrolling
- [ ] Proper card width and spacing

### Collection Pages

#### Collection Grid
- [ ] Products display in configured columns (3-5)
- [ ] All product cards equal height
- [ ] 2-column grid on tablet breakpoint
- [ ] Proper gap spacing
- [ ] Filters sidebar (if enabled) properly styled

#### Pagination
- [ ] Pagination centered below products
- [ ] Dark theme styling applied
- [ ] Current page clearly indicated (gradient background)
- [ ] Hover effects on page numbers
- [ ] Prev/next arrows functional
- [ ] Touch targets adequate (44x44px minimum)

### Product Pages

#### Product Benefits Section
- [ ] Dark background gradient (not light #fff7ed)
- [ ] Icons visible and properly sized
- [ ] Titles use warm cream color
- [ ] Descriptions readable (slate color)
- [ ] Grid layout responsive (1-2-3 columns)
- [ ] Hover effects working

#### Product Why-Buy Section
- [ ] Dark background applied
- [ ] 4-column layout on desktop
- [ ] Icons centered and large
- [ ] Text centered and readable
- [ ] Hover effects on cards

### Global Elements

#### Header
- [ ] Logo left-aligned
- [ ] Navigation links visible and clickable
- [ ] Search, account, cart icons functional
- [ ] Sticky positioning working on scroll
- [ ] Hover states on all clickable elements

#### Footer
- [ ] Content properly organized
- [ ] Links functional
- [ ] Social icons visible
- [ ] Newsletter signup styled

#### Cookie Banner
- [ ] Appears at bottom (if not previously accepted)
- [ ] Dark background with blur effect
- [ ] Text readable
- [ ] Accept/Decline buttons styled
- [ ] Doesn't cover important content

#### WhatsApp FAB
- [ ] Fixed to bottom-right
- [ ] Green background (#25d366)
- [ ] Icon visible
- [ ] Hover effect (scale up)
- [ ] Moves up when cookie banner visible
- [ ] Doesn't overlap with content

---

## Tablet Testing (768x1024, 820x1180)

### Orientation: Portrait

#### Homepage
- [ ] Hero shows single slide at a time
- [ ] Text overlay readable and properly sized
- [ ] Featured collections display 2 columns
- [ ] Benefits section displays 2 columns
- [ ] Why-buy section displays 2 columns
- [ ] All interactive elements have 44x44px touch targets
- [ ] Cookie banner fits properly
- [ ] WhatsApp button accessible

#### Collection Pages
- [ ] Product grid displays 2 columns
- [ ] Cards have proper spacing
- [ ] Pagination functional

### Orientation: Landscape

#### Homepage
- [ ] Similar to portrait but may show 3 columns based on viewport width
- [ ] Hero properly sized
- [ ] All sections properly spaced

---

## Mobile Testing (iPhone SE: 375x667, iPhone 12: 390x844, Samsung S21: 360x800)

### Critical Tests

#### Hero/Slideshow (PRIORITY 1)
- [ ] **ONLY ONE SLIDE VISIBLE AT A TIME** (not two slides showing)
- [ ] Slide takes full width (100vw)
- [ ] Can swipe between slides smoothly
- [ ] Text overlay visible with dark background
- [ ] Headline fully visible (no truncation with "...")
- [ ] Subtext fully visible (no truncation)
- [ ] Text wraps properly (word-wrap working)
- [ ] CTA buttons full-width and tappable
- [ ] Navigation dots/counter at bottom center
- [ ] All text legible against background image

#### Product Grid (PRIORITY 2)
- [ ] **PRODUCTS DISPLAY IN 2 COLUMNS** (not single column)
- [ ] Equal column widths
- [ ] Proper gap between cards (1rem)
- [ ] Card content not cut off
- [ ] Product images square aspect ratio
- [ ] Product titles limited to 2 lines
- [ ] Prices clearly visible
- [ ] Badges positioned correctly (top-right)
- [ ] Rating stars visible
- [ ] Quick-add buttons functional
- [ ] Can tap on any part of card to navigate

#### Benefits & Why-Buy Sections (PRIORITY 3)
- [ ] **Dark backgrounds applied** (not light colored)
- [ ] Single column layout on mobile
- [ ] Icons clearly visible
- [ ] Text readable (proper size)
- [ ] Proper spacing between items
- [ ] Touch targets adequate

#### Cookie Banner + WhatsApp (PRIORITY 4)
- [ ] Cookie banner at bottom of screen
- [ ] Banner doesn't cover critical content
- [ ] WhatsApp button bottom-right
- [ ] **WhatsApp button moves up when cookie banner visible**
- [ ] Both elements tappable
- [ ] No overlap between banner and FAB

### Section-by-Section Mobile Tests

#### Homepage Sections
- [ ] Trust badges: single column or 2-column grid
- [ ] Featured collections: slider if swipe_on_mobile=true, otherwise 2-column grid
- [ ] Benefits conversion: single column
- [ ] Reviews slider: horizontal scroll working

#### Collection Pages
- [ ] Collection header centered
- [ ] Product grid: 2 columns
- [ ] Filters: drawer or dropdown working
- [ ] Pagination: properly sized and tappable

#### Product Pages
- [ ] Product images: slider or stacked
- [ ] Product info: single column
- [ ] Benefits section: single column, dark theme
- [ ] Why-buy section: single column, dark theme
- [ ] Add to cart button: prominent and tappable

### Navigation & Interactions

#### Header
- [ ] Hamburger menu icon visible (44x44px)
- [ ] Menu drawer opens smoothly
- [ ] Menu items tappable
- [ ] Search icon opens search
- [ ] Cart icon shows count
- [ ] Logo tappable and goes to home

#### Forms
- [ ] Input fields properly sized
- [ ] Labels visible
- [ ] Submit buttons 44x44px minimum
- [ ] Validation messages clear

#### Modals & Drawers
- [ ] Open/close smoothly
- [ ] Close button accessible
- [ ] Content scrollable
- [ ] Backdrop dismisses modal

---

## Color Consistency Verification

Use browser DevTools to inspect these elements:

### Check Dark Theme Applied

#### Product Benefits Section
```css
Expected: background: linear-gradient(135deg, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.85))
NOT: background: #fff7ed (light orange)
```

#### Product Why-Buy Section  
```css
Expected: background: linear-gradient(135deg, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.85))
```

#### Section Headings
```css
Expected: color: #fef3c7 (warm cream)
```

#### Descriptions
```css
Expected: color: rgba(226, 232, 240, 0.85) (slate)
```

### Check Accent Colors

#### Primary Actions (Buttons, Links)
```css
Expected: #0ea5e9 or #22c55e (blue or green)
```

#### Secondary/Hover States
```css
Expected: #fbbf24 (amber)
```

#### Rating Stars
```css
Expected: #fbbf24 (amber) for filled stars
Expected: rgba(148, 163, 184, 0.3) for empty stars
```

---

## Accessibility Testing

### Keyboard Navigation
1. Tab through interactive elements
   - [ ] Focus indicator visible (amber outline)
   - [ ] Logical tab order
   - [ ] All interactive elements reachable
   - [ ] No focus traps

2. Test with screen reader (optional)
   - [ ] Headings properly nested
   - [ ] Links have descriptive text
   - [ ] Images have alt text
   - [ ] Form inputs have labels

### Reduced Motion
Enable "prefers-reduced-motion" in browser:
- [ ] Animations disabled or minimal
- [ ] Transitions still functional
- [ ] No disorienting motion

---

## Browser Compatibility

### Desktop Browsers
- [ ] Chrome 90+ (Windows, macOS)
- [ ] Firefox 88+ (Windows, macOS)
- [ ] Safari 14+ (macOS)
- [ ] Edge 90+ (Windows)

### Mobile Browsers  
- [ ] Safari iOS 14+ (iPhone)
- [ ] Chrome Mobile (Android)
- [ ] Samsung Internet (Android)

---

## Performance Checks

### Page Load
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] No horizontal scrollbars
- [ ] Images load progressively

### Interactions
- [ ] Hover effects smooth (no jank)
- [ ] Scrolling smooth
- [ ] Modal open/close smooth
- [ ] Slider transitions smooth

---

## Issue Reporting Template

If you find issues, report them using this format:

```
**Device/Browser**: iPhone 12 / Safari iOS 15.6
**Page**: Homepage
**Issue**: Hero shows 2 slides at once
**Expected**: Only 1 slide visible
**Screenshot**: [attach if possible]
**Steps to Reproduce**:
1. Navigate to homepage on mobile
2. Observe hero section
3. See 2 slides side by side
```

---

## Quick Fix Reference

### If 2-column mobile grid NOT working:
- Check that section doesn't have `swipe_on_mobile: true` setting
- Verify CSS file `storefront-polish-refinements-2024.css` is loaded
- Check browser console for CSS errors

### If colors are light instead of dark:
- Clear browser cache
- Verify `storefront-polish-refinements-2024.css` loads AFTER other CSS files
- Check browser DevTools computed styles

### If WhatsApp overlaps cookie banner:
- Check browser supports `:has()` selector (Chrome 105+, Safari 15.4+)
- Verify cookie banner JavaScript is running
- Check z-index values in DevTools

### If slideshow shows multiple slides:
- Check screen size (should be < 750px for mobile styles)
- Verify `storefront-visual-fixes-2024.css` is loaded
- Check for conflicting JavaScript

---

## Sign-Off Checklist

Before marking as complete, verify:

- [ ] All PRIORITY tests passing on at least 2 mobile devices
- [ ] Desktop testing complete on Chrome and one other browser
- [ ] No console errors on any page
- [ ] Color consistency verified on 3+ sections
- [ ] Cookie banner + WhatsApp tested
- [ ] Product grid 2-column confirmed on mobile
- [ ] Hero single-slide confirmed on mobile
- [ ] Screenshots captured for key pages
- [ ] Issues logged if any found

---

**Last Updated**: January 13, 2024  
**Version**: 1.0  
**Related Files**:
- `assets/storefront-polish-refinements-2024.css`
- `assets/storefront-visual-fixes-2024.css`
- `layout/theme.liquid`
