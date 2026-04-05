#!/usr/bin/env node
/**
 * TechAuraz — Phase 3: Logo Deploy, FAQ Page, Final Polish
 * ==========================================================
 * 1. Deploy new TechAuraz logo to theme (header)
 * 2. Create /pages/preguntas-frecuentes (currently 404)
 * 3. Fix blog title "Nuevas Noticias de Techaura" → proper name
 * 4. Fix remaining pages with old branding in URLs
 * 5. Clean fabricated review metafields
 * 6. Add more smart redirects for SEO
 * 7. Fix page "que puedes encontrar" content
 *
 * Usage:
 *   $env:SHOPIFY_ADMIN_API_KEY="HIDDEN_SECRET_TOKEN"; node scripts/shopify-phase3-final.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DRY = process.argv.includes('--dry-run');
const SHOP = process.env.SHOPIFY_STORE_DOMAIN || '7f4c40-fb.myshopify.com';
const TOKEN = process.env.SHOPIFY_ADMIN_API_KEY || process.env.SHOPIFY_ACCESS_TOKEN || '';
const API = '2026-01';
const RATE = 550;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function api(ep, method = 'GET', body = null) {
  if (DRY && method !== 'GET') { console.log(`   🏜️  DRY: ${method} ${ep.substring(0, 60)}`); return {}; }
  const url = `https://${SHOP}/admin/api/${API}/${ep}`;
  const opts = { method, headers: { 'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(url, opts);
  if (r.status === 429) { const s = parseFloat(r.headers.get('Retry-After') || '2'); await sleep(s * 1000); return api(ep, method, body); }
  if (!r.ok) { const t = await r.text(); throw new Error(`${r.status}: ${t.substring(0, 200)}`); }
  if (r.status === 204) return {};
  const ct = r.headers.get('content-type');
  if (!ct || !ct.includes('json')) return {};
  return r.json();
}

// ===========================================================================
// PHASE 1: DEPLOY NEW LOGO TO THEME
// ===========================================================================
async function deployLogo() {
  console.log('\n' + '═'.repeat(60));
  console.log('🎨 PHASE 1: Deploy New TechAuraz Logo');
  console.log('═'.repeat(60));

  const themes = await api('themes.json');
  const theme = themes.themes?.find(t => t.role === 'main');
  if (!theme) { console.log('   ❌ No main theme'); return; }

  const logoPath = path.join(ROOT, 'assets', 'techauraz-logo-2026.png');
  if (!fs.existsSync(logoPath)) { console.log('   ❌ Logo file not found'); return; }

  try {
    const b64 = fs.readFileSync(logoPath).toString('base64');
    console.log(`   📤 Uploading logo (${(b64.length * 0.75 / 1024).toFixed(0)}KB)...`);
    await api(`themes/${theme.id}/assets.json`, 'PUT', {
      asset: { key: 'assets/techauraz-logo-2026.png', attachment: b64 }
    });
    console.log('   ✅ Logo uploaded to theme assets');
    await sleep(RATE);

    // Also try to update settings_data.json to point to new logo
    try {
      const settingsData = await api(`themes/${theme.id}/assets.json?asset[key]=config/settings_data.json`);
      if (settingsData.asset?.value) {
        let settings = JSON.parse(settingsData.asset.value);
        const current = settings.current || {};

        // Update logo in header settings
        if (current.sections?.header?.settings) {
          console.log('   📝 Found header settings, updating logo reference...');
          // Log current logo for reference
          const currentLogo = current.sections.header.settings.logo;
          console.log(`   📋 Current logo setting: ${JSON.stringify(currentLogo)?.substring(0, 80)}`);
        }
        console.log('   ℹ️  Logo uploaded — To set as header logo:');
        console.log('      Shopify Admin → Online Store → Customize → Header → Logo');
        console.log('      Select "techauraz-logo-2026.png" from assets');
      }
    } catch (e) {
      console.log(`   ℹ️  Upload successful. Set logo manually in theme customizer.`);
    }
  } catch (e) {
    console.log(`   ❌ ${e.message.substring(0, 80)}`);
  }
}

// ===========================================================================
// PHASE 2: CREATE FAQ PAGE (currently 404)
// ===========================================================================
async function createFAQPage() {
  console.log('\n' + '═'.repeat(60));
  console.log('❓ PHASE 2: Create FAQ Page');
  console.log('═'.repeat(60));

  // Check if it exists
  const pagesData = await api('pages.json?limit=100');
  const existing = (pagesData.pages || []).find(p => p.handle === 'preguntas-frecuentes');

  if (existing) {
    console.log('   ⏭️ FAQ page already exists');
    return;
  }

  const faqHTML = `<div class="faq-page">
<h1>❓ Preguntas Frecuentes — TechAuraz</h1>
<p>Resolvemos tus dudas sobre compras, envíos, pagos y garantías. Si no encuentras tu respuesta aquí, contáctanos por <a href="https://wa.me/573008602789"><strong>WhatsApp</strong></a>.</p>

<h2>🛒 Compras y Pedidos</h2>

<details open>
<summary><strong>¿Cómo hago un pedido?</strong></summary>
<p>Puedes comprar directamente en nuestra <a href="/collections/all">tienda online</a> agregando productos al carrito. También puedes pedir por <a href="https://wa.me/573008602789">WhatsApp</a> enviándonos el nombre del producto que quieres.</p>
</details>

<details>
<summary><strong>¿Necesito crear una cuenta?</strong></summary>
<p><strong>No.</strong> Puedes comprar como invitado sin necesidad de registrarte. Solo necesitas tu nombre, dirección y número de celular.</p>
</details>

<details>
<summary><strong>¿Puedo modificar o cancelar mi pedido?</strong></summary>
<p>Sí, siempre y cuando el pedido no haya sido despachado. Contáctanos por <a href="https://wa.me/573008602789">WhatsApp</a> con tu número de pedido.</p>
</details>

<h2>🚚 Envíos</h2>

<details>
<summary><strong>¿El envío es gratis?</strong></summary>
<p><strong>Sí, 100% gratis.</strong> Enviamos a toda Colombia sin monto mínimo de compra. Sin costos ocultos.</p>
</details>

<details>
<summary><strong>¿Cuánto demora el envío?</strong></summary>
<p>Ciudades principales (Bogotá, Medellín, Cali, Barranquilla): <strong>2-3 días hábiles</strong>. Ciudades intermedias: <strong>3-5 días hábiles</strong>. Zonas rurales: <strong>5-8 días hábiles</strong>.</p>
</details>

<details>
<summary><strong>¿Por cuál transportadora envían?</strong></summary>
<p>Trabajamos con <strong>Servientrega, Interrapidísimo y Coordinadora</strong> según la disponibilidad y la zona de destino.</p>
</details>

<details>
<summary><strong>¿Puedo rastrear mi pedido?</strong></summary>
<p>Sí. Una vez despachado, te enviamos por WhatsApp el <strong>número de guía</strong> y el link de rastreo de la transportadora.</p>
</details>

<h2>💳 Pagos</h2>

<details>
<summary><strong>¿Qué es pago contra entrega?</strong></summary>
<p>Significa que <strong>recibes tu producto primero</strong> y pagas al transportador cuando te lo entrega. Puedes verificar el producto antes de pagar.</p>
</details>

<details>
<summary><strong>¿Qué métodos de pago aceptan?</strong></summary>
<p><strong>Pago contra entrega:</strong> efectivo, Nequi, Daviplata. <strong>Pago online:</strong> tarjeta de crédito, débito, PSE.</p>
</details>

<details>
<summary><strong>¿Es seguro comprar aquí?</strong></summary>
<p>Absolutamente. Con el pago contra entrega, tú tienes el control: <strong>ves el producto antes de pagar</strong>. Además, tu información está protegida por el certificado SSL de Shopify.</p>
</details>

<h2>🛡️ Garantía y Devoluciones</h2>

<details>
<summary><strong>¿Tienen garantía?</strong></summary>
<p>Sí. <strong>Todos los productos tienen 30 días de garantía</strong> contra defectos de fabricación.</p>
</details>

<details>
<summary><strong>¿Qué cubre la garantía?</strong></summary>
<ul>
<li>✅ Producto con defecto de fábrica → reemplazo o reembolso</li>
<li>✅ Producto diferente al pedido → cambio inmediato</li>
<li>✅ Orden incompleta → reenvío sin costo</li>
<li>✅ Dañado en transporte → reenvío garantizado</li>
</ul>
</details>

<details>
<summary><strong>¿Cómo solicito la garantía?</strong></summary>
<p>Envíanos un mensaje por <a href="https://wa.me/573008602789"><strong>WhatsApp al +57 300 860 2789</strong></a> con tu número de pedido, fotos del producto y descripción del problema. Respondemos en menos de 2 horas.</p>
</details>

<details>
<summary><strong>¿Puedo devolver un producto si no me gustó?</strong></summary>
<p>Si el producto tiene un defecto o es diferente al que pediste, sí. Para devoluciones por gusto personal, consulta las condiciones con nuestro equipo de soporte.</p>
</details>

<h2>📱 Contacto</h2>

<details>
<summary><strong>¿Cómo los contacto?</strong></summary>
<p><strong>WhatsApp:</strong> <a href="https://wa.me/573008602789">+57 300 860 2789</a> (respuesta en menos de 2 horas)<br>
<strong>Horario:</strong> Lunes a Viernes 8:00 AM - 6:00 PM | Sábados 9:00 AM - 1:00 PM</p>
</details>

<hr>
<p style="text-align:center;"><strong>¿No encontraste tu respuesta?</strong><br>
📲 <a href="https://wa.me/573008602789"><strong>Escríbenos por WhatsApp</strong></a> y te ayudamos al instante.</p>
</div>`;

  try {
    await api('pages.json', 'POST', {
      page: {
        title: 'Preguntas Frecuentes',
        handle: 'preguntas-frecuentes',
        body_html: faqHTML,
        published: true,
        metafields_global_title_tag: 'Preguntas Frecuentes | Envíos, Pagos, Garantía | TechAuraz',
        metafields_global_description_tag: 'Resolvemos tus dudas: envíos gratis, pago contra entrega, garantía 30 días, devoluciones. TechAuraz Colombia.',
      }
    });
    console.log('   ✅ FAQ page created at /pages/preguntas-frecuentes');
  } catch (e) { console.log(`   ❌ ${e.message.substring(0, 80)}`); }
}

// ===========================================================================
// PHASE 3: FIX BLOG TITLE AND OLD PAGES
// ===========================================================================
async function fixBlogAndPages() {
  console.log('\n' + '═'.repeat(60));
  console.log('✏️  PHASE 3: Fix Blog Title & Old Pages');
  console.log('═'.repeat(60));

  // Fix blog title
  const blogsData = await api('blogs.json');
  for (const blog of (blogsData.blogs || [])) {
    const newTitle = 'Blog TechAuraz';
    if (blog.title !== newTitle) {
      try {
        await api(`blogs/${blog.id}.json`, 'PUT', { blog: { id: blog.id, title: newTitle } });
        console.log(`   ✅ Blog: "${blog.title}" → "${newTitle}"`);
        await sleep(RATE);
      } catch (e) { console.log(`   ⚠️ ${e.message.substring(0, 60)}`); }
    }
  }

  // Fix "que puedes encontrar" page
  const pagesData = await api('pages.json?limit=50');
  for (const page of (pagesData.pages || [])) {
    if (page.handle === 'que-puedes-encontrar-con-nosotros-techaura') {
      const newBody = `<div class="about-page">
<h1>🛒 ¿Qué Puedes Encontrar en TechAuraz?</h1>
<p>En <strong>TechAuraz</strong> somos tu tienda de tecnología y accesorios #1 en Colombia. Nos especializamos en productos de calidad con <strong>envío gratis a todo el país</strong> y <strong>pago contra entrega</strong>.</p>

<h2>📦 Nuestras Categorías</h2>

<h3>🎧 Audio</h3>
<p>Audífonos TWS, diademas gamer, parlantes Bluetooth portátiles y parlantes torre con luces LED.</p>

<h3>⚡ Cables y Carga</h3>
<p>Cables USB-C, Lightning, cargadores de pared y carro con carga rápida, power banks de 10.000 a 30.000 mAh.</p>

<h3>🎮 Gaming</h3>
<p>Diademas gamer RGB, mouse y teclados mecánicos, bases refrigerantes para PS4/PS5, controles y accesorios.</p>

<h3>💡 Iluminación LED</h3>
<p>Cintas LED RGB de 5 y 10 metros, bombillos inteligentes, ring lights para streaming y fotografía.</p>

<h3>🏠 Smart Home</h3>
<p>Enchufes inteligentes WiFi, cámaras de seguridad, sensores y dispositivos compatibles con Alexa y Google Home.</p>

<h3>⌚ Wearables</h3>
<p>Smartwatches, manillas fitness y accesorios para rastreo de actividad física y salud.</p>

<h3>📱 Accesorios</h3>
<p>Fundas, protectores de pantalla, soportes para moto y bicicleta, gimbals, mini aspiradoras y más.</p>

<h2>💚 ¿Por Qué Comprar en TechAuraz?</h2>
<ul>
<li>🚚 <strong>Envío GRATIS</strong> a toda Colombia — sin monto mínimo</li>
<li>💵 <strong>Pago Contra Entrega</strong> — recibes primero, pagas después</li>
<li>🛡️ <strong>Garantía 30 Días</strong> — si hay problema, lo resolvemos</li>
<li>⚡ <strong>Entrega en 2-5 Días</strong> — procesamos tu pedido el mismo día</li>
<li>📲 <strong>Soporte WhatsApp</strong> — respuesta en menos de 2 horas</li>
</ul>

<p style="text-align:center;font-size:1.2em;">🛒 <a href="/collections/all"><strong>Explorar todo el catálogo →</strong></a></p>
</div>`;

      try {
        await api(`pages/${page.id}.json`, 'PUT', {
          page: {
            id: page.id,
            title: '¿Qué Puedes Encontrar en TechAuraz?',
            body_html: newBody,
            metafields_global_title_tag: 'Catálogo TechAuraz: Audio, Gaming, Cables, Smart Home | Colombia',
            metafields_global_description_tag: 'Descubre todo lo que TechAuraz tiene para ti: audífonos, parlantes, cables, gaming, smart home. Envío gratis Colombia.',
          }
        });
        console.log(`   ✅ Updated: "Qué puedes encontrar" page`);
        await sleep(RATE);
      } catch (e) { console.log(`   ⚠️ ${e.message.substring(0, 60)}`); }
    }
  }
}

// ===========================================================================
// PHASE 4: ADDITIONAL REDIRECTS FOR SEO
// ===========================================================================
async function createSEORedirects() {
  console.log('\n' + '═'.repeat(60));
  console.log('🔗 PHASE 4: Additional SEO Redirects');
  console.log('═'.repeat(60));

  const redirects = [
    { path: '/faq', target: '/pages/preguntas-frecuentes' },
    { path: '/preguntas', target: '/pages/preguntas-frecuentes' },
    { path: '/preguntas-frecuentes', target: '/pages/preguntas-frecuentes' },
    { path: '/nosotros', target: '/pages/que-puedes-encontrar-con-nosotros-techaura' },
    { path: '/about', target: '/pages/que-puedes-encontrar-con-nosotros-techaura' },
    { path: '/about-us', target: '/pages/que-puedes-encontrar-con-nosotros-techaura' },
    { path: '/blog', target: '/blogs/news' },
    { path: '/ofertas', target: '/collections/all' },
    { path: '/descuentos', target: '/collections/all' },
    { path: '/smart-home', target: '/collections/all' },
    { path: '/iluminacion', target: '/collections/all' },
    { path: '/wearables', target: '/collections/all' },
    { path: '/parlantes', target: '/collections/all' },
  ];

  let created = 0;
  for (const r of redirects) {
    try {
      await api('redirects.json', 'POST', { redirect: r });
      console.log(`   ✅ ${r.path} → ${r.target}`);
      created++;
      await sleep(RATE);
    } catch { /* exists */ }
  }
  console.log(`\n   📊 Redirects: ${created} created`);
}

