const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const IN_FILE = 'C:/Users/Torre/Desktop/TechAuraBot/Cuentas dropi/FORMATO PARA SOLICITUD DE INFORMACION DE GUIAS.xlsx';
const OUT_FILE = 'C:/Users/Torre/Desktop/TechAuraBot/Cuentas dropi/FORMATO_LLENO_3_GUIAS.xlsx';

async function execute() {
    const wb = xlsx.readFile(IN_FILE);
    const sheetName = wb.SheetNames[0];
    const sh = wb.Sheets[sheetName];
    
    // Obtenemos los datos tal cual
    let data = xlsx.utils.sheet_to_json(sh, {header: 1});
    
    // Identificar fila de headers (dónde sale "NÚMERO GUÍA")
    let headerRow = -1;
    for(let i=0; i<data.length; i++) {
        if(data[i] && data[i][0] && typeof data[i][0] === 'string' && data[i][0].includes('GU')) {
            headerRow = i;
            break;
        }
    }
    
    if (headerRow === -1) headerRow = 2; // Default
    
    // Limpiamos datos de ejemplo dejando solo metadata y header
    data = data.slice(0, headerRow + 1);
    
    // Vamos a insertar las 3 guías
    const guias = [
        ['014156464488', 'N/A', 'N/A'], // Orden 65674074
        ['36395130152', 'N/A', 'N/A'],  // Orden 66406933
        ['014156862045', 'N/A', 'N/A']   // Orden 66895969
    ];
    
    guias.forEach(g => data.push(g));
    
    const newWs = xlsx.utils.aoa_to_sheet(data);
    wb.Sheets[sheetName] = newWs;
    
    xlsx.writeFile(wb, OUT_FILE);
    console.log('[+] Creado archivo llenado ->', OUT_FILE);
}
execute();
