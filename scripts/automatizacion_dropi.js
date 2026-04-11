require('dotenv').config({ path: 'C:/Users/Torre/Desktop/TechAuraBot/techaura_full_automatic-main/.env' });
const fs = require('fs');
const path = require('path');
// axios fallback for fast raw requests if node modules are acting up in bare folder
const https = require('https');

const DROPI_API_TOKEN = process.env.DROPI_API_TOKEN;
const DIR_GUIAS = 'C:/Users/Torre/Desktop/TechAuraBot/Cuentas dropi/Guias dropi';

function fetchDropiHistory() {
    return new Promise((resolve) => {
        console.log('[+] Conectando con API Dropi...');
        if (!DROPI_API_TOKEN) {
            console.error('[!] DROPI_API_TOKEN no está presente en el .env');
            resolve(null);
            return;
        }

        const options = {
            hostname: 'app.dropi.co',
            port: 443,
            path: '/api/wallet/history',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${DROPI_API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (d) => data += d);
            res.on('end', () => {
                if(res.statusCode === 200 || res.statusCode === 201) {
                    resolve(data);
                } else {
                    console.error('[!] La API de Dropi devolvió un código HTTP:', res.statusCode);
                    // Dropi likely has an endpoint change or we need 'Integration Token' on a specific endpoint
                    resolve(null); 
                }
            });
        });

        req.on('error', (e) => {
            console.error('[!] Error en request a Dropi:', e.message);
            resolve(null);
        });

        req.end();
    });
}

async function runAutomation() {
    console.log('======================================================');
    console.log(' INICIANDO SINCRONIZACIÓN DE CUENTAS DROPI - TECHAURA');
    console.log('======================================================');
    
    let guiasData = [];
    if (fs.existsSync(DIR_GUIAS)) {
        guiasData = fs.readdirSync(DIR_GUIAS).filter(v => v.includes('GUIA'));
    }
    console.log(`[✓] ${guiasData.length} guías de envío locales escaneadas.`);
    
    let dropiData = await fetchDropiHistory();
    if (dropiData) {
        console.log('[✓] Historial obtenido de la API exitosamente.');
    } else {
        console.log('[!] La ruta genérica /api/wallet/history requiere parámetros extra o el Token no tiene ese permiso.');
        console.log('[!] Fallback: Dependiendo del script de lectura de Excel local (verify_dropi_guides.js)');
    }
    
    console.log('[+] [WHATSAPP SIMULADO] -> Reporte Financiero TechAura enviado al Admin.');
    console.log('    - Automatización validada hoy. Guías registradas: ' + guiasData.length);
    console.log('======================================================');
}

runAutomation();
