#!/usr/bin/env node
/**
 * TechAuraz — 2026 Master Optimization Script
 * =============================================
 * Unified script replacing 5 fragmented optimization scripts.
 * Runs ALL optimizations in a single idempotent pass.
 *
 * Usage:
 *   $env:SHOPIFY_ADMIN_API_KEY="HIDDEN_SECRET_TOKEN"; node scripts/shopify-master-optimize.mjs
 *   $env:SHOPIFY_ADMIN_API_KEY="HIDDEN_SECRET_TOKEN"; node scripts/shopify-master-optimize.mjs --dry-run
 *
 * Replaces: shopify-product-manager.mjs, shopify-2026-optimizations.mjs,
 *           shopify-deep-optimizations.mjs, shopify-ultra-optimizations.mjs,
 *           shopify-description-optimizer.mjs
 */

const DRY_RUN = process.argv.includes('--dry-run');
const SHOP = process.env.SHOPIFY_STORE_DOMAIN || '7f4c40-fb.myshopify.com';
const TOKEN = process.env.SHOPIFY_ADMIN_API_KEY || process.env.SHOPIFY_ACCESS_TOKEN || '';
const API = '2026-01';
const RATE_MS = 550;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const stats = { updated: 0, skipped: 0, errors: 0, imageAlts: 0, skus: 0, redirects: 0, collections: 0, pages: 0, tags: 0 };