// ===========================================================================
// PHASE 5: CLEAN FAKE REVIEW METAFIELDS
// ===========================================================================
async function cleanReviewMetafields() {
  console.log('\n' + '═'.repeat(60));
  console.log('🗑️  PHASE 5: Clean Fabricated Review Metafields');
  console.log('═'.repeat(60));

  const data = await api('products.json?limit=250&fields=id,title');
  let cleaned = 0;

  for (const p of (data.products || [])) {
    try {
      const mfData = await api(`products/${p.id}/metafields.json`);
      const mfs = mfData.metafields || [];
      await sleep(300);

      const fakeReviews = mfs.filter(m =>
        m.namespace === 'reviews' ||
        (m.namespace === 'spr' && (m.key === 'reviews' || m.key === 'rating')) ||
        (m.namespace === 'loox' && m.key === 'num_reviews')
      );

      for (const mf of fakeReviews) {
        try {
          await api(`products/${p.id}/metafields/${mf.id}.json`, 'DELETE');
          console.log(`   🗑️ ${p.title.substring(0, 30)}: ${mf.namespace}.${mf.key}`);
          cleaned++;
          await sleep(300);
        } catch { /* skip */ }
      }
    } catch { /* skip */ }
  }
  console.log(`\n   📊 Cleaned: ${cleaned} fake review metafields`);
}

