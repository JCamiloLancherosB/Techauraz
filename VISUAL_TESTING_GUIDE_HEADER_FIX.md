# Visual Testing Guide - Header, Announcement Bar & Slideshow Fixes

## 🎯 Quick Visual Validation

This guide helps you quickly verify all the UI/UX fixes are working correctly.

---

## 📍 Test 1: Announcement Bar Scroll Behavior

### Expected Behavior
- **Before Scroll:** Announcement bar visible at top of page
- **After Scrolling Down (> 50px):** Bar smoothly fades out and moves up
- **No Empty Space:** Header should immediately follow content, no gap

### How to Test
1. Load the homepage
2. Scroll down slowly past the header
3. Observe the announcement bar
4. ✅ **Pass if:** Bar fades and slides up smoothly, no empty space left

### Visual Indicators
```
BEFORE SCROLL:
┌────────────────────────┐
│  Announcement Bar      │ ← Visible
├────────────────────────┤
│  Header (Logo, Nav)    │
└────────────────────────┘

AFTER SCROLL (> 50px):
┌────────────────────────┐
│  Header (Logo, Nav)    │ ← No gap above!
└────────────────────────┘
```

---

## 📍 Test 2: Header Icons Consistency

### Expected Behavior
- All icons (search, account, cart) have circular hover areas
- Blue background appears on hover: rgba(59, 130, 246, 0.1)
- Icons scale slightly (1.05x) on hover
- No "X" appears next to search icon

### How to Test
1. Hover over each icon in the header (search, account, cart)
2. Check for circular blue background
3. Verify smooth scale animation
4. ✅ **Pass if:** All icons behave identically

### Visual Check
```
NORMAL STATE:          HOVER STATE:
   [Q]  [👤]  [🛒]       [🔵Q]  [👤]  [🛒]
                         ↑ Blue circle + slight scale
```

---

## 📍 Test 3: Slideshow Navigation Buttons

### Expected Behavior
- Both left and right arrows have identical styling
- White circular buttons with slight transparency
- Subtle border: 2px solid rgba(30, 58, 95, 0.2)
- Box shadow visible
- Blue hover effect with scale animation

### How to Test
1. Go to homepage slideshow
2. Look at the left arrow button
3. Look at the right arrow button
4. Compare their styling
5. Hover over each button
6. ✅ **Pass if:** Both buttons look identical in all states

### Visual Reference
```
BOTH BUTTONS SHOULD LOOK LIKE THIS:

Normal:                 Hover:
  ⃝  ←                    ⃝  ←
  │                       │
  └─ White, shadow       └─ Brighter, blue border, scales up

SHOULD BE IDENTICAL:
Left:  ⃝  ←
Right:      →  ⃝
```

---

## 📍 Test 4: Pagination Dots Visibility