// ============================================
// API HELPER (with 429 retry)
// ============================================
async function api(ep, method = 'GET', body = null) {
  if (DRY_RUN && method !== 'GET') {
    console.log(`   🏜️  DRY: ${method} ${ep.substring(0, 60)}`);
    return {};
  }
  const url = `https://${SHOP}/admin/api/${API}/${ep}`;
  const opts = { method, headers: { 'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(url, opts);
  if (r.status === 429) {
    const s = parseFloat(r.headers.get('Retry-After') || '2');
    console.log(`   ⏳ Rate limited, retry in ${s}s...`);
    await sleep(s * 1000);
    return api(ep, method, body);
  }
  if (!r.ok) { const t = await r.text(); throw new Error(`${r.status}: ${t.substring(0, 200)}`); }
  if (r.status === 204) return {};
  const ct = r.headers.get('content-type');
  if (!ct || !ct.includes('json')) return {};
  return r.json();
}

// ============================================
// PRODUCT CATEGORIES
// ============================================
const CATEGORIES = {
  'parlante torre': { type: 'Audio', tags: ['parlante', 'torre', 'bluetooth', 'audio', 'fiesta'] },
  'bolso parlante': { type: 'Audio', tags: ['parlante', 'bluetooth', 'audio', 'bolso', 'portátil'] },
  'karaoke': { type: 'Audio', tags: ['parlante', 'karaoke', 'audio', 'fiesta'] },
  'parlante': { type: 'Audio', tags: ['parlante', 'bluetooth', 'audio', 'musica'] },
  'audifonos inalambricos': { type: 'Audio', tags: ['audifonos', 'inalambricos', 'bluetooth', 'audio'] },
  'audifono': { type: 'Audio', tags: ['audifonos', 'audio'] },
  'microfono condensador': { type: 'Audio & Streaming', tags: ['microfono', 'condensador', 'usb', 'streaming', 'podcast'] },
  'diadema': { type: 'Gaming', tags: ['diadema', 'gamer', 'audifonos', 'gaming'] },
  'base refrigerante para ps': { type: 'Gaming & PC', tags: ['base', 'consola', 'gaming', 'refrigerante'] },
  'base refrigerante': { type: 'Gaming & PC', tags: ['base-refrigerante', 'laptop', 'pc', 'gaming'] },
  'mouse gamer': { type: 'Gaming', tags: ['mouse', 'gamer', 'gaming'] },
  'teclado gamer': { type: 'Gaming', tags: ['teclado', 'gamer', 'gaming'] },
  'mouse': { type: 'Accesorios PC', tags: ['mouse', 'pc', 'computador'] },
  'teclado': { type: 'Accesorios PC', tags: ['teclado', 'pc', 'computador'] },
  'ps4': { type: 'Gaming & PC', tags: ['ps4', 'playstation', 'consola', 'gaming'] },
  'ps5': { type: 'Gaming & PC', tags: ['ps5', 'playstation', 'consola', 'gaming'] },
  'control': { type: 'Gaming & PC', tags: ['control', 'mando', 'gaming'] },
  'cable tipo c': { type: 'Cables & Carga', tags: ['cable', 'tipo-c', 'usb-c', 'carga'] },
  'cable usb': { type: 'Cables & Carga', tags: ['cable', 'usb', 'carga'] },
  'cable': { type: 'Cables & Carga', tags: ['cable', 'carga'] },
  'cargador para carro': { type: 'Cables & Carga', tags: ['cargador', 'carro', 'vehiculo', 'carga-rapida'] },
  'cargador de pared': { type: 'Cables & Carga', tags: ['cargador', 'pared', 'carga-rapida'] },
  'cargador': { type: 'Cables & Carga', tags: ['cargador', 'carga-rapida'] },
  'power bank': { type: 'Cables & Carga', tags: ['power-bank', 'bateria', 'portatil', 'carga'] },
  'powerbank': { type: 'Cables & Carga', tags: ['power-bank', 'bateria', 'portatil', 'carga'] },
  'cinta led': { type: 'Iluminación & LED', tags: ['cinta-led', 'rgb', 'iluminacion', 'decoracion'] },
  'bombillo': { type: 'Iluminación & LED', tags: ['bombillo', 'led', 'rgb', 'iluminacion'] },
  'lampara': { type: 'Iluminación & LED', tags: ['lampara', 'led', 'iluminacion'] },
  'aro de luz': { type: 'Iluminación & LED', tags: ['aro-luz', 'ring-light', 'foto', 'video'] },
  'enchufe inteligente': { type: 'Smart Home', tags: ['smart-home', 'enchufe', 'wifi', 'alexa'] },
  'camara': { type: 'Smart Home', tags: ['camara', 'seguridad', 'smart-home', 'wifi'] },
  'reloj': { type: 'Wearables', tags: ['reloj', 'smartwatch', 'wearable'] },
  'smartwatch': { type: 'Wearables', tags: ['smartwatch', 'reloj', 'wearable'] },
  'manilla': { type: 'Wearables', tags: ['manilla', 'fitness', 'wearable'] },
  'soporte tv': { type: 'Accesorios Hogar', tags: ['soporte', 'tv', 'monitor', 'hogar'] },
  'soporte de telefono para moto': { type: 'Accesorios Moto', tags: ['soporte', 'moto', 'telefono', 'bicicleta'] },
  'soporte': { type: 'Accesorios', tags: ['soporte', 'telefono'] },
  'gimbal': { type: 'Accesorios', tags: ['gimbal', 'estabilizador', 'selfie', 'foto', 'video'] },
  'bolso antirrobo': { type: 'Accesorios', tags: ['bolso', 'antirrobo', 'mochila', 'seguridad'] },
  'mochila': { type: 'Accesorios', tags: ['mochila', 'bolso', 'portatil'] },
  'funda': { type: 'Accesorios', tags: ['funda', 'proteccion', 'celular'] },
  'protector': { type: 'Accesorios', tags: ['protector', 'pantalla', 'celular'] },
  'mini aspiradora': { type: 'Hogar & Oficina', tags: ['aspiradora', 'mini', 'portatil', 'usb', 'limpieza'] },
};

const COMMERCIAL_TAGS = ['envio-gratis', 'garantia-30-dias', 'pago-contraentrega', 'colombia'];

const SUPPLIER_PATTERNS = [
  /3138077201/g, /3105500811/g, /3150759625/g, /320\s*567\s*5803/g, /319\s*532\s*7500/g, /3243585129/g,
  /310\s*7752905/g, /310\s*2132011/g,
  /H\s*&\s*T\s*STORE/gi, /STOM\s*Accesorios/gi, /ONE\s*TECH(\s*SAS)?/gi,
  /🔴.*?STOM\s*Accesorios.*?(?=<\/p>|$)/gis,
  /🔴.*?ONE\s*TECH.*?(?=<\/p>|$)/gis,
  /⚠️INFORMACIÓN\s*IMPORTANTE\s*⚠️.*?(?=<\/p>|$)/gis,
  /RECUERDA\s*QUE\s*EL\s*ÚNICO\s*NÚMERO\s*AUTORIZADO.*?(?=<\/p>|$)/gis,
  /📱\s*Contáctanos\s*por\s*mensaje\s*al\s*(?!3008602789).*?(?=<\/p>|<\/li>|$)/gis,
  /📞\s*Ventas\s*al\s*por\s*mayor.*?(?=<\/p>|$)/gis,
  /ANTES\s*DE\s*REALIZAR\s*EL\s*PEDIDO\s*POR\s*FAVOR\s*PREGUNTAR.*?(?=<[a-z])/gis,
  /<a\s+href="https:\/\/wa\.me\/(?!573008602789)[^"]*"[^>]*>.*?<\/a>/gis,
  /\(Producto\s*exclusivo\s*para\s*Mayorista\)/gi,
  /Para\s*mas\s*información\s*comunícate\s*con\s*nosotros\s*a\s*los\s*números.*?(?=<\/p>|$)/gis,
  /<a\s+href="https:\/\/www\.bing\.com\/ck\/[^"]*"[^>]*>(.*?)<\/a>/gis,
  /<h2>.*?H\s*&\s*T\s*STORE.*?<\/h2>/gis,
];

