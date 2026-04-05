#!/usr/bin/env node
/**
 * TechAuraz — Phase 2: Deep Content, Branding & SEO Polish
 * ==========================================================
 * 1. Fix remaining branding issues (TechAura → TechAuraz on pages/blog)
 * 2. Create 8 more blog articles for full topical authority
 * 3. Add product comparison content
 * 4. Create custom collections with rich content
 * 5. Fix page SEO titles (contact, policies)
 * 6. Add product tags for gift guide, seasonal, trending
 * 7. Create FAQ page content
 * 8. Optimize image alt text for remaining images
 *
 * Usage:
 *   $env:SHOPIFY_ADMIN_API_KEY="HIDDEN_SECRET_TOKEN"; node scripts/shopify-phase2-polish.mjs
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
// PHASE 1: FIX BRANDING — TechAura → TechAuraz on all pages
// ===========================================================================
async function fixBranding() {
  console.log('\n' + '═'.repeat(60));
  console.log('✏️  PHASE 1: Fix Branding (TechAura → TechAuraz)');
  console.log('═'.repeat(60));

  // Fix pages
  const pagesData = await api('pages.json?limit=50');
  const pages = pagesData.pages || [];
  let fixed = 0;

  for (const page of pages) {
    let needsFix = false;
    let newTitle = page.title;
    let newBody = page.body_html || '';

    // Fix title
    if (newTitle.includes('TechAura') && !newTitle.includes('TechAuraz')) {
      newTitle = newTitle.replace(/TechAura(?!z)/g, 'TechAuraz');
      needsFix = true;
    }

    // Fix body
    if (newBody.includes('TechAura') && !newBody.includes('TechAuraz')) {
      // Only replace standalone TechAura (not already TechAuraz)
      newBody = newBody.replace(/TechAura(?!z)/g, 'TechAuraz');
      needsFix = true;
    }

    if (needsFix) {
      try {
        const payload = { page: { id: page.id, title: newTitle, body_html: newBody } };
        // Also fix SEO title
        const seoTitle = `${newTitle} | TechAuraz Colombia`;
        payload.page.metafields_global_title_tag = seoTitle;
        await api(`pages/${page.id}.json`, 'PUT', payload);
        console.log(`   ✅ Fixed: "${page.title}" → "${newTitle}"`);
        fixed++;
        await sleep(RATE);
      } catch (e) { console.log(`   ⚠️ ${page.title}: ${e.message.substring(0, 60)}`); }
    }
  }

  // Fix blog title
  const blogsData = await api('blogs.json');
  for (const blog of (blogsData.blogs || [])) {
    if (blog.title.includes('TechAura') && !blog.title.includes('TechAuraz')) {
      try {
        await api(`blogs/${blog.id}.json`, 'PUT', { blog: { id: blog.id, title: blog.title.replace(/TechAura(?!z)/g, 'TechAuraz') } });
        console.log(`   ✅ Blog title fixed: "${blog.title}"`);
        fixed++;
        await sleep(RATE);
      } catch (e) { console.log(`   ⚠️ Blog: ${e.message.substring(0, 60)}`); }
    }
  }

  // Fix blog articles
  if (blogsData.blogs?.length) {
    const blogId = blogsData.blogs[0].id;
    const articlesData = await api(`blogs/${blogId}/articles.json?limit=50`);
    for (const art of (articlesData.articles || [])) {
      let needsArtFix = false;
      let artBody = art.body_html || '';
      let artTitle = art.title;
      if (artBody.includes('TechAura') && !artBody.includes('TechAuraz')) {
        artBody = artBody.replace(/TechAura(?!z)/g, 'TechAuraz');
        needsArtFix = true;
      }
      if (artTitle.includes('TechAura') && !artTitle.includes('TechAuraz')) {
        artTitle = artTitle.replace(/TechAura(?!z)/g, 'TechAuraz');
        needsArtFix = true;
      }
      if (needsArtFix) {
        try {
          await api(`blogs/${blogId}/articles/${art.id}.json`, 'PUT', { article: { id: art.id, title: artTitle, body_html: artBody } });
          console.log(`   ✅ Article fixed: "${art.title.substring(0, 40)}"`);
          fixed++;
          await sleep(RATE);
        } catch (e) { console.log(`   ⚠️ ${e.message.substring(0, 60)}`); }
      }
    }
  }

  console.log(`\n   📊 Branding: ${fixed} items fixed`);
}

// ===========================================================================
// PHASE 2: 8 MORE SEO BLOG ARTICLES — Full Topical Authority
// ===========================================================================
async function createMoreBlogContent() {
  console.log('\n' + '═'.repeat(60));
  console.log('📝 PHASE 2: Extended Blog Content (8 new articles)');
  console.log('═'.repeat(60));

  const blogs = await api('blogs.json');
  if (!blogs.blogs?.length) return;
  const blogId = blogs.blogs[0].id;

  const existing = await api(`blogs/${blogId}/articles.json?limit=50&fields=id,title`);
  const titles = new Set((existing.articles || []).map(a => a.title));

  const articles = [
    {
      title: '¿Qué es la Carga Rápida y Cómo Funciona? Guía 2026',
      tags: 'guia, carga-rapida, tecnologia, usb-c, qc, pd, 2026',
      body_html: `<h2>Todo lo que necesitas saber sobre carga rápida en 2026</h2>
<p>La <strong>carga rápida</strong> se ha convertido en una característica esencial de cualquier smartphone moderno. Pero hay tantos estándares (Quick Charge, USB-PD, VOOC, Dart Charge) que es fácil confundirse. Aquí te lo explicamos todo.</p>
<h3>¿Cómo funciona la carga rápida?</h3>
<p>Un cargador normal entrega <strong>5W de potencia</strong> (5V × 1A). La carga rápida aumenta el voltaje y/o el amperaje para entregar entre <strong>18W y 240W</strong>. La negociación ocurre entre el chip del cargador y el chip del celular — si ambos soportan el mismo protocolo, se activa la carga rápida automáticamente.</p>
<h3>Los estándares principales</h3>
<table>
<thead><tr><th>Estándar</th><th>Potencia</th><th>Marcas</th></tr></thead>
<tbody>
<tr><td><strong>USB Power Delivery (USB-PD)</strong></td><td>Hasta 240W</td><td>iPhone 15+, Samsung, Google, laptops</td></tr>
<tr><td><strong>Qualcomm Quick Charge 5</strong></td><td>Hasta 100W</td><td>Samsung, Xiaomi, Motorola</td></tr>
<tr><td><strong>VOOC/Dart Charge</strong></td><td>Hasta 150W</td><td>Oppo, OnePlus, Realme</td></tr>
<tr><td><strong>Samsung Adaptive Fast</strong></td><td>25-45W</td><td>Samsung Galaxy</td></tr>
</tbody></table>
<h3>¿Qué necesitas para cargar rápido?</h3>
<ol>
<li><strong>Un cargador certificado</strong> con la potencia adecuada para tu celular</li>
<li><strong>Un cable de calidad</strong> que soporte la potencia requerida (los cables baratos limitan a 10W)</li>
<li><strong>Compatibilidad</strong> entre cargador y celular en el mismo protocolo</li>
</ol>
<h3>¿La carga rápida daña la batería?</h3>
<p><strong>No, si usas cargadores certificados.</strong> Los celulares modernos tienen circuitos de protección que regulan la carga. Lo que SÍ daña la batería es usar cargadores genéricos sin certificación que envían voltaje inestable.</p>
<p>⚡ En <strong>TechAuraz</strong> todos nuestros cargadores y cables soportan carga rápida certificada. <a href="/collections/carga-energia-techaura">Ver cargadores →</a></p>`,
      metafields_global_title_tag: '¿Qué es la Carga Rápida? Guía Completa 2026 | TechAuraz',
      metafields_global_description_tag: 'Guía completa sobre carga rápida: USB-PD, Quick Charge, VOOC. Cómo funciona y qué necesitas. TechAuraz Colombia.',
    },
    {
      title: 'Los 5 Mejores Regalos Tecnológicos por Menos de $80.000',
      tags: 'guia, regalos, economico, ideas, navidad, cumpleanos',
      body_html: `<h2>Ideas de regalos tech que sorprenden sin vaciar tu bolsillo</h2>
<p>¿Buscas un <strong>regalo original</strong> que no sea la típica camiseta o los chocolates de siempre? La tecnología ofrece opciones increíbles por menos de <strong>$80.000 COP</strong>.</p>
<h3>1. 🔋 Power Bank 10.000mAh (~$35.000)</h3>
<p>El regalo más útil que puedes dar. <strong>Todos</strong> necesitan batería extra. Un power bank de 10.000mAh carga un celular 2 veces y cabe en cualquier bolsillo.</p>
<p><em>Ideal para:</em> viajeros, repartidores, estudiantes, cualquier persona con celular.</p>
<h3>2. 🎧 Audífonos TWS M10 (~$45.000)</h3>
<p>Audífonos Bluetooth con estuche de carga. Sonido claro, batería de 5+ horas y diseño discreto. Un upgrade instantáneo vs los audífonos de cable.</p>
<p><em>Ideal para:</em> jóvenes, deportistas, usuarios de transporte público.</p>
<h3>3. 💡 Cinta LED RGB 5 metros (~$25.000)</h3>
<p>Transforma cualquier habitación en un espacio aesthetic. 16 millones de colores, control remoto y adhesivo 3M. El regalo favorito de TikTokers.</p>
<p><em>Ideal para:</em> adolescentes, gamers, personas que aman la decoración.</p>
<h3>4. 📱 Soporte para celular de moto (~$30.000)</h3>
<p>Para el amigo motociclista: un soporte impermeable con rotación 360° para usar GPS sin riesgo. Práctico y potencialmente salvavidas.</p>
<p><em>Ideal para:</em> motociclistas, ciclistas, repartidores.</p>
<h3>5. ⚡ Cable USB-C premium de 2 metros (~$20.000)</h3>
<p>Suena simple, pero un cable de nylon trenzado de 2 metros con carga rápida es algo que NADIE se compra pero todos necesitan. Los cables baratos se dañan cada mes.</p>
<p><em>Ideal para:</em> literalmente cualquier persona.</p>
<h3>💡 Tip: Pago contra entrega</h3>
<p>En <strong>TechAuraz</strong> puedes comprar sin tarjeta de crédito. Tu amigo <strong>recibe primero, paga después</strong>. Envío GRATIS a toda Colombia.</p>
<p>🎁 <a href="/collections/all">Ver todos los regalos tech →</a></p>`,
      metafields_global_title_tag: '5 Regalos Tecnológicos Baratos (Menos de $80.000) | TechAuraz',
      metafields_global_description_tag: 'Ideas de regalos tecnológicos por menos de $80.000 COP. Power banks, audífonos, LED y más. Envío gratis Colombia.',
    },
    {
      title: 'Pago Contra Entrega en Colombia: Cómo Comprar Seguro Online',
      tags: 'guia, pago-contraentrega, seguridad, colombia, compras-online',
      body_html: `<h2>La forma más segura de comprar online en Colombia</h2>
<p>El <strong>pago contra entrega</strong> es el método favorito de los colombianos para comprar online, y con razón. Te explicamos exactamente cómo funciona y por qué deberías aprovecharlo.</p>
<h3>¿Qué es el pago contra entrega?</h3>
<p>Es simple: <strong>recibes tu producto primero, lo inspeccionas, y DESPUÉS pagas</strong>. Si no estás satisfecho, puedes rechazar el paquete sin costo alguno.</p>
<h3>¿Cómo funciona en TechAuraz?</h3>
<ol>
<li>📱 <strong>Haces tu pedido</strong> por la tienda online o WhatsApp</li>
<li>📦 <strong>Te llega a tu puerta</strong> en 2-5 días hábiles por Servientrega o Interrapidísimo</li>
<li>👀 <strong>Abres y verificas</strong> el producto frente al transportador</li>
<li>💵 <strong>Pagas en efectivo</strong> al transportador (o por Nequi/Daviplata)</li>
</ol>
<h3>¿A toda Colombia?</h3>
<p><strong>Sí.</strong> Enviamos a las 32 departamentos de Colombia. Ciudades principales (Bogotá, Medellín, Cali, Barranquilla) reciben en 2-3 días. Ciudades intermedias en 3-5 días.</p>
<h3>¿Tiene costo adicional?</h3>
<p><strong>No.</strong> En TechAuraz el envío es <strong>100% GRATIS</strong> sin monto mínimo. No hay costos ocultos ni recargos por pago contra entrega.</p>
<h3>¿Y si el producto llega dañado?</h3>
<p>Tienes <strong>30 días de garantía</strong>. Si hay cualquier problema, nos contactas por WhatsApp y lo resolvemos: reenvío, cambio o reembolso.</p>
<p>🛒 <strong><a href="/collections/all">Compra ahora con pago contra entrega →</a></strong> | 📲 <a href="https://wa.me/573008602789">WhatsApp: +57 300 860 2789</a></p>`,
      metafields_global_title_tag: 'Pago Contra Entrega Colombia: Cómo Funciona | TechAuraz',
      metafields_global_description_tag: 'Cómo funciona el pago contra entrega en Colombia. Recibe primero, paga después. Envío gratis a toda Colombia. TechAuraz.',
    },
    {
      title: 'Home Office Productivo: Los Accesorios que Hacen la Diferencia',
      tags: 'guia, home-office, productividad, trabajo-remoto, accesorios',
      body_html: `<h2>Tu productividad depende de tus herramientas</h2>
<p>Trabajar desde casa se convirtió en la norma, pero ¿tu espacio de trabajo está realmente optimizado? Estos accesorios pueden <strong>duplicar tu productividad</strong> y reducir el cansancio.</p>
<h3>🎧 Audífonos con cancelación de ruido</h3>
<p>El ruido de la calle, los vecinos, la construcción. Unos audífonos con <strong>ANC (Active Noise Cancelling)</strong> son la inversión #1 para quienes trabajan desde casa. Te permiten entrar en estado de flujo profundo.</p>
<h3>🎙️ Micrófono USB para videollamadas</h3>
<p>¿Tus compañeros se quejan de que suenas como si hablaras desde un tubo? Un <strong>micrófono condensador USB</strong> transforma la calidad de tus llamadas de Zoom/Meet/Teams. Tu voz se escucha profesional y clara.</p>
<h3>💡 Aro de luz para cámara</h3>
<p>La iluminación es el secreto de verse profesional en cámara. Un <strong>ring light</strong> de escritorio elimina sombras y te hace ver con una calidad tipo estudio de TV.</p>
<h3>⌨️ Hub USB-C multipuerto</h3>
<p>Si tu laptop solo tiene 2 puertos USB-C, estás limitado. Un hub con <strong>HDMI, USB-A, USB-C, lector SD</strong> expande tus opciones. Conecta monitor externo, teclado, mouse y disco externo simultáneamente.</p>
<h3>🔋 Power bank para el café</h3>
<p>¿Trabajas desde cafeterías? Un <strong>power bank de 20.000mAh</strong> te libera de depender de que haya enchufes disponibles. Trabaja desde donde quieras sin ansiedad de batería.</p>
<p>💼 Encuentra todos los accesorios de home office en <strong>TechAuraz</strong>. <a href="/collections/all">Ver accesorios →</a></p>`,
      metafields_global_title_tag: 'Accesorios Home Office Productivo | TechAuraz Colombia',
      metafields_global_description_tag: 'Los mejores accesorios para home office: audífonos ANC, micrófono USB, ring light, hub USB-C. Envío gratis Colombia.',
    },
    {
      title: 'Guía de Parlantes Bluetooth: ¿Cuál Comprar Según Tu Uso?',
      tags: 'guia, parlantes, bluetooth, comparativa, portatil, torre',
      body_html: `<h2>No todos los parlantes Bluetooth son iguales</h2>
<p>Desde el portátil para la ducha hasta la torre para el asado del fin de semana, hay un <strong>parlante bluetooth</strong> para cada momento. Esta guía te ayuda a elegir el correcto.</p>
<h3>🏖️ Parlante portátil (tipo Flip)</h3>
<p><strong>Para quién:</strong> personas que salen mucho — playa, piscina, parque, gimnasio.</p>
<ul>
<li>✅ Cabe en la mochila o en el portavasos del carro</li>
<li>✅ Resistente al agua (IP67 — sumérgelo sin miedo)</li>
<li>✅ 8-12 horas de batería</li>
<li>❌ Volumen limitado para espacios abiertos grandes</li>
</ul>
<p><strong>Precio típico:</strong> $55.000 - $90.000 COP</p>
<h3>🏠 Parlante mediano (tipo barra)</h3>
<p><strong>Para quién:</strong> uso en casa, oficina, reuniones pequeñas.</p>
<ul>
<li>✅ Mejor calidad de sonido que el portátil</li>
<li>✅ Suficiente volumen para una sala</li>
<li>✅ Múltiples entradas (Bluetooth, AUX, USB, tarjeta SD)</li>
<li>❌ No es tan portátil</li>
</ul>
<p><strong>Precio típico:</strong> $70.000 - $120.000 COP</p>
<h3>🎉 Parlante torre (tipo fiesta)</h3>
<p><strong>Para quién:</strong> amantes de la fiesta, karaoke, eventos.</p>
<ul>
<li>✅ Potencia brutal — llena un salón</li>
<li>✅ Luces LED RGB sincronizadas con la música</li>
<li>✅ Entrada de micrófono para karaoke</li>
<li>✅ Control remoto incluido</li>
<li>❌ Pesado y grande, no es portátil</li>
</ul>
<p><strong>Precio típico:</strong> $120.000 - $280.000 COP</p>
<h3>Nuestra recomendación</h3>
<p>Si solo puedes tener uno, el <strong>portátil resistente al agua</strong> es la mejor inversión: lo usas en casa, en la ducha, en el carro y de viaje.</p>
<p>🔊 <a href="/collections/all">Ver todos los parlantes en TechAuraz →</a></p>`,
      metafields_global_title_tag: 'Guía de Parlantes Bluetooth: ¿Cuál Comprar? | TechAuraz',
      metafields_global_description_tag: 'Parlante portátil vs torre vs barra. ¿Cuál comprar? Guía comparativa con precios Colombia. TechAuraz, envío gratis.',
    },
    {
      title: 'Iluminación LED para tu Habitación: Ideas y Tips de Instalación',
      tags: 'guia, iluminacion, led, rgb, decoracion, habitacion, setup, tips',
      body_html: `<h2>Transforma tu espacio con iluminación LED inteligente</h2>
<p>La <strong>iluminación ambiental LED</strong> es la forma más rápida y económica de transformar cualquier habitación. Con cintas LED RGB puedes crear ambientes increíbles para relajarte, trabajar, jugar o simplemente impresionar.</p>
<h3>💡 Ideas de dónde poner tus LEDs</h3>
<ul>
<li>🛏️ <strong>Detrás de la cama</strong> — Crea un halo de luz suave para lectura nocturna</li>
<li>📺 <strong>Detrás del TV</strong> — Reduce fatiga visual y crea el efecto ambilight</li>
<li>🖥️ <strong>Detrás del monitor</strong> — Setup gamer level pro con luz RGB</li>
<li>📚 <strong>Debajo de estantes</strong> — Ilumina tus colecciones y figuras</li>
<li>🪜 <strong>En las escaleras</strong> — Luz de seguridad con estilo</li>
<li>🍳 <strong>Debajo de muebles de cocina</strong> — Iluminación práctica y moderna</li>
</ul>
<h3>🔧 Tips de instalación</h3>
<ol>
<li><strong>Limpia la superficie</strong> — El adhesivo 3M necesita una superficie limpia y seca</li>
<li><strong>Mide antes de cortar</strong> — Las cintas se cortan SOLO por las líneas marcadas (cada 3 LEDs)</li>
<li><strong>No dobles en 90°</strong> — Haz un bucle suave o usa conectores de esquina</li>
<li><strong>Esconde el controlador</strong> — Ponlo detrás del mueble para un look limpio</li>
<li><strong>Usa adhesivo extra</strong> — Si la superficie no es perfecta, refuerza con clips adhesivos</li>
</ol>
<h3>🎨 Los mejores modos de color</h3>
<p><strong>Para relajarse:</strong> Azul suave o morado tenue. <strong>Para trabajar:</strong> Blanco neutro (4000K). <strong>Para gaming:</strong> RGB arcoíris o el color de tu equipo. <strong>Para cine:</strong> Rojo muy tenue o apagado.</p>
<p>💡 En <strong>TechAuraz</strong> tenemos cintas LED de 5 metros con control remoto desde $25.000. <a href="/collections/all">Ver iluminación LED →</a></p>`,
      metafields_global_title_tag: 'Ideas de Iluminación LED para tu Habitación | TechAuraz',
      metafields_global_description_tag: 'Ideas y tips para instalar cintas LED RGB en tu habitación. Decoración gaming, cine y más. Envío gratis Colombia.',
    },
    {
      title: '¿Cómo Saber si un Cargador es Original o Genérico? Guía Práctica',
      tags: 'guia, cargador, original, generico, seguridad, tips',
      body_html: `<h2>No pongas en riesgo tu celular (ni tu seguridad)</h2>
<p>Un cargador genérico de mala calidad no solo carga lento — puede <strong>dañar la batería</strong> de tu celular, sobrecalentar el dispositivo, e incluso representar un <strong>riesgo de incendio</strong>. Aquí te enseñamos a distinguir la calidad.</p>
<h3>🔍 Señales de un cargador de mala calidad</h3>
<ul>
<li>❌ <strong>Peso ultra liviano</strong> — Los componentes de calidad pesan. Si pesa como una pluma, no tiene los componentes de seguridad</li>
<li>❌ <strong>Sin marcas ni certificaciones</strong> — Busca los logos CE, FCC o UL en el cargador</li>
<li>❌ <strong>Plástico que huele raro</strong> — Material reciclado de baja calidad</li>
<li>❌ <strong>El celular se calienta mucho</strong> al cargar — Voltaje inestable</li>
<li>❌ <strong>Carga MUY lento</strong> aunque sea "carga rápida" — Amperaje falso</li>
</ul>
<h3>✅ Señales de un buen cargador</h3>
<ul>
<li>✅ <strong>Peso proporcionado</strong> — Tiene transformador real adentro</li>
<li>✅ <strong>Certificaciones visibles</strong> — CE, FCC, RoHS, o UL</li>
<li>✅ <strong>Protección inteligente</strong> — Anti-sobrecarga, cortocircuito, sobrecalentamiento</li>
<li>✅ <strong>Especificaciones claras</strong> — Voltaje, amperaje y watios claramente impresos</li>
<li>✅ <strong>Garantía del vendedor</strong> — Una tienda seria respalda sus productos</li>
</ul>
<h3>💡 Tip TechAuraz</h3>
<p>No necesitas un cargador "original" de la marca de tu celular (que cuesta 3x más). Un cargador <strong>genérico de buena calidad certificado</strong> funciona igual de bien. La clave está en la certificación, no en la marca.</p>
<p>En <strong>TechAuraz</strong> todos nuestros cargadores tienen protección inteligente y <strong>30 días de garantía</strong>. <a href="/collections/carga-energia-techaura">Ver cargadores certificados →</a></p>`,
      metafields_global_title_tag: 'Cargador Original vs Genérico: Cómo Identificarlos | TechAuraz',
      metafields_global_description_tag: 'Cómo saber si un cargador es de calidad o genérico peligroso. Guía práctica con tips de seguridad. TechAuraz Colombia.',
    },
    {
      title: 'Tendencias Tech 2026: Lo Que Viene en Accesorios y Gadgets',
      tags: 'tendencias, 2026, tecnologia, futuro, gadgets, ia',
      body_html: `<h2>Las tendencias tecnológicas que van a dominar este año</h2>
<p>El mundo tech no se detiene. Estas son las <strong>tendencias más fuertes de 2026</strong> en accesorios y gadgets que ya están llegando a Colombia.</p>
<h3>1. 🔋 Carga inalámbrica Qi2 universal</h3>
<p>El nuevo estándar <strong>Qi2</strong> (con imanes MagSafe) está llegando a todos los Android. Esto significa pads de carga magnéticos universales que funcionan con iPhone Y Android perfectamente alineados.</p>
<h3>2. 🎧 ANC adaptativo con IA</h3>
<p>Los audífonos de 2026 usan <strong>inteligencia artificial</strong> para adaptar la cancelación de ruido en tiempo real. Detectan si estás en el metro, en una oficina o caminando, y ajustan el ANC automáticamente.</p>
<h3>3. 🏠 Smart Home sin hub</h3>
<p>El protocolo <strong>Matter</strong> está eliminando la necesidad de hubs centrales. Los dispositivos inteligentes se comunican directamente entre sí. Un enchufe de cualquier marca funciona con cualquier asistente de voz.</p>
<h3>4. ⚡ USB-C para todo</h3>
<p>2026 marca el año donde <strong>USB-C es verdaderamente universal</strong>. Celulares, laptops, tablets, audífonos, parlantes, controles de consola — todo USB-C. Un cable para todo.</p>
<h3>5. 📱 Wearables de salud</h3>
<p>Los smartwatches de 2026 miden <strong>presión arterial, glucosa y temperatura</strong> con sensores ópticos avanzados. Ya no son solo para contar pasos.</p>
<h3>6. 💡 Iluminación LED reactiva</h3>
<p>Las cintas LED de nueva generación reaccionan al <strong>sonido del TV o la computadora</strong> en tiempo real (como Ambilight pero con cualquier TV).</p>
<h3>¿Cómo prepararte?</h3>
<p>Invierte en <strong>cables y cargadores USB-C de calidad</strong>, son la base de todo. Luego, construye tu ecosistema smart home gradualmente.</p>
<p>🚀 Encuentra todas las tendencias 2026 en <a href="/collections/all"><strong>TechAuraz</strong></a> — envío gratis, pago contra entrega.</p>`,
      metafields_global_title_tag: 'Tendencias Tech 2026: Gadgets y Accesorios | TechAuraz',
      metafields_global_description_tag: 'Las tendencias tecnológicas de 2026: Qi2, ANC con IA, Matter, USB-C universal. Lo que viene en accesorios. TechAuraz.',
    },
  ];

  let created = 0;
  for (const art of articles) {
    if (titles.has(art.title)) { console.log(`   ⏭️ "${art.title.substring(0, 45)}" exists`); continue; }
    try {
      await api(`blogs/${blogId}/articles.json`, 'POST', { article: { ...art, published: true, author: 'TechAuraz' } });
      console.log(`   ✅ "${art.title.substring(0, 50)}"`);
      created++;
      await sleep(RATE);
    } catch (e) { console.log(`   ⚠️ ${e.message.substring(0, 80)}`); }
  }
  console.log(`\n   📊 Blog articles: ${created} published`);
}

// ===========================================================================
// PHASE 3: ENHANCED PRODUCT IMAGE ALT TEXT — Deep pass
// ===========================================================================
async function deepImageAlts() {
  console.log('\n' + '═'.repeat(60));
  console.log('🖼️  PHASE 3: Deep Image Alt Text Optimization');
  console.log('═'.repeat(60));

  const data = await api('products.json?limit=250&fields=id,title,product_type,images');
  let fixed = 0;

  for (const p of (data.products || [])) {
    if (!p.images?.length) continue;
    for (let i = 0; i < p.images.length; i++) {
      const img = p.images[i];
      const goodAlt = i === 0
        ? `${p.title} - Comprar en TechAuraz Colombia con envío gratis`
        : `${p.title} - Vista ${i + 1} - ${p.product_type || 'Tecnología'} TechAuraz`;

      if (img.alt === goodAlt) continue;
      if (img.alt && img.alt.includes('TechAuraz') && img.alt.length > 30) continue;

      try {
        await api(`products/${p.id}/images/${img.id}.json`, 'PUT', { image: { id: img.id, alt: goodAlt.substring(0, 512) } });
        fixed++;
        await sleep(300);
      } catch { /* skip */ }
    }
  }
  console.log(`\n   📊 Image alts: ${fixed} optimized`);
}

