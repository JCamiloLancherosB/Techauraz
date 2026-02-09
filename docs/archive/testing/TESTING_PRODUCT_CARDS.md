# Product Card Cleanup - Testing Guide

## 🎯 Quick Testing Checklist

Use this guide to verify all changes are working correctly on Shopify preview theme.

---

## 🔗 Setup

1. Deploy this branch to a Shopify preview theme
2. Access: `https://[your-store].myshopify.com/?preview_theme_id=[theme-id]`
3. Or use Theme Customizer preview

---

## ✅ Test Cases

### Test 1: Home Page - Featured Products

**Location**: Homepage → "Productos Destacados" section

**What to check:**
- [ ] Cards display correctly
- [ ] Maximum 1 badge per card
- [ ] Badges are at top-left corner
- [ ] No duplicate badges at bottom
- [ ] No checkmarks "✓ En stock"
- [ ] Cards look cleaner/shorter
- [ ] Hover effect works (shadow + lift)

**Expected badges:**
- Product with discount: Red "OFERTA" badge
- Product with "Nuevo" tag: Green "Nuevo" badge
- Sold out product: Gray "Agotado" badge
- Other products: No badge

---

### Test 2: Collections Page

**Location**: `/collections/all` or any collection

**What to check:**
- [ ] All cards consistent with home
- [ ] Badge logic working correctly
- [ ] Price display correct
- [ ] Responsive on mobile

---

### Test 3: Badge Logic - OFERTA

**Find a product with discount:**
1. Look for product where compare_at_price > price
2. Example: $75.000 with original $100.000

**Expected:**
- [ ] Red "OFERTA" badge visible
- [ ] Strikethrough price showing ($100.000)
- [ ] Current price highlighted ($75.000)
- [ ] Only ONE badge (OFERTA has priority)

**NOT expected:**
- [ ] ❌ No "Nuevo" badge even if recently added
- [ ] ❌ No percentage badge (-25%)
- [ ] ❌ No stock badges
- [ ] ❌ No duplicate badges at bottom

---

### Test 4: Badge Logic - Nuevo

**Find a product with "Nuevo" tag (and no discount):**
1. Product must have tag "Nuevo" in Shopify admin
2. Must NOT have discount (compare_at = price or null)

**Expected:**
- [ ] Green "Nuevo" badge visible
- [ ] No strikethrough price
- [ ] Only ONE badge

**Verify:**
- [ ] Products WITHOUT "Nuevo" tag don't show badge
- [ ] Newly published products (< 30 days) don't auto-show "Nuevo"

---

### Test 5: Badge Logic - Sin Descuento

**Find a product WITHOUT discount:**
1. Compare_at_price is null or equals price
2. Does NOT have "Nuevo" tag
3. Is available (in stock)

**Expected:**
- [ ] NO badge shown
- [ ] NO strikethrough price
- [ ] Only regular price visible
- [ ] Clean card appearance

**This is CRITICAL:**
- [ ] ❌ Must NOT show "OFERTA" badge
- [ ] ❌ Must NOT show strikethrough if compare_at == price
- [ ] ❌ Must NOT show invented badges

---

### Test 6: Badge Logic - Agotado

**Find a sold out product:**
1. Product with available = false

**Expected:**
- [ ] Gray "Agotado" badge
- [ ] "Agregar al carrito" button disabled or shows "Agotado"
- [ ] Price still visible

---

### Test 7: Quick-Add Functionality

**Test with product with single variant:**
1. Click "Agregar al carrito" button
2. Product should add to cart
3. Cart drawer/notification should appear

**Expected:**
- [ ] Button works
- [ ] Product added successfully
- [ ] Loading spinner shows briefly
- [ ] No errors in console

**Test with product with multiple variants:**
1. Click "Seleccionar opciones" button
2. Modal should open
3. Select variants and add to cart

**Expected:**
- [ ] Modal opens correctly
- [ ] Variants selectable
- [ ] Add to cart works from modal
- [ ] No layout issues

---

### Test 8: Price Display - Con Descuento

**Product with real discount:**
- Price: $75.000
- Compare_at: $100.000

**Expected format:**
```
$75.000 ~~$100.000~~
```

**Verify:**
- [ ] Current price bold/highlighted
- [ ] Original price strikethrough
- [ ] Original price slightly smaller/lighter
- [ ] Prices aligned properly

---

### Test 9: Price Display - Sin Descuento

**Product without discount:**
- Price: $100.000
- Compare_at: null or $100.000

**Expected format:**
```
$100.000
```