const WARRANTY = `
<hr>
<h3><strong>Garantía TechAuraz</strong></h3>
<p>Todos nuestros productos cuentan con <strong>30 días de garantía</strong> contra defectos de fabricación.</p>
<ul>
  <li>✅ Orden incompleta — reenvío sin costo</li>
  <li>✅ Producto diferente — cambio inmediato</li>
  <li>✅ Defecto de fábrica — reemplazo o reembolso</li>
  <li>✅ Dañado en transporte — reenvío garantizado</li>
</ul>
<p>📲 WhatsApp: <strong><a href="https://wa.me/573008602789">+57 300 860 2789</a></strong></p>`;

const WEIGHT_MAP = {
  'audio': 250, 'audio & streaming': 400, 'gaming': 350, 'gaming & pc': 400,
  'cables & carga': 80, 'smart home': 120, 'accesorios': 200, 'accesorios pc': 300,
  'accesorios moto': 280, 'accesorios hogar': 250, 'iluminación & led': 150,
  'hogar & oficina': 500, 'wearables': 100, 'tecnología': 300,
};

const GOOGLE_CATS = {
  'Audio': '222', 'Audio & Streaming': '222', 'Gaming & PC': '2032',
  'Cables & Carga': '276', 'Smart Home': '2236', 'Accesorios': '264',
  'Accesorios PC': '284', 'Accesorios Moto': '5598', 'Iluminación & LED': '2436',
  'Hogar & Oficina': '333', 'Tecnología': '222', 'Wearables': '178',
};

// ============================================
// HELPER FUNCTIONS
// ============================================
function classifyProduct(title) {
  const lower = title.toLowerCase();
  const keys = Object.keys(CATEGORIES).sort((a, b) => b.length - a.length);
  for (const key of keys) { if (lower.includes(key)) return CATEGORIES[key]; }
  return { type: 'Tecnología', tags: ['tecnologia'] };
}

function cleanDescription(html, title) {
  if (!html) return `<p><strong>${title}</strong> — Producto de alta calidad disponible en TechAuraz.</p><p>Envío <strong>gratis</strong> a toda Colombia. Pago contraentrega disponible.</p>${WARRANTY}`;
  let c = html;
  for (const p of SUPPLIER_PATTERNS) c = c.replace(p, '$1' in p ? '$1' : '');
  c = c.replace(/<p>\s*<\/p>/g, '').replace(/<li>\s*<\/li>/g, '').replace(/<ul>\s*<\/ul>/g, '');
  c = c.replace(/<p>\s*<strong>POLÍTICA DE GARANTÍA:?<\/strong>\s*<\/p>[\s\S]*$/i, '');
  c = c.replace(/GARANTIAS QUE APLICAN[\s\S]*GARANTÍAS[\s\S]*$/i, '');
  c = c.replace(/🚨.*?GARANTÍA.*?🚨[\s\S]*$/i, '');
  if (!c.includes('Garantía TechAuraz')) c = c.trim() + WARRANTY;
  return c;
}

function compareAtPrice(price) {
  const n = parseFloat(price);
  const markup = 1.25 + (Math.random() * 0.10);
  return (Math.ceil((n * markup) / 1000) * 1000).toFixed(2);
}

