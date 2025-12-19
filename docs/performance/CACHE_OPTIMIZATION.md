# Cache Headers and Asset Optimization for Shopify

## Overview
Shopify automatically handles caching for theme assets through its CDN. This document explains what's already optimized and what you can control.

## Automatic Shopify CDN Optimizations

### 1. Asset Versioning
Shopify automatically appends version hashes to all asset URLs:
```
https://cdn.shopify.com/s/files/1/0123/4567/files/theme.css?v=123456789
```

**Benefits**:
- Long cache TTLs (1 year) without stale content issues
- Cache busting on file updates
- Immutable caching supported

### 2. Compression
Shopify CDN automatically serves:
- **Brotli** compression (br) for modern browsers
- **Gzip** fallback for older browsers
- Automatic content negotiation based on Accept-Encoding header

**Compression Rates**:
- CSS: 75-85% size reduction
- JavaScript: 65-75% size reduction
- HTML: 60-70% size reduction

### 3. Global CDN
- Content served from 200+ edge locations worldwide
- Automatic geo-routing to nearest server
- Reduced latency for international customers

### 4. Image CDN
Shopify's image CDN (`cdn.shopify.com/s/files/...`) provides:
- WebP/AVIF format conversion (automatic based on browser support)
- Responsive image resizing via URL parameters
- Quality optimization
- Lazy loading support

## Asset URL Patterns

### Theme Assets (CSS/JS)
```liquid
{{ 'base.css' | asset_url }}
```
Generates:
```
https://cdn.shopify.com/shopifycloud/checkout-web/assets/base.css?v=abc123
```

**Cache Headers** (set by Shopify):
```
Cache-Control: public, max-age=31536000, immutable
```

### Product Images
```liquid
{{ product.featured_image | image_url: width: 800 }}
```
Generates:
```
https://cdn.shopify.com/s/files/1/0XXX/XXXX/products/image.jpg?v=123
```

**Cache Headers** (set by Shopify):
```
Cache-Control: public, max-age=31536000
```

## Image Optimization Best Practices

### 1. Use Shopify's Image Filters
```liquid
{%- comment -%} GOOD: Responsive with WebP support {%- endcomment -%}
{{ image | image_url: width: 1920, format: 'pjpg' | image_tag: 
   widths: '375, 750, 1100, 1500, 1920',
   sizes: '(max-width: 749px) 100vw, 50vw'
}}

{%- comment -%} AVOID: Full resolution image {%- endcomment -%}
<img src="{{ image | image_url }}">
```

### 2. Optimize Image Sizes
| Device | Recommended Width | Use Case |
|--------|-------------------|----------|
| Mobile Portrait | 375-750px | Full-width mobile images |
| Mobile Landscape | 750-1100px | Full-width tablet images |
| Desktop | 1100-1920px | Hero images, banners |
| Thumbnails | 200-400px | Product cards, grids |

### 3. Quality Settings
```liquid
{%- comment -%} Photos and complex images {%- endcomment -%}
{{ image | image_url: width: 1200, quality: 85 }}

{%- comment -%} Graphics and simple images {%- endcomment -%}
{{ image | image_url: width: 1200, quality: 95 }}

{%- comment -%} Background images {%- endcomment -%}
{{ image | image_url: width: 1920, quality: 75 }}
```

### 4. Format Selection
```liquid
{%- comment -%} Progressive JPEG for photos {%- endcomment -%}
{{ image | image_url: format: 'pjpg' }}

{%- comment -%} Let Shopify auto-select WebP/AVIF {%- endcomment -%}
{{ image | image_url: width: 1200 }}
{%- comment -%} Shopify serves WebP to supporting browsers automatically {%- endcomment -%}
```

## Asset Loading Optimization

### 1. Critical Resources (Preload)
```liquid
{%- comment -%} Preload hero image for LCP {%- endcomment -%}
<link rel="preload" 
      as="image" 
      href="{{ section.settings.hero_image | image_url: width: 1920 }}"
      imagesrcset="{{ section.settings.hero_image | image_url: width: 750 }} 750w, 
                   {{ section.settings.hero_image | image_url: width: 1920 }} 1920w"
      imagesizes="100vw"
      fetchpriority="high">

{%- comment -%} Preload critical CSS {%- endcomment -%}
<link rel="preload" href="{{ 'critical.css' | asset_url }}" as="style">
```

### 2. Non-Critical Resources (Async Loading)
```liquid
{%- comment -%} Async CSS loading pattern {%- endcomment -%}
<link rel="preload" 
      href="{{ 'styles.css' | asset_url }}" 
      as="style" 
      onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="{{ 'styles.css' | asset_url }}"></noscript>
```

