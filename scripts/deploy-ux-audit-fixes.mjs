#!/usr/bin/env node
/**
 * TechAuraz — Deploy UX Audit Fixes
 * ===================================
 * Deploys only the files changed during the homepage UX audit.
 * 
 * USAGE: node scripts/deploy-ux-audit-fixes.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: "C:/Users/Torre/Desktop/TechAuraBot/techaura_full_automatic-main/.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const THEME_ROOT = path.resolve(__dirname, '..');

const CONFIG = {
  SHOP: process.env.SHOPIFY_STORE_DOMAIN || '7f4c40-fb.myshopify.com',
  ACCESS_TOKEN: process.env.SHOPIFY_ADMIN_API_KEY || process.env.SHOPIFY_ACCESS_TOKEN || '',
  API_VERSION: process.env.SHOPIFY_API_VERSION || '2026-01',
  RATE_LIMIT_MS: 600,
};

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
  if (res.status === 429) {
    const retryAfter = parseFloat(res.headers.get('Retry-After') || '2');
    console.log(`   ⏳ Rate limited, retrying after ${retryAfter}s...`);
    await sleep(retryAfter * 1000);
    return shopifyFetch(endpoint, method, body);
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify API ${res.status}: ${text.substring(0, 300)}`);
  }
  const contentType = res.headers.get('content-type');
  if (res.status === 204 || !contentType || !contentType.includes('json')) return {};
  return res.json();
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('  🎨 TechAuraz — UX Audit Fixes Deployment');
  console.log('  ' + new Date().toISOString());
  console.log('═'.repeat(60));

  if (!CONFIG.ACCESS_TOKEN) {
    console.error('\n❌ No Shopify access token found. Check .env file.');
    process.exit(1);
  }

  console.log(`\n🏪 Store: ${CONFIG.SHOP}`);
  console.log(`🔑 Token: ${CONFIG.ACCESS_TOKEN.substring(0, 12)}...`);

  // Find active theme
  const themesData = await shopifyFetch('themes.json');
  const mainTheme = themesData.themes.find(t => t.role === 'main');
  if (!mainTheme) {
    console.error('❌ No main theme found!');
    process.exit(1);
  }
  console.log(`✅ Active theme: "${mainTheme.name}" (ID: ${mainTheme.id})\n`);

  // Files changed during UX audit
  const filesToDeploy = [
    // SPRINT 1 — Critical
    'assets/visual-system-unified.css',           // Benefits horizontal grid CSS (was broken/empty)
    'templates/index.json',                        // Category icons, benefits icons, copy, section order
    'snippets/card-product.liquid',                // Removed auto-assign Alta Demanda, trust-line, details-link
    'sections/category-navigation.liquid',         // Grid changed from auto-fit to repeat(3, 1fr)
    'config/settings_data.json',                   // buttons_radius: 8, card_corner_radius: 12
    
    // SPRINT 2 — High Impact  
    'sections/header-group.json',                  // Announcement bar copy refinement, reduced to 4 msgs
    
    // Supporting files (benefits section Liquid)
    'sections/benefits-conversion.liquid',         // Benefits section HTML
  ];

  let deployed = 0;
  let errors = 0;

  for (const relPath of filesToDeploy) {
    const fullPath = path.join(THEME_ROOT, relPath);
    if (!fs.existsSync(fullPath)) {
      console.log(`   ⚠️  Skip: ${relPath} (not found)`);
      continue;
    }

    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      const assetKey = relPath.replace(/\\/g, '/');
      const sizeKB = (content.length / 1024).toFixed(1);
      
      console.log(`   📤 Deploying: ${assetKey} (${sizeKB}KB)...`);
      await shopifyFetch(`themes/${mainTheme.id}/assets.json`, 'PUT', {
        asset: { key: assetKey, value: content },
      });
      console.log(`   ✅ ${assetKey} — deployed`);
      deployed++;
      await sleep(CONFIG.RATE_LIMIT_MS);
    } catch (err) {
      console.log(`   ❌ ${relPath}: ${err.message.substring(0, 150)}`);
      errors++;
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`📊 DEPLOYMENT COMPLETE: ${deployed} files deployed, ${errors} errors`);
  console.log('═'.repeat(60));

  if (errors === 0) {
    console.log('\n🎉 All UX audit fixes deployed successfully!');
    console.log('🌐 Visit https://techauraz.com to verify.\n');
    console.log('Changes deployed:');
    console.log('  ✅ Benefits section — horizontal grid with SVG icons');
    console.log('  ✅ Category navigation — 6 categories, proper icons, fixed grid');
    console.log('  ✅ Product cards — removed badge spam, trust-line, details-link');
    console.log('  ✅ Buttons — 8px border-radius');
    console.log('  ✅ Cards — 12px corner radius');
    console.log('  ✅ Announcement bar — refined copy, 4 messages');
    console.log('  ✅ Section titles — improved CRO copy');
    console.log('  ✅ Newsletter — removed from homepage (footer only)');
    console.log('  ✅ Hero CTA — "Comprar Ahora" (less aggressive)');
  } else {
    console.log(`\n⚠️  ${errors} file(s) failed. Check output above.\n`);
  }
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