// ===========================================================================
// PHASE 4: CUSTOM COLLECTIONS — Seasonal & Thematic
// ===========================================================================
async function createCustomCollections() {
  console.log('\n' + '═'.repeat(60));
  console.log('📁 PHASE 4: Custom Marketing Collections');
  console.log('═'.repeat(60));

  // Check existing
  const smartCols = await api('smart_collections.json?limit=250&fields=id,title');
  const customCols = await api('custom_collections.json?limit=250&fields=id,title');
  const allTitles = new Set([
    ...(smartCols.smart_collections || []).map(c => c.title),
    ...(customCols.custom_collections || []).map(c => c.title),
  ]);

  const newSmartCols = [
    {
      title: 'Lo Más Vendido TechAuraz',
      rules: [{ column: 'tag', relation: 'equals', condition: 'bestseller' }],
      body_html: `<div class="collection-seo-content"><h2>🏆 Los Productos Más Vendidos</h2><p>Descubre los <strong>productos favoritos</strong> de nuestros clientes. Los más vendidos de TechAuraz con envío gratis a toda Colombia.</p></div>`,
      sort_order: 'best-selling',
      seoTitle: 'Lo Más Vendido | Productos Populares | TechAuraz Colombia',
      seoDesc: 'Los productos tecnológicos más vendidos en Colombia. Audífonos, cables, power banks y más. Envío gratis. TechAuraz.',
    },
    {
      title: 'Ofertas TechAuraz',
      rules: [{ column: 'variant_compare_at_price', relation: 'is_not_empty', condition: '' }],
      body_html: `<div class="collection-seo-content"><h2>🔥 Ofertas y Descuentos</h2><p>Aprovecha los <strong>mejores precios</strong> en tecnología. Productos con descuento, envío gratis y pago contra entrega.</p></div>`,
      sort_order: 'price-ascending',
      seoTitle: 'Ofertas Tech con Envío Gratis | TechAuraz Colombia',
      seoDesc: 'Ofertas y descuentos en tecnología. Power banks, cables, audífonos con hasta 25% OFF. Envío gratis Colombia.',
    },
    {
      title: 'Novedades TechAuraz',
      rules: [{ column: 'created_at', relation: 'less_than', condition: '30' }],
      body_html: `<div class="collection-seo-content"><h2>🆕 Recién Llegados</h2><p>Los <strong>últimos productos</strong> que llegaron a TechAuraz. Descubre las novedades antes que nadie.</p></div>`,
      sort_order: 'created-descending',
      seoTitle: 'Novedades y Nuevos Productos | TechAuraz Colombia',
      seoDesc: 'Los productos más nuevos en TechAuraz. Tecnología recién llegada con envío gratis a toda Colombia.',
    },
  ];

  let created = 0;
  for (const col of newSmartCols) {
    if (allTitles.has(col.title)) { console.log(`   ⏭️ "${col.title}" exists`); continue; }
    try {
      const { seoTitle, seoDesc, ...rest } = col;
      await api('smart_collections.json', 'POST', {
        smart_collection: {
          ...rest, published: true, disjunctive: false,
          metafields_global_title_tag: seoTitle,
          metafields_global_description_tag: seoDesc,
        }
      });
      console.log(`   ✅ Created: "${col.title}"`);
      created++;
      await sleep(RATE);
    } catch (e) { console.log(`   ⚠️ ${col.title}: ${e.message.substring(0, 60)}`); }
  }

  console.log(`\n   📊 Collections: ${created} created`);
}