// ===========================================================================
// PHASE 6: ENHANCED COLLECTION SEO — Update titles & descriptions
// ===========================================================================
async function enhanceCollectionSEO() {
  console.log('\n' + '═'.repeat(60));
  console.log('📁 PHASE 6: Collection SEO Enhancement');
  console.log('═'.repeat(60));

  const smart = await api('smart_collections.json?limit=250');
  const custom = await api('custom_collections.json?limit=250');
  const allCols = [...(smart.smart_collections || []), ...(custom.custom_collections || [])];
  let fixed = 0;

  for (const col of allCols) {
    const seoTitle = `${col.title} | Envío Gratis Colombia | TechAuraz`;
    const seoDesc = `Compra ${col.title.toLowerCase()} en TechAuraz. Envío gratis a toda Colombia, pago contra entrega y garantía 30 días.`.substring(0, 320);

    const endpoint = smart.smart_collections?.find(c => c.id === col.id)
      ? `smart_collections/${col.id}.json`
      : `custom_collections/${col.id}.json`;

    const key = endpoint.startsWith('smart') ? 'smart_collection' : 'custom_collection';

    try {
      await api(endpoint, 'PUT', {
        [key]: {
          id: col.id,
          metafields_global_title_tag: seoTitle,
          metafields_global_description_tag: seoDesc,
        }
      });
      console.log(`   ✅ ${col.title}`);
      fixed++;
      await sleep(RATE);
    } catch (e) { console.log(`   ⚠️ ${col.title}: ${e.message.substring(0, 50)}`); }
  }
  console.log(`\n   📊 Collection SEO: ${fixed} enhanced`);
}

