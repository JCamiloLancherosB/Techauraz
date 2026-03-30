#!/usr/bin/env node
/**
 * TechAuraz — Shopify Product Manager
 * ====================================
 * Automated script to clean, categorize, and optimize all products.
 * 
 * SETUP:
 *   1. Go to Shopify Admin → Settings → Apps → Develop apps
 *   2. Create app → "TechAuraz Automation"
 *   3. Configure Admin API scopes:
 *      - write_products
 *      - write_inventory
 *      - read_locations
 *   4. Install app → Copy the Admin API Access Token
 *   5. Update SHOPIFY_ACCESS_TOKEN below
 *   6. Run: node scripts/shopify-product-manager.mjs
 * 
 * What this script does:
 *   ✅ Sets stock to 50 for all products
 *   ✅ Cleans supplier branding from descriptions
 *   ✅ Assigns proper product_type and tags
 *   ✅ Sets compare_at_price for discount display
 *   ✅ Standardizes vendor to "TechAuraz"
 */

// ============================================
// CONFIGURATION — UPDATE THESE VALUES
// ============================================
const CONFIG = {
  SHOP: '7f4c40-fb.myshopify.com',
  ACCESS_TOKEN: process.env.SHOPIFY_ACCESS_TOKEN || '',
  API_VERSION: '2024-10',
  DEFAULT_STOCK: 50,
  RATE_LIMIT_MS: 500, // Delay between API calls to avoid rate limits
};

// ============================================
// PRODUCT CATEGORIZATION MAP
// ============================================
const PRODUCT_CATEGORIES = {
  // Audio
  'parlante torre': { type: 'Audio', tags: ['parlante', 'torre', 'bluetooth', 'audio', 'fiesta'] },
  'bolso parlante': { type: 'Audio', tags: ['parlante', 'bluetooth', 'audio', 'bolso', 'portátil'] },
  'karaoke': { type: 'Audio', tags: ['parlante', 'karaoke', 'audio', 'fiesta'] },
  'parlante': { type: 'Audio', tags: ['parlante', 'bluetooth', 'audio', 'musica'] },
  'audifonos inalambricos': { type: 'Audio', tags: ['audifonos', 'inalambricos', 'bluetooth', 'audio'] },
  'audifono': { type: 'Audio', tags: ['audifonos', 'audio'] },
  // Gaming
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
  // Cables & Charging
  'cable tipo c': { type: 'Cables & Carga', tags: ['cable', 'tipo-c', 'usb-c', 'carga'] },
  'cable usb': { type: 'Cables & Carga', tags: ['cable', 'usb', 'carga'] },
  'cable': { type: 'Cables & Carga', tags: ['cable', 'carga'] },
  'cargador para carro': { type: 'Cables & Carga', tags: ['cargador', 'carro', 'vehiculo', 'carga-rapida'] },
  'cargador de pared': { type: 'Cables & Carga', tags: ['cargador', 'pared', 'carga-rapida'] },
  'cargador': { type: 'Cables & Carga', tags: ['cargador', 'carga-rapida'] },
  'power bank': { type: 'Cables & Carga', tags: ['power-bank', 'bateria', 'portatil', 'carga'] },
  'powerbank': { type: 'Cables & Carga', tags: ['power-bank', 'bateria', 'portatil', 'carga'] },
  // Lighting
  'cinta led': { type: 'Iluminación', tags: ['cinta-led', 'rgb', 'iluminacion', 'decoracion'] },
  'bombillo': { type: 'Iluminación', tags: ['bombillo', 'led', 'rgb', 'iluminacion'] },
  'lampara': { type: 'Iluminación', tags: ['lampara', 'led', 'iluminacion'] },
  'aro de luz': { type: 'Iluminación', tags: ['aro-luz', 'ring-light', 'foto', 'video'] },
  // Smart Home
  'enchufe inteligente': { type: 'Smart Home', tags: ['smart-home', 'enchufe', 'wifi', 'alexa'] },
  'camara': { type: 'Smart Home', tags: ['camara', 'seguridad', 'smart-home', 'wifi'] },
  // Wearables
  'reloj': { type: 'Wearables', tags: ['reloj', 'smartwatch', 'wearable'] },
  'smartwatch': { type: 'Wearables', tags: ['smartwatch', 'reloj', 'wearable'] },
  'manilla': { type: 'Wearables', tags: ['manilla', 'fitness', 'wearable'] },
  // Accessories
  'soporte tv': { type: 'Accesorios Hogar', tags: ['soporte', 'tv', 'monitor', 'hogar'] },
  'soporte de telefono para moto': { type: 'Accesorios Moto', tags: ['soporte', 'moto', 'telefono', 'bicicleta'] },
  'soporte': { type: 'Accesorios', tags: ['soporte', 'telefono'] },
  'gimbal': { type: 'Accesorios', tags: ['gimbal', 'estabilizador', 'selfie', 'foto', 'video'] },
  'bolso antirrobo': { type: 'Accesorios', tags: ['bolso', 'antirrobo', 'mochila', 'seguridad'] },
  'mochila': { type: 'Accesorios', tags: ['mochila', 'bolso', 'portatil'] },
  'funda': { type: 'Accesorios', tags: ['funda', 'proteccion', 'celular'] },
  'protector': { type: 'Accesorios', tags: ['protector', 'pantalla', 'celular'] },
};

