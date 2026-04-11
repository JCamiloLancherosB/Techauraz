const fs = require('fs');

let c = fs.readFileSync('sections/main-product.liquid', 'utf8');

c = c.replace(
    /<div class="product__title" [^>]*>\s*<h1>{{ product\.title \| escape }}<\/h1>\s*<\/div>/i,
    `$&
                {%- comment -%} NEUROMARKETING: Simulación de compradores activos {%- endcomment -%}
                <div style="margin-top: 10px; margin-bottom: 10px;">
                  {% render 'product-buyer-activity' %}
                </div>`
);

c = c.replace(
    /{%- render "ta-booster-2026" -%}/,
    `$&
                  {%- comment -%} NEUROMARKETING: Urgencia de stock {%- endcomment -%}
                  <div style="margin-top: 15px;">
                    {%- render 'product-urgency-bar' -%}
                  </div>`
);

c = c.replace(
    /{%- render 'trust-badges-inline', layout: 'compact', show_heading: false, context: 'product' -%}/,
    `{%- render 'pdp-conversion-badges' -%}
                $&`
);

fs.writeFileSync('sections/main-product.liquid', c);
console.log('[+] Inyección de Liquid completada con éxito.');
