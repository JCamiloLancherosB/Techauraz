# Cleanup Removals - Inline Scripts/Styles and Redundant Files

## Summary

This document records all files removed as part of the audit-driven safe cleanup to eliminate inline scripts, redundant templates/sections/snippets, and consolidate code into external asset files.

## Date: 2026-01-28

---

## 1. Inline Scripts Moved to External Files

### 1.1 Smooth Scroll Script (main-product.liquid)

**Location**: `sections/main-product.liquid` (inline script near "Ver todos los detalles" link)
**Destination**: `assets/product-enhancements.js` (function `initSmoothScrollToDescription`)

**Description**: Moved the smooth scroll functionality for "Ver todos los detalles" link from inline script to the external product-enhancements.js file. The script handles:
- Smooth scroll with 80px header offset
- Respects `prefers-reduced-motion` preference
- Uses `data-scroll-to-description` attribute for initialization

**Verification Commands**:
```bash
# Confirm script exists in external file
grep -n "initSmoothScrollToDescription" assets/product-enhancements.js
# Output: Shows function definition

# Confirm inline script removed
grep -c "<script>" sections/main-product.liquid | grep -v asset_url
# Expected: Significantly reduced count
```

---

### 1.2 StickyCTABar Class (sticky-mobile-cta.liquid)

**Location**: `sections/sticky-mobile-cta.liquid` (inline script, ~250 lines)
**Destination**: `assets/sticky-cta.js` (new file)

**Description**: Moved the entire StickyCTABar class implementation to a new external JavaScript file. The class handles:
- Shows when primary CTA scrolls out of viewport
- Coordinates with WhatsApp button and cookie banner
- Handles Buy Now vs Add to Cart action
- Updates on variant changes
- Mobile-only activation (< 750px)
- Proper cleanup on page navigation

**Data Attribute Changes**:
- Added `data-buy-button-text` attribute to pass the button text from Liquid settings

**Verification Commands**:
```bash
# Confirm new file created
ls -la assets/sticky-cta.js

# Confirm class exists in external file
grep -n "class StickyCTABar" assets/sticky-cta.js
# Output: Line 13

# Confirm inline script removed from section
grep "<script>" sections/sticky-mobile-cta.liquid | grep -v asset_url
# Expected: No inline script tags
```

---

## 2. Inline Styles Assessment

### 2.1 Dynamic Padding Style (product-views-counter.liquid)

**Location**: `sections/product-views-counter.liquid` (lines 32-37)
**Status**: **KEPT INLINE** (intentional)

**Reason**: This style block generates CSS using Liquid section ID and settings values:
```liquid
<style>
  .section-{{ section.id }}-padding {
    padding-top: {{ section.settings.padding_top }}px;
    padding-bottom: {{ section.settings.padding_bottom }}px;
  }
</style>
```

This pattern is standard in Shopify themes for section-specific dynamic styles that depend on admin configuration. Moving this to external CSS would require JavaScript to apply the values, which is less efficient.

---

## 3. Deleted Redundant Files

### 3.1 snippets/sticky-mobile-cta.liquid

**Reason**: Duplicate functionality of `sections/sticky-mobile-cta.liquid`

**Reference Search Commands**:
```bash
# Search for usage in sections
grep -r "render 'sticky-mobile-cta'" sections/
# Output: No matches found

# Search for usage in layout
grep -r "render 'sticky-mobile-cta'" layout/
# Output: No matches found

# Search for usage in templates
grep -r "render 'sticky-mobile-cta'" templates/
# Output: No matches found

# Only self-reference in documentation comment
grep -r "render 'sticky-mobile-cta'" snippets/
# Output: snippets/sticky-mobile-cta.liquid:15 (documentation comment only)
```

**Conclusion**: The snippet was never actually used. The section `sticky-mobile-cta` is used directly via `product.json` template configuration.

---

### 3.2 snippets/cookie-notice.liquid

**Reason**: Unused alternate implementation of cookie consent

**Reference Search Commands**:
```bash
# Search for actual usage
grep -r "render 'cookie-notice'" layout/ sections/ templates/
# Output: No matches found

# Confirm cookie-banner is the active implementation
grep -r "render 'cookie-banner'" layout/
# Output: layout/theme.liquid:550

# Check for referenced CSS file
ls assets/component-cookie-notice.css
# Output: No such file (does not exist)
```

**Conclusion**: The snippet was never integrated into the theme. The active cookie consent implementation is `snippets/cookie-banner.liquid` (rendered in theme.liquid).

---

## 4. Files Retained

The following files were evaluated but retained:

### 4.1 templates/product.liquid

**Status**: Retained

**Reason**: While `templates/product.json` is the primary template, `product.liquid` serves as a compatibility layer for Shopify theme editor features and is a standard Dawn theme component.

### 4.2 Duplicate section/snippet pairs

All section files that have similar snippet counterparts were verified. The sections are the canonical implementations and snippets serve different purposes (reusable components vs full sections).

---

## 5. Testing Performed

### 5.1 Files Modified

1. `sections/main-product.liquid` - Removed inline smooth scroll script
2. `sections/sticky-mobile-cta.liquid` - Replaced inline script with external reference
3. `assets/product-enhancements.js` - Enhanced smooth scroll function
4. `assets/sticky-cta.js` - New external file for StickyCTABar class

### 5.2 Expected Behavior

All product page functionality should remain identical:
- "Ver todos los detalles" smooth scrolls to description with 80px header offset
- Sticky CTA bar appears on mobile when scrolling past primary CTA
- Variant changes update sticky bar price and availability
- Buy Now button triggers correct checkout flow

---

## 6. Maintenance Notes

### Future Considerations

1. **CSS consolidation**: Some sections may benefit from moving dynamic styles to CSS custom properties set via JavaScript, but this is not critical.

2. **Script loading**: The `sticky-cta.js` file is loaded with `defer` attribute to avoid blocking page render.

3. **Theme editor compatibility**: Both modified sections include Shopify section event listeners for proper theme editor integration.

---

## Approval Checklist

- [x] Inline smooth scroll script removed from main-product.liquid
- [x] StickyCTABar class moved to external sticky-cta.js
- [x] Unused snippets deleted (sticky-mobile-cta.liquid, cookie-notice.liquid)
- [x] Reference searches documented with commands used
- [x] No inline scripts remain in targeted sections
- [x] External JS files properly initialized via data attributes