// ============================================
// SUPPLIER BRANDING TO REMOVE
// ============================================
const SUPPLIER_PATTERNS = [
  // Phone numbers from OTHER suppliers
  /3138077201/g, /3105500811/g, /3150759625/g,
  /320\s*567\s*5803/g, /319\s*532\s*7500/g, /3243585129/g,
  /310\s*7752905/g, /310\s*2132011/g,
  // Supplier names
  /H\s*&\s*T\s*STORE/gi,
  /STOM\s*Accesorios/gi,
  /ONE\s*TECH(\s*SAS)?/gi,
  // Supplier-specific blocks (full paragraphs)
  /🔴.*?STOM\s*Accesorios.*?(?=<\/p>|$)/gis,
  /🔴.*?ONE\s*TECH.*?(?=<\/p>|$)/gis,
  /⚠️INFORMACIÓN\s*IMPORTANTE\s*⚠️.*?(?=<\/p>|$)/gis,
  /RECUERDA\s*QUE\s*EL\s*ÚNICO\s*NÚMERO\s*AUTORIZADO.*?(?=<\/p>|$)/gis,
  /📱\s*Contáctanos\s*por\s*mensaje\s*al\s*(?!3008602789).*?(?=<\/p>|<\/li>|$)/gis,
  /📞\s*Ventas\s*al\s*por\s*mayor.*?(?=<\/p>|$)/gis,
  /ANTES\s*DE\s*REALIZAR\s*EL\s*PEDIDO\s*POR\s*FAVOR\s*PREGUNTAR.*?(?=<[a-z])/gis,
  // Competitor WhatsApp links (keep only TechAuraz's: 3008602789)
  /<a\s+href="https:\/\/wa\.me\/(?!573008602789)[^"]*"[^>]*>.*?<\/a>/gis,
  // Wholesale-only notices
  /\(Producto\s*exclusivo\s*para\s*Mayorista\)/gi,
  /Para\s*mas\s*información\s*comunícate\s*con\s*nosotros\s*a\s*los\s*números.*?(?=<\/p>|$)/gis,
];

// ============================================
// STANDARD WARRANTY TEXT (TechAuraz branded)
// ============================================
const TECHAURAZ_WARRANTY = `
<h3><strong>Garantía TechAuraz</strong></h3>
<p>Todos nuestros productos cuentan con <strong>30 días de garantía</strong> contra defectos de fabricación.</p>
<ul>
  <li>✅ Orden incompleta — reenvío sin costo</li>
  <li>✅ Producto diferente al solicitado — cambio inmediato</li>
  <li>✅ Producto con defecto de fábrica — reemplazo o reembolso</li>
  <li>✅ Producto dañado en transporte — reenvío garantizado</li>
</ul>
<p>📲 Contáctanos por <strong>WhatsApp al +57 300 860 2789</strong> para cualquier solicitud de garantía.</p>
`;

