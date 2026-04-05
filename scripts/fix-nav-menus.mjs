#!/usr/bin/env node
/**
 * Fix navigation menus — create footer-info linklist and add Blog to main menu
 * Uses GraphQL Admin API with proper mutation syntax
 */
const SHOP = '7f4c40-fb.myshopify.com';
const TOKEN = process.env.SHOPIFY_ADMIN_API_KEY;
const API = '2026-01';
const GQL = `https://${SHOP}/admin/api/${API}/graphql.json`;

async function gql(query) {
  const r = await fetch(GQL, {
    method: 'POST',
    headers: { 'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  return r.json();
}

async function main() {
  // ─── Step 1: List all menus ───
  console.log('=== Listing existing menus ===');
  const listResult = await gql(`{ menus(first: 10) { edges { node { id title handle items(first: 20) { edges { node { title url } } } } } } }`);

  if (listResult.errors) {
    console.log('GraphQL errors:', JSON.stringify(listResult.errors));
    return;
  }

  const menus = listResult.data?.menus?.edges?.map(e => e.node) || [];
  for (const m of menus) {
    console.log(`\n📋 Menu: "${m.title}" (${m.handle}) — ID: ${m.id}`);
    for (const item of (m.items?.edges?.map(e => e.node) || [])) {
      console.log(`   • ${item.title} → ${item.url}`);
    }
  }

  // ─── Step 2: Find the main menu ───
  const mainMenu = menus.find(m => m.handle === 'main-menu');
  const footerMenu = menus.find(m => m.handle === 'footer' || m.handle === 'footer-menu');

  // ─── Step 3: Update main menu to add Blog ───
  if (mainMenu) {
    const existingItems = mainMenu.items?.edges?.map(e => e.node) || [];
    const hasBlog = existingItems.some(i => i.url?.includes('/blogs/'));
    
    if (!hasBlog) {
      const items = existingItems.map(i => {
        return `{ title: "${i.title.replace(/"/g, '\\"')}", url: "${i.url}", type: HTTP }`;
      });
      items.push(`{ title: "Blog", url: "https://techauraz.com/blogs/news", type: HTTP }`);
      
      const mutation = `mutation { menuUpdate(id: "${mainMenu.id}", title: "${mainMenu.title}", items: [${items.join(', ')}]) { menu { id title } userErrors { field message } } }`;
      const result = await gql(mutation);
      
      if (result.data?.menuUpdate?.menu) {
        console.log('\n✅ Added "Blog" to main menu');
      } else {
        console.log('\n⚠️ Main menu update:', JSON.stringify(result.data?.menuUpdate?.userErrors || result.errors || []).substring(0, 200));
      }
    } else {
      console.log('\n⏭️ Main menu already has Blog');
    }
  }

  // ─── Step 4: Update footer menu to add links ───
  if (footerMenu) {
    const existingItems = footerMenu.items?.edges?.map(e => e.node) || [];
    const urls = new Set(existingItems.map(i => i.url));
    
    const newLinks = [
      { title: 'Blog', url: 'https://techauraz.com/blogs/news' },
      { title: 'Preguntas Frecuentes', url: 'https://techauraz.com/pages/preguntas-frecuentes' },
      { title: 'Contacto', url: 'https://techauraz.com/pages/contacto-techaura' },
      { title: 'Acerca de', url: 'https://techauraz.com/pages/acerca-de' },
    ].filter(l => !urls.has(l.url));

    if (newLinks.length > 0) {
      const items = [
        ...existingItems.map(i => `{ title: "${i.title.replace(/"/g, '\\"')}", url: "${i.url}", type: HTTP }`),
        ...newLinks.map(l => `{ title: "${l.title}", url: "${l.url}", type: HTTP }`),
      ];

      const mutation = `mutation { menuUpdate(id: "${footerMenu.id}", title: "${footerMenu.title}", items: [${items.join(', ')}]) { menu { id title } userErrors { field message } } }`;
      const result = await gql(mutation);
      
      if (result.data?.menuUpdate?.menu) {
        console.log(`✅ Added ${newLinks.map(l => l.title).join(', ')} to footer menu`);
      } else {
        console.log('⚠️ Footer update:', JSON.stringify(result.data?.menuUpdate?.userErrors || result.errors || []).substring(0, 200));
      }
    } else {
      console.log('⏭️ Footer already has all links');
    }
  } else {
    // No footer menu — create one
    console.log('\n--- Creating footer-info menu ---');
    const createMutation = `mutation {
      menuCreate(title: "Footer Info", handle: "footer-info", items: [
        { title: "Blog", url: "https://techauraz.com/blogs/news", type: HTTP },
        { title: "Preguntas Frecuentes", url: "https://techauraz.com/pages/preguntas-frecuentes", type: HTTP },
        { title: "Contacto", url: "https://techauraz.com/pages/contacto-techaura", type: HTTP },
        { title: "Acerca de", url: "https://techauraz.com/pages/acerca-de", type: HTTP }
      ]) {
        menu { id title handle }
        userErrors { field message }
      }
    }`;
    const createResult = await gql(createMutation);
    
    if (createResult.data?.menuCreate?.menu) {
      console.log(`✅ Created "Footer Info" menu: ${createResult.data.menuCreate.menu.id}`);
    } else {
      console.log('⚠️ Create footer menu:', JSON.stringify(createResult.data?.menuCreate?.userErrors || createResult.errors || []).substring(0, 200));
    }
  }

  console.log('\n🏆 Navigation fix complete!');
}

main().catch(e => console.error('Fatal:', e.message));