// ===========================================================================
// PHASE 5: ENHANCED PAGE CONTENT — Contact, About, FAQ
// ===========================================================================
async function enhancePages() {
  console.log('\n' + '═'.repeat(60));
  console.log('📄 PHASE 5: Enhanced Page Content');
  console.log('═'.repeat(60));

  const pagesData = await api('pages.json?limit=50');
  const pages = pagesData.pages || [];
  let updated = 0;

  const pageEnhancements = {
    'contacto-techaura': {
      title: 'Contacto TechAuraz | Soporte y Atención',
      body_html: `<div class="contact-page">
<h1>📲 Contacto TechAuraz</h1>
<p>¿Tienes preguntas sobre tu pedido? ¿Necesitas ayuda para elegir el producto perfecto? Estamos aquí para ayudarte.</p>

<h2>💬 WhatsApp (Respuesta rápida)</h2>
<p>Nuestro canal principal de atención. Respuesta en menos de 2 horas en horario laboral.</p>
<p><strong><a href="https://wa.me/573008602789">📱 +57 300 860 2789</a></strong></p>
<p>Horario: Lunes a Viernes 8:00 AM - 6:00 PM | Sábados 9:00 AM - 1:00 PM</p>

<h2>📧 Correo Electrónico</h2>
<p>Para consultas formales, garantías o reclamos.</p>
<p><strong>soporte@techauraz.com</strong></p>

<h2>🏢 Información de la Empresa</h2>
<ul>
<li><strong>Razón social:</strong> TechAuraz</li>
<li><strong>País:</strong> Colombia 🇨🇴</li>
<li><strong>Envíos:</strong> A todo el territorio nacional</li>
<li><strong>Métodos de pago:</strong> Contra entrega (efectivo, Nequi, Daviplata)</li>
</ul>

<h2>❓ Preguntas Frecuentes</h2>
<details><summary><strong>¿Cuánto demora el envío?</strong></summary>
<p>2-3 días hábiles en ciudades principales. 3-5 días en ciudades intermedias.</p></details>

<details><summary><strong>¿El envío tiene costo?</strong></summary>
<p>No. El envío es 100% GRATIS a toda Colombia, sin monto mínimo.</p></details>

<details><summary><strong>¿Cómo funciona el pago contra entrega?</strong></summary>
<p>Recibes el producto, lo verificas y pagas al transportador en efectivo, Nequi o Daviplata.</p></details>

<details><summary><strong>¿Tienen garantía?</strong></summary>
<p>Sí. Todos los productos tienen 30 días de garantía contra defectos de fabricación.</p></details>

<details><summary><strong>¿Puedo devolver un producto?</strong></summary>
<p>Sí. Si el producto tiene algún defecto o es diferente al que pediste, lo cambiamos o reembolsamos.</p></details>
</div>`,
      seoTitle: 'Contacto TechAuraz | WhatsApp +57 300 860 2789 | Soporte',
      seoDesc: 'Contáctanos por WhatsApp +57 300 860 2789. Soporte rápido para pedidos, garantías y consultas. TechAuraz Colombia.',
    },
  };

  for (const page of pages) {
    const enhancement = pageEnhancements[page.handle];
    if (enhancement) {
      try {
        await api(`pages/${page.id}.json`, 'PUT', {
          page: {
            id: page.id,
            title: enhancement.title,
            body_html: enhancement.body_html,
            metafields_global_title_tag: enhancement.seoTitle,
            metafields_global_description_tag: enhancement.seoDesc,
          }
        });
        console.log(`   ✅ Enhanced: "${enhancement.title}"`);
        updated++;
        await sleep(RATE);
      } catch (e) { console.log(`   ⚠️ ${e.message.substring(0, 60)}`); }
    }
  }

  console.log(`\n   📊 Pages: ${updated} enhanced`);
}

// ===========================================================================
// MAIN
// ===========================================================================
async function main() {
  console.log('\n' + '✨'.repeat(30));
  console.log('  TechAuraz — Phase 2: Deep Content & Branding Polish');
  console.log(`  ${new Date().toISOString()} | API ${API}`);
  if (DRY) console.log('  🏜️  DRY RUN MODE');
  console.log('✨'.repeat(30));

  if (!TOKEN) { console.error('\n❌ Set SHOPIFY_ADMIN_API_KEY'); process.exit(1); }

  await fixBranding();
  await createMoreBlogContent();
  await deepImageAlts();
  await createCustomCollections();
  await enhancePages();

  console.log('\n\n' + '═'.repeat(60));
  console.log('✨ PHASE 2 COMPLETE — All content polished');
  console.log('═'.repeat(60));
  console.log('🌐 Visit https://techauraz.com to verify\n');
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
