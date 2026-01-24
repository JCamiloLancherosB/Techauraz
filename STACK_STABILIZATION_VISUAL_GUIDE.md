# Stack Stabilization - Visual Reference

## Before vs After

### BEFORE (Issues)
```
┌─────────────────────────────────────┐
│  Topbar (floating weird)            │ ← Positioned incorrectly
├─────────────────────────────────────┤
│  Header (weird offset)              │ ← Wrong top position
├─────────────────────────────────────┤
│                                     │
│  [GAP/OVERLAP]                      │ ← Weird spacing
│                                     │
├─────────────────────────────────────┤
│                                     │
│  Hero/Slider (covered)              │ ← Overlapped by header
│                                     │
└─────────────────────────────────────┘
```

**Problems**:
- ❌ Topbar "floating weird"
- ❌ Header has strange offset
- ❌ Gap or overlap between header and content
- ❌ Hero/slider covered by sticky elements
- ❌ Scroll jumps when navigating

### AFTER (Fixed)
```
┌─────────────────────────────────────┐
│  Topbar (sticky top:0, z:101)       │ ← 45px mobile
├─────────────────────────────────────┤
│  Header (sticky top:45px, z:100)    │ ← 60px mobile
├─────────────────────────────────────┤  
│  Main (padding-top: 105px)          │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │  Hero/Slider (visible)        │  │ ← No overlap!
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

**Solutions**:
- ✅ Topbar sticky at top: 0 with z-index: 101
- ✅ Header sticky at top: var(--tech-topbar-height) with z-index: 100
- ✅ Main content has padding-top: var(--tech-stack-height)
- ✅ Hero/slider properly positioned
- ✅ Smooth scroll with scroll-padding-top

## Z-Index Stack (Side View)

```
Layer 5 (Front)  │  Modals/Drawers (z: 200+)
                 │  ┌──────────────────────┐
                 │  │ [Cart Drawer]        │
                 │  └──────────────────────┘
─────────────────┼─────────────────────────────
Layer 4          │  Topbar (z: 101)
                 │  ┌──────────────────────┐
                 │  │ Announcement Bar     │
                 │  └──────────────────────┘
                 │  Header (z: 100)
                 │  ┌──────────────────────┐
                 │  │ Main Navigation      │
                 │  └──────────────────────┘
─────────────────┼─────────────────────────────
Layer 3          │  Floating Elements (z: 95)
                 │  ┌──────┐
                 │  │ 💬   │ WhatsApp FAB
                 │  └──────┘
─────────────────┼─────────────────────────────
Layer 1 (Back)   │  Content (z: 0-9)
                 │  ┌──────────────────────┐
                 │  │ Hero/Slider          │
                 │  │ Product Grid         │
                 │  │ Footer               │
                 │  └──────────────────────┘
```

## CSS Variables Flow

### Mobile (< 750px)
```
:root {
  --tech-topbar-height: 45px
  --tech-header-height: 60px
  --tech-stack-height: calc(45px + 60px) = 105px
}

.announcement-bar-section {
  top: 0px  ───────────┐
}                      │
                       │ 45px gap
.section-header {      │
  top: 45px ──────────┘
}

main {
  padding-top: 105px ─────┐
}                          │ Offset = topbar + header
                           │
First Content Element ────┘
```

### Tablet (750px - 989px)
```
:root {
  --tech-topbar-height: 48px
  --tech-header-height: 64px
  --tech-stack-height: 112px
}
```

### Desktop (≥ 990px)
```
:root {
  --tech-topbar-height: 52px
  --tech-header-height: 68px
  --tech-stack-height: 120px
}
```

## Scroll Behavior

### Before Scroll
```
┌─────────────────────┐
│ Topbar (visible)    │ ← top: 0
├─────────────────────┤
│ Header (visible)    │ ← top: 45px
├─────────────────────┤
│ Content...          │
│                     │
│                     │
└─────────────────────┘
       ↓ User scrolls down
```

### During Scroll (Sticky Behavior)
```
┌─────────────────────┐ ← Viewport top
│ Topbar (sticky)     │ ← Stays at top: 0
├─────────────────────┤
│ Header (sticky)     │ ← Stays at top: 45px (below topbar)
├─────────────────────┤
│                     │
│ Content scrolling.. │ ← Scrolls normally
│                     │
│                     │
└─────────────────────┘
```

### Key Point
Both elements stick, but at **different vertical positions**:
- Topbar: Always at `top: 0`
- Header: Always at `top: var(--tech-topbar-height)`

This creates a **stacked sticky effect** ✨

## Anchor Link Behavior

### Without scroll-padding-top ❌
```
User clicks link → #section-2
                      ↓
┌─────────────────────┐ ← Viewport top
│ Topbar              │ ← Covers content!
├─────────────────────┤
│ Header              │ ← Covers content!
├═════════════════════┤
│ [SECTION-2 HIDDEN]  │ ← Hidden under sticky header
│                     │
└─────────────────────┘
```

### With scroll-padding-top ✅
```
User clicks link → #section-2
                      ↓
┌─────────────────────┐ ← Viewport top
│ Topbar              │
├─────────────────────┤
│ Header              │
├─────────────────────┤
│                     │ ← 105px offset
│ [SECTION-2 VISIBLE] │ ← Visible below header!
│                     │
└─────────────────────┘
```

## Browser DevTools Inspection

### To verify heights are correct:

1. **Open DevTools** (F12)
2. **Select announcement-bar-section**
   ```
   Computed → height: ???px
   ```
3. **Compare with CSS variable**
   ```css
   --tech-topbar-height: 45px  ← Should match computed height
   ```
4. **Adjust if needed**

### To verify stacking:

1. **Inspect z-index values**
   ```
   .announcement-bar-section → z-index: 101 ✅
   .section-header → z-index: 100 ✅
   ```

2. **Check sticky positioning**
   ```
   .announcement-bar-section → position: sticky; top: 0px ✅
   .section-header → position: sticky; top: 45px ✅
   ```

3. **Verify main offset**
   ```
   main → padding-top: 105px ✅
   ```

## Quick Troubleshooting

### Issue: Gap between header and content
**Check**: `main { padding-top: var(--tech-stack-height) }`
**Fix**: Ensure variable is calculated correctly

### Issue: Header overlaps topbar
**Check**: `.section-header { top: var(--tech-topbar-height) }`
**Fix**: Verify variable is defined in :root

### Issue: Content hidden under header
**Check**: `main { padding-top: var(--tech-stack-height) }`
**Fix**: Increase padding or adjust variables

### Issue: Transparency shows content underneath
**Check**: Background colors on sticky elements
**Fix**: Ensure `background-color: rgb(var(--color-background))` is applied

## Testing Checklist

### Visual Tests
- [ ] Topbar visible and stable at page top
- [ ] Header positioned directly below topbar
- [ ] No gap between topbar and header
- [ ] No overlap with hero/slider
- [ ] Smooth scroll behavior
- [ ] All text is readable (proper contrast)

### Functional Tests
- [ ] Scroll down → header sticks
- [ ] Scroll up → header remains stable
- [ ] Click anchor link → content not hidden
- [ ] Resize window → responsive heights work
- [ ] Mobile menu works (z-index correct)
- [ ] Cart drawer appears above header

### Breakpoint Tests
- [ ] Mobile (< 750px): 45px + 60px = 105px
- [ ] Tablet (750-989px): 48px + 64px = 112px
- [ ] Desktop (≥ 990px): 52px + 68px = 120px

---

**Quick Reference**: All measurements in `STACK_STABILIZATION_SUMMARY.md`
