import fs from 'fs';
import path from 'path';

const SHOP = '7f4c40-fb.myshopify.com';
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || '[REDACTED_SHOPIFY_TOKEN]';
const API_VERSION = '2026-01';

async function shopifyFetch(endpoint, method = 'GET', body = null) {
  const url = `https://${SHOP}/admin/api/${API_VERSION}/${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN
    }
  };
  if (body) options.body = JSON.stringify(body);
  
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.statusText} on ${url}`);
  }
  return await res.json();
}

const imagesPath = 'C:/Users/Torre/.gemini/antigravity/brain/380a748a-7ebb-416b-9e74-9b0c83a81dc6';
const mappings = [
    { matcher: /power bank port/i, filePrefix: 'solar_power_bank' },
    { matcher: /power bank trans/i, filePrefix: 'transparent_powerbank' },
    { matcher: /base refri/i, filePrefix: 'ps5_cooling_stand' },
    { matcher: /aud[ií]fono/i, filePrefix: 'smart_screen_earbuds' },
    { matcher: /cable/i, filePrefix: 'premium_charge_cable' } 
];

async function updateImages() {
    console.log('Fetching products...');
    const data = await shopifyFetch('products.json?limit=250');
    let products = data.products;
    
    const files = fs.readdirSync(imagesPath);
    
    for (let product of products) {
        for (let mapping of mappings) {
            if (mapping.matcher.test(product.title) && !mapping.applied) {
                const file = files.find(f => f.startsWith(mapping.filePrefix) && f.endsWith('.png'));
                if (file) {
                    console.log(`\nFound product match: [${product.title}] -> ${file}`);
                    mapping.applied = true; // Use this image only once
                    
                    const filePath = path.join(imagesPath, file);
                    const base64Image = fs.readFileSync(filePath, {encoding: 'base64'});
                    
                    try {
                        console.log(`  Uploading image...`);
                        const addedImage = await shopifyFetch(`products/${product.id}/images.json`, 'POST', {
                            image: {
                                attachment: base64Image,
                                filename: file
                            }
                        });
                        console.log(`  Uploaded ID: ${addedImage.image.id}`);

                        console.log(`  Setting position 1 (primary)...`);
                        await shopifyFetch(`products/${product.id}/images/${addedImage.image.id}.json`, 'PUT', {
                            image: {
                                id: addedImage.image.id,
                                position: 1
                            }
                        });
                        
                        console.log(`  Success for ${product.title}!`);
                    } catch(e) {
                         console.error('  Failed to upload image:', e.message);
                    }
                }
            }
        }
    }
}

updateImages();