// ============================================
// OPT 1: PRODUCTS — Single pass optimization
// ============================================
async function optimizeProducts() {
  console.log('\n' + '═'.repeat(60));
  console.log('📦 PHASE 1: Product Optimization (single-pass)');
  console.log('═'.repeat(60));

  const data = await api('products.json?limit=250');
  const products = data.products || [];
  console.log(`   Found ${products.length} products\n`);

  // Get location for inventory
  const locations = await api('locations.json');
  const locationId = locations.locations?.[0]?.id;

  for (const p of products) {
    try {
      const cat = classifyProduct(p.title);
      const v = p.variants[0];
      const currentTags = (p.tags || '').split(', ').filter(Boolean);
      const newTags = [...new Set([...cat.tags, ...COMMERCIAL_TAGS, ...currentTags.filter(t => !cat.tags.includes(t))])];

      // Check what needs updating
      const needsVendor = p.vendor !== 'TechAuraz';
      const needsType = p.product_type !== cat.type;
      const descCleaned = cleanDescription(p.body_html, p.title);
      const needsDesc = descCleaned !== p.body_html;
      const needsTags = newTags.sort().join(', ') !== currentTags.sort().join(', ');

      if (!needsVendor && !needsType && !needsDesc && !needsTags) {
        stats.skipped++;
        continue;
      }

      // SEO title & description
      const price = v?.price ? ` | Desde $${parseInt(v.price).toLocaleString('es-CO')}` : '';
      let seoTitle = `${p.title}${price} | Envío GRATIS | TechAuraz`;
      if (seoTitle.length > 70) seoTitle = `${p.title.substring(0, 45)}${price} | TechAuraz`;
      const seoDesc = `${p.title} — ${v?.price ? `Desde $${parseInt(v.price).toLocaleString('es-CO')}. ` : ''}Envío GRATIS a toda Colombia. Pago contra entrega. Garantía 30 días. TechAuraz.`.substring(0, 320);

      const payload = {
        product: {
          id: p.id, vendor: 'TechAuraz', product_type: cat.type,
          tags: newTags.join(', '), body_html: descCleaned,
          metafields_global_title_tag: seoTitle,
          metafields_global_description_tag: seoDesc,
          variants: [{ id: v.id, compare_at_price: compareAtPrice(v.price), inventory_management: 'shopify' }],
        },
      };

      await api(`products/${p.id}.json`, 'PUT', payload);
      console.log(`   ✅ ${p.title.substring(0, 50)}`);
      stats.updated++;
      await sleep(RATE_MS);

      // Image alt text
      if (p.images?.length) {
        for (let i = 0; i < p.images.length; i++) {
          const img = p.images[i];
          if (!img.alt || img.alt.length < 10 || img.alt === p.title) {
            const alt = i === 0
              ? `${p.title} | ${cat.type} | TechAuraz Colombia`
              : `${p.title} - Detalle ${i + 1} | ${cat.type} | TechAuraz`;
            try {
              await api(`products/${p.id}/images/${img.id}.json`, 'PUT', { image: { id: img.id, alt: alt.substring(0, 512) } });
              stats.imageAlts++;
              await sleep(300);
            } catch { /* skip */ }
          }
        }
      }

      // SKU standardization
      if (!v.sku || v.sku.trim() === '') {
        const handlePart = (p.handle || '').substring(0, 20).toUpperCase().replace(/-/g, '');
        const newSKU = `TA-${handlePart}-${String(v.id).slice(-4)}`;
        try {
          await api(`variants/${v.id}.json`, 'PUT', { variant: { id: v.id, sku: newSKU } });
          stats.skus++;
          await sleep(300);
        } catch { /* skip */ }
      }

      // Weight standardization
      if (!v.weight || v.weight === 0) {
        const w = WEIGHT_MAP[(cat.type || '').toLowerCase()] || 250;
        try {
          await api(`variants/${v.id}.json`, 'PUT', { variant: { id: v.id, weight: w, weight_unit: 'g' } });
          await sleep(300);
        } catch { /* skip */ }
      }

      // Barcode for Google Shopping
      if (!v.barcode || v.barcode.trim() === '') {
        const barcode = `TA${String(v.id).slice(-10).padStart(10, '0')}`;
        try {
          await api(`variants/${v.id}.json`, 'PUT', { variant: { id: v.id, barcode } });
          await sleep(300);
        } catch { /* skip */ }
      }

      // Google Shopping category metafield
      const gCat = GOOGLE_CATS[cat.type];
      if (gCat) {
        try {
          await api(`products/${p.id}/metafields.json`, 'POST', {
            metafield: { namespace: 'mm-google-shopping', key: 'google_product_category', value: gCat, type: 'single_line_text_field' }
          });
          await sleep(300);
        } catch { /* may already exist */ }
      }

      // Inventory level
      if (locationId && v.id) {
        try {
          const vd = await api(`variants/${v.id}.json`);
          const invId = vd.variant?.inventory_item_id;
          if (invId) {
            await api('inventory_levels/set.json', 'POST', { location_id: locationId, inventory_item_id: invId, available: 50 });
            await sleep(300);
          }
        } catch { /* skip */ }
      }

    } catch (e) {
      console.log(`   ❌ ${p.title?.substring(0, 40)}: ${e.message.substring(0, 80)}`);
      stats.errors++;
    }
  }

  console.log(`\n   📊 Products: ${stats.updated} updated, ${stats.skipped} skipped, ${stats.imageAlts} alts, ${stats.skus} SKUs`);
}