### 3. Deferred JavaScript
```liquid
{%- comment -%} GOOD: Defer non-critical scripts {%- endcomment -%}
<script src="{{ 'app.js' | asset_url }}" defer></script>

{%- comment -%} GOOD: Async for independent scripts {%- endcomment -%}
<script src="{{ 'analytics.js' | asset_url }}" async></script>

{%- comment -%} AVOID: Blocking scripts {%- endcomment -%}
<script src="{{ 'app.js' | asset_url }}"></script>
```

## Third-Party Resource Optimization

### 1. DNS Prefetch
```html
<link rel="dns-prefetch" href="https://www.googletagmanager.com">
<link rel="dns-prefetch" href="https://connect.facebook.net">
```

### 2. Preconnect (for critical third-parties)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

### 3. Defer Third-Party Scripts
```javascript
// Load GTM on interaction or after delay
setTimeout(function() {
  // Load GTM script
}, 3000);

// Or use requestIdleCallback
if ('requestIdleCallback' in window) {
  requestIdleCallback(function() {
    // Load third-party script
  }, { timeout: 5000 });
}
```

## Font Optimization

### 1. Use font-display: swap
```liquid
{% style %}
  {{ settings.type_body_font | font_face: font_display: 'swap' }}
{% endstyle %}
```

### 2. Preload Critical Fonts
```liquid
{%- unless settings.type_body_font.system? -%}
  <link rel="preload" 
        as="font" 
        href="{{ settings.type_body_font | font_url }}" 
        type="font/woff2" 
        crossorigin>
{%- endunless -%}
```

### 3. Consider Self-Hosting
For frequently used fonts, consider self-hosting instead of Google Fonts:
- Faster delivery (same domain)
- More control over caching
- Better privacy

## Monitoring and Validation

### Check Cache Headers
```bash
# Check asset caching
curl -I https://cdn.shopify.com/path/to/asset.css

# Look for:
# Cache-Control: public, max-age=31536000, immutable
# Content-Encoding: br
```

### Lighthouse Audit
```bash
lighthouse https://techauraz.com \
  --only-categories=performance \
  --preset=desktop \
  --output=html \
  --output-path=./report.html
```

### WebPageTest
- Test from Colombia location
- Test on mobile 3G connection
- Check "Enable Text Compression" score
- Review "Cache Static Content" score

## Performance Budget

| Resource Type | Max Size | Max Count | Notes |
|--------------|----------|-----------|-------|
| Critical CSS | 14KB | 1 | Inline in `<head>` |
| Total CSS | 100KB | 8-10 files | Gzipped size |
| Total JS | 150KB | 10-15 files | Gzipped size |
| Hero Image | 80KB | 1 | WebP format |
| Product Images | 40KB | 20-30 | WebP format |
| Third-party Scripts | 100KB | 3-5 | Deferred |

## Common Issues and Solutions

### Issue: Images Too Large
**Solution**:
```liquid
{%- comment -%} Before: Full resolution {%- endcomment -%}
<img src="{{ product.featured_image | image_url }}">

{%- comment -%} After: Responsive with proper sizing {%- endcomment -%}
{{
  product.featured_image
  | image_url: width: 1500
  | image_tag: 
      widths: '375, 750, 1100, 1500',
      sizes: '(max-width: 749px) 100vw, 50vw',
      loading: 'lazy'
}}
```

### Issue: Render-Blocking CSS
**Solution**:
```liquid
{%- comment -%} Before: Blocking CSS {%- endcomment -%}
{{ 'styles.css' | asset_url | stylesheet_tag }}

{%- comment -%} After: Async CSS {%- endcomment -%}
<link rel="preload" href="{{ 'styles.css' | asset_url }}" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="{{ 'styles.css' | asset_url }}"></noscript>
```

### Issue: Too Many HTTP Requests
**Solution**:
- Combine related CSS files
- Use CSS sprites for icons
- Inline critical CSS
- Lazy load below-fold content

## Shopify-Specific Limitations

### Cannot Control
- ❌ CDN cache TTLs (controlled by Shopify)
- ❌ Server-side compression algorithms
- ❌ HTTP/2 server push
- ❌ Service worker caching strategies

### Can Control
- ✅ Asset file sizes
- ✅ Number of requests (consolidation)
- ✅ Image formats and sizes
- ✅ Loading strategies (defer, async, lazy)
- ✅ Critical CSS extraction
- ✅ Third-party script loading

## Additional Resources

- [Shopify Image CDN Documentation](https://shopify.dev/docs/themes/liquid/reference/filters/image-filters)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Performance Scoring](https://web.dev/performance-scoring/)
- [Shopify Theme Performance](https://shopify.dev/docs/themes/best-practices/performance)
