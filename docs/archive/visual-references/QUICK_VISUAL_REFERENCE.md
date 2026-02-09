# Quick Visual Reference Guide - Techauraz 2026

## 🎨 New Visual Components

### Badges
Add badges to products or sections:
```html
<span class="badge badge--new">New</span>
<span class="badge badge--featured">Featured</span>
<span class="badge badge--sale">Sale</span>
<span class="badge badge--premium">Premium</span>
<span class="badge badge--outline">Limited</span>
```

### Gradient Backgrounds
Apply gradient backgrounds to sections:
```html
<div class="gradient-bg-primary">...</div>
<div class="gradient-bg-secondary">...</div>
<div class="gradient-bg-accent">...</div>
```

### Glassmorphism
Add modern glass effect:
```html
<div class="glass-effect">...</div>
```

### Shadow Effects
Apply premium shadows:
```html
<div class="shadow-premium">...</div>
<div class="shadow-premium-hover">Hover me</div>
<div class="glow-effect">...</div>
```

### Animations
Add smooth entry animations:
```html
<div class="animate-fade-in">...</div>
<div class="loading-shimmer">Loading...</div>
```

## 🎯 Component Classes

### Buttons
```html
<!-- Primary (default) -->
<button class="button button--primary">Primary</button>

<!-- Secondary -->
<button class="button button--secondary">Secondary</button>

<!-- Tertiary -->
<button class="button button--tertiary">Tertiary</button>

<!-- Sizes -->
<button class="button button--small">Small</button>
<button class="button button--large">Large</button>
```

### Cards
All cards now have automatic premium styling:
- Hover effects (lift, shadow, border glow)
- Smooth transitions
- Responsive grids

### Hero/Banner
Automatic enhancements:
- Gradient overlays on images
- Glassmorphism content boxes
- Enhanced button styling
- Dark variant support

### Newsletter
Modern gradient design with:
- Glass-effect inputs
- Inline submit button
- Enhanced focus states
- Success/error messages

### Testimonials
Premium card design with:
- Quote decorations
- Star ratings
- Avatar rings
- Slider controls

### Footer
Modern dark gradient with:
- Gradient text headings
- Animated link underlines
- Glowing social icons
- Responsive grid

## 🎨 Color Palette

### Primary Colors
- Primary: `#3b82f6` (Blue-500)
- Primary Dark: `#2563eb` (Blue-600) - **Use for buttons**
- Primary Darker: `#1d4ed8` (Blue-700)

### Gradients
- Button: `#2563eb → #1d4ed8`
- Hero/Newsletter: `rgba(59, 130, 246, 0.95) → rgba(37, 99, 235, 0.95)`
- Footer: `#1e293b → #0f172a`

### Shadows
All shadows use blue tints: `rgba(59, 130, 246, 0.25)`

## 📱 Responsive Breakpoints

- **Mobile**: max-width: 749px
- **Tablet**: 750px - 989px
- **Desktop**: min-width: 990px

## ♿ Accessibility Features

### Focus States
All interactive elements have blue focus rings with glow

### Skip to Content
Automatically available on keyboard navigation

### Color Contrast
- All text: WCAG AA compliant
- Button text: 5.17:1 ratio ✓

### Media Preferences
- High contrast mode supported
- Reduced motion supported

## 🚀 Quick Wins

### 1. Add Product Badges
```html
<div class="badge-container">
  <span class="badge badge--new">New</span>
</div>
```

### 2. Enhance Section Backgrounds
```html
<section class="gradient-bg-accent">
  <!-- Your content -->
</section>
```

### 3. Use Premium Shadows
Add class `shadow-premium` to any element for instant depth

### 4. Apply Animations
Add class `animate-fade-in` for smooth entry effects

## 📊 File Loading

The `visual-refinements-2026.css` is automatically loaded via `theme.liquid`:
```liquid
<link rel="preload" href="{{ 'visual-refinements-2026.css' | asset_url }}" 
      as="style" onload="this.onload=null;this.rel='stylesheet'">
```

All styles are applied automatically to standard Shopify components.

## 🎓 Best Practices

1. **Use CSS Variables**: All spacing, colors, fonts use design tokens
2. **Mobile First**: Design for mobile, enhance for desktop
3. **Accessibility**: Always test keyboard navigation
4. **Performance**: Gradients and shadows are GPU-accelerated
5. **Consistency**: Use existing components before creating new ones

## 🔍 Testing Checklist

- [ ] Test on mobile (375px, 414px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1440px+)
- [ ] Verify keyboard navigation
- [ ] Check color contrast
- [ ] Test with reduced motion enabled
- [ ] Verify in Chrome, Firefox, Safari

## 📞 Questions?

Refer to:
- `VISUAL_ENHANCEMENTS_2026_SUMMARY.md` - Complete documentation
- `STYLE_NOTES.md` - Architecture details
- `assets/base.css` - Design tokens
- `assets/visual-refinements-2026.css` - All component styles
