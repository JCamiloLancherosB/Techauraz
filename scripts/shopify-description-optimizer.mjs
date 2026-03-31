#!/usr/bin/env node
/**
 * TechAuraz — Product Description Optimizer
 * ==========================================
 * Upgrades all product descriptions with persuasive, conversion-focused
 * e-commerce copy. Also fixes remaining product_type misclassifications.
 * 
 * Run: $env:SHOPIFY_ACCESS_TOKEN="shpat_xxx"; node scripts/shopify-description-optimizer.mjs
 */

const CONFIG = {
  SHOP: '7f4c40-fb.myshopify.com',
  ACCESS_TOKEN: process.env.SHOPIFY_ACCESS_TOKEN || '',
  API_VERSION: '2024-10',
  RATE_LIMIT_MS: 600,
};

// ============================================
// SHOPIFY API
// ============================================
async function shopifyFetch(endpoint, method = 'GET', body = null) {
  const url = `https://${CONFIG.SHOP}/admin/api/${CONFIG.API_VERSION}/${endpoint}`;
  const opts = {
    method,
    headers: { 'X-Shopify-Access-Token': CONFIG.ACCESS_TOKEN, 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`API ${res.status}: ${(await res.text()).substring(0, 200)}`);
  return res.json();
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ============================================
// PRODUCT-SPECIFIC DESCRIPTIONS
// ============================================
const DESCRIPTIONS = {
  // --- AUDIO ---
  'audifonos inalambricos anc': {
    type: 'Audio',
    tags: 'audifonos, inalambricos, anc, cancelacion-ruido, bluetooth, audio',
    html: `
<h2>🎧 Audífonos Inalámbricos ANC con Pantalla Táctil</h2>
<p><strong>Sumérgete en un mundo de sonido puro.</strong> Estos audífonos TWS cuentan con <strong>cancelación activa de ruido (ANC)</strong> que elimina el ruido exterior para que disfrutes tu música, podcasts y llamadas con una claridad impresionante.</p>
<h3>🔥 ¿Por qué elegirlos?</h3>
<ul>
  <li>✅ <strong>ANC Real</strong> — Cancelación activa de ruido para aislamiento total</li>
  <li>✅ <strong>Pantalla LED táctil</strong> — Muestra batería restante con precisión</li>
  <li>✅ <strong>Bluetooth 5.3</strong> — Conexión instantánea y estable hasta 10m</li>
  <li>✅ <strong>Batería extendida</strong> — Hasta 6h continuas + 30h con estuche</li>
  <li>✅ <strong>Impermeables IPX5</strong> — Úsalos bajo la lluvia o entrenando</li>
  <li>✅ <strong>Sonido Hi-Fi</strong> — Drivers de 13mm para graves profundos</li>
</ul>
<h3>📦 Incluye</h3>
<p>Audífonos + Estuche de carga + Cable USB-C + 3 pares de almohadillas + Manual</p>
<p>🚚 <strong>Envío GRATIS</strong> a toda Colombia · 💳 <strong>Pago contra entrega</strong> · ✨ <strong>Garantía 30 días</strong></p>`
  },

  'audifonos inalambricos m10': {
    type: 'Audio',
    tags: 'audifonos, inalambricos, m10, bluetooth, tws, audio',
    html: `
<h2>🎵 Audífonos Inalámbricos M10 – Sonido Premium TWS</h2>
<p>Los audífonos <strong>M10</strong> ofrecen la combinación perfecta de <strong>calidad de sonido, comodidad y duración de batería</strong>. Diseñados para personas que exigen lo mejor sin pagar de más.</p>
<h3>🔥 Características</h3>
<ul>
  <li>✅ <strong>Sonido estéreo Hi-Fi</strong> — Drivers de alta fidelidad para música envolvente</li>
  <li>✅ <strong>Bluetooth 5.1</strong> — Emparejamiento automático al abrir el estuche</li>
  <li>✅ <strong>Control táctil</strong> — Reproduce, pausa y contesta sin tocar el celular</li>
  <li>✅ <strong>Estuche powerbank</strong> — Hasta 25h de reprodución total con carga</li>
  <li>✅ <strong>Micrófono dual</strong> — Llamadas claras con reducción de viento</li>
  <li>✅ <strong>Diseño ergonómico</strong> — Se ajustan perfectamente y no se caen</li>
</ul>
<h3>🎯 Ideal para</h3>
<p>Deportistas, profesionales en movimiento, gamers móviles y amantes del buen sonido.</p>
<p>🚚 <strong>Envío GRATIS</strong> a toda Colombia · 💳 <strong>Pago contra entrega</strong> · ✨ <strong>Garantía 30 días</strong></p>`
  },

  'parlante flip': {
    type: 'Audio',
    tags: 'parlante, bluetooth, flip, portatil, audio, resistente-agua',
    html: `
<h2>🔊 Parlante FLIP6 – Sonido Poderoso y Portátil</h2>
<p>Lleva la <strong>fiesta a donde quieras</strong>. Este parlante Bluetooth ofrece un sonido potente, graves profundos y una construcción resistente al agua que lo hace perfecto para la playa, la piscina o el parque.</p>
<h3>🔥 ¿Por qué es el favorito?</h3>
<ul>
  <li>✅ <strong>Sonido 360°</strong> — Llena cualquier espacio con audio envolvente</li>
  <li>✅ <strong>Resistente al agua IP67</strong> — Sumérgelo sin miedo</li>
  <li>✅ <strong>12 horas de batería</strong> — Un día completo de música</li>
  <li>✅ <strong>PartyBoost</strong> — Conecta múltiples parlantes para mega sonido</li>
  <li>✅ <strong>Portátil y ligero</strong> — Cabe en tu mochila o en el portavasos</li>
</ul>
<p>🚚 <strong>Envío GRATIS</strong> · 💳 <strong>Pago contra entrega</strong> · ✨ <strong>Garantía 30 días</strong></p>`
  },

  'parlante torre': {
    type: 'Audio',
    tags: 'parlante, torre, bluetooth, audio, fiesta, karaoke',
    html: `
<h2>🎶 Parlante Torre Bluetooth – La Fiesta En Tu Casa</h2>
<p>¿Quieres que tu sala se convierta en una discoteca? Este <strong>parlante torre</strong> tiene luces LED RGB, conectividad Bluetooth, y un sonido que llena cualquier espacio.</p>
<h3>🔥 Incluye</h3>
<ul>
  <li>✅ <strong>Sonido potente</strong> — Bocinas de alta potencia con subwoofer integrado</li>
  <li>✅ <strong>Luces LED multicolor</strong> — Se sincronizan con la música</li>
  <li>✅ <strong>Karaoke listo</strong> — Entrada para micrófono incluida</li>
  <li>✅ <strong>Múltiples entradas</strong> — Bluetooth, USB, AUX, tarjeta TF, FM</li>
  <li>✅ <strong>Control remoto</strong> — Maneja todo desde tu sofá</li>
</ul>
<p>🚚 <strong>Envío GRATIS</strong> · 💳 <strong>Pago contra entrega</strong> · ✨ <strong>Garantía 30 días</strong></p>`
  },

  // --- GAMING ---
  'diadema alambrica gamer': {
    type: 'Gaming',
    tags: 'diadema, gamer, audifonos, gaming, rgb, microfono',
    html: `
<h2>🎮 Diadema Gamer con Micrófono RGB</h2>
<p>Domina cada partida con <strong>sonido envolvente 7.1 virtual</strong> y un micrófono con cancelación de ruido que hace que tu equipo te escuche con claridad total.</p>
<h3>🔥 Diseñada para Ganar</h3>
<ul>
  <li>✅ <strong>Sonido surround 7.1</strong> — Detecta enemigos por el sonido de sus pasos</li>
  <li>✅ <strong>Micrófono retráctil</strong> — Cancelación de ruido para comunicación clara</li>
  <li>✅ <strong>Iluminación RGB</strong> — Dale estilo a tu setup</li>
  <li>✅ <strong>Almohadillas suaves</strong> — Diseño over-ear para sesiones largas sin fatiga</li>
  <li>✅ <strong>Compatible</strong> — PC, PS4, PS5, Xbox, Switch, celular</li>
</ul>
<p>🚚 <strong>Envío GRATIS</strong> · 💳 <strong>Pago contra entrega</strong> · ✨ <strong>Garantía 30 días</strong></p>`
  },

  'base refrigerante para ps4': {
    type: 'Gaming & PC',
    tags: 'base, ps4, playstation, ventilador, refrigerante, gaming',
    html: `
<h2>🕹️ Base Refrigerante para PS4 – Protege tu Consola</h2>
<p>Mantén tu PlayStation 4 <strong>fría y organizada</strong>. Esta base multifuncional enfría, carga y organiza todos tus controles y juegos en un solo lugar.</p>
<h3>🔥 Todo en Uno</h3>
<ul>
  <li>✅ <strong>Ventiladores silenciosos</strong> — Previene sobrecalentamiento y extiende la vida de tu consola</li>
  <li>✅ <strong>Carga dual</strong> — Carga 2 controles simultáneamente</li>
  <li>✅ <strong>Hub USB integrado</strong> — Puertos adicionales para teclado y mouse</li>
  <li>✅ <strong>Almacenamiento</strong> — Soporte para 12 discos de juegos</li>
  <li>✅ <strong>LED indicador</strong> — Estado de carga visible</li>
</ul>
<p>🚚 <strong>Envío GRATIS</strong> · 💳 <strong>Pago contra entrega</strong> · ✨ <strong>Garantía 30 días</strong></p>`
  },

  'base refrigerante para ps5': {
    type: 'Gaming & PC',
    tags: 'base, ps5, playstation, ventilador, refrigerante, gaming',
    html: `
<h2>🕹️ Base Refrigerante para PS5 – El Setup Definitivo</h2>
<p>Tu PS5 merece el mejor cuidado. Esta <strong>base multifuncional</strong> mantiene tu consola ventilada, carga tus controles y organiza tu espacio gaming como un profesional.</p>
<h3>🔥 Características Pro</h3>
<ul>
  <li>✅ <strong>3 niveles de ventilación</strong> — Silenciosa y efectiva contra el sobrecalentamiento</li>
  <li>✅ <strong>Carga dual DualSense</strong> — Tus controles siempre listos para jugar</li>
  <li>✅ <strong>12 slots para juegos</strong> — Tus discos organizados y accesibles</li>
  <li>✅ <strong>Compatible PS5 Disc y Digital</strong> — Funciona con ambas versiones</li>
  <li>✅ <strong>Indicadores LED</strong> — Estado de carga en tiempo real</li>
</ul>
<p>🚚 <strong>Envío GRATIS</strong> · 💳 <strong>Pago contra entrega</strong> · ✨ <strong>Garantía 30 días</strong></p>`
  },

  // --- CABLES & CARGA ---
  'power bank 20': {
    type: 'Cables & Carga',
    tags: 'power-bank, bateria, portatil, carga, 20000mah, carga-rapida',
    html: `
<h2>🔋 Power Bank 20.000 mAh – Nunca Te Quedes Sin Batería</h2>
<p>Con <strong>20.000 mAh</strong> de capacidad, este power bank carga tu celular hasta <strong>4 veces completas</strong>. Perfecto para viajes, trabajo y emergencias.</p>
<h3>🔥 ¿Por qué lo necesitas?</h3>
<ul>
  <li>✅ <strong>20.000 mAh reales</strong> — Hasta 4 cargas completas de celular</li>
  <li>✅ <strong>Carga rápida</strong> — Recarga tu celular a máxima velocidad</li>
  <li>✅ <strong>2 puertos USB</strong> — Carga 2 dispositivos al mismo tiempo</li>
  <li>✅ <strong>Display LED</strong> — Muestra el porcentaje exacto de batería</li>
  <li>✅ <strong>Compacto y liviano</strong> — Cabe en tu bolsillo o morral</li>
</ul>
<p>🎯 <strong>Ideal para:</strong> Viajeros, repartidores, estudiantes, profesionales en movimiento.</p>
<p>🚚 <strong>Envío GRATIS</strong> · 💳 <strong>Pago contra entrega</strong> · ✨ <strong>Garantía 30 días</strong></p>`
  },

  'cargador para carro': {
    type: 'Cables & Carga',
    tags: 'cargador, carro, vehiculo, carga-rapida, usb',
    html: `
<h2>🚗 Cargador para Carro – Carga Rápida en el Camino</h2>
<p>No más llegar con el celular muerto. Este cargador para vehículo ofrece <strong>carga rápida</strong> para que tu teléfono esté listo cuando más lo necesitas — navegación GPS, llamadas, Spotify.</p>
<h3>🔥 Ventajas</h3>
<ul>
  <li>✅ <strong>Carga Ultra Rápida</strong> — Tecnología QC para cargar a máxima velocidad</li>
  <li>✅ <strong>Puertos duales</strong> — Carga 2 dispositivos simultáneamente</li>
  <li>✅ <strong>Protección inteligente</strong> — Anti-cortocircuito, anti-sobre carga y anti-sobrecalentamiento</li>
  <li>✅ <strong>Compacto</strong> — Diseño minimalista que no estorba</li>
  <li>✅ <strong>Universal</strong> — Compatible con cualquier celular y tablet</li>
</ul>
<p>🚚 <strong>Envío GRATIS</strong> · 💳 <strong>Pago contra entrega</strong> · ✨ <strong>Garantía 30 días</strong></p>`
  },

  'cable tipo c a tipo c': {
    type: 'Cables & Carga',
    tags: 'cable, tipo-c, usb-c, carga-rapida, datos',
    html: `
<h2>⚡ Cable USB-C a USB-C – Carga Rápida y Transferencia</h2>
<p>Un cable <strong>resistente y confiable</strong> que soporta carga rápida de alta potencia y transferencia de datos a máxima velocidad. Compatible con todos tus dispositivos USB-C.</p>
<h3>🔥 Calidad que se siente</h3>
<ul>
  <li>✅ <strong>Carga rápida</strong> — Soporta hasta 60W+ de potencia</li>
  <li>✅ <strong>Transferencia de datos</strong> — Sincroniza archivos a alta velocidad</li>
  <li>✅ <strong>Cable reforzado</strong> — Nylon trenzado anti-enredos y resistente a dobleces</li>
  <li>✅ <strong>Conector premium</strong> — Conectores chapados para mejor conductividad</li>
  <li>✅ <strong>Universal</strong> — Samsung, iPhone 15+, iPad, laptop, tablet</li>
</ul>
<p>🚚 <strong>Envío GRATIS</strong> · 💳 <strong>Pago contra entrega</strong> · ✨ <strong>Garantía 30 días</strong></p>`
  },

  // --- SMART HOME ---
  'enchufe': {
    type: 'Smart Home',
    tags: 'smart-home, enchufe, inteligente, wifi, alexa, google-home',
    html: `
<h2>🏠 Enchufe Inteligente WiFi – Controla Todo Desde Tu Celular</h2>
<p>Convierte cualquier electrodoméstico en <strong>inteligente</strong>. Prende y apaga luces, ventiladores y más desde tu celular o con comandos de voz a Alexa y Google Home.</p>
<h3>🔥 ¿Por qué necesitas uno?</h3>
<ul>
  <li>✅ <strong>Control por voz</strong> — Funciona con Alexa y Google Home</li>
  <li>✅ <strong>App Smart Life</strong> — Enciende/apaga desde cualquier lugar del mundo</li>
  <li>✅ <strong>Programación</strong> — Crea horarios automáticos (prende a las 7am, apaga a las 10pm)</li>
  <li>✅ <strong>Temporizador</strong> — Apaga dispositivos automáticamente</li>
  <li>✅ <strong>Fácil instalación</strong> — Solo enchufar y conectar al WiFi, 0 instalaciones eléctricas</li>
</ul>
<p>🚚 <strong>Envío GRATIS</strong> · 💳 <strong>Pago contra entrega</strong> · ✨ <strong>Garantía 30 días</strong></p>`
  },

  // --- ACCESSORIES ---
  'gimbal': {
    type: 'Accesorios',
    tags: 'gimbal, estabilizador, selfie, tripode, foto, video, tiktok',
    html: `
<h2>📱 Gimbal Estabilizador Q08 – Videos Profesionales</h2>
<p>Crea contenido de <strong>nivel profesional</strong> con este estabilizador gimbal. Anti-vibración, seguimiento facial automático y control bluetooth para TikTok, Instagram Reels y YouTube.</p>
<h3>🔥 Para Creadores de Contenido</h3>
<ul>
  <li>✅ <strong>Estabilización anti-temblor</strong> — Videos fluidos y profesionales</li>
  <li>✅ <strong>Seguimiento facial</strong> — La cámara te sigue automáticamente</li>
  <li>✅ <strong>360° rotación</strong> — Captura desde cualquier ángulo</li>
  <li>✅ <strong>Trípode integrado</strong> — Se sostiene solo para fotos grupales</li>
  <li>✅ <strong>Plegable y portátil</strong> — Cabe en tu bolso o mochila</li>
  <li>✅ <strong>Control Bluetooth</strong> — Dispara fotos y graba sin tocar el celular</li>
</ul>
<p>🚚 <strong>Envío GRATIS</strong> · 💳 <strong>Pago contra entrega</strong> · ✨ <strong>Garantía 30 días</strong></p>`
  },

  'soporte de telefono para moto': {
    type: 'Accesorios Moto',
    tags: 'soporte, moto, bicicleta, telefono, gps, impermeable',
    html: `
<h2>🏍️ Soporte para Celular de Moto – Impermeable y Antivibración</h2>
<p>Navega con GPS sin preocupaciones. Este soporte mantiene tu celular <strong>seguro, visible y protegido de la lluvia</strong> mientras conduces.</p>
<h3>🔥 Diseñado para Motociclistas</h3>
<ul>
  <li>✅ <strong>Protección contra lluvia</strong> — Funda impermeable incluida</li>
  <li>✅ <strong>Anti-vibración</strong> — Tu celular no se cae ni con baches</li>
  <li>✅ <strong>Rotación 360°</strong> — Ajusta el ángulo perfecto</li>
  <li>✅ <strong>Pantalla táctil</strong> — Usa el celular sin sacarlo de la funda</li>
  <li>✅ <strong>Instalación universal</strong> — Compatible con motos y bicicletas</li>
</ul>
<p>🚚 <strong>Envío GRATIS</strong> · 💳 <strong>Pago contra entrega</strong> · ✨ <strong>Garantía 30 días</strong></p>`
  },

  'microfono condensador': {
    type: 'Audio & Streaming',
    tags: 'microfono, condensador, usb, streaming, podcast, gaming, rgb',
    html: `
<h2>🎙️ Micrófono Condensador USB – Audio Profesional</h2>
<p>Calidad de estudio sin complicaciones. Este micrófono USB se conecta directamente a tu PC y ofrece <strong>sonido cristalino</strong> para streaming, podcasts, clases online y gaming.</p>
<h3>🔥 Audio de Nivel Profesional</h3>
<ul>
  <li>✅ <strong>Condensador cardioide</strong> — Captura tu voz con claridad, ignora el ruido de fondo</li>
  <li>✅ <strong>Plug and Play USB</strong> — Conecta y funciona, sin drivers</li>
  <li>✅ <strong>Iluminación RGB</strong> — Dale estilo a tu setup de streaming</li>
  <li>✅ <strong>Soporte ajustable</strong> — Trípode con altura regulable incluido</li>
  <li>✅ <strong>Compatible</strong> — Windows, Mac, PS4, PS5</li>
</ul>
<p>🎯 <strong>Ideal para:</strong> Gamers, streamers, podcasters, clases virtuales, home office.</p>
<p>🚚 <strong>Envío GRATIS</strong> · 💳 <strong>Pago contra entrega</strong> · ✨ <strong>Garantía 30 días</strong></p>`
  },

  'mini aspiradora': {
    type: 'Hogar & Oficina',
    tags: 'aspiradora, mini, portatil, usb, teclado, escritorio, limpieza',
    html: `
<h2>🧹 Mini Aspiradora Portátil USB – Limpieza Express</h2>
<p>Mantén tu escritorio, teclado y carro <strong>impecable</strong> con esta práctica mini aspiradora USB. Compacta, potente y recargable.</p>
<h3>🔥 Pequeña pero Poderosa</h3>
<ul>
  <li>✅ <strong>Succión potente</strong> — Elimina polvo, migas y partículas pequeñas</li>
  <li>✅ <strong>Recargable USB</strong> — Sin cables, sin pilas</li>
  <li>✅ <strong>Ultra compacta</strong> — Cabe en tu cajón o maletín</li>
  <li>✅ <strong>Múltiples boquillas</strong> — Para teclados, ranuras y superficies</li>
  <li>✅ <strong>Silenciosa</strong> — Úsala en la oficina sin molestar</li>
</ul>
<p>🚚 <strong>Envío GRATIS</strong> · 💳 <strong>Pago contra entrega</strong> · ✨ <strong>Garantía 30 días</strong></p>`
  },

  // --- ILUMINACIÓN ---
  'cinta led': {
    type: 'Iluminación',
    tags: 'cinta-led, rgb, iluminacion, decoracion, habitacion, setup',
    html: `
<h2>💡 Cinta LED RGB 5 Metros – Transforma tu Espacio</h2>
<p>Dale vida a tu habitación, setup gamer o sala con <strong>5 metros de iluminación LED RGB</strong>. 16 millones de colores, múltiples modos y control remoto incluido.</p>
<h3>🔥 Crea el Ambiente Perfecto</h3>
<ul>
  <li>✅ <strong>16M+ colores</strong> — Personaliza tu espacio con el color que quieras</li>
  <li>✅ <strong>Múltiples modos</strong> — Fijo, respiración, música, arcoíris</li>
  <li>✅ <strong>5 metros</strong> — Cubre paredes, escritorio, cama o TV completa</li>
  <li>✅ <strong>Control remoto</strong> — Cambia colores y modos desde el sofá</li>
  <li>✅ <strong>Adhesivo 3M</strong> — Se pega fácil en cualquier superficie</li>
  <li>✅ <strong>Cortable</strong> — Ajusta la longitud a tu medida</li>
</ul>
<p>🚚 <strong>Envío GRATIS</strong> · 💳 <strong>Pago contra entrega</strong> · ✨ <strong>Garantía 30 días</strong></p>`
  },

  'bombillo rgb': {
    type: 'Iluminación',
    tags: 'bombillo, led, rgb, iluminacion, inteligente, decoracion',
    html: `
<h2>💡 Bombillo LED RGB + Blanco – 4 Aspectos de Luz</h2>
<p>Un solo bombillo, <strong>4 modos de iluminación</strong>: blanco frío, blanco cálido, RGB multicolor y efecto disco. Controla todo con el control remoto incluido.</p>
<h3>🔥 Iluminación Inteligente</h3>
<ul>
  <li>✅ <strong>4 modos</strong> — Blanco frío, blanco cálido, RGB, efecto fiesta</li>
  <li>✅ <strong>Control remoto</strong> — Cambia color, brillo y modo a distancia</li>
  <li>✅ <strong>Ahorro energético LED</strong> — Consume menos que un bombillo tradicional</li>
  <li>✅ <strong>Rosca estándar E27</strong> — Compatible con cualquier lámpara</li>
  <li>✅ <strong>Larga duración</strong> — Más de 50.000 horas de vida útil</li>
</ul>
<p>🚚 <strong>Envío GRATIS</strong> · 💳 <strong>Pago contra entrega</strong> · ✨ <strong>Garantía 30 días</strong></p>`
  },
};

// ============================================
// STANDARD WARRANTY FOOTER
// ============================================
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

// ============================================
// MATCHING LOGIC
// ============================================
function findDescriptionMatch(title) {
  const lower = title.toLowerCase();
  const keys = Object.keys(DESCRIPTIONS).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (lower.includes(key)) return DESCRIPTIONS[key];
  }
  return null;
}

// ============================================
// MAIN
// ============================================
async function main() {
  if (!CONFIG.ACCESS_TOKEN) {
    console.error('❌ Set SHOPIFY_ACCESS_TOKEN env var');
    process.exit(1);
  }

  console.log('\n🚀 TechAuraz Description Optimizer\n');

  const data = await shopifyFetch('products.json?limit=250');
  console.log(`📦 ${data.products.length} products loaded\n`);

  let upgraded = 0, skipped = 0;

  for (const product of data.products) {
    const match = findDescriptionMatch(product.title);
    if (!match) {
      skipped++;
      continue;
    }

    console.log(`\n━━━ ${product.title.substring(0, 45)}`);
    console.log(`   📂 ${match.type} | 🏷️ ${match.tags.substring(0, 40)}...`);

    const payload = {
      product: {
        id: product.id,
        body_html: match.html.trim() + WARRANTY,
        product_type: match.type,
        tags: match.tags,
      },
    };

    await shopifyFetch(`products/${product.id}.json`, 'PUT', payload);
    console.log(`   ✅ Description upgraded`);
    upgraded++;
    await sleep(CONFIG.RATE_LIMIT_MS);
  }

  console.log('\n' + '═'.repeat(50));
  console.log(`✅ Upgraded: ${upgraded}`);
  console.log(`⏭️ Skipped (no template): ${skipped}`);
  console.log('═'.repeat(50));
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
