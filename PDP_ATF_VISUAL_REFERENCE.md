# PDP Above-the-Fold - Visual Reference

## Mobile Layout (360x800)

```
┌─────────────────────────────────────┐
│  [HEADER/NAVIGATION]                │ ← Outside ATF scope
├─────────────────────────────────────┤
│                                     │
│  [PRODUCT IMAGE SLIDER]             │ ← .tech-pdp-media
│  Max height: 45vh on mobile         │    (existing class)
│                                     │
│  [◀ Prev] [● ● ●] [Next ▶]         │
│                                     │
├─────────────────────────────────────┤
│ ╔═══════════════════════════════╗  │ ← .tech-pdp-atf wrapper
│ ║                               ║  │    (NEW)
│ ║ Power Bank Transparente       ║  │ ← Title block
│ ║ 670 - 20,000 mAh              ║  │    margin-bottom: 0.375rem
│ ║                               ║  │
│ ║ $89.900                       ║  │ ← Price block
│ ║ Precio regular: $119.900      ║  │    margin-bottom: 0.375rem
│ ║                               ║  │
│ ║ ┌───────────────────────────┐ ║  │ ← Trust Line (NEW)
│ ║ │ 💵 Contraentrega Colombia │ ║  │    .tech-trust-line
│ ║ │ ✅ Garantía 30 días       │ ║  │    margin-bottom: 0.5rem
│ ║ └───────────────────────────┘ ║  │
│ ║                               ║  │
│ ║ Color: [Negro] [Blanco]       ║  │ ← Variant picker
│ ║                               ║  │    margin-bottom: 0.5rem
│ ║                               ║  │
│ ║ ╔═══════════════════════════╗ ║  │ ← .tech-pdp-purchase
│ ║ ║ ┌───────────────────────┐ ║ ║  │    (existing wrapper)
│ ║ ║ │ 🛒 COMPRAR AHORA      │ ║ ║  │ ← Primary CTA
│ ║ ║ │   (PayPal/Card)       │ ║ ║  │    .tech-cta-primary
│ ║ ║ └───────────────────────┘ ║ ║  │    (existing styles)
│ ║ ║                           ║ ║  │    gap: 0.625rem
│ ║ ║ ┌───────────────────────┐ ║ ║  │
│ ║ ║ │ Agregar al carrito    │ ║ ║  │ ← Secondary CTA
│ ║ ║ └───────────────────────┘ ║ ║  │    .tech-cta-secondary
│ ║ ╚═══════════════════════════╝ ║  │    (existing styles)
│ ║                               ║  │
│ ╚═══════════════════════════════╝  │ ← End .tech-pdp-atf
├─────────────────────────────────────┤
│                                     │
│  [Description]                      │ ← Below the fold
│  [Specifications]                   │    (scroll required)
│  [Reviews]                          │
│                                     │
└─────────────────────────────────────┘
```

## Key Visual Elements

### Trust Line Appearance
```
┌─────────────────────────────────────┐
│                                     │
│  💵 Contraentrega en Colombia       │
│  ✅ Garantía 30 días                │
│                                     │
└─────────────────────────────────────┘
  ▲                                   ▲
  │                                   │
  │    Gradient background:           │
  │    #f8f9fa → #e9ecef              │
  │    Border: #dee2e6                │
  │    Border-radius: 8px             │
  └───────────────────────────────────┘
```

### Desktop/Tablet Layout (>749px)

Trust line displays horizontally with more spacing:
```
┌──────────────────────────────────────────────┐
│                                              │
│  💵 Contraentrega Colombia  │  ✅ Garantía  │
│                             │    30 días     │
│                                              │
└──────────────────────────────────────────────┘
         ▲                            ▲
         │                            │
         └─── Gap: 1.5rem ────────────┘
```

### Very Small Mobile (<360px)

Trust line stacks vertically:
```
┌────────────────────┐
│                    │
│ 💵 Contraentrega   │
│    en Colombia     │
│                    │
│ ✅ Garantía        │
│    30 días         │
│                    │
└────────────────────┘
```

## Spacing Comparison

### Before (Default Theme)
```
Title
  ↓ ~1rem
Price
  ↓ ~1.5rem
Variant Picker
  ↓ ~1.5rem
Buy Buttons
```

### After (Optimized ATF)
```
Title
  ↓ 0.375rem
Price
  ↓ 0.375rem
Trust Line ← NEW
  ↓ 0.5rem
Variant Picker
  ↓ 0.5rem
Buy Buttons
```

**Total Space Saved:** ~2.8rem (~45px) on mobile

## Media Height Comparison

### Before
```
┌──────────────┐
│              │
│              │
│    IMAGE     │ 60vh
│              │
│              │
└──────────────┘
       ↓
   [Content]
```

### After (Mobile)
```
┌──────────────┐
│              │
│    IMAGE     │ 45vh
│              │
└──────────────┘
       ↓
   [Content] ← More visible above fold
```

## Color Palette

### Trust Line
- **Background Start:** `#f8f9fa` (very light gray)
- **Background End:** `#e9ecef` (light gray)
- **Border:** `#dee2e6` (medium light gray)
- **Text:** `#374151` (dark gray)
- **Emoji Size:** `1.25rem` (desktop), `1.125rem` (mobile)
- **Text Size:** `0.875rem` (desktop), `0.8125rem` (mobile)

### CTA Buttons (Existing)
**Primary (Comprar ahora):**
- Background: `#2563eb` (blue)
- Text: `#ffffff` (white)
- Shadow: `0 4px 12px rgba(37, 99, 235, 0.3)`
- Height: `52px` (desktop), `50px` (mobile)

**Secondary (Agregar al carrito):**
- Background: `white`
- Border: `2px solid #0096c7` (cyan)
- Text: `#0096c7` (cyan)
- Height: `48px`

## Responsive Breakpoints

1. **Desktop/Tablet** (`>749px`)
   - Media height: `60vh`
   - Trust line gap: `1.5rem`
   - Spacing: Default (larger)

2. **Mobile** (`≤749px`)
   - Media height: `45vh`
   - Trust line gap: `1rem`
   - Spacing: Compact

3. **Small Mobile** (`≤360px`)
   - Trust line: Stacked vertical
   - Gap: `0.5rem`

## Z-Index Layers
No z-index changes required. All elements remain in normal document flow.

## Animation/Transitions
No animations added. Existing theme animations preserved.

## Accessibility
- Emoji icons: `aria-hidden="true"` (decorative)
- Text labels: Semantic and readable
- Color contrast: Meets WCAG AA standards
- Touch targets: 48px minimum (maintained)

## Print Styles
Not affected. Trust line will print with content if user prints page.

## Dark Mode
Not implemented. Uses theme's default color scheme.

## RTL Support
CSS uses logical properties where applicable. Trust line will work with RTL languages.

## Example on /products/power-bank-transparente-670-20-000-mah

When trust_line block is added via Shopify admin, it will appear as:

```
Power Bank Transparente 670 - 20,000 mAh
$89.900  (Regular: $119.900)

┌────────────────────────────────────┐
│ 💵 Contraentrega en Colombia       │
│ ✅ Garantía 30 días                │
└────────────────────────────────────┘

Color: [Negro] [Blanco] [Azul]

[🛒 COMPRAR AHORA]
[Agregar al carrito]
```

## Notes
- All measurements are responsive and scale with viewport
- Emoji display depends on user's OS/browser
- Theme customizations may affect final appearance
- Block must be manually added via Shopify theme editor
