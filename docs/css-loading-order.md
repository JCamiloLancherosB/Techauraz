# CSS Loading Order Documentation

This document describes the intended layering order for CSS in the TechAura Shopify theme, ensuring predictable styling and avoiding cascade conflicts.

## CSS Architecture Overview

The theme uses a layered CSS architecture with clear responsibilities for each layer:

```
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 5: Section-Specific Styles (Highest Specificity)        │
│  - section-*.css (loaded per section via stylesheet_tag)       │
│  - Scoped with section wrapper classes (.category-nav-section) │
└─────────────────────────────────────────────────────────────────┘
                              ▲
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 4: Custom UI Overrides                                   │
│  - techauraz-custom-ui.css (WhatsApp, announcements, UI)       │
│  - slideshow-enhancements.css (controls, CTAs)                 │
└─────────────────────────────────────────────────────────────────┘
                              ▲
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 3: Component & Section Base Styles                       │
│  - home-modern-blocks.css (testimonials, newsletter, footer)   │
│  - testimonials.css (reviews & carousel sections)              │
│  - ui-ux-responsive-fixes.css (responsive utilities)           │
└─────────────────────────────────────────────────────────────────┘
                              ▲
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 2: Base Theme Styles                                     │
│  - base.css (Dawn core styles, typography, grid)               │
└─────────────────────────────────────────────────────────────────┘
                              ▲
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 1: Design Tokens (Lowest - Foundation)                   │
│  - techauraz-tokens.css (CSS custom properties)                │
└─────────────────────────────────────────────────────────────────┘
```

## Loading Order in theme.liquid

The CSS files are loaded in this exact order in `layout/theme.liquid`:

### 1. Design Tokens (Foundation)
```liquid
<link rel="preload" href="{{ 'techauraz-tokens.css' | asset_url }}" as="style" ...>
```
- **Purpose**: Defines CSS custom properties (variables)
- **Contains**: Colors, spacing, typography scales, shadows
- **Specificity**: Lowest - provides values, not styles

### 2. Base Styles
```liquid
<link rel="preload" href="{{ 'base.css' | asset_url }}" as="style" ...>
```
- **Purpose**: Core Dawn theme styles
- **Contains**: Reset, typography, grid, basic components
- **Specificity**: Low - generic element and class selectors

### 3. UI/UX Responsive Fixes
```liquid
<link rel="preload" href="{{ 'ui-ux-responsive-fixes.css' | asset_url }}" as="style" ...>
```
- **Purpose**: Responsive design utilities and fixes
- **Contains**: Media queries, layout adjustments, normalization
- **Specificity**: Medium

### 4. Component Styles
```liquid
<link rel="preload" href="{{ 'home-modern-blocks.css' | asset_url }}" as="style" ...>
<link rel="preload" href="{{ 'testimonials.css' | asset_url }}" as="style" ...>
```
- **Purpose**: Shared component styles
- **Contains**: Common UI patterns used across sections
- **Specificity**: Medium

### 5. Custom UI Components
```liquid
<link rel="preload" href="{{ 'techauraz-custom-ui.css' | asset_url }}" as="style" ...>
```
- **Purpose**: TechAura-specific UI components
- **Contains**: WhatsApp button, announcement bar, cookie banner
- **Specificity**: Medium-High
- **Note**: Loaded ONCE in theme.liquid - sections should NOT reload this file

### 6. Enhancement Overrides
```liquid
<link rel="preload" href="{{ 'slideshow-enhancements.css' | asset_url }}" as="style" ...>
```
- **Purpose**: Enhancement styles for specific features
- **Contains**: Slideshow controls, CTAs, animations
- **Specificity**: High

### 7. Section-Specific Styles (Per Section)
```liquid
{{ 'section-category-navigation.css' | asset_url | stylesheet_tag }}
{{ 'section-modern-feature-cards.css' | asset_url | stylesheet_tag }}
```
- **Purpose**: Styles specific to individual sections
- **Contains**: Isolated section styles with scoped selectors
- **Specificity**: Highest - uses section wrapper classes
- **Loading**: Each section loads its own CSS file via stylesheet_tag

## Scoping Guidelines

### Section CSS Scoping
All section-specific CSS should be scoped using the section's wrapper class:

```css
/* ✅ CORRECT - Scoped to section wrapper */
.category-nav-section .category-card {
  /* styles */
}

/* ❌ WRONG - Global selector, can leak to other components */
.category-card {
  /* styles */
}
```

### Keyframe Naming
Use unique prefixes for keyframes to avoid conflicts:

```css
/* ✅ CORRECT - Unique keyframe name */
@keyframes categoryFadeInUp { ... }
@keyframes featureCardFadeInScale { ... }

/* ❌ WRONG - Generic name may conflict */
@keyframes fadeIn { ... }
```

## Avoiding Duplicate Loads

### Files Loaded Globally (DO NOT reload in sections)
These files are loaded once in `theme.liquid`:
- `techauraz-tokens.css`
- `base.css`
- `ui-ux-responsive-fixes.css`
- `home-modern-blocks.css`
- `testimonials.css`
- `techauraz-custom-ui.css`
- `slideshow-enhancements.css`

### Files Loaded Per Section (Load in sections as needed)
These files should be loaded by their respective sections:
- `section-category-navigation.css`
- `section-modern-feature-cards.css`
- Component-specific CSS (`component-*.css`)

## Troubleshooting

### Styles Not Applying?
1. Check if the CSS file is loaded (DevTools → Network tab)
2. Verify selector specificity matches the element
3. Ensure no duplicate loads causing cascade conflicts
4. Check for `!important` overrides in other files

### Duplicate CSS Loads?
1. Search for the filename across all sections: `grep -r "filename.css" sections/`
2. Remove redundant `stylesheet_tag` calls from sections
3. Keep ONE source of truth (usually in `theme.liquid`)

### Cascade Conflicts?
1. Increase specificity using section wrapper class
2. Verify loading order in `theme.liquid`
3. Use DevTools to trace which file is winning

## File Reference

| File | Layer | Loaded In | Purpose |
|------|-------|-----------|---------|
| `techauraz-tokens.css` | 1 | theme.liquid | Design tokens |
| `base.css` | 2 | theme.liquid | Core styles |
| `ui-ux-responsive-fixes.css` | 3 | theme.liquid | Responsive utils |
| `home-modern-blocks.css` | 3 | theme.liquid | Component styles |
| `testimonials.css` | 3 | theme.liquid | Reviews & carousel styles |
| `techauraz-custom-ui.css` | 4 | theme.liquid | Custom UI |
| `slideshow-enhancements.css` | 4 | theme.liquid | Slideshow |
| `section-*.css` | 5 | Per section | Section-specific |

---

*Last updated: 2026-01-26*