// ============================================
// OPT 2: COLLECTIONS — SEO enrichment
// ============================================
async function optimizeCollections() {
  console.log('\n' + '═'.repeat(60));
  console.log('📁 PHASE 2: Collection SEO');
  console.log('═'.repeat(60));

  const data = await api('smart_collections.json?limit=250');
  const cols = data.smart_collections || [];
  let fixed = 0;

  for (const col of cols) {
    if (!col.body_html || col.body_html.trim().length < 50) {
      const body = `<p>Explora nuestra selección de <strong>${col.title}</strong> en TechAuraz. Envío gratis a toda Colombia, pago contra entrega y garantía de 30 días.</p>`;
      try {
        await api(`smart_collections/${col.id}.json`, 'PUT', { smart_collection: { id: col.id, body_html: body } });
        console.log(`   ✅ ${col.title}`);
        fixed++;
        await sleep(RATE_MS);
      } catch (e) { console.log(`   ⚠️ ${col.title}: ${e.message.substring(0, 60)}`); }
    }
  }
  stats.collections = fixed;
  console.log(`\n   📊 Collections: ${fixed} enriched`);
}

// ============================================
// OPT 3: PAGES — SEO
// ============================================
async function optimizePages() {
  console.log('\n' + '═'.repeat(60));
  console.log('📄 PHASE 3: Page SEO');
  console.log('═'.repeat(60));

  const data = await api('pages.json?limit=50');
  const pages = data.pages || [];
  let fixed = 0;

  const seoMap = {
    'contacto-techaura': { t: 'Contacto TechAuraz | Soporte Colombia', d: 'Contáctanos por WhatsApp al +57 300 860 2789. Soporte rápido para todos tus pedidos en TechAuraz.' },
    'politica-de-envio': { t: 'Política de Envío GRATIS | TechAuraz', d: 'Envío gratis a toda Colombia sin monto mínimo. Entrega en 2-5 días hábiles. Pago contra entrega.' },
    'politica-de-reembolso': { t: 'Devoluciones y Reembolso | TechAuraz', d: 'Garantía de 30 días en todos los productos. Devolución sin complicaciones.' },
  };

  for (const page of pages) {
    const seo = seoMap[page.handle];
    const title = seo ? seo.t : `${page.title} | TechAuraz Colombia`;
    const desc = seo ? seo.d : `${page.title} en TechAuraz. Envío gratis y garantía 30 días.`;
    try {
      await api(`pages/${page.id}.json`, 'PUT', {
        page: { id: page.id, metafields_global_title_tag: title, metafields_global_description_tag: desc }
      });
      fixed++;
      await sleep(RATE_MS);
    } catch { /* skip */ }
  }
  stats.pages = fixed;
  console.log(`   📊 Pages: ${fixed} optimized`);
}

