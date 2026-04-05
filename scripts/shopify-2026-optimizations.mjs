#!/usr/bin/env node
/**
 * TechAuraz — 2026 Advanced Shopify Optimizations
 * ==================================================
 * Leverages ALL available API scopes for maximum optimization:
 * 
 * 1. Product SEO: Smart meta titles, descriptions, image alt text
 * 2. Collection SEO: Titles, descriptions, template suffix
 * 3. Shop Metafields: Structured data, business info
 * 4. Script Tags Cleanup: Remove orphaned/unwanted scripts
 * 5. Page SEO: Contact, policy pages optimization
 * 6. Product Image Alt Text: Auto-generate accessibility text
 * 7. Smart redirects: Common misspellings, old URLs
 */

const SHOP = process.env.SHOPIFY_STORE_DOMAIN || '7f4c40-fb.myshopify.com';
const TOKEN = process.env.SHOPIFY_ADMIN_API_KEY || '';
const API = process.env.SHOPIFY_API_VERSION || '2026-01';
const RATE_MS = 550;

async function api(ep, method = 'GET', body = null) {
  const url = `https://${SHOP}/admin/api/${API}/${ep}`;
  const opts = { method, headers: { 'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(url, opts);
  if (r.status === 429) {
    const s = parseFloat(r.headers.get('Retry-After') || '2');
    await sleep(s * 1000);
    return api(ep, method, body);
  }
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`${r.status}: ${t.substring(0, 250)}`);
  }
  if (r.status === 204) return {};
  const ct = r.headers.get('content-type');
  if (!ct || !ct.includes('json')) return {};
  return r.json();
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// =============================================
// OPTIMIZATION 1: Product SEO Enhancement
// =============================================
async function optimizeProductSEO() {
  console.log('\n' + '═'.repeat(60));
  console.log('🔍 OPT 1: Product SEO — Titles, Descriptions, Image Alt Text');
  console.log('═'.repeat(60));

  const data = await api('products.json?limit=250&fields=id,title,handle,body_html,images,product_type,tags,variants,metafields_global_title_tag,metafields_global_description_tag');
  const products = data.products;
  console.log(`   Found ${products.length} products\n`);

  let optimized = 0;
  let imageAlts = 0;

  for (const p of products) {
    const updates = {};
    let needsUpdate = false;

    // 1a. Generate SEO title if missing or generic
    const currentSeoTitle = p.metafields_global_title_tag || '';
    if (!currentSeoTitle || currentSeoTitle === p.title) {
      // Create optimized SEO title with brand + category + CTA
      const category = p.product_type || 'Tecnología';
      const price = p.variants?.[0]?.price ? ` | Desde $${parseInt(p.variants[0].price).toLocaleString('es-CO')}` : '';
      const seoTitle = `${p.title}${price} | Envío GRATIS | TechAuraz`;
      
      // Shopify max 70 chars for title
      updates.metafields_global_title_tag = seoTitle.length > 70 
        ? `${p.title.substring(0, 45)}${price} | TechAuraz`
        : seoTitle;
      needsUpdate = true;
    }

    // 1b. Generate SEO description if missing
    const currentSeoDesc = p.metafields_global_description_tag || '';
    if (!currentSeoDesc) {
      const category = p.product_type || 'accesorio tech';
      const price = p.variants?.[0]?.price ? `Desde $${parseInt(p.variants[0].price).toLocaleString('es-CO')}. ` : '';
      const seoDesc = `${p.title} — ${price}Envío GRATIS a toda Colombia. Pago contra entrega. Garantía 30 días. Compra segura en TechAuraz.`;
      
      // Shopify max 320 chars for description
      updates.metafields_global_description_tag = seoDesc.substring(0, 320);
      needsUpdate = true;
    }

    // 1c. Update product
    if (needsUpdate) {
      try {
        await api(`products/${p.id}.json`, 'PUT', { product: { id: p.id, ...updates } });
        console.log(`   ✅ SEO: ${p.title.substring(0, 50)}`);
        optimized++;
        await sleep(RATE_MS);
      } catch (e) {
        console.log(`   ⚠️ SEO fail: ${p.title.substring(0, 35)} — ${e.message.substring(0, 80)}`);
      }
    }

    // 1d. Fix image alt text
    if (p.images && p.images.length > 0) {
      for (let i = 0; i < p.images.length; i++) {
        const img = p.images[i];
        if (!img.alt || img.alt.trim() === '') {
          const altText = i === 0 
            ? `${p.title} — Vista principal` 
            : `${p.title} — Vista ${i + 1}`;
          try {
            await api(`products/${p.id}/images/${img.id}.json`, 'PUT', {
              image: { id: img.id, alt: altText.substring(0, 512) }
            });
            imageAlts++;
            await sleep(300);
          } catch (e) {
            // Skip silently for non-critical image alt updates
          }
        }
      }
    }
  }

  console.log(`\n   📊 SEO: ${optimized} products optimized, ${imageAlts} image alt texts added`);
}

// =============================================
// OPTIMIZATION 2: Collection SEO
// =============================================
async function optimizeCollections() {
  console.log('\n' + '═'.repeat(60));
  console.log('📁 OPT 2: Collection SEO — Titles, Descriptions');
  console.log('═'.repeat(60));

  // Smart collections
  const smartData = await api('smart_collections.json?limit=250');
  const collections = smartData.smart_collections || [];
  console.log(`   Found ${collections.length} smart collections\n`);

  let optimized = 0;

  for (const col of collections) {
    const updates = {};
    let needsUpdate = false;

    // Generate SEO-optimized meta title
    if (!col.metafield?.title_tag) {
      updates.metafield = updates.metafield || {};
      // Can't set meta title via REST easily, but we can optimize body_html
    }

    // Add/improve collection description for SEO
    if (!col.body_html || col.body_html.trim().length < 50) {
      const seoBody = `<p>Explora nuestra selección de <strong>${col.title}</strong> en TechAuraz. Envío gratis a toda Colombia, pago contra entrega y garantía de 30 días. Encuentra los mejores ${col.title.toLowerCase()} con la mejor calidad y precio.</p>`;
      updates.body_html = seoBody;
      needsUpdate = true;
    }

    if (needsUpdate) {
      try {
        await api(`smart_collections/${col.id}.json`, 'PUT', { smart_collection: { id: col.id, ...updates } });
        console.log(`   ✅ Collection SEO: ${col.title}`);
        optimized++;
        await sleep(RATE_MS);
      } catch (e) {
        console.log(`   ⚠️ Fail: ${col.title} — ${e.message.substring(0, 80)}`);
      }
    } else {
      console.log(`   ⏭️ OK: ${col.title}`);
    }
  }

  console.log(`\n   📊 Collections: ${optimized} optimized`);
}

// =============================================
// OPTIMIZATION 3: Shop-level Metafields
// =============================================
async function optimizeShopMetafields() {
  console.log('\n' + '═'.repeat(60));
  console.log('🏪 OPT 3: Shop Metafields — Business structured data');
  console.log('═'.repeat(60));

  // Set business-critical metafields for enhanced structured data
  const metafields = [
    {
      namespace: 'global',
      key: 'description_tag',
      value: 'Explora nuestra gama de productos tecnológicos en TechAuraz. Envío gratis a toda Colombia. Power banks, cables USB, hubs, memorias y más con garantía de 30 días. Pago contra entrega.',
      type: 'single_line_text_field',
    },
    {
      namespace: 'custom',
      key: 'business_phone',
      value: '+573008602789',
      type: 'single_line_text_field',
    },
    {
      namespace: 'custom',
      key: 'business_country',
      value: 'CO',
      type: 'single_line_text_field',
    },
    {
      namespace: 'custom',
      key: 'free_shipping_threshold',
      value: '0',
      type: 'single_line_text_field',
    },
    {
      namespace: 'custom',
      key: 'warranty_days',
      value: '30',
      type: 'single_line_text_field',
    },
    {
      namespace: 'custom',
      key: 'social_whatsapp',
      value: 'https://wa.me/573008602789',
      type: 'single_line_text_field',
    },
  ];

  let created = 0;
  for (const mf of metafields) {
    try {
      await api('metafields.json', 'POST', { metafield: mf });
      console.log(`   ✅ ${mf.namespace}.${mf.key} = ${mf.value.substring(0, 50)}`);
      created++;
      await sleep(RATE_MS);
    } catch (e) {
      if (e.message.includes('taken')) {
        console.log(`   ⏭️ ${mf.namespace}.${mf.key} — already exists`);
      } else {
        console.log(`   ⚠️ ${mf.namespace}.${mf.key}: ${e.message.substring(0, 80)}`);
      }
    }
  }

  console.log(`\n   📊 Metafields: ${created} created/updated`);
}

// =============================================
// OPTIMIZATION 4: Script Tags Audit & Cleanup
// =============================================
async function auditScriptTags() {
  console.log('\n' + '═'.repeat(60));
  console.log('🧹 OPT 4: Script Tags Audit — Remove orphaned/unwanted');
  console.log('═'.repeat(60));

  const data = await api('script_tags.json?limit=250');
  const scripts = data.script_tags || [];
  console.log(`   Found ${scripts.length} script tag(s)\n`);

  // Flag suspicious/unwanted scripts
  const blacklist = [
    'fake', 'popup', 'notification', 'countdown-fake', 'social-proof-fake',
    'trust-pilot-fake', 'review-faker', 'scarcity-fake',
  ];

  for (const s of scripts) {
    const srcLower = (s.src || '').toLowerCase();
    const isBlacklisted = blacklist.some(b => srcLower.includes(b));
    
    if (isBlacklisted) {
      try {
        await api(`script_tags/${s.id}.json`, 'DELETE');
        console.log(`   🗑️ Removed: ${s.src.substring(0, 80)}`);
        await sleep(RATE_MS);
      } catch (e) {
        console.log(`   ⚠️ Couldn't remove: ${e.message.substring(0, 60)}`);
      }
    } else {
      console.log(`   ✅ OK: ${s.src ? s.src.substring(0, 80) : 'inline'} [${s.event}]`);
    }
  }
}

// =============================================
// OPTIMIZATION 5: Pages SEO
// =============================================
async function optimizePages() {
  console.log('\n' + '═'.repeat(60));
  console.log('📄 OPT 5: Pages SEO — Title tags and meta descriptions');
  console.log('═'.repeat(60));

  const data = await api('pages.json?limit=50');
  const pages = data.pages || [];
  console.log(`   Found ${pages.length} page(s)\n`);

  const pageSEO = {
    'contacto-techaura': {
      title: 'Contacto TechAuraz | Soporte y Atención al Cliente Colombia',
      description: 'Contáctanos por WhatsApp al +57 300 860 2789. Soporte rápido y personalizado para todos tus pedidos en TechAuraz. Envío gratis a toda Colombia.',
    },
    'usb-al-gusto-personalizada': {
      title: 'USB Personalizada | Memorias con Tu Contenido | TechAuraz',
      description: 'Diseña tu USB con el contenido que desees. Memorias USB 100% personalizadas para regalos corporativos y personales. Envío gratis Colombia.',
    },
    'politica-de-envio': {
      title: 'Política de Envío GRATIS | TechAuraz Colombia',
      description: 'Envío gratis a toda Colombia sin monto mínimo. Entrega en 2-5 días hábiles. Pago contra entrega disponible. TechAuraz — tu tienda tech de confianza.',
    },
    'politica-de-reembolso': {
      title: 'Política de Devoluciones y Reembolso | TechAuraz',
      description: 'Garantía de 30 días en todos los productos. Devolución sin complicaciones. TechAuraz — tu satisfacción es nuestra prioridad.',
    },
  };

  let optimized = 0;
  for (const page of pages) {
    const handle = page.handle;
    const seo = pageSEO[handle];
    
    if (seo) {
      try {
        await api(`pages/${page.id}.json`, 'PUT', {
          page: {
            id: page.id,
            metafields_global_title_tag: seo.title,
            metafields_global_description_tag: seo.description,
          }
        });
        console.log(`   ✅ ${handle}: SEO optimized`);
        optimized++;
        await sleep(RATE_MS);
      } catch (e) {
        console.log(`   ⚠️ ${handle}: ${e.message.substring(0, 80)}`);
      }
    } else {
      // Generic optimization for unknown pages
      if (!page.metafields_global_title_tag) {
        try {
          await api(`pages/${page.id}.json`, 'PUT', {
            page: {
              id: page.id,
              metafields_global_title_tag: `${page.title} | TechAuraz Colombia`,
              metafields_global_description_tag: `${page.title} en TechAuraz. Tienda #1 de tecnología en Colombia con envío gratis y garantía de 30 días.`,
            }
          });
          console.log(`   ✅ ${handle}: Generic SEO added`);
          optimized++;
          await sleep(RATE_MS);
        } catch (e) {
          console.log(`   ⚠️ ${handle}: ${e.message.substring(0, 60)}`);
        }
      } else {
        console.log(`   ⏭️ ${handle}: already has SEO`);
      }
    }
  }

  console.log(`\n   📊 Pages: ${optimized} optimized`);
}

// =============================================
// OPTIMIZATION 6: Smart Redirects for Common SEO Issues
// =============================================
async function createSmartRedirects() {
  console.log('\n' + '═'.repeat(60));
  console.log('🔗 OPT 6: Smart Redirects — SEO-safe URL patterns');
  console.log('═'.repeat(60));

  const redirects = [
    // Common misspellings & alternate URLs
    { path: '/contacto', target: '/pages/contacto-techaura' },
    { path: '/contact', target: '/pages/contacto-techaura' },
    { path: '/garantia', target: '/pages/politica-de-reembolso' },
    { path: '/warranty', target: '/pages/politica-de-reembolso' },
    { path: '/envio', target: '/pages/politica-de-envio' },
    { path: '/shipping', target: '/pages/politica-de-envio' },
    { path: '/devoluciones', target: '/pages/politica-de-reembolso' },
    { path: '/returns', target: '/pages/politica-de-reembolso' },
    { path: '/usb', target: '/pages/usb-al-gusto-personalizada' },
    { path: '/usb-personalizada', target: '/pages/usb-al-gusto-personalizada' },
    // Category shortcuts
    { path: '/audifonos', target: '/collections/diademas-gamer-techaura' },
    { path: '/headphones', target: '/collections/diademas-gamer-techaura' },
    { path: '/cables', target: '/collections/cables-de-datos-techaura' },
    { path: '/cargadores', target: '/collections/carga-energia-techaura' },
    { path: '/powerbank', target: '/collections/carga-energia-techaura' },
  ];

  let created = 0;
  for (const r of redirects) {
    try {
      await api('redirects.json', 'POST', { redirect: r });
      console.log(`   ✅ ${r.path} → ${r.target}`);
      created++;
      await sleep(RATE_MS);
    } catch (e) {
      if (e.message.includes('422') || e.message.includes('already')) {
        console.log(`   ⏭️ ${r.path} → already exists or conflict`);
      } else {
        console.log(`   ⚠️ ${r.path}: ${e.message.substring(0, 80)}`);
      }
    }
  }

  console.log(`\n   📊 Redirects: ${created} created`);
}

// =============================================
// OPTIMIZATION 7: Blog SEO Foundation
// =============================================
async function optimizeBlog() {
  console.log('\n' + '═'.repeat(60));
  console.log('📝 OPT 7: Blog Infrastructure — SEO content foundation');
  console.log('═'.repeat(60));

  const data = await api('blogs.json');
  const blogs = data.blogs || [];
  
  if (blogs.length === 0) {
    // Create a blog for content marketing SEO
    try {
      const result = await api('blogs.json', 'POST', {
        blog: {
          title: 'TechAuraz Blog',
          commentable: 'moderate',
          metafields_global_title_tag: 'Blog TechAuraz | Guías, Reviews y Consejos Tech Colombia',
          metafields_global_description_tag: 'Descubre guías de compra, reviews y consejos sobre tecnología. Power banks, cables USB, smartwatches y más en el blog de TechAuraz Colombia.',
        }
      });
      console.log(`   ✅ Blog created: ${result.blog?.title || 'TechAuraz Blog'}`);
    } catch (e) {
      console.log(`   ⚠️ Blog creation: ${e.message.substring(0, 100)}`);
    }
  } else {
    console.log(`   ✅ Blog exists: ${blogs[0].title} (ID: ${blogs[0].id})`);
    
    // Optimize existing blog SEO
    try {
      await api(`blogs/${blogs[0].id}.json`, 'PUT', {
        blog: {
          id: blogs[0].id,
          metafields_global_title_tag: 'Blog TechAuraz | Guías, Reviews y Consejos Tech Colombia',
          metafields_global_description_tag: 'Descubre guías de compra, reviews y consejos sobre tecnología. Power banks, cables USB, smartwatches y más en el blog de TechAuraz Colombia.',
        }
      });
      console.log(`   ✅ Blog SEO optimized`);
    } catch (e) {
      console.log(`   ⚠️ Blog SEO: ${e.message.substring(0, 80)}`);
    }
  }
}

// =============================================
// OPTIMIZATION 8: Product Structured Data Enhancement
// =============================================
async function enhanceProductData() {
  console.log('\n' + '═'.repeat(60));
  console.log('📦 OPT 8: Product Data Enhancement — Tags, GTIN hints');
  console.log('═'.repeat(60));

  const data = await api('products.json?limit=250&fields=id,title,tags,product_type');
  const products = data.products;
  let enhanced = 0;

  for (const p of products) {
    const currentTags = (p.tags || '').split(', ').filter(Boolean);
    const newTags = [...currentTags];
    let changed = false;

    // Add essential commercial tags
    if (!currentTags.includes('envio-gratis')) {
      newTags.push('envio-gratis');
      changed = true;
    }
    if (!currentTags.includes('garantia-30-dias')) {
      newTags.push('garantia-30-dias');
      changed = true;
    }
    if (!currentTags.includes('pago-contraentrega')) {
      newTags.push('pago-contraentrega');
      changed = true;
    }
    if (!currentTags.includes('colombia')) {
      newTags.push('colombia');
      changed = true;
    }

    if (changed) {
      try {
        await api(`products/${p.id}.json`, 'PUT', {
          product: { id: p.id, tags: newTags.join(', ') }
        });
        console.log(`   ✅ Tags: ${p.title.substring(0, 45)}`);
        enhanced++;
        await sleep(RATE_MS);
      } catch (e) {
        console.log(`   ⚠️ ${p.title.substring(0, 30)}: ${e.message.substring(0, 60)}`);
      }
    }
  }

  console.log(`\n   📊 Products: ${enhanced} enhanced with commercial tags`);
}

// =============================================
// MAIN
// =============================================
async function main() {
  console.log('\n' + '⚡'.repeat(30));
  console.log('  TechAuraz — 2026 Advanced Optimizations');
  console.log('  ' + new Date().toISOString());
  console.log('⚡'.repeat(30));

  if (!TOKEN) {
    console.error('❌ Set SHOPIFY_ADMIN_API_KEY env var');
    process.exit(1);
  }

  console.log(`\n🏪 ${SHOP} | API ${API}\n`);

  await optimizeProductSEO();
  await optimizeCollections();
  await optimizeShopMetafields();
  await auditScriptTags();
  await optimizePages();
  await createSmartRedirects();
  await optimizeBlog();
  await enhanceProductData();

  console.log('\n\n' + '═'.repeat(60));
  console.log('✨ ALL OPTIMIZATIONS COMPLETE');
  console.log('═'.repeat(60));
  console.log('Visit https://techauraz.com to verify\n');
}

main().catch(e => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
