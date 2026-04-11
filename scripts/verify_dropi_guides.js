const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

// Rutas actualizadas a la nueva ubicación TechAuraBot
const DIR_GUIAS = 'C:/Users/Torre/Desktop/TechAuraBot/Cuentas dropi/Guias dropi';
const DIR_CUENTAS = 'C:/Users/Torre/Desktop/TechAuraBot/Cuentas dropi';

async function scanGuiasLocales(dir) {
    let filesData = [];
    if (!fs.existsSync(dir)) {
        console.warn(`[!] La carpeta de guías no existe en la ruta esperada: ${dir}`);
        return filesData;
    }
    
    const walkSync = (currentDirPath) => {
        const files = fs.readdirSync(currentDirPath);
        for (const name of files) {
            const filePath = path.join(currentDirPath, name);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                walkSync(filePath);
            } else {
                // Extraer ORDEN y GUIA del nombre del archivo (con o sin prefijo)
                const match = name.match(/ORDEN-(\d+).+?GUIA-(\d+)/i);
                if (match) {
                    filesData.push({
                        fileName: name,
                        orden: match[1],
                        guia: match[2],
                        path: filePath
                    });
                }
            }
        }
    };
    walkSync(dir);
    return filesData;
}

function parseDropiExcel() {
    let excelFile = null;
    const files = fs.readdirSync(DIR_CUENTAS);
    for (let f of files) {
        if (f.endsWith('.xlsx') && f.includes('historial de cartera')) {
            excelFile = path.join(DIR_CUENTAS, f);
            break;
        }
    }
    
    if (!excelFile) {
        console.error('[!] No se encontró ningún archivo XLSX de historial de cartera en ' + DIR_CUENTAS);
        return [];
    }
    
    console.log(`[+] Leyendo cuentas desde: ${path.basename(excelFile)}`);
    const workbook = xlsx.readFile(excelFile);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    // Se salta el encabezado si existe o maneja el arreglo directo
    const data = xlsx.utils.sheet_to_json(sheet, { defval: '' });
    
    return data;
}

async function verifyDropi() {
    console.log(`\n================= AUDITORÍA FINANCIERA DROPI =================\n`);
    const localGuias = await scanGuiasLocales(DIR_GUIAS);
    console.log(`[+] Encontradas ${localGuias.length} guías en PDF.`);
    
    const dropiData = parseDropiExcel();
    console.log(`[+] Leídos ${dropiData.length} registros del Historial de Cartera.`);
    
    if (dropiData.length > 0) {
        
        // Mapear transacciones Dropi para extraer IDs (Normalmente están en columnas de Concepto o Descripción)
        // Ya que el formato exacto de las columnas de Dropi excel depende de su export, buscaremos los IDs
        // en todos los valores de las filas (convertidos a string) para mayor resiliencia.
        
        let localGuiasNoRegistradasEnDropi = [];
        let ordenesAprobadasListas = 0;
        
        for (let guiaLocal of localGuias) {
            let encontrada = false;
            
            // Buscar la orden en el excel de Dropi
            for (let row of dropiData) {
                const rowStr = JSON.stringify(row).toLowerCase();
                // Si la fila del excel menciona la ORDEN del PDF
                if (rowStr.includes(guiaLocal.orden)) {
                    encontrada = true;
                    ordenesAprobadasListas++;
                    break;
                }
            }
            
            if (!encontrada) {
                localGuiasNoRegistradasEnDropi.push(guiaLocal);
            }
        }
        
        console.log(`\n--- RESULTADOS DEL CRUCE ---`);
        console.log(`✔️ Guías cruzadas exitosamente con movimientos financieros: ${ordenesAprobadasListas}`);
        console.log(`❌ Guías generadas que NO aparecen pagadas/cobrados en la Cartera: ${localGuiasNoRegistradasEnDropi.length}`);
        
        if (localGuiasNoRegistradasEnDropi.length > 0) {
            console.log(`\n[!] ATENCIÓN: Las siguientes órdenes no registran entradas o salidas en Dropi:`);
            console.table(localGuiasNoRegistradasEnDropi.map(g => ({ Orden: g.orden, Guia: g.guia })));
        } else {
            console.log(`\n[✓] Todas las guías en tu carpeta de local concuerdan con el historial de tu cuenta Dropi.`);
        }
    }
    
    console.log(`\n==============================================================\n`);
}

verifyDropi().catch(console.error);