// ============================================
// OPT 4: REDIRECTS
// ============================================
async function createRedirects() {
  console.log('\n' + '═'.repeat(60));
  console.log('🔗 PHASE 4: Smart Redirects');
  console.log('═'.repeat(60));

  const redirects = [
    { path: '/contacto', target: '/pages/contacto-techaura' },
    { path: '/contact', target: '/pages/contacto-techaura' },
    { path: '/garantia', target: '/pages/politica-de-reembolso' },
    { path: '/envio', target: '/pages/politica-de-envio' },
    { path: '/shipping', target: '/pages/politica-de-envio' },
    { path: '/usb', target: '/pages/usb-al-gusto-personalizada' },
    { path: '/catalogo', target: '/collections/all' },
    { path: '/productos', target: '/collections/all' },
    { path: '/tienda', target: '/collections/all' },
    { path: '/whatsapp', target: 'https://wa.me/573008602789' },
    { path: '/soporte', target: '/pages/contacto-techaura' },
    { path: '/ayuda', target: '/pages/contacto-techaura' },
    { path: '/promo', target: '/collections/all' },
    { path: '/carga-rapida', target: '/collections/carga-energia-techaura' },
    { path: '/powerbank', target: '/collections/carga-energia-techaura' },
    { path: '/cables', target: '/collections/cables-de-datos-techaura' },
    { path: '/audifonos', target: '/collections/diademas-gamer-techaura' },
    { path: '/gamer', target: '/collections/all' },
    { path: '/envio-gratis', target: '/collections/all' },
  ];

  let created = 0;
  for (const r of redirects) {
    try {
      await api('redirects.json', 'POST', { redirect: r });
      console.log(`   ✅ ${r.path} → ${r.target.substring(0, 40)}`);
      created++;
      await sleep(RATE_MS);
    } catch { /* already exists */ }
  }
  stats.redirects = created;
  console.log(`\n   📊 Redirects: ${created} created`);
}

// ============================================
// OPT 5: SHOP METAFIELDS
// ============================================
async function setShopMetafields() {
  console.log('\n' + '═'.repeat(60));
  console.log('🏪 PHASE 5: Shop Metafields');
  console.log('═'.repeat(60));

  const fields = [
    { namespace: 'custom', key: 'business_phone', value: '+573008602789', type: 'single_line_text_field' },
    { namespace: 'custom', key: 'business_country', value: 'CO', type: 'single_line_text_field' },
    { namespace: 'custom', key: 'free_shipping_threshold', value: '0', type: 'single_line_text_field' },
    { namespace: 'custom', key: 'warranty_days', value: '30', type: 'single_line_text_field' },
    { namespace: 'custom', key: 'social_whatsapp', value: 'https://wa.me/573008602789', type: 'single_line_text_field' },
  ];

  for (const mf of fields) {
    try {
      await api('metafields.json', 'POST', { metafield: mf });
      console.log(`   ✅ ${mf.key}`);
      await sleep(RATE_MS);
    } catch { console.log(`   ⏭️ ${mf.key} — exists`); }
  }
}

// ============================================
// OPT 6: SCRIPT TAGS AUDIT
// ============================================
async function auditScriptTags() {
  console.log('\n' + '═'.repeat(60));
  console.log('🧹 PHASE 6: Script Tags Audit');
  console.log('═'.repeat(60));

  const data = await api('script_tags.json?limit=250');
  const scripts = data.script_tags || [];
  const blacklist = ['fake', 'popup-fake', 'countdown-fake', 'social-proof-fake', 'review-faker', 'scarcity-fake'];

  for (const s of scripts) {
    const src = (s.src || '').toLowerCase();
    if (blacklist.some(b => src.includes(b))) {
      try {
        await api(`script_tags/${s.id}.json`, 'DELETE');
        console.log(`   🗑️ Removed: ${s.src.substring(0, 60)}`);
      } catch { /* skip */ }
    } else {
      console.log(`   ✅ OK: ${(s.src || 'inline').substring(0, 60)}`);
    }
  }
}

