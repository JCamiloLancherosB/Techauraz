# Header Fix Visual Reference

## Before vs After

### BEFORE (Problem) ❌
```
┌─────────────────────────────────────┐
│  🔵 Announcement Bar (z-index: 10) │  ← COVERED/HIDDEN
├─────────────────────────────────────┤
│                                     │
│  ⚪ Header (z-index: 100, sticky)  │  ← OVERLAPPING
│                                     │
├─────────────────────────────────────┤
│                                     │
│  Hero Section                       │  ← PARTIALLY HIDDEN
│  (Content starts here)              │     UNDER HEADER
│                                     │
└─────────────────────────────────────┘
```

**Issues:**
- ❌ Announcement bar covered by header
- ❌ Hero content hidden under sticky header
- ❌ Inconsistent z-index values (10 vs 99 vs 100)
- ❌ No proper offset for main content

---

### AFTER (Fixed) ✅
```
┌─────────────────────────────────────┐
│  🟦 Announcement Bar (z-index: 101)│  ← ALWAYS VISIBLE
├─────────────────────────────────────┤
│  ⬜ Header (z-index: 100, sticky)  │  ← BELOW ANNOUNCEMENT
├─────────────────────────────────────┤
│  ↕ Offset: var(--tech-header-offset)│  ← PROPER SPACING
├─────────────────────────────────────┤
│                                     │
│  Hero Section                       │  ← FULLY VISIBLE
│  (Content properly positioned)      │
│                                     │
└─────────────────────────────────────┘
```

**Solutions Applied:**
- ✅ Announcement bar z-index: 101 (above header)
- ✅ Header z-index: 100 (below announcement, above content)
- ✅ Main padding-top: var(--tech-header-offset)
- ✅ Body scroll-padding-top: var(--tech-header-offset)

---

## Z-Index Hierarchy

```
┌─────────────────────────────────────────┐
│  Layer 5: MODALS & DRAWERS (200+)      │  ← Topmost
│  • Cart Drawer                          │
│  • Menu Drawer                          │
│  • Search Modal                         │
├─────────────────────────────────────────┤
│  Layer 4: STICKY HEADER GROUP (100-101)│
│  ├─ Announcement Bar (101) ✅           │
│  └─ Main Header (100) ✅                │
├─────────────────────────────────────────┤
│  Layer 3: STICKY ELEMENTS (90-99)      │
│  ├─ Sticky Benefits Bar (98)           │
│  └─ WhatsApp Float Button (95)         │
├─────────────────────────────────────────┤
│  Layer 2: INTERACTIVE (10-50)          │
│  • Dropdowns, Tooltips, Quick-views    │
├─────────────────────────────────────────┤
│  Layer 1: REGULAR CONTENT (0-9)        │  ← Base layer
│  • Cards, Sections, Images             │
└─────────────────────────────────────────┘
```

---

## Responsive Offsets

### Mobile (< 750px)
```
┌────────────────────┐
│  Announcement Bar  │
├────────────────────┤
│  Header            │
├────────────────────┤
│  ↕ 64px offset     │  ← var(--tech-header-offset)
├────────────────────┤
│  Content           │
└────────────────────┘
```

### Tablet (750px - 989px)
```
┌─────────────────────────┐
│  Announcement Bar       │
├─────────────────────────┤
│  Header                 │
├─────────────────────────┤
│  ↕ 68px offset          │  ← var(--tech-header-offset)
├─────────────────────────┤
│  Content                │
└─────────────────────────┘
```

### Desktop (≥ 990px)
```
┌────────────────────────────────┐
│  Announcement Bar              │
├────────────────────────────────┤
│  Header                        │
├────────────────────────────────┤
│  ↕ 72px offset                 │  ← var(--tech-header-offset)
├────────────────────────────────┤
│  Content                       │
└────────────────────────────────┘
```

---

## Sticky Behavior on Scroll

### Initial State (Top of Page)
```
Viewport Top ──────────────────────────
│
├─ Announcement Bar (sticky, top: 0, z: 101)
├─ Header (sticky, top: 0, z: 100)
│
├─ Main Content (padding-top: offset)
│
```

### Scrolling Down
```
Viewport Top ──────────────────────────
│
├─ Announcement Bar ← STICKS (z: 101, visible)
├─ Header          ← STICKS (z: 100, below announcement)
│
│  [Content scrolling up...]
│
```

### Key: Both Stick at Same Position
- Announcement bar z-index: 101 → appears ABOVE
- Header z-index: 100 → appears BELOW
- Both have `top: 0` but different z-index creates stack

---

## CSS Variables Flow

```
:root {
  --tech-header-offset: 64px;  ← Mobile default
}

@media (min-width: 750px) {
  :root {
    --tech-header-offset: 68px;  ← Tablet
  }
}

@media (min-width: 990px) {
  :root {
    --tech-header-offset: 72px;  ← Desktop
  }
}

↓ Used in:

body {
  scroll-padding-top: var(--tech-header-offset);
  ↑ Prevents anchors from hiding under header
}

main {
  padding-top: var(--tech-header-offset);
  ↑ Prevents first section from hiding under header
}
```

---

## Exception: Overlay Headers

### Normal Header
```
┌────────────────┐
│  Header        │ ← Opaque background
├────────────────┤
│  ↕ offset      │ ← Padding needed
├────────────────┤
│  Content       │
└────────────────┘
```

### Overlay Header
```
┌────────────────┐
│  Header        │ ← Transparent background
│  ............. │    (over hero image)
│  Hero Image    │
│  ............. │
└────────────────┘
No offset needed (padding-top: 0)
```

CSS:
```css
.header-wrapper--overlay + main {
  padding-top: 0;  /* Reset for overlay */
}
```

---

## Testing Matrix

| Element | Expected Behavior | Verification Method |
|---------|-------------------|---------------------|
| Announcement Bar | Always visible, z: 101 | Visual inspection |
| Header | Below announcement, z: 100 | Visual inspection |
| Hero Section | Starts below header | Measure offset |
| Cart Drawer | Opens above all, z: 200 | Click cart icon |
| Menu Drawer | Opens above all, z: 200 | Click menu icon |
| Menu Hover | Blue color + underline | Hover over links |
| Scroll Behavior | Smooth, no jumps | Scroll up/down |

---

## Quick Reference

### Variable Values
- Mobile: `--tech-header-offset: 64px`
- Tablet: `--tech-header-offset: 68px`
- Desktop: `--tech-header-offset: 72px`

### Z-Index Values
- Modals: `200+`
- Announcement: `101` ✅
- Header: `100` ✅
- Sticky Elements: `90-99`
- Content: `0-9`

### Key Files Modified
1. `assets/ui-ux-responsive-fixes.css` (Main)
2. `assets/techauraz-custom-ui.css` (Z-index)
3. `assets/base.css` (Consistency)
4. `sections/header.liquid` (Positioning)

---

## Success Indicators

✅ Announcement bar text fully readable
✅ No content hidden under header
✅ Smooth scroll behavior
✅ Stable header height
✅ Drawers open correctly
✅ Menu hover states work
✅ Works on all breakpoints
✅ No console errors
✅ CSS validates

---

**Visual Reference Created:** 2026-01-23
**Status:** Ready for Testing ✅