**Verify:**
- [ ] Only one price shown
- [ ] NO strikethrough
- [ ] Price formatted correctly
- [ ] No weird spacing

---

### Test 10: Visual Appearance

**General card appearance:**

**Expected:**
- [ ] Cards are shorter (no description visible)
- [ ] No "Ver todos los detalles" link
- [ ] No "✓ En stock" or "✓ Envío rápido"
- [ ] Clean, minimal design
- [ ] Professional appearance

**Hover effect:**
- [ ] Subtle shadow appears on hover
- [ ] Card lifts slightly (2px)
- [ ] Smooth transition (~0.3s)
- [ ] Cursor changes to pointer

**Badge styling:**
- [ ] Badge at top-left (12px from edges)
- [ ] Rounded corners (4px)
- [ ] Appropriate colors (red/green/gray)
- [ ] Text uppercase and bold

---

### Test 11: Responsive - Mobile

**Test on mobile device or browser dev tools (< 750px):**

**Expected:**
- [ ] Cards stack properly
- [ ] Badges are smaller but readable
- [ ] Text sizes appropriate
- [ ] Touch targets adequate
- [ ] No horizontal scroll
- [ ] Images scale correctly

**Badges on mobile:**
- [ ] Smaller font size (0.7rem)
- [ ] Smaller padding
- [ ] Still visible and readable
- [ ] Position correct (top-left)

---

### Test 12: Full Card Clickability

**Click anywhere on card (not just title):**

**Expected:**
- [ ] Entire card area is clickable
- [ ] Takes you to product page
- [ ] No conflicts with quick-add button
- [ ] Cursor shows pointer on hover

**But buttons should still work:**
- [ ] Quick-add button clickable
- [ ] Doesn't navigate to product page
- [ ] Opens modal or adds to cart

---

## 🐛 Common Issues to Check

### Issue 1: Strikethrough when shouldn't
**Symptom:** Price is crossed out when compare_at == price
**Check:** snippets/price.liquid line 59
**Expected:** `compare_at_price and compare_at_price > price`

### Issue 2: Multiple badges showing
**Symptom:** More than 1 badge per card
**Check:** snippets/card-product.liquid lines 110-122
**Expected:** Only one badge due to `elsif` logic

### Issue 3: Quick-add not working
**Symptom:** Button doesn't respond
**Check:** Browser console for errors
**Verify:** No conflicting JavaScript

### Issue 4: "Nuevo" on all products
**Symptom:** Every product shows "Nuevo"
**Check:** Badge condition uses tags, not publish date
**Expected:** Only products with "Nuevo" tag

### Issue 5: Hover effect not working
**Symptom:** No shadow/lift on hover
**Check:** CSS is loaded
**Verify:** .tech-card-product class present

---

## 📊 Success Criteria

### ✅ All tests passing means:

1. **Badge System Working:**
   - Max 1 badge per card
   - Correct priority (Oferta > Nuevo > Agotado)
   - No invented badges
   - Conditions properly checked

2. **Price Display Correct:**
   - Strikethrough only with real discount
   - No strikethrough when prices equal
   - Formatting clean and readable

3. **Visual Quality:**
   - Cards look cleaner and more premium
   - No duplicate elements
   - Proper spacing and alignment
   - Hover effects working

4. **Functionality Intact:**
   - Quick-add works
   - Full card clickable
   - Responsive on mobile
   - No broken features

5. **Performance:**
   - No console errors
   - Fast loading
   - Smooth interactions

---

## 🚨 If Issues Found

### Minor Issues
- Document in PR comments
- Can be fixed post-deployment

### Major Issues
- Quick-add broken
- Price display wrong
- Badges not showing correctly
→ **DO NOT MERGE**, fix first

---

## 📝 Testing Sign-Off

**Tester:** _______________
**Date:** _______________
**Theme ID:** _______________

**Results:**
- [ ] All tests passed
- [ ] Minor issues found (documented)
- [ ] Major issues found (needs fix)

**Comments:**
_______________________________
_______________________________

**Approval:**
- [ ] ✅ Ready for production
- [ ] ⏸️ Needs fixes
- [ ] ❌ Reject changes

---

## 🔗 Related Documents

- `PRODUCT_CARD_CLEANUP_SUMMARY.md` - Technical implementation
- `PRODUCT_CARD_VISUAL_GUIDE.md` - Visual comparison
- PR in GitHub - Code review and discussion

---

**Version:** 1.0
**Last Updated:** 2026-01-23
**Branch:** copilot/clean-product-cards-home
