#!/usr/bin/env node
/**
 * TechAuraz — Professional Content & Theme Deployment
 * =====================================================
 * 1. Deploy all modified theme files to the live store
 * 2. Create 6+ SEO blog articles for topical authority
 * 3. Enhance ALL product descriptions with professional copy
 * 4. Enrich collection pages with marketing content
 * 5. Create additional marketing collections
 *
 * Usage:
 *   $env:SHOPIFY_ADMIN_API_KEY="HIDDEN_SECRET_TOKEN"; node scripts/shopify-content-deploy.mjs
 *   $env:SHOPIFY_ADMIN_API_KEY="HIDDEN_SECRET_TOKEN"; node scripts/shopify-content-deploy.mjs --dry-run
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
// PHASE 1: DEPLOY THEME FILES
// ===========================================================================
async function deployTheme() {
  console.log('\n' + '═'.repeat(60));
  console.log('🚀 PHASE 1: Deploy Theme Files to Live Store');
  console.log('═'.repeat(60));

  const themes = await api('themes.json');
  const theme = themes.themes?.find(t => t.role === 'main');
  if (!theme) { console.log('   ❌ No main theme'); return; }
  console.log(`   Theme: "${theme.name}" (ID: ${theme.id})\n`);

  const files = [
    'layout/theme.liquid',
    'snippets/schema-faq.liquid',
    'snippets/schema-product.liquid',
    'snippets/schema-breadcrumbs.liquid',
    'snippets/structured-data-base.liquid',
    'snippets/meta-tags.liquid',
    'snippets/cart-drawer.liquid',
    'snippets/order-bump.liquid',
    'sections/main-product.liquid',
    'sections/main-cart-items.liquid',
    'sections/product-views-counter.liquid',
    'sections/category-navigation.liquid',
    'sections/product-trust-strip.liquid',
    'sections/product-benefits.liquid',
    'sections/product-faq.liquid',
    'sections/product-testimonials.liquid',
    'sections/cross-sell.liquid',
    'sections/related-products.liquid',
    'sections/recently-viewed.liquid',
    'sections/sticky-mobile-cta.liquid',
    'sections/countdown-timer.liquid',
    'sections/shipping-timeline.liquid',
    'sections/shipping-returns.liquid',
    'sections/benefits-conversion.liquid',
    'sections/social-proof-banner.liquid',
    'templates/product.liquid',
    'templates/cart.json',
    'templates/index.json',
    // CSS
    'assets/techauraz-2026-cro.css',
    'assets/section-product-views-counter.css',
    'assets/section-category-navigation.css',
    'assets/cart-drawer-order-bump.css',
  ];

  let deployed = 0;
  for (const f of files) {
    const full = path.join(ROOT, f);
    if (!fs.existsSync(full)) continue;
    try {
      const content = fs.readFileSync(full, 'utf8');
      await api(`themes/${theme.id}/assets.json`, 'PUT', { asset: { key: f, value: content } });
      console.log(`   ✅ ${f}`);
      deployed++;
      await sleep(RATE);
    } catch (e) { console.log(`   ⚠️ ${f}: ${e.message.substring(0, 80)}`); }
  }

  // Binary assets (images)
  const images = ['assets/hero-slide-1.png', 'assets/hero-slide-2.png', 'assets/hero-slide-3.png',
    'assets/techauraz-icon-192.png', 'assets/techauraz-icon-512.png'];
  for (const img of images) {
    const full = path.join(ROOT, img);
    if (!fs.existsSync(full)) continue;
    try {
      const b64 = fs.readFileSync(full).toString('base64');
      await api(`themes/${theme.id}/assets.json`, 'PUT', { asset: { key: img, attachment: b64 } });
      console.log(`   ✅ ${img} (image)`);
      deployed++;
      await sleep(RATE * 2);
    } catch (e) { console.log(`   ⚠️ ${img}: ${e.message.substring(0, 60)}`); }
  }

  console.log(`\n   📊 Deployed: ${deployed} files`);
}

// ===========================================================================
// PHASE 2: BLOG CONTENT AUTHORITY — 6 Professional SEO Articles
// ===========================================================================
async function createBlogContent() {
  console.log('\n' + '═'.repeat(60));
  console.log('📝 PHASE 2: Blog Content — Professional SEO Articles');
  console.log('═'.repeat(60));

  const blogs = await api('blogs.json');
  if (!blogs.blogs?.length) { console.log('   ❌ No blog'); return; }
  const blogId = blogs.blogs[0].id;

  const existing = await api(`blogs/${blogId}/articles.json?limit=50&fields=id,title`);
  const titles = new Set((existing.articles || []).map(a => a.title));

  const articles = [
    {
      title: 'Cable USB-C vs Lightning: ¿Cuál Necesitas en 2026?',
      tags: 'guia, cables, usb-c, lightning, comparativa, 2026',
      body_html: `<h2>La batalla definitiva de los cables de carga</h2>
<p>Con Apple finalmente adoptando <strong>USB-C</strong> en toda su línea de productos, el panorama de la carga ha cambiado radicalmente. Pero, ¿realmente entiendes las diferencias entre estos estándares?</p>
<h3>USB-C: El estándar universal</h3>
<p>El <strong>USB Type-C</strong> es el conector universal que está dominando 2026. Sus ventajas son claras:</p>
<ul>
<li>⚡ <strong>Carga rápida hasta 240W</strong> — Puede cargar desde tu celular hasta tu laptop con un solo cable</li>
<li>📱 <strong>Universal</strong> — funciona con Samsung, Xiaomi, iPhone 15+, iPad, MacBook, Nintendo Switch</li>
<li>🔄 <strong>Reversible</strong> — Se conecta en cualquier dirección, sin ese frustrante "voltéalo"</li>
<li>📊 <strong>Transferencia de datos</strong> — USB 3.2 alcanza hasta 20 Gbps</li>
</ul>
<h3>Lightning: En camino a la jubilación</h3>
<p>Apple mantuvo <strong>Lightning</strong> por más de una década, pero desde 2024 migró a USB-C por regulación europea. Si aún tienes un iPhone 14 o anterior, necesitarás Lightning, pero si piensas actualizar tu celular, USB-C es el futuro definitivo.</p>
<h3>¿Qué cable comprar?</h3>
<p>Nuestra recomendación para 2026: invierte en <strong>cables USB-C de buena calidad</strong> con soporte de carga rápida. Un buen cable de nylon trenzado dura años y funciona con todos tus dispositivos.</p>
<p>🛒 <strong>En TechAuraz</strong> tenemos cables USB-C certificados desde $15.000 COP con <strong>envío gratis</strong> a toda Colombia. <a href="/collections/cables-de-datos-techaura">Ver cables →</a></p>`,
      metafields_global_title_tag: 'USB-C vs Lightning: Guía Comparativa 2026 | TechAuraz',
      metafields_global_description_tag: 'Diferencias entre USB-C y Lightning en 2026. ¿Cuál necesitas? Guía completa con recomendaciones. TechAuraz Colombia.',
    },
    {
      title: 'Top 7 Gadgets para un Setup Gamer Épico en Colombia',
      tags: 'guia, gaming, setup, gadgets, 2026, colombia',
      body_html: `<h2>Arma tu estación de juego definitiva sin romper el banco</h2>
<p>No necesitas gastar millones para tener un <strong>setup gamer</strong> que impresione. Con los accesorios correctos puedes transformar tu espacio en un verdadero centro de entretenimiento.</p>
<h3>1. 🎧 Diadema Gamer con Micrófono RGB</h3>
<p>El audio lo es todo en gaming competitivo. Una buena diadema con <strong>sonido envolvente 7.1</strong> te permite detectar enemigos por el sonido de sus pasos. Busca una con micrófono noise-cancelling para comunicarte con tu equipo.</p>
<h3>2. 🖱️ Mouse Gamer con DPI ajustable</h3>
<p>La precisión importa. Un mouse con <strong>sensor óptico de 12.000 DPI</strong> y botones programables marca la diferencia entre ganar y perder.</p>
<h3>3. ⌨️ Teclado Mecánico RGB</h3>
<p>Nada se compara con la <strong>respuesta táctil de un teclado mecánico</strong>. Las teclas con switches azules son ideales para gaming con su click audible y satisfactorio.</p>
<h3>4. 💡 Cinta LED RGB para tu escritorio</h3>
<p>La iluminación ambiental no es solo estética — <strong>reduce la fatiga visual</strong> durante sesiones largas. Con 16 millones de colores, puedes crear el ambiente perfecto.</p>
<h3>5. 🎙️ Micrófono Condensador USB</h3>
<p>Si haces streaming o grabas contenido, un <strong>micrófono condensador</strong> eleva la calidad de tu audio dramáticamente comparado con el micro de tus audífonos.</p>
<h3>6. 🕹️ Base Refrigerante para Consola</h3>
<p>Tu PS4/PS5 necesita respirar. Una <strong>base con ventiladores</strong> previene sobrecalentamiento y organiza tus controles y juegos.</p>
<h3>7. 🔋 Power Bank 20.000mAh</h3>
<p>Para gaming móvil, un power bank potente te da <strong>horas extra de juego</strong> sin depender de un enchufe.</p>
<p>🎮 Encuentra todos estos accesorios en <strong>TechAuraz</strong> con <strong>envío gratis y pago contra entrega</strong>. <a href="/collections/all">Explorar catálogo gamer →</a></p>`,
      metafields_global_title_tag: 'Top 7 Gadgets Setup Gamer Colombia 2026 | TechAuraz',
      metafields_global_description_tag: 'Los 7 accesorios esenciales para un setup gamer épico en Colombia. Diademas, mouse, teclados, LED y más. Envío gratis.',
    },
    {
      title: 'Smart Home en Colombia: Guía para Principiantes 2026',
      tags: 'guia, smart-home, alexa, inteligente, wifi, 2026',
      body_html: `<h2>Convierte tu casa en un hogar inteligente sin gastar una fortuna</h2>
<p>La <strong>domótica</strong> ya no es cosa del futuro ni de casas de lujo. En 2026, puedes automatizar tu hogar colombiano con productos accesibles que se conectan por WiFi.</p>
<h3>¿Qué es un Smart Home?</h3>
<p>Un hogar inteligente es aquel donde puedes <strong>controlar luces, electrodomésticos y seguridad</strong> desde tu celular o con la voz. Los tres pilares son:</p>
<ul>
<li>📱 <strong>Control remoto</strong> — Enciende/apaga dispositivos desde cualquier lugar</li>
<li>🗓️ <strong>Automatización</strong> — Programa horarios (luces que se encienden a las 6pm)</li>
<li>🗣️ <strong>Control por voz</strong> — "Alexa, apaga la luz de la sala"</li>
</ul>
<h3>Los 3 productos para empezar</h3>
<h4>1. Enchufe WiFi Inteligente (~$25.000 COP)</h4>
<p>El punto de entrada más fácil. <strong>Enchufas tu lámpara o ventilador</strong> y ya puedes controlarlo con tu celular o con Alexa. No requiere instalación eléctrica.</p>
<h4>2. Bombillo LED RGB WiFi (~$18.000 COP)</h4>
<p>Cambia el <strong>color y la intensidad de la luz</strong> desde tu teléfono. Programa que se encienda al amanecer con luz cálida y se ponga en modo "noche" automáticamente.</p>
<h4>3. Cámara de Seguridad WiFi (~$65.000 COP)</h4>
<p>Vigila tu casa desde el trabajo. <strong>Visión nocturna, detección de movimiento</strong> y grabación en la nube. Tranquilidad total.</p>
<h3>¿Qué app usar?</h3>
<p>La mayoría de dispositivos económicos usan la app <strong>Smart Life / Tuya</strong>, que es gratuita y funciona con Alexa y Google Home. Es el estándar en Colombia.</p>
<p>🏠 <strong>En TechAuraz</strong> tenemos todo lo que necesitas para empezar tu smart home con <strong>envío gratis</strong>. <a href="/collections/all">Ver productos smart home →</a></p>`,
      metafields_global_title_tag: 'Smart Home Colombia: Guía para Principiantes 2026 | TechAuraz',
      metafields_global_description_tag: 'Cómo crear un hogar inteligente en Colombia. Enchufes WiFi, bombillos LED, cámaras de seguridad. Guía paso a paso. TechAuraz.',
    },
    {
      title: '¿Por Qué Tu Cable de Carga Se Daña Tan Rápido? 5 Errores Comunes',
      tags: 'guia, cables, cuidado, tips, errores, durabilidad',
      body_html: `<h2>Deja de botar dinero en cables que duran 2 meses</h2>
<p>Si sientes que estás comprando cables nuevos cada dos meses, probablemente estás cometiendo uno de estos <strong>5 errores comunes</strong> que acortan dramáticamente la vida útil de tus cables.</p>
<h3>Error 1: Desconectar jalando el cable (no el conector)</h3>
<p>Este es el asesino #1 de cables. Cuando <strong>jalas el cable en vez del conector</strong>, estresar la unión interna y eventualmente los hilos de cobre se rompen. Siempre agarra firmemente el conector plástico al desconectar.</p>
<h3>Error 2: Doblar el cable en ángulo de 90°</h3>
<p>Cargar tu celular en la cama mientras lo usas crea un <strong>ángulo agudo en la base del conector</strong>. Esto fractura los cables internos. Solución: usa un cable largo (2 metros) para que tenga holgura.</p>
<h3>Error 3: Comprar el cable más barato posible</h3>
<p>Un cable de $5.000 COP en el semáforo tiene <strong>hilos de aluminio en vez de cobre</strong>, sin blindaje y con plástico frágil. Invierte en uno de nylon trenzado — dura 10x más y carga más rápido.</p>
<h3>Error 4: Enrollar el cable apretado</h3>
<p>Enrollar el cable muy apretado o hacer "figuras de 8" <strong>daña el blindaje interno</strong>. Enrolla siempre en círculos amplios y sueltos, como lo hacen los técnicos de audio.</p>
<h3>Error 5: No limpiar el puerto de carga</h3>
<p>El polsillo de tu bolsillo se acumula en el <strong>puerto USB de tu celular</strong>. Esto causa mal contacto y fuerza al cable a estar en posiciones incómodas. Limpia con un palillo de dientes suavemente cada mes.</p>
<h3>La solución definitiva</h3>
<p>Invierte en <strong>cables de nylon trenzado con conectores reforzados</strong>. Cuestan un poco más pero duran años. En TechAuraz todos nuestros cables son de calidad premium con <strong>garantía de 30 días</strong>.</p>
<p>⚡ <a href="/collections/cables-de-datos-techaura">Ver cables premium →</a> | Envío GRATIS a toda Colombia</p>`,
      metafields_global_title_tag: '5 Errores Que Dañan Tu Cable de Carga | Tips TechAuraz',
      metafields_global_description_tag: '¿Tu cable de carga dura solo 2 meses? Estos 5 errores comunes los están destruyendo. Aprende a cuidarlos. Tips TechAuraz.',
    },
    {
      title: 'Audífonos TWS vs Over-Ear: ¿Cuáles Son Mejores Para Ti?',
      tags: 'guia, audifonos, tws, over-ear, comparativa, audio',
      body_html: `<h2>La guía definitiva para elegir tus audífonos ideales</h2>
<p>El mercado de audífonos tiene dos grandes familias: los <strong>TWS (True Wireless Stereo)</strong> compactos que van dentro del oído, y los <strong>Over-Ear</strong> que cubren toda la oreja. Cada uno tiene ventajas claras.</p>
<h3>🎵 Audífonos TWS (Inalámbricos In-Ear)</h3>
<p><strong>Ideales para:</strong> deporte, transporte público, uso diario casual.</p>
<ul>
<li>✅ Ultra portátiles — caben en tu bolsillo</li>
<li>✅ Perfectos para CrossFit, correr y gimnasio</li>
<li>✅ Estuche funciona como cargador portátil</li>
<li>✅ Algunos tienen ANC (cancelación activa de ruido)</li>
<li>❌ Menor duración de batería (4-8h)</li>
<li>❌ Se pueden caer si no ajustan bien</li>
</ul>
<h3>🎧 Audífonos Over-Ear (Tipo Diadema)</h3>
<p><strong>Ideales para:</strong> gaming, producción musical, trabajo en oficina, sesiones largas.</p>
<ul>
<li>✅ Comfort total — almohadillas acolchadas para horas de uso</li>
<li>✅ Mejor calidad de sonido (drivers de 40-50mm)</li>
<li>✅ Mejor ANC que los TWS</li>
<li>✅ Micrófono superior para llamadas y gaming</li>
<li>❌ No son portátiles — ocupan espacio</li>
<li>❌ Dan calor en clima tropical colombiano</li>
</ul>
<h3>Nuestra recomendación</h3>
<p><strong>Si te mueves mucho:</strong> TWS con ANC son tu mejor opción — libertad total de movimiento. <strong>Si juegas o produces:</strong> Over-Ear con micrófono — la experiencia es incomparable.</p>
<p>Lo ideal: <strong>ten uno de cada uno</strong>. Un TWS para la calle y un Over-Ear para casa. En TechAuraz tenemos ambos con <strong>envío gratis y pago contra entrega</strong>.</p>
<p>🎧 <a href="/collections/diademas-gamer-techaura">Ver audífonos →</a></p>`,
      metafields_global_title_tag: 'TWS vs Over-Ear: ¿Qué Audífonos Comprar? Guía 2026 | TechAuraz',
      metafields_global_description_tag: 'Comparativa TWS vs Over-Ear. ¿Cuáles son mejores para ti? Guía completa con recomendaciones por uso. TechAuraz Colombia.',
    },
    {
      title: 'Cómo Proteger Tu Celular: 7 Accesorios Esenciales',
      tags: 'guia, proteccion, celular, accesorios, funda, vidrio-templado',
      body_html: `<h2>Tu celular cuesta entre $1 y $5 millones — protégelo</h2>
<p>Gastaste una fortuna en tu smartphone, pero ¿lo estás protegiendo adecuadamente? Estos <strong>7 accesorios esenciales</strong> pueden salvar tu inversión.</p>
<h3>1. Funda con protección militar</h3>
<p>Las fundas con <strong>certificación militar (MIL-STD-810G)</strong> absorben impactos de hasta 2 metros. Busca fundas con esquinas reforzadas y borde elevado que proteja la pantalla al caer boca abajo.</p>
<h3>2. Vidrio templado 9H</h3>
<p>Un <strong>vidrio templado de dureza 9H</strong> absorbe el impacto en lugar de tu pantalla. Cuesta $10.000 COP pero reemplazar la pantalla cuesta $300.000+.</p>
<h3>3. Soporte para carro</h3>
<p>Usar el celular con la mano mientras conduces es <strong>peligroso e ilegal</strong>. Un soporte magnético para el carro mantiene tu GPS visible sin riesgo.</p>
<h3>4. Cable de carga reforzado</h3>
<p>Un cable de <strong>nylon trenzado</strong> no solo dura más — también evita accidentes donde el cable se rompe y deja tu celular sin carga en el peor momento.</p>
<h3>5. Power bank</h3>
<p>Quedarte sin batería = quedarte sin GPS, sin comunicación, sin todo. Un <strong>power bank de 10.000 mAh</strong> te da 2-3 cargas completas de emergencia.</p>
<h3>6. Bolso antirrobo</h3>
<p>En ciudades colombianas, un <strong>bolso con cierre oculto y correa reforzada</strong> protege tu celular de los amigos de lo ajeno.</p>
<h3>7. Soporte impermeable para moto</h3>
<p>Si andas en moto, un <strong>soporte con funda impermeable</strong> protege tu celular de la lluvia y las vibraciones del motor.</p>
<p>🛡️ Encuentra todos estos accesorios de protección en <strong>TechAuraz</strong> con <strong>envío gratis a toda Colombia</strong>. <a href="/collections/all">Ver accesorios de protección →</a></p>`,
      metafields_global_title_tag: '7 Accesorios Para Proteger Tu Celular | TechAuraz Colombia',
      metafields_global_description_tag: '7 accesorios esenciales para proteger tu smartphone. Fundas, vidrio templado, soportes y más. Envío gratis Colombia. TechAuraz.',
    },
  ];

  let created = 0;
  for (const art of articles) {
    if (titles.has(art.title)) { console.log(`   ⏭️ "${art.title.substring(0, 45)}" exists`); continue; }
    try {
      await api(`blogs/${blogId}/articles.json`, 'POST', { article: { ...art, published: true, author: 'TechAuraz' } });
      console.log(`   ✅ Published: "${art.title.substring(0, 50)}"`);
      created++;
      await sleep(RATE);
    } catch (e) { console.log(`   ⚠️ ${e.message.substring(0, 80)}`); }
  }
  console.log(`\n   📊 Blog articles: ${created} published`);
}

// ===========================================================================
// PHASE 3: PROFESSIONAL PRODUCT DESCRIPTIONS — Expanded templates
// ===========================================================================
async function enhanceDescriptions() {
  console.log('\n' + '═'.repeat(60));
  console.log('📝 PHASE 3: Professional Product Descriptions');
  console.log('═'.repeat(60));

  const data = await api('products.json?limit=250&fields=id,title,body_html,product_type,variants');
  const products = data.products || [];
  let enhanced = 0;

  const WARRANTY = `<hr><h3><strong>🛡️ Garantía TechAuraz</strong></h3>
<p>Todos nuestros productos incluyen:</p>
<ul><li>✅ <strong>30 días de garantía</strong> contra defectos de fabricación</li>
<li>✅ Reenvío sin costo por orden incompleta</li>
<li>✅ Cambio inmediato si el producto es diferente</li>
<li>✅ Reemplazo o reembolso por defectos</li></ul>
<p>📲 <strong><a href="https://wa.me/573008602789">WhatsApp: +57 300 860 2789</a></strong></p>`;

  const FOOTER = `<p>🚚 <strong>Envío GRATIS</strong> a toda Colombia · 💳 <strong>Pago contra entrega</strong> · ✨ <strong>Garantía 30 días</strong></p>`;

  for (const p of products) {
    const html = p.body_html || '';
    // Skip if already has professional description (H2 tags with emojis = our format)
    if (html.includes('<h2>') && html.includes('✅') && html.includes('TechAuraz')) continue;

    const type = (p.product_type || 'Tecnología');
    const price = p.variants?.[0]?.price ? `$${parseInt(p.variants[0].price).toLocaleString('es-CO')} COP` : '';

    // Generate professional description based on product type
    let desc = '';
    const title = p.title;

    if (type.includes('Audio') || title.toLowerCase().includes('parlante') || title.toLowerCase().includes('audifono')) {
      desc = `<h2>🔊 ${title} — Audio de Alta Calidad</h2>
<p>Disfruta una experiencia de sonido inmersiva con el <strong>${title}</strong>. Diseñado para ofrecer graves profundos, medios claros y agudos nítidos, este producto es la elección perfecta para los amantes del buen sonido.</p>
<h3>🔥 Características principales</h3>
<ul>
<li>✅ <strong>Conectividad Bluetooth</strong> — Emparejamiento rápido y estable</li>
<li>✅ <strong>Batería de larga duración</strong> — Horas de música sin interrupción</li>
<li>✅ <strong>Diseño portátil</strong> — Llévalo a donde quieras</li>
<li>✅ <strong>Sonido envolvente</strong> — Drivers optimizados para audio premium</li>
<li>✅ <strong>Compatible</strong> — Funciona con cualquier celular, tablet o PC</li>
</ul>
<h3>📦 Incluye</h3>
<p>${title} + Cable de carga + Manual de usuario</p>`;
    } else if (type.includes('Gaming') || title.toLowerCase().includes('gamer')) {
      desc = `<h2>🎮 ${title} — Equipamiento Gamer Profesional</h2>
<p>Lleva tu juego al siguiente nivel con el <strong>${title}</strong>. Diseñado para gamers que exigen rendimiento, comodidad y estilo en cada partida.</p>
<h3>🔥 Características Pro</h3>
<ul>
<li>✅ <strong>Rendimiento gaming</strong> — Respuesta precisa y rápida</li>
<li>✅ <strong>Iluminación RGB</strong> — Dale estilo a tu setup</li>
<li>✅ <strong>Diseño ergonómico</strong> — Comodidad para sesiones largas</li>
<li>✅ <strong>Compatibilidad total</strong> — PC, PS4, PS5, Xbox, Switch</li>
<li>✅ <strong>Construcción premium</strong> — Materiales duraderos y resistentes</li>
</ul>
<h3>🎯 Ideal para</h3>
<p>Gamers competitivos, streamers y amantes del entretenimiento digital.</p>`;
    } else if (type.includes('Cables') || type.includes('Carga') || title.toLowerCase().includes('power bank') || title.toLowerCase().includes('cargador') || title.toLowerCase().includes('cable')) {
      desc = `<h2>⚡ ${title} — Carga y Conectividad Premium</h2>
<p>No te quedes sin energía. El <strong>${title}</strong> ofrece carga confiable y rápida para mantener todos tus dispositivos funcionando cuando más los necesitas.</p>
<h3>🔥 ¿Por qué elegirlo?</h3>
<ul>
<li>✅ <strong>Carga rápida</strong> — Tecnología optimizada para máxima velocidad</li>
<li>✅ <strong>Construcción resistente</strong> — Materiales premium de larga duración</li>
<li>✅ <strong>Protección inteligente</strong> — Anti-sobrecarga y anti-cortocircuito</li>
<li>✅ <strong>Compatibilidad universal</strong> — iPhone, Samsung, Xiaomi y más</li>
<li>✅ <strong>Compacto</strong> — Diseño práctico para llevar a donde quieras</li>
</ul>`;
    } else if (type.includes('Iluminación') || title.toLowerCase().includes('led') || title.toLowerCase().includes('bombillo') || title.toLowerCase().includes('lampara')) {
      desc = `<h2>💡 ${title} — Iluminación Inteligente</h2>
<p>Transforma cualquier espacio con el <strong>${title}</strong>. Iluminación LED eficiente, colorida y controlable para crear el ambiente perfecto en tu hogar, oficina o setup.</p>
<h3>🔥 Características</h3>
<ul>
<li>✅ <strong>Tecnología LED</strong> — Bajo consumo, alta luminosidad</li>
<li>✅ <strong>Múltiples modos</strong> — Colores, intensidades y efectos</li>
<li>✅ <strong>Fácil instalación</strong> — Plug and play, sin herramientas</li>
<li>✅ <strong>Larga vida útil</strong> — Miles de horas de funcionamiento</li>
<li>✅ <strong>Ahorro energético</strong> — Consume hasta 80% menos que iluminación tradicional</li>
</ul>`;
    } else if (type.includes('Smart Home') || title.toLowerCase().includes('inteligente') || title.toLowerCase().includes('wifi') || title.toLowerCase().includes('camara')) {
      desc = `<h2>🏠 ${title} — Tu Hogar Inteligente</h2>
<p>Dale un upgrade a tu hogar con el <strong>${title}</strong>. Tecnología WiFi que te permite controlar todo desde tu celular o con la voz a través de Alexa y Google Home.</p>
<h3>🔥 Ventajas</h3>
<ul>
<li>✅ <strong>Control remoto</strong> — Maneja todo desde la app en tu celular</li>
<li>✅ <strong>Compatible con Alexa y Google</strong> — Control por voz</li>
<li>✅ <strong>WiFi integrado</strong> — Sin necesidad de hub adicional</li>
<li>✅ <strong>Programación automática</strong> — Crea rutinas y horarios</li>
<li>✅ <strong>Instalación sencilla</strong> — Conecta y configura en minutos</li>
</ul>`;
    } else {
      desc = `<h2>🔥 ${title} — Calidad Premium TechAuraz</h2>
<p>Descubre el <strong>${title}</strong>, un producto seleccionado por el equipo TechAuraz por su excelente relación calidad-precio. Diseñado para satisfacer las necesidades del colombiano moderno.</p>
<h3>✨ Características</h3>
<ul>
<li>✅ <strong>Calidad garantizada</strong> — Producto probado y verificado</li>
<li>✅ <strong>Diseño funcional</strong> — Práctico y fácil de usar</li>
<li>✅ <strong>Materiales premium</strong> — Construido para durar</li>
<li>✅ <strong>Compatible</strong> — Funciona con tus dispositivos favoritos</li>
</ul>`;
    }

    desc += '\n' + FOOTER + '\n' + WARRANTY;

    try {
      await api(`products/${p.id}.json`, 'PUT', { product: { id: p.id, body_html: desc } });
      console.log(`   ✅ ${title.substring(0, 50)}`);
      enhanced++;
      await sleep(RATE);
    } catch (e) { console.log(`   ⚠️ ${title.substring(0, 35)}: ${e.message.substring(0, 60)}`); }
  }

  console.log(`\n   📊 Descriptions: ${enhanced} products enhanced`);
}

// ===========================================================================
// PHASE 4: COLLECTION SEO ENRICHMENT
// ===========================================================================
async function enrichCollections() {
  console.log('\n' + '═'.repeat(60));
  console.log('📁 PHASE 4: Collection Content Enrichment');
  console.log('═'.repeat(60));

  const data = await api('smart_collections.json?limit=250');
  const cols = data.smart_collections || [];
  let enriched = 0;

  const richDescriptions = {
    'diademas-gamer-techaura': `<div class="collection-seo-content">
<h2>🎧 Los Mejores Audífonos y Diademas Gamer en Colombia</h2>
<p>Encuentra la <strong>diadema gamer perfecta</strong> para tu setup. Desde audífonos TWS compactos hasta diademas over-ear con sonido surround 7.1, tenemos opciones para cada gamer y presupuesto.</p>
<p>Todos nuestros audífonos incluyen <strong>envío gratis, pago contra entrega y garantía de 30 días</strong>. ¿No quedaste satisfecho? Te devolvemos tu dinero.</p>
</div>`,
    'cables-de-datos-techaura': `<div class="collection-seo-content">
<h2>⚡ Cables USB-C, Lightning y de Datos — Carga Rápida</h2>
<p>Cables de <strong>nylon trenzado</strong> con soporte de carga rápida. USB-C a USB-C, USB-C a Lightning, USB-A a USB-C — tenemos el cable exacto que necesitas.</p>
<p>Todos nuestros cables soportan <strong>carga rápida y transferencia de datos</strong>. Envío gratis a toda Colombia.</p>
</div>`,
    'carga-energia-techaura': `<div class="collection-seo-content">
<h2>🔋 Power Banks y Cargadores — Nunca Te Quedes Sin Batería</h2>
<p>Power banks de <strong>10.000 a 30.000 mAh</strong>, cargadores de pared con carga rápida y cargadores para carro. La energía que necesitas, donde la necesitas.</p>
<p>Todos los cargadores incluyen <strong>protección inteligente</strong> contra sobrecarga, sobrecalentamiento y cortocircuito.</p>
</div>`,
  };

  for (const col of cols) {
    const richDesc = richDescriptions[col.handle];
    if (richDesc && (!col.body_html || !col.body_html.includes('collection-seo-content'))) {
      try {
        await api(`smart_collections/${col.id}.json`, 'PUT', { smart_collection: { id: col.id, body_html: richDesc } });
        console.log(`   ✅ ${col.title}: enriched`);
        enriched++;
        await sleep(RATE);
      } catch (e) { console.log(`   ⚠️ ${col.title}: ${e.message.substring(0, 60)}`); }
    }
  }

  // Create marketing collections
  const marketingCols = [
    {
      title: 'Regalos Tecnológicos TechAuraz',
      rules: [{ column: 'tag', relation: 'equals', condition: 'regalo' }],
      body_html: '<p>Los mejores <strong>regalos tecnológicos</strong> para sorprender. Envío gratis + empaque listo para regalo.</p>',
      seoTitle: 'Regalos Tecnológicos | Ideas de Regalo Tech | TechAuraz',
      seoDesc: 'Ideas de regalos tecnológicos originales en Colombia. Power banks, audífonos, gadgets. Envío gratis. TechAuraz.',
    },
    {
      title: 'Accesorios para Home Office',
      rules: [{ column: 'tag', relation: 'equals', condition: 'home-office' }],
      body_html: '<p>Todo lo que necesitas para un <strong>home office productivo</strong>. Hubs USB, bases, teclados, micrófonos y más.</p>',
      seoTitle: 'Accesorios Home Office | Trabaja Desde Casa | TechAuraz',
      seoDesc: 'Accesorios esenciales para home office en Colombia. Hubs USB, webcam, micrófono, iluminación. Envío gratis. TechAuraz.',
    },
  ];

  const existing = new Set(cols.map(c => c.title));
  for (const mc of marketingCols) {
    if (existing.has(mc.title)) { console.log(`   ⏭️ "${mc.title}" exists`); continue; }
    try {
      await api('smart_collections.json', 'POST', {
        smart_collection: {
          title: mc.title, rules: mc.rules, body_html: mc.body_html,
          published: true, disjunctive: false,
          metafields_global_title_tag: mc.seoTitle,
          metafields_global_description_tag: mc.seoDesc,
        }
      });
      console.log(`   ✅ Created: ${mc.title}`);
      enriched++;
      await sleep(RATE);
    } catch (e) { console.log(`   ⚠️ ${mc.title}: ${e.message.substring(0, 60)}`); }
  }

  console.log(`\n   📊 Collections: ${enriched} enriched/created`);
}

// ===========================================================================
// PHASE 5: PRODUCT TAGS FOR MARKETING COLLECTIONS
// ===========================================================================
async function addMarketingTags() {
  console.log('\n' + '═'.repeat(60));
  console.log('🏷️ PHASE 5: Marketing Tags for Collections');
  console.log('═'.repeat(60));

  const data = await api('products.json?limit=250&fields=id,title,tags,product_type,variants');
  const products = data.products || [];
  let tagged = 0;

  for (const p of products) {
    const tags = (p.tags || '').split(', ').filter(Boolean);
    const newTags = [...tags];
    let changed = false;
    const lower = p.title.toLowerCase();
    const price = parseFloat(p.variants?.[0]?.price || 0);

    // "regalo" tag for gift-friendly items under $100k
    if (price > 0 && price < 100000 && !tags.includes('regalo')) {
      newTags.push('regalo');
      changed = true;
    }

    // "home-office" tag
    if ((lower.includes('hub') || lower.includes('teclado') || lower.includes('mouse') || lower.includes('microfono') ||
         lower.includes('lampara') || lower.includes('soporte') || lower.includes('base refrigerante')) && !tags.includes('home-office')) {
      newTags.push('home-office');
      changed = true;
    }

    // "bestseller" tag for popular items (mark certain types)
    if ((lower.includes('power bank') || lower.includes('audifono') || lower.includes('cable tipo c') || lower.includes('parlante')) && !tags.includes('bestseller')) {
      newTags.push('bestseller');
      changed = true;
    }

    if (changed) {
      try {
        await api(`products/${p.id}.json`, 'PUT', { product: { id: p.id, tags: newTags.join(', ') } });
        console.log(`   ✅ ${p.title.substring(0, 40)}: +${newTags.filter(t => !tags.includes(t)).join(', ')}`);
        tagged++;
        await sleep(RATE);
      } catch (e) { console.log(`   ⚠️ ${e.message.substring(0, 60)}`); }
    }
  }

  console.log(`\n   📊 Tagged: ${tagged} products`);
}

// ===========================================================================
// MAIN
// ===========================================================================
async function main() {
  console.log('\n' + '🚀'.repeat(30));
  console.log('  TechAuraz — Professional Content & Deployment');
  console.log(`  ${new Date().toISOString()} | API ${API}`);
  if (DRY) console.log('  🏜️  DRY RUN MODE');
  console.log('🚀'.repeat(30));

  if (!TOKEN) { console.error('\n❌ Set SHOPIFY_ADMIN_API_KEY'); process.exit(1); }

  await deployTheme();
  await createBlogContent();
  await enhanceDescriptions();
  await enrichCollections();
  await addMarketingTags();

  console.log('\n\n' + '═'.repeat(60));
  console.log('✨ ALL CONTENT & DEPLOYMENT COMPLETE');
  console.log('═'.repeat(60));
  console.log('🌐 Visit https://techauraz.com to verify\n');
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