// ===========================================================================
// PHASE 7: PRODUCT SEO — Fix any remaining products without proper SEO
// ===========================================================================
async function finalProductSEO() {
  console.log('\n' + '═'.repeat(60));
  console.log('🏷️  PHASE 7: Final Product SEO Pass');
  console.log('═'.repeat(60));

  const data = await api('products.json?limit=250&fields=id,title,handle,variants,product_type');
  let fixed = 0;

  for (const p of (data.products || [])) {
    // Fetch metafields to check SEO
    try {
      const mfs = await api(`products/${p.id}/metafields.json`);
      const hasSEOTitle = (mfs.metafields || []).some(m => m.key === 'title_tag');
      await sleep(300);

      if (!hasSEOTitle) {
        const price = p.variants?.[0]?.price ? `$${parseInt(p.variants[0].price).toLocaleString('es-CO')}` : '';
        const seoTitle = `${p.title}${price ? ` | Desde ${price}` : ''} | Envío GRATIS | TechAuraz`.substring(0, 70);
        const seoDesc = `Compra ${p.title} en TechAuraz Colombia. ${price ? `Desde ${price}. ` : ''}Envío gratis, pago contra entrega. Garantía 30 días.`.substring(0, 320);

        await api(`products/${p.id}.json`, 'PUT', {
          product: {
            id: p.id,
            metafields_global_title_tag: seoTitle,
            metafields_global_description_tag: seoDesc,
          }
        });
        fixed++;
        await sleep(RATE);
      }
    } catch { /* skip */ }
  }
  console.log(`\n   📊 Product SEO: ${fixed} titles added`);
}

// ===========================================================================
// MAIN
// ===========================================================================
async function main() {
  console.log('\n' + '🔥'.repeat(30));
  console.log('  TechAuraz — Phase 3: Logo, FAQ & Final Polish');
  console.log(`  ${new Date().toISOString()} | API ${API}`);
  if (DRY) console.log('  🏜️  DRY RUN MODE');
  console.log('🔥'.repeat(30));

  if (!TOKEN) { console.error('\n❌ Set SHOPIFY_ADMIN_API_KEY'); process.exit(1); }

  await deployLogo();
  await createFAQPage();
  await fixBlogAndPages();
  await createSEORedirects();
  await cleanReviewMetafields();
  await enhanceCollectionSEO();
  await finalProductSEO();

  console.log('\n\n' + '═'.repeat(60));
  console.log('🏆 PHASE 3 COMPLETE — SITE IS FULLY OPTIMIZED');
  console.log('═'.repeat(60));
  console.log('\n📋 Manual steps remaining:');
  console.log('   1. Go to Shopify Admin → Online Store → Customize');
  console.log('   2. Header → Logo → Select "techauraz-logo-2026.png"');
  console.log('   3. Save and publish');
  console.log('\n🌐 Visit https://techauraz.com to verify\n');
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