// ============================================
// API HELPERS
// ============================================
async function shopifyFetch(endpoint, method = 'GET', body = null) {
  const url = `https://${CONFIG.SHOP}/admin/api/${CONFIG.API_VERSION}/${endpoint}`;
  const opts = {
    method,
    headers: {
      'X-Shopify-Access-Token': CONFIG.ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify API ${res.status}: ${text}`);
  }
  return res.json();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// PRODUCT CLASSIFICATION
// ============================================
function classifyProduct(title) {
  const lower = title.toLowerCase();

  // Check most specific patterns first (longer matches first)
  const sortedKeys = Object.keys(PRODUCT_CATEGORIES).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (lower.includes(key)) {
      return PRODUCT_CATEGORIES[key];
    }
  }
  // Default
  return { type: 'Tecnología', tags: ['tecnologia'] };
}

// ============================================
// DESCRIPTION CLEANER
// ============================================
function cleanDescription(html, productTitle) {
  if (!html) return generateDefaultDescription(productTitle);

  let cleaned = html;

  // Remove supplier branding patterns
  for (const pattern of SUPPLIER_PATTERNS) {
    cleaned = cleaned.replace(pattern, '');
  }

  // Remove empty paragraphs left behind
  cleaned = cleaned.replace(/<p>\s*<\/p>/g, '');
  cleaned = cleaned.replace(/<li>\s*<\/li>/g, '');
  cleaned = cleaned.replace(/<ul>\s*<\/ul>/g, '');

  // Remove old warranty sections (we'll append TechAuraz's standard one)
  cleaned = cleaned.replace(/<p>\s*<strong>POLÍTICA DE GARANTÍA:?<\/strong>\s*<\/p>[\s\S]*$/i, '');
  cleaned = cleaned.replace(/GARANTIAS QUE APLICAN[\s\S]*GARANTÍAS[\s\S]*$/i, '');
  cleaned = cleaned.replace(/🚨.*?GARANTÍA.*?🚨[\s\S]*$/i, '');

  // Remove Bing tracking links
  cleaned = cleaned.replace(/<a\s+href="https:\/\/www\.bing\.com\/ck\/[^"]*"[^>]*>(.*?)<\/a>/gis, '$1');

  // Remove H&T Store header
  cleaned = cleaned.replace(/<h2>.*?H\s*&\s*T\s*STORE.*?<\/h2>/gis, '');

  // Append TechAuraz warranty
  cleaned = cleaned.trim() + TECHAURAZ_WARRANTY;

  return cleaned;
}

function generateDefaultDescription(title) {
  return `
<p><strong>${title}</strong> — Producto de alta calidad disponible en TechAuraz.</p>
<p>Envío <strong>gratis</strong> a toda Colombia. Pago contraentrega disponible.</p>
${TECHAURAZ_WARRANTY}
  `.trim();
}

// ============================================
// DISCOUNT PRICE CALCULATOR
// ============================================
function calculateCompareAtPrice(price) {
  const numPrice = parseFloat(price);
  // Set compare_at between 20-35% higher for discount perception
  const markup = 1.25 + (Math.random() * 0.10); // 25-35%
  return (Math.ceil((numPrice * markup) / 1000) * 1000).toFixed(2);
}

// ============================================
// MAIN EXECUTION
// ============================================
async function main() {
  console.log('\n🚀 TechAuraz Product Manager — Starting...\n');

  if (!CONFIG.ACCESS_TOKEN) {
    console.error('❌ ERROR: Set SHOPIFY_ACCESS_TOKEN environment variable');
    console.log('\nUsage:');
    console.log('  $env:SHOPIFY_ACCESS_TOKEN="shpat_xxx"; node scripts/shopify-product-manager.mjs');
    console.log('\nOr create a .env file in the Techauraz directory with:');
    console.log('  SHOPIFY_ACCESS_TOKEN=shpat_xxx\n');
    process.exit(1);
  }

  // 1. Fetch all products (limit=250 covers up to 250 products in one call)
  console.log('📦 Fetching products...');
  const data = await shopifyFetch('products.json?limit=250');
  const allProducts = data.products;
  console.log(`   Found ${allProducts.length} products\n`);

  // Count how many need processing
  const needsUpdate = allProducts.filter(p => p.vendor !== 'TechAuraz');
  console.log(`   ${needsUpdate.length} need full update, ${allProducts.length - needsUpdate.length} already processed (will refresh stock)\n`);

  // 2. Get inventory location
  console.log('📍 Getting inventory location...');
  const locations = await shopifyFetch('locations.json');
  const locationId = locations.locations[0]?.id;
  console.log(`   Location ID: ${locationId}\n`);

  // 3. Process each product
  let updated = 0;
  let errors = 0;

  for (const product of allProducts) {
    try {
      console.log(`\n━━━ Processing: ${product.title.substring(0, 50)}...`);

      // Classify
      const category = classifyProduct(product.title);
      console.log(`   📂 Category: ${category.type} | Tags: ${category.tags.join(', ')}`);

      // Clean description
      const cleanedBody = cleanDescription(product.body_html, product.title);
      const descChanged = cleanedBody !== product.body_html;
      console.log(`   📝 Description: ${descChanged ? 'CLEANED ✓' : 'OK'}`);

      // Calculate compare_at_price
      const variant = product.variants[0];
      const compareAt = calculateCompareAtPrice(variant.price);
      console.log(`   💰 Price: $${variant.price} → Compare at: $${compareAt}`);

      // Update product
      const updatePayload = {
        product: {
          id: product.id,
          product_type: category.type,
          tags: category.tags.join(', '),
          vendor: 'TechAuraz',
          body_html: cleanedBody,
          variants: [{
            id: variant.id,
            compare_at_price: compareAt,
            inventory_management: 'shopify',
          }],
        },
      };

      await shopifyFetch(`products/${product.id}.json`, 'PUT', updatePayload);
      console.log(`   ✅ Product updated`);

      // Set inventory level
      if (locationId && variant.id) {
        try {
          // First get the inventory_item_id
          const variantData = await shopifyFetch(`variants/${variant.id}.json`);
          const inventoryItemId = variantData.variant.inventory_item_id;

          await shopifyFetch('inventory_levels/set.json', 'POST', {
            location_id: locationId,
            inventory_item_id: inventoryItemId,
            available: CONFIG.DEFAULT_STOCK,
          });
          console.log(`   📦 Stock set to ${CONFIG.DEFAULT_STOCK}`);
        } catch (invErr) {
          console.log(`   ⚠️ Stock update failed: ${invErr.message.substring(0, 80)}`);
        }
      }

      updated++;
      await sleep(CONFIG.RATE_LIMIT_MS);

    } catch (err) {
      console.error(`   ❌ Error: ${err.message.substring(0, 100)}`);
      errors++;
    }
  }

  // 4. Summary
  console.log('\n' + '═'.repeat(50));
  console.log('📊 RESUMEN');
  console.log('═'.repeat(50));
  console.log(`   ✅ Actualizados: ${updated}`);
  console.log(`   ❌ Errores: ${errors}`);
  console.log(`   📦 Stock establecido: ${CONFIG.DEFAULT_STOCK} unidades`);
  console.log(`   🏷️ Tags y categorías asignados`);
  console.log(`   📝 Descripciones limpiadas de proveedores`);
  console.log(`   💰 Precios comparativos (descuento) agregados`);
  console.log(`   🏪 Vendor estandarizado a "TechAuraz"`);
  console.log('\n✨ ¡Listo! Revisa tu Shopify Admin para verificar los cambios.\n');
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
