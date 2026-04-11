const fs = require('fs');

const SHOP = '7f4c40-fb.myshopify.com';
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const API_VERSION = '2026-01';

async function updateTOS() {
  const url = `https://${SHOP}/admin/api/${API_VERSION}/graphql.json`;
  const headers = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': TOKEN
  };

  // 1. Fetch current TOS
  const query = `
    {
      shop {
        termsOfService {
          body
        }
      }
    }
  `;

  let res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query })
  });
  let data = await res.json();
  
  let currentBody = data.data?.shop?.termsOfService?.body || '';

  // Ensure we don't prepend twice
  if (!currentBody.includes('TechAuraz')) {
      const addition = `<strong>Este documento de Términos de Servicio gobierna el uso del sitio web local y las integraciones de la aplicación TechAuraz.</strong><br><br>`;
      currentBody = addition + currentBody;
      
      const mutation = `
        mutation shopPolicyUpdate($shopPolicy: ShopPolicyInput!) {
          shopPolicyUpdate(shopPolicy: $shopPolicy) {
            shopPolicy {
              id
            }
            userErrors {
              field
              message
            }
          }
        }
      `;
      
      const variables = {
        shopPolicy: {
          body: currentBody,
          type: 'TERMS_OF_SERVICE'
        }
      };

      res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query: mutation, variables })
      });
      data = await res.json();
      console.log('Update Response:', JSON.stringify(data, null, 2));
      if (data.data?.shopPolicyUpdate?.userErrors?.length) {
          console.error('Errors:', data.data.shopPolicyUpdate.userErrors);
      } else {
          console.log('TOS Updated Successfully!');
      }
  } else {
      console.log('TOS already contains TechAuraz. Skipping update.');
  }
}

updateTOS().catch(console.error);
