# 🗑️ Removed Assets — Techauraz Theme

**Date:** 2026-02-09  
**Author:** Automated Asset Audit  
**Purpose:** Document CSS/JS files removed from `assets/` to reduce repository size and avoid confusion.

---

## Audit Methodology

Every CSS and JS file in `assets/` was checked against references in:

- `layout/theme.liquid`
- All files in `sections/`
- All files in `snippets/`
- All files in `templates/`
- `config/settings_data.json`

Files with **zero references** in any Liquid or JSON file were marked for removal. Additionally, files whose content was **fully duplicated** in `base.css` were identified and removed along with their now-redundant `stylesheet_tag` references.

---

## Files Removed in This Audit

### 1. `mobile-fixes-handler.js` (11,531 bytes / 11.3 KB)

| Field | Detail |
|-------|--------|
| **Type** | JavaScript |
| **Size** | 11,531 bytes (11.3 KB) |
| **Reason** | Not referenced in any Liquid or JSON file |
| **Details** | Originally handled dynamic positioning for mobile elements (cookie banner, WhatsApp FAB, product grid spacing, sticky CTA collisions, iOS viewport). All functionality was superseded by CSS-only fixes in `ui-ux-responsive-fixes.css` (see line 774 comment: "Replaces JS-based fixes in mobile-fixes-handler.js for better performance"). |
| **Impact** | None — file was not loaded on any page |

### 2. `component-rating.css` (1,697 bytes / 1.7 KB)

| Field | Detail |
|-------|--------|
| **Type** | CSS |
| **Size** | 1,697 bytes (1.7 KB) |
| **Reason** | All selectors fully duplicated in `base.css` |
| **Details** | Defined `.rating`, `.rating-star`, `.rating-text`, `.rating-count`, `.rating-wrapper`, `.card-product-rating`, and `.shopify-product-reviews-badge` — all of which already exist in `base.css` (lines 3870, 6322–6381, 12524–12942). Was loaded redundantly in 7 sections. |
| **References removed from** | `sections/related-products.liquid`, `sections/modern-featured-grid.liquid`, `sections/collage.liquid`, `sections/main-product.liquid`, `sections/featured-collection.liquid`, `sections/main-search.liquid`, `sections/main-collection-product-grid.liquid`, `snippets/card-product.liquid` (comment only) |
| **Impact** | None — styles remain available via `base.css` which loads on every page |

---

## Previously Removed Files (Documented in STYLE_NOTES.md)

The following files were removed in earlier cleanup sessions (January 2026) as documented in `docs/visual-references/STYLE_NOTES.md`:

| File | Size | Reason |
|------|------|--------|
| `mobile-view-fixes-2024.css` | ~16 KB | Consolidated into `responsive-mobile-unified.css` (later into `base.css`) |
| `mobile-visual-fixes-jan-2024.css` | ~17 KB | Consolidated into `responsive-mobile-unified.css` (later into `base.css`) |
| `storefront-visual-fixes-2024.css` | ~16 KB | Consolidated into `responsive-mobile-unified.css` (later into `base.css`) |
| `button-visibility-enhancements.css` | ~13 KB | Consolidated into `global-button-styles.css` (later into `base.css`) |
| `product-page-visual-fixes-2024.css` | ~9.6 KB | Never loaded in `theme.liquid` |
| `product-conversion.css` | ~11 KB | Never loaded in `theme.liquid` |
| 90+ component/section/theme CSS files | ~524 KB | Consolidated into single `base.css` (see `CSS_ARCHITECTURE.md`) |

---

## Summary

| Metric | Value |
|--------|-------|
| **Files removed this audit** | 2 |
| **Bytes saved this audit** | 13,228 bytes (12.9 KB) |
| **Total files removed (all audits)** | 98+ |
| **Total bytes saved (all audits)** | ~600+ KB |
| **Remaining CSS files** | 31 |
| **Remaining JS files** | 53 |
| **All remaining files verified referenced** | ✅ Yes |

---

## Verification

After removal, the following was confirmed:

- ✅ No broken `stylesheet_tag` or `script_tag` references in any Liquid file
- ✅ All rating styles (`.rating`, `.rating-star`, etc.) still available via `base.css`
- ✅ No mobile fix functionality lost (CSS-only approach in `ui-ux-responsive-fixes.css`)
- ✅ Theme renders identically — no visual changes
