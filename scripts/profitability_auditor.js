require('dotenv').config({ path: 'C:/Users/Torre/Desktop/TechAuraBot/techaura_full_automatic-main/.env' });
const https = require('https');

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || '7f4c40-fb.myshopify.com';
const API_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || process.env.SHOPIFY_ADMIN_API_KEY;
const API_VERSION = '2024-01';

// Parámetros de Operación 2026
const COSTO_ADS_PROMEDIO = 15000;
const COSTO_ENVIO_PROMEDIO = 14500;
const DROPI_COST_RATIO = 0.38; // Asumimos que Dropi cobra un ~38% del precio Retail promedio de Shopify.

function fetchShopifyProducts() {
    return new Promise((resolve, reject) => {
        if (!API_TOKEN) {
            return reject(new Error('❌ ERROR: SHOPIFY_ACCESS_TOKEN no encontrado en .env'));
        }

        const options = {
            hostname: STORE_DOMAIN,
            path: `/admin/api/${API_VERSION}/products.json?limit=250&fields=title,variants,status`,
            method: 'GET',
            headers: {
                'X-Shopify-Access-Token': API_TOKEN,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data).products);
                    } catch (e) {
                        reject(new Error('Fallo al parsear JSON de Shopify.'));
                    }
                } else {
                    reject(new Error(`Shopify API Error: ${res.statusCode} - ${data}`));
                }
            });
        });

        req.on('error', e => reject(e));
        req.end();
    });
}

function classifyProfitability(marginNeto) {
    if (marginNeto <= 0) return '🚨 SANGRE (PÉRDIDA)';
    if (marginNeto < 15000) return '⚠️ WARNING (CEBO)';
    if (marginNeto < 40000) return '✅ SALUDABLE';
    return '💎 HOMERUN (ORO)';
}

async function runAuditor() {
    console.log("===================================================================");
    console.log(" 💎 TECH-AURAZ LIVE SCANNER: INTEGRACIÓN SHOPIFY Y DROPI");
    console.log("===================================================================");
    console.log(`📡 Store Mapeado: ${STORE_DOMAIN}`);
    console.log(`📉 Estimador Dropi Cost: ${(DROPI_COST_RATIO * 100).toFixed(0)}% de valor Retail (Aprox)`);
    console.log(`📢 Target CPA Ads: $${COSTO_ADS_PROMEDIO.toLocaleString()} | 🚚 Envío: $${COSTO_ENVIO_PROMEDIO.toLocaleString()}`);
    console.log("===================================================================\n");

    try {
        const products = await fetchShopifyProducts();
        console.log(`[✓] Descargando catálogo 2026... Se encontraron ${products.length} productos en servidor.`);
        
        // Filtrar productos activos y con variantes con precio
        const activeProducts = products.filter(p => p.status === 'active');
        let rentablesCount = 0;
        let totales = 0;

        activeProducts.forEach(product => {
            if (!product.variants || product.variants.length === 0) return;
            
            // Tomamos el precio de la primera variante como ref base
            const retailPrice = parseFloat(product.variants[0].price);
            if (isNaN(retailPrice) || retailPrice === 0) return;

            // Algoritmo de Estimación: (Retail Price * Ratio Fijo Costo) o mapeo directo si hay meta fields.
            const costoDropiEstimado = retailPrice * DROPI_COST_RATIO;
            const margenBruto = retailPrice - costoDropiEstimado;
            const utilidadLibre = margenBruto - COSTO_ENVIO_PROMEDIO - COSTO_ADS_PROMEDIO;
            const statusTag = classifyProfitability(utilidadLibre);
            const roasReq = (retailPrice / COSTO_ADS_PROMEDIO).toFixed(1);

            console.log(`📦 [${product.title.toUpperCase()}]`);
            console.log(`   - Venta Público:      $${retailPrice.toLocaleString('es-CO')}`);
            console.log(`   - Costo Dropi (Est):  $${costoDropiEstimado.toLocaleString('es-CO')}`);
            console.log(`   - UTILIDAD NETA:      $${utilidadLibre.toLocaleString('es-CO')}  -> [${statusTag}]`);
            if (utilidadLibre > 0) {
                console.log(`   - Target ROAS:        ${roasReq}x requerido.`);
                rentablesCount++;
            }
            console.log("------------------------------------------");
            totales++;
        });

        console.log("===================================================================");
        console.log(`🌟 RESUMEN AUDITORÍA: ${rentablesCount} de ${totales} productos generan ROAS positivo.`);
        console.log(`💡 Nota del Director AI: Puedes ajustar constantes en scripts/profitability_auditor.js`);
        console.log("===================================================================");

    } catch (e) {
        console.error('\n❌ ERROR FATAL:', e.message);
    }
}

runAuditor();