// ============================================
// OPT 7: BLOG + ARTICLES
// ============================================
async function optimizeBlog() {
  console.log('\n' + '═'.repeat(60));
  console.log('📝 PHASE 7: Blog Infrastructure');
  console.log('═'.repeat(60));

  const data = await api('blogs.json');
  let blogId;
  if (!data.blogs?.length) {
    try {
      const r = await api('blogs.json', 'POST', { blog: { title: 'TechAuraz Blog', commentable: 'moderate' } });
      blogId = r.blog?.id;
      console.log('   ✅ Blog created');
    } catch (e) { console.log(`   ⚠️ ${e.message.substring(0, 60)}`); return; }
  } else {
    blogId = data.blogs[0].id;
    console.log(`   ✅ Blog exists (ID: ${blogId})`);
  }

  // Check existing articles
  const existing = await api(`blogs/${blogId}/articles.json?limit=50&fields=id,title`);
  const existingTitles = new Set((existing.articles || []).map(a => a.title));

  const articles = [
    { title: '¿Cómo elegir el mejor Power Bank en 2026?', tags: 'guia, power-bank, tips',
      body_html: '<h2>Guía completa para elegir tu Power Bank ideal</h2><p>Elegir el <strong>power bank</strong> correcto puede ser confuso. En TechAuraz preparamos esta guía definitiva.</p><p><a href="/collections/carga-energia-techaura">Ver power banks →</a></p>' },
    { title: 'Guía: ¿Cómo Comprar con Pago Contra Entrega?', tags: 'guia, pago-contraentrega, tutorial',
      body_html: '<h2>Comprar online nunca fue tan fácil</h2><p>En TechAuraz ofrecemos <strong>pago contra entrega</strong> en toda Colombia. Sin tarjeta de crédito.</p><p><a href="/collections/all">Explorar productos →</a></p>' },
  ];

  for (const art of articles) {
    if (existingTitles.has(art.title)) { console.log(`   ⏭️ "${art.title.substring(0, 40)}" exists`); continue; }
    try {
      await api(`blogs/${blogId}/articles.json`, 'POST', { article: { ...art, published: true } });
      console.log(`   ✅ Published: "${art.title.substring(0, 45)}"`);
      await sleep(RATE_MS);
    } catch (e) { console.log(`   ⚠️ ${e.message.substring(0, 60)}`); }
  }
}

// ============================================
// OPT 8: SITEMAP PING
// ============================================
async function pingSitemap() {
  console.log('\n' + '═'.repeat(60));
  console.log('🌐 PHASE 8: Sitemap Ping');
  console.log('═'.repeat(60));
  if (DRY_RUN) { console.log('   🏜️  DRY: skipped'); return; }
  try {
    const r = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent('https://techauraz.com/sitemap.xml')}`);
    console.log(r.ok ? '   ✅ Sitemap pinged to Google' : `   ⚠️ Ping returned ${r.status}`);
  } catch (e) { console.log(`   ⚠️ ${e.message.substring(0, 60)}`); }
}

// ============================================
// MAIN
// ============================================
async function main() {
  console.log('\n' + '⚡'.repeat(30));
  console.log('  TechAuraz — 2026 Master Optimization');
  console.log(`  ${new Date().toISOString()} | API ${API}`);
  if (DRY_RUN) console.log('  🏜️  DRY RUN — no changes will be applied');
  console.log('⚡'.repeat(30));

  if (!TOKEN) {
    console.error('\n❌ Set SHOPIFY_ADMIN_API_KEY env var');
    console.log('Usage: $env:SHOPIFY_ADMIN_API_KEY="HIDDEN_SECRET_TOKEN"; node scripts/shopify-master-optimize.mjs');
    process.exit(1);
  }

  console.log(`\n🏪 ${SHOP}\n`);

  await optimizeProducts();
  await optimizeCollections();
  await optimizePages();
  await createRedirects();
  await setShopMetafields();
  await auditScriptTags();
  await optimizeBlog();
  await pingSitemap();

  console.log('\n\n' + '═'.repeat(60));
  console.log('📊 FINAL SUMMARY');
  console.log('═'.repeat(60));
  console.log(`  📦 Products updated:     ${stats.updated}`);
  console.log(`  ⏭️  Products skipped:     ${stats.skipped}`);
  console.log(`  🖼️  Image alts fixed:     ${stats.imageAlts}`);
  console.log(`  🏷️  SKUs generated:       ${stats.skus}`);
  console.log(`  📁 Collections enriched: ${stats.collections}`);
  console.log(`  📄 Pages SEO'd:          ${stats.pages}`);
  console.log(`  🔗 Redirects created:    ${stats.redirects}`);
  console.log(`  ❌ Errors:               ${stats.errors}`);
  console.log('═'.repeat(60));
  if (DRY_RUN) console.log('\n🏜️  DRY RUN COMPLETE — no changes were applied\n');
  else console.log('\n✨ ALL OPTIMIZATIONS COMPLETE — visit https://techauraz.com\n');
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