### Expected Behavior
- Dots visible against slideshow background
- Active dot is blue (#3b82f6) and slightly larger (14px vs 12px)
- Inactive dots are gray with transparency
- Hover shows blue color
- Smooth transitions

### How to Test
1. Navigate to homepage slideshow
2. Look at pagination dots below the slideshow
3. Click different dots to change slides
4. Observe active dot changes
5. Hover over inactive dots
6. ✅ **Pass if:** Active dot is clearly blue and larger

### Visual Reference
```
INACTIVE DOTS:  ○ ○ ○ ○     (gray, transparent)
ACTIVE DOT:     ○ ● ○ ○     (blue, larger, glow)
                  ↑
                  14px, #3b82f6, glow effect
```

---

## 📍 Test 5: Header Navigation Active Link

### Expected Behavior
- Active page link is blue (#3b82f6)
- Active link has underline below it
- Font weight is 600 (semibold)
- Hover shows blue background

### How to Test
1. Go to homepage - "Inicio" should be active
2. Go to a collection page - that link should be active
3. Check if active link is blue
4. Check if underline appears below active link
5. ✅ **Pass if:** Active link is clearly indicated with blue color and underline

### Visual Reference
```
NAVIGATION MENU:

Home      Products    Contact
────      ────────    ───────
↑         ↑           ↑
Blue      Normal      Normal
Underline No line     No line
```

---

## 📍 Test 6: Slideshow Title Color

### Expected Behavior
- Slideshow title is WHITE (#ffffff), not golden/orange
- Title has subtle text-shadow for depth
- Text is clearly readable against all slideshow images
- Content box has darker glassmorphism effect

### How to Test
1. Load homepage slideshow
2. Read the main title (e.g., "Tecnología Premium para tu Estilo de Vida")
3. Verify title is white, not golden
4. Navigate between slides to check all titles
5. ✅ **Pass if:** All titles are white with good readability

### Color Comparison
```
❌ OLD (Golden Gradient):
   ┌─────────────────┐
   │  Orange/Golden  │ ← Can be hard to read
   │  Gradient Text  │
   └─────────────────┘

✅ NEW (White):
   ┌─────────────────┐
   │  White Text     │ ← Clear and readable
   │  with shadow    │
   └─────────────────┘
```

---

## 📍 Test 7: CTA Button Styling

### Expected Behavior
- Primary button: Blue (#3b82f6), no border
- Secondary button: Transparent with white border
- Both buttons have hover effects (lift up 1px, add shadow)
- Rounded corners (8px border-radius)

### How to Test
1. Find CTA buttons in slideshow ("VER CATÁLOGO", "CONTACTAR")
2. Check primary button is blue
3. Check secondary button has white border
4. Hover over both buttons
5. ✅ **Pass if:** Buttons lift slightly and show shadow on hover

### Visual Reference
```
PRIMARY BUTTON (VER CATÁLOGO):
┌──────────────────┐
│   VER CATÁLOGO   │  ← Blue background
└──────────────────┘

SECONDARY BUTTON (CONTACTAR):
┌──────────────────┐
│    CONTACTAR     │  ← Transparent + white border
└──────────────────┘

HOVER: Both lift up slightly with shadow
```

---

## 📱 Mobile Testing (< 750px)

### Changes on Mobile
1. **Navigation Buttons:** Smaller (40x40px instead of 48x48px)
2. **Content Box Padding:** Reduced (24px 20px)
3. **CTA Buttons:** Slightly smaller text and padding
4. **Icons:** Smaller (16px instead of 20px)

### How to Test
1. Resize browser to mobile width (< 750px) or use device
2. Verify all elements are proportionally smaller
3. Check touch targets are still usable
4. ✅ **Pass if:** All elements scale appropriately

---

## 🖥️ Desktop Testing (> 990px)

### Changes on Desktop
1. **Full Sizing:** All elements at maximum size
2. **Hover Effects:** All hover animations enabled
3. **Spacing:** Optimal spacing for larger screens

### How to Test
1. View on desktop browser (> 990px width)
2. Test all hover effects
3. Verify optimal spacing
4. ✅ **Pass if:** All elements look polished and spacious

---

## ⚡ Performance Check

### Expected Performance
- No layout shifts when scrolling
- Smooth 60fps animations
- No flash of unstyled content
- Fast CSS loading (preloaded)

### How to Test
1. Open Chrome DevTools → Performance tab
2. Record while scrolling and hovering
3. Check for 60fps (no drops below 50fps)
4. ✅ **Pass if:** Smooth animations with no jank

---

## 🎨 Cross-Browser Testing Matrix

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Announcement Bar Hide | ☐ | ☐ | ☐ | ☐ |
| Header Icon Hover | ☐ | ☐ | ☐ | ☐ |
| Slideshow Buttons | ☐ | ☐ | ☐ | ☐ |
| Pagination Dots | ☐ | ☐ | ☐ | ☐ |
| Active Nav Link | ☐ | ☐ | ☐ | ☐ |
| White Titles | ☐ | ☐ | ☐ | ☐ |
| CTA Buttons | ☐ | ☐ | ☐ | ☐ |

---

## 🔍 Common Issues to Watch For

### Issue: Announcement bar leaves gap
**Check:** Is `scrolled-past-header` class being added to body?
**Fix:** Verify header-scroll-handler.js is loaded

### Issue: Icons not hovering consistently
**Check:** Are all icons using `.header__icon` class?
**Fix:** Verify class names in header.liquid

### Issue: Slideshow buttons still different
**Check:** Is CSS file loaded after slideshow-enhancements.css?
**Fix:** Verify loading order in theme.liquid

### Issue: Title still shows golden color
**Check:** Are `!important` flags being overridden?
**Fix:** Check browser DevTools for CSS conflicts

### Issue: Changes not appearing
**Check:** Is CSS file cached?
**Fix:** Hard refresh (Ctrl+Shift+R) or clear browser cache

---

## ✅ Final Checklist

- [ ] Announcement bar hides smoothly on scroll
- [ ] Header icons have circular hover effect
- [ ] Slideshow navigation buttons are identical
- [ ] Pagination dots are visible and blue when active
- [ ] Active navigation link is blue with underline
- [ ] Slideshow titles are white (not golden)
- [ ] CTA buttons have proper styling and hover effects
- [ ] Mobile view scales appropriately
- [ ] Desktop view shows all effects
- [ ] No console errors
- [ ] Smooth 60fps animations
- [ ] Works in all major browsers

---

## 📸 Before/After Screenshots

Take screenshots of the following for documentation:

1. **Announcement Bar:**
   - Before scroll (bar visible)
   - After scroll (bar hidden, no gap)

2. **Header Icons:**
   - Normal state
   - Hover state (blue circle)

3. **Slideshow Navigation:**
   - Left button style
   - Right button style (should match left)
   - Hover state

4. **Slideshow Title:**
   - Old golden gradient (if available)
   - New white text

5. **Mobile View:**
   - All elements scaled down
   - Touch targets still usable

---

**Testing Date:** _____________  
**Tested By:** _____________  
**Browser/Device:** _____________  
**Result:** ☐ Pass  ☐ Fail  ☐ Needs Revision

---

## 🎓 Tips for Effective Testing

1. **Test systematically:** Go through each section in order
2. **Use multiple devices:** Desktop, tablet, mobile
3. **Test all browsers:** Chrome, Firefox, Safari, Edge
4. **Record video:** Capture scroll and hover animations
5. **Check console:** Open DevTools to catch any errors
6. **Compare with issue description:** Verify all problems are fixed

---

**Document Version:** 1.0  
**Last Updated:** 2026-02-04
