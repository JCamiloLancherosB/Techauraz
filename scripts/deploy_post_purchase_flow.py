"""
╔══════════════════════════════════════════════════════════════════╗
║  TechAuraz — Post-Purchase Email Automation Deployer            ║
║  Creates discount codes + generates HTML email templates         ║
║  for Shopify Email / Flow integration                            ║
╚══════════════════════════════════════════════════════════════════╝

This script:
1. Creates the ELITE-TECHAURAZ discount code via Shopify GraphQL API
2. Generates 3 production-ready HTML email templates
3. Saves them as .html files ready to paste into Shopify Email editor

Usage: python deploy_post_purchase_flow.py
"""

import requests
import json
import os
from datetime import datetime, timedelta

# ─── Configuration ───────────────────────────────────────────────
SHOP_DOMAIN = "7f4c40-fb.myshopify.com"
ACCESS_TOKEN = os.environ.get("SHOPIFY_ADMIN_API_KEY", "")
API_VERSION = "2026-01"
GRAPHQL_URL = f"https://{SHOP_DOMAIN}/admin/api/{API_VERSION}/graphql.json"

DISCOUNT_CODE = "ELITE-TECHAURAZ"
DISCOUNT_PERCENTAGE = 0.15  # 15%
DISCOUNT_TITLE = "Post-Purchase Élite — 15% Segunda Compra"
DISCOUNT_DURATION_DAYS = 60  #  Active period for the code itself (customers get 15-day window via email copy)

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "email_templates")

HEADERS = {
    "X-Shopify-Access-Token": ACCESS_TOKEN,
    "Content-Type": "application/json"
}

# ─── Brand Design Tokens ──────────────────────────────────────────
BRAND = {
    "primary": "#0a0a0a",
    "accent": "#00d4aa",
    "accent_dark": "#00b893",
    "surface": "#111111",
    "surface_light": "#1a1a1a",
    "text_primary": "#ffffff",
    "text_secondary": "#a0a0a0",
    "text_muted": "#666666",
    "border": "#222222",
    "gradient_start": "#00d4aa",
    "gradient_end": "#0088ff",
    "font_family": "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    "logo_url": "https://techauraz.com/cdn/shop/files/logotechauraz.png?v=1741225997",
    "store_url": "https://techauraz.com",
    "instagram_url": "https://www.instagram.com/techauraz/",
    "whatsapp_url": "https://wa.me/573001234567",
}


def create_discount_code():
    """Create the ELITE-TECHAURAZ discount code via Shopify GraphQL API."""
    print("\n" + "="*60)
    print("  PASO 1: Creando código de descuento en Shopify")
    print("="*60)

    starts_at = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    ends_at = (datetime.utcnow() + timedelta(days=DISCOUNT_DURATION_DAYS)).strftime("%Y-%m-%dT%H:%M:%SZ")

    query = """
    mutation CreateDiscountCode($basicCodeDiscount: DiscountCodeBasicInput!) {
      discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
        codeDiscountNode {
          id
          codeDiscount {
            ... on DiscountCodeBasic {
              title
              startsAt
              endsAt
              codes(first: 5) {
                nodes {
                  code
                }
              }
              customerGets {
                value {
                  ... on DiscountPercentage {
                    percentage
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
    """

    variables = {
        "basicCodeDiscount": {
            "title": DISCOUNT_TITLE,
            "code": DISCOUNT_CODE,
            "startsAt": starts_at,
            "endsAt": ends_at,
            "customerSelection": {
                "all": True
            },
            "customerGets": {
                "value": {
                    "percentage": DISCOUNT_PERCENTAGE
                },
                "items": {
                    "all": True
                }
            },
            "usageLimit": None,
            "appliesOncePerCustomer": True
        }
    }

    payload = {"query": query, "variables": variables}
    resp = requests.post(GRAPHQL_URL, json=payload, headers=HEADERS)

    if resp.status_code != 200:
        print(f"  ✗ HTTP Error: {resp.status_code}")
        print(f"    {resp.text[:500]}")
        return False

    data = resp.json()

    if "errors" in data:
        print(f"  ✗ GraphQL Errors: {json.dumps(data['errors'], indent=2)}")
        return False

    result = data.get("data", {}).get("discountCodeBasicCreate", {})
    user_errors = result.get("userErrors", [])

    if user_errors:
        for err in user_errors:
            print(f"  ✗ Error: {err['message']} (field: {err.get('field', 'N/A')})")
        # If the error is that the code already exists, that's OK
        if any("already" in e.get("message", "").lower() or "taken" in e.get("message", "").lower() for e in user_errors):
            print("  ℹ  El código ya existe — continuando con la generación de templates...")
            return True
        return False

    node = result.get("codeDiscountNode", {})
    discount = node.get("codeDiscount", {})
    print(f"  ✓ Descuento creado exitosamente!")
    print(f"    ID:     {node.get('id')}")
    print(f"    Título: {discount.get('title')}")
    print(f"    Código: {discount.get('codes', {}).get('nodes', [{}])[0].get('code', 'N/A')}")
    print(f"    Valor:  {int(DISCOUNT_PERCENTAGE * 100)}% OFF")
    print(f"    Inicio: {discount.get('startsAt')}")
    print(f"    Fin:    {discount.get('endsAt')}")
    return True


def build_email_shell(body_content, preheader_text=""):
    """Wraps email body content in a premium, dark-themed responsive shell."""
    return f"""<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>TechAuraz</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    :root {{ color-scheme: dark; supported-color-schemes: dark; }}
    body, table, td, a {{ -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }}
    table, td {{ mso-table-lspace: 0pt; mso-table-rspace: 0pt; }}
    img {{ -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }}
    body {{ margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: {BRAND['primary']}; }}
    
    .email-wrapper {{ width: 100%; background-color: {BRAND['primary']}; padding: 32px 0; }}
    .email-container {{ max-width: 600px; margin: 0 auto; background-color: {BRAND['surface']}; border-radius: 16px; overflow: hidden; border: 1px solid {BRAND['border']}; }}
    
    .header {{ padding: 32px 40px 24px; text-align: center; border-bottom: 1px solid {BRAND['border']}; }}
    .header img {{ width: 140px; height: auto; }}
    
    .content {{ padding: 40px 40px 32px; }}
    .content h1 {{ color: {BRAND['text_primary']}; font-family: {BRAND['font_family']}; font-size: 26px; font-weight: 700; line-height: 1.3; margin: 0 0 8px; }}
    .content h2 {{ color: {BRAND['accent']}; font-family: {BRAND['font_family']}; font-size: 20px; font-weight: 700; line-height: 1.3; margin: 28px 0 12px; }}
    .content h3 {{ color: {BRAND['text_primary']}; font-family: {BRAND['font_family']}; font-size: 16px; font-weight: 600; line-height: 1.4; margin: 24px 0 8px; }}
    .content p {{ color: {BRAND['text_secondary']}; font-family: {BRAND['font_family']}; font-size: 15px; line-height: 1.7; margin: 0 0 16px; }}
    .content strong {{ color: {BRAND['text_primary']}; }}
    .content a {{ color: {BRAND['accent']}; text-decoration: none; }}
    .content a:hover {{ text-decoration: underline; }}
    
    .accent-line {{ width: 48px; height: 3px; background: linear-gradient(90deg, {BRAND['gradient_start']}, {BRAND['gradient_end']}); border-radius: 2px; margin: 0 0 24px; }}
    
    .divider {{ height: 1px; background-color: {BRAND['border']}; margin: 28px 0; }}
    
    .tip-card {{ background-color: {BRAND['surface_light']}; border-radius: 12px; padding: 20px 24px; margin: 16px 0; border-left: 3px solid {BRAND['accent']}; }}
    .tip-card h3 {{ margin: 0 0 8px; color: {BRAND['text_primary']}; font-family: {BRAND['font_family']}; font-size: 15px; font-weight: 600; }}
    .tip-card p {{ margin: 0; color: {BRAND['text_secondary']}; font-family: {BRAND['font_family']}; font-size: 14px; line-height: 1.6; }}
    .tip-card .tip-label {{ color: {BRAND['accent']}; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; display: block; }}
    
    .cta-button {{ display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, {BRAND['gradient_start']}, {BRAND['gradient_end']}); color: {BRAND['primary']} !important; font-family: {BRAND['font_family']}; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 8px; text-align: center; letter-spacing: 0.5px; }}
    
    .code-block {{ background-color: {BRAND['surface_light']}; border: 1px dashed {BRAND['accent']}; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }}
    .code-block .code {{ font-family: 'Courier New', monospace; font-size: 24px; font-weight: 700; color: {BRAND['accent']}; letter-spacing: 3px; margin: 8px 0; }}
    .code-block .code-label {{ font-family: {BRAND['font_family']}; font-size: 11px; color: {BRAND['text_muted']}; text-transform: uppercase; letter-spacing: 1.5px; }}
    .code-block .code-detail {{ font-family: {BRAND['font_family']}; font-size: 13px; color: {BRAND['text_secondary']}; margin: 4px 0 0; }}
    
    .signature {{ padding: 0 40px 32px; }}
    .signature p {{ color: {BRAND['text_muted']}; font-family: {BRAND['font_family']}; font-size: 13px; line-height: 1.6; margin: 0; }}
    .signature .team {{ color: {BRAND['text_primary']}; font-weight: 600; font-size: 14px; }}
    
    .footer {{ padding: 24px 40px; background-color: {BRAND['primary']}; text-align: center; border-top: 1px solid {BRAND['border']}; }}
    .footer p {{ color: {BRAND['text_muted']}; font-family: {BRAND['font_family']}; font-size: 12px; line-height: 1.6; margin: 4px 0; }}
    .footer a {{ color: {BRAND['text_muted']}; text-decoration: underline; }}
    
    .ps-note {{ background-color: {BRAND['surface_light']}; padding: 16px 20px; border-radius: 8px; margin: 24px 0 0; }}
    .ps-note p {{ color: {BRAND['text_muted']}; font-family: {BRAND['font_family']}; font-size: 13px; line-height: 1.6; margin: 0; font-style: italic; }}
    
    @media only screen and (max-width: 620px) {{
      .email-container {{ margin: 0 12px !important; border-radius: 12px !important; }}
      .header {{ padding: 24px 24px 20px !important; }}
      .content {{ padding: 28px 24px 24px !important; }}
      .content h1 {{ font-size: 22px !important; }}
      .signature {{ padding: 0 24px 24px !important; }}
      .footer {{ padding: 20px 24px !important; }}
      .code-block .code {{ font-size: 20px !important; }}
    }}
  </style>
</head>
<body style="margin:0;padding:0;background-color:{BRAND['primary']};">
  <!-- Preheader text (hidden) -->
  <div style="display:none;font-size:1px;color:{BRAND['primary']};line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    {preheader_text}
    &#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
  </div>
  
  <div class="email-wrapper">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center">
          <div class="email-container">
            <!-- Header -->
            <div class="header">
              <a href="{BRAND['store_url']}" target="_blank">
                <img src="{BRAND['logo_url']}" alt="TechAuraz" width="140">
              </a>
            </div>
            
            <!-- Body -->
            {body_content}
            
            <!-- Footer -->
            <div class="footer">
              <p>TechAuraz — Tech que funciona, sin excusas.</p>
              <p><a href="{BRAND['store_url']}">techauraz.com</a> &nbsp;·&nbsp; <a href="{BRAND['instagram_url']}">Instagram</a></p>
              <p style="margin-top:12px;">Si no quieres recibir más correos de este tipo, <a href="{{{{unsubscribe_url}}}}">puedes salir aquí</a>.</p>
              <p>© 2026 TechAuraz. Colombia.</p>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>"""


def generate_email_1():
    """Día +1: Bienvenido a la Élite — Agradecimiento puro, cero venta."""
    body = f"""
            <div class="content">
              <div class="accent-line"></div>
              <h1>Hola {{{{ customer.first_name }}}},</h1>
              <p>Esto no es un correo automático genérico. Bueno, técnicamente sí lo es — pero lo que dice adentro no.</p>
              
              <p>Queríamos tomarnos un segundo para decirte algo simple:</p>
              
              <p style="font-size:18px; color:{BRAND['text_primary']}; font-weight:600; padding:16px 0;">Gracias por confiar en nosotros.</p>
              
              <p>Sabemos que en Colombia comprar tecnología online todavía genera dudas. Que elegiste Pago Contra Entrega porque querías ver antes de soltar tu plata. Y que aún así, decidiste que TechAuraz valía el click.</p>
              
              <p><strong>Eso no lo tomamos a la ligera.</strong></p>
              
              <p>Tu pedido ya está en tus manos. Y lo que tienes ahí no es solo un producto — es una herramienta seleccionada por un equipo que prueba, descarta y solo publica lo que realmente funciona.</p>
              
              <div class="tip-card">
                <h3 style="color:{BRAND['accent']};">No vendemos todo. Vendemos lo correcto.</h3>
                <p>Cada producto en nuestro catálogo pasó por nuestras manos antes de llegar a las tuyas. Si no nos convence, no lo publicamos. Así de simple.</p>
              </div>
              
              <div class="divider"></div>
              
              <p>Ahora, solo un favor:</p>
              
              <p>Si algo no se siente bien con tu pedido — <strong>cualquier cosa</strong> — responde directamente a este correo. Sin formularios, sin tickets, sin robots. Una persona real te va a responder.</p>
              
              <p>Pero si todo llegó perfecto (que es lo que esperamos), simplemente disfrútalo.</p>
              
              <p>Nos vemos pronto, {{{{ customer.first_name }}}}.</p>
            </div>
            
            <div class="signature">
              <p class="team">— El equipo de TechAuraz</p>
              <div class="ps-note">
                <p>P.D. — No te vamos a llenar el correo de ofertas. Cuando te escribamos, va a valer la pena abrirlo.</p>
              </div>
            </div>"""

    return build_email_shell(
        body,
        preheader_text="El 94% de la gente compra tech sin investigar. Tú no eres el 94%."
    )


def generate_email_2():
    """Día +5: MasterClass — Tips de mantenimiento + soft CTA a Instagram."""
    body = f"""
            <div class="content">
              <div class="accent-line"></div>
              <h1>3 errores que arruinan tu tech</h1>
              <p style="color:{BRAND['text_muted']}; font-size:13px; margin-bottom:24px;">(y cómo evitarlos)</p>
              
              <p>Hola {{{{ customer.first_name }}}},</p>
              
              <p>Ya llevas unos días con tu equipo. Y si eres como la mayoría de nuestros clientes, probablemente ya le estás sacando provecho.</p>
              
              <p>Pero hay algo que casi nadie hace bien: <strong>el mantenimiento.</strong></p>
              
              <p>No hablamos de cosas complicadas. Hablamos de hábitos simples que separan al que reemplaza su tech cada 6 meses... del que le saca <strong>3+ años de vida útil.</strong></p>
              
              <!-- Tip 1 -->
              <div class="tip-card">
                <span class="tip-label">⚡ Regla #1</span>
                <h3>La regla del 20-80 en carga</h3>
                <p>Si usas power banks, audífonos o cualquier dispositivo con batería de litio: <strong style="color:{BRAND['text_primary']}">no lo cargues al 100% siempre.</strong> El punto óptimo está entre 20% y 80%. Eso solo puede duplicar la vida útil de tu batería.</p>
                <p style="margin-top:8px; color:{BRAND['text_muted']}; font-size:12px;">Dato: las baterías de litio no mueren por uso. Mueren por ciclos completos innecesarios.</p>
              </div>
              
              <!-- Tip 2 -->
              <div class="tip-card">
                <span class="tip-label">🧹 Regla #2</span>
                <h3>Limpieza ≠ paño húmedo</h3>
                <p>Nunca uses alcohol directo sobre pantallas o superficies mate. Un paño de microfibra seco hace el 90% del trabajo. Si necesitas líquido: agua destilada con una gota mínima de jabón neutro. Punto.</p>
                <p style="margin-top:8px; color:{BRAND['text_muted']}; font-size:12px;">Los "limpiadores de pantalla" que venden por ahí son, en su mayoría, agua cara con fragancia.</p>
              </div>
              
              <!-- Tip 3 -->
              <div class="tip-card">
                <span class="tip-label">🔌 Regla #3</span>
                <h3>El cargador importa más que el cable</h3>
                <p>Un cable genérico rara vez daña tu equipo. Pero un cargador de mala calidad puede freír tu circuito de carga lentamente sin que lo notes. <strong style="color:{BRAND['text_primary']}">Invierte en el cargador, ahorra en el cable.</strong> No al revés.</p>
              </div>
              
              <div class="divider"></div>
              
              <p>Estas son las cosas que sabemos porque vivimos en esto todos los días. Y nos gusta compartirlas con la gente que realmente le importa su tech.</p>
              
              <p><strong>Hablando de eso</strong> — si quieres más contenido así (reviews honestos, lanzamientos antes que nadie, y detrás de cámaras de lo que probamos), estamos activos en Instagram:</p>
              
              <div style="text-align:center; padding:16px 0;">
                <a href="{BRAND['instagram_url']}" class="cta-button" target="_blank">
                  @techauraz en Instagram →
                </a>
              </div>
              
              <p style="text-align:center; color:{BRAND['text_muted']}; font-size:13px;">No es el típico feed de "OFERTA 🔥🔥🔥". Es contenido real para gente que le gusta la tecnología en serio.</p>
              
              <p>Cuida tu equipo, {{{{ customer.first_name }}}}.</p>
            </div>
            
            <div class="signature">
              <p class="team">— El equipo de TechAuraz</p>
            </div>"""

    return build_email_shell(
        body,
        preheader_text="Tu setup merece durar años, no meses. Esto es lo que nadie te dice."
    )


def generate_email_3():
    """Día +10: La Reseña — Wall of Love + código de descuento exclusivo."""
    body = f"""
            <div class="content">
              <div class="accent-line"></div>
              <h1>{{{{ customer.first_name }}}}, ¿nos prestas 2 minutos?</h1>
              
              <p>Directo al punto: <strong>necesitamos tu opinión.</strong></p>
              
              <p>No para nosotros — para la próxima persona que esté donde tú estabas hace 10 días. Buscando tech online en Colombia, con dudas, comparando opciones, preguntándose si TechAuraz es real.</p>
              
              <p><strong>Tu experiencia puede ser la que le dé confianza para dar el paso.</strong></p>
              
              <div class="divider"></div>
              
              <h2>🏛️ El Wall of Love</h2>
              
              <p>Estamos construyendo algo que llamamos el <strong>Wall of Love</strong> — un muro con testimonios reales de clientes reales. Sin editar, sin filtrar, sin inventar.</p>
              
              <p>Y nos encantaría que tu historia estuviera ahí.</p>
              
              <div class="tip-card">
                <h3>¿Qué necesitamos?</h3>
                <p>Solo responde a este correo con unas líneas. Puede ser tan simple como:</p>
                <p style="margin-top:12px;">
                  <span style="color:{BRAND['accent']};">→</span> ¿Qué compraste?<br>
                  <span style="color:{BRAND['accent']};">→</span> ¿Cómo fue la entrega?<br>
                  <span style="color:{BRAND['accent']};">→</span> ¿Lo recomendarías?
                </p>
                <p style="margin-top:12px; color:{BRAND['text_muted']}; font-size:12px;">Si quieres adjuntar una foto de tu setup, mejor todavía. Pero no es obligatorio.</p>
              </div>
              
              <div class="divider"></div>
              
              <h2>🎁 Y aquí viene lo bueno</h2>
              
              <p>Como agradecimiento por tomarte el tiempo, desbloqueamos algo que <strong>no está disponible en la tienda:</strong></p>
              
              <div class="code-block">
                <div class="code-label">Tu código exclusivo</div>
                <div class="code">{DISCOUNT_CODE}</div>
                <div class="code-detail" style="color:{BRAND['accent']}; font-weight:600; font-size:16px;">{int(DISCOUNT_PERCENTAGE * 100)}% OFF en tu segunda compra</div>
                <div style="margin-top:12px;">
                  <span class="code-detail">Válido por: 15 días</span><br>
                  <span class="code-detail">Aplica en: Todo el catálogo</span><br>
                  <span class="code-detail">Uso: Único por cliente</span>
                </div>
              </div>
              
              <p>No es un cupón genérico. Es un código para quienes ya son parte de esto.</p>
              
              <div class="divider"></div>
              
              <p style="font-size:16px; color:{BRAND['text_primary']};">Esto es simple, {{{{ customer.first_name }}}}:</p>
              
              <p>Tú nos das 2 minutos de tu tiempo → Nosotros te damos acceso a un precio que nadie más tiene.</p>
              
              <p><strong>¿Trato?</strong></p>
              
              <div style="text-align:center; padding:20px 0;">
                <a href="mailto:soporte@techauraz.com?subject=Mi%20reseña%20TechAuraz&body=Hola%20TechAuraz!%20Compré%20..." class="cta-button">
                  Responder con mi reseña →
                </a>
              </div>
            </div>
            
            <div class="signature">
              <p class="team">— El equipo de TechAuraz</p>
              <div class="ps-note">
                <p>P.D. — Si ya nos dejaste reseña en la tienda, envíanos el link y el código es tuyo igual. No vamos a hacerte trabajar doble.</p>
              </div>
            </div>"""

    return build_email_shell(
        body,
        preheader_text="Tu experiencia vale un descuento que no publicamos en la tienda."
    )


def save_templates():
    """Save all 3 email templates as HTML files."""
    print("\n" + "="*60)
    print("  PASO 2: Generando plantillas HTML de emails")
    print("="*60)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    templates = [
        {
            "filename": "email_1_bienvenido_elite.html",
            "subject": "{{ customer.first_name }}, ya eres parte de algo diferente.",
            "day": "+1",
            "generator": generate_email_1,
        },
        {
            "filename": "email_2_masterclass.html",
            "subject": "3 errores que arruinan tu tech (y cómo evitarlos)",
            "day": "+5",
            "generator": generate_email_2,
        },
        {
            "filename": "email_3_resena_wall_of_love.html",
            "subject": "{{ customer.first_name }}, ¿nos prestas 2 minutos?",
            "day": "+10",
            "generator": generate_email_3,
        },
    ]

    for tmpl in templates:
        html = tmpl["generator"]()
        filepath = os.path.join(OUTPUT_DIR, tmpl["filename"])
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"  ✓ [{tmpl['day']}] {tmpl['filename']}")
        print(f"    Asunto: {tmpl['subject']}")
        print(f"    Path:   {filepath}")

    print(f"\n  📁 Todas las plantillas guardadas en: {OUTPUT_DIR}")
    return True


def print_flow_setup_guide():
    """Print the step-by-step guide for setting up Shopify Flow."""
    print("\n" + "="*60)
    print("  PASO 3: Guía de configuración — Shopify Flow + Email")
    print("="*60)
    print("""
  ┌─────────────────────────────────────────────────────────┐
  │  CONFIGURACIÓN EN SHOPIFY ADMIN                         │
  │  (Automations > Create automation)                      │
  └─────────────────────────────────────────────────────────┘

  FLUJO 1: "Post-Purchase — Bienvenido a la Élite"
  ─────────────────────────────────────────────────
  → Trigger:  Fulfillment status = Delivered
  → Wait:     1 día
  → Action:   Send marketing email
  → Template: email_1_bienvenido_elite.html
  → Asunto:   {{ customer.first_name }}, ya eres parte de algo diferente.
  → Segment:  First-time customers / Total orders = 1

  FLUJO 2: "Post-Purchase — MasterClass"
  ──────────────────────────────────────
  → Trigger:  Fulfillment status = Delivered
  → Wait:     5 días
  → Action:   Send marketing email
  → Template: email_2_masterclass.html
  → Asunto:   3 errores que arruinan tu tech (y cómo evitarlos)
  → Segment:  First-time customers / Total orders = 1

  FLUJO 3: "Post-Purchase — Wall of Love"
  ──────────────────────────────────────
  → Trigger:  Fulfillment status = Delivered
  → Wait:     10 días
  → Action:   Send marketing email
  → Template: email_3_resena_wall_of_love.html
  → Asunto:   {{ customer.first_name }}, ¿nos prestas 2 minutos?
  → Segment:  First-time customers / Total orders = 1

  ┌─────────────────────────────────────────────────────────┐
  │  PASO EN SHOPIFY EMAIL                                   │
  │  (Marketing > Automations > Templates)                   │
  └─────────────────────────────────────────────────────────┘

  1. Ir a Marketing > Automations
  2. Click "Create automation"
  3. Seleccionar "Custom automation"
  4. Trigger: Order fulfilled
  5. Agregar condición: customer.orders_count == 1
  6. Agregar acción: Wait (X días según el email)
  7. Agregar acción: Send email
  8. En el editor de email, cambiar a HTML/código
  9. Pegar el contenido del archivo .html correspondiente
  10. Configurar asunto y preheader
  11. Preview + Activar

  ┌─────────────────────────────────────────────────────────┐
  │  ALTERNATIVA: SHOPIFY FLOW (si está disponible)          │
  └─────────────────────────────────────────────────────────┘

  Si tienes Shopify Flow:
  1. Settings > Apps > Shopify Flow
  2. Create workflow
  3. Trigger: Order fulfilled
  4. Condition: Order is first order for customer
  5. Action: Wait 1 day → Send email (usar Shopify Email)
  6. Branch: Wait 5 days → Send email #2
  7. Branch: Wait 10 days → Send email #3

  CÓDIGO DE DESCUENTO ACTIVO: {DISCOUNT_CODE} ({int(DISCOUNT_PERCENTAGE*100)}% OFF)
""")


def main():
    print("""
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   ████████╗███████╗ ██████╗██╗  ██╗ █████╗ ██╗   ██╗██████╗     ║
║   ╚══██╔══╝██╔════╝██╔════╝██║  ██║██╔══██╗██║   ██║╚════██╗    ║
║      ██║   █████╗  ██║     ███████║███████║██║   ██║ █████╔╝    ║
║      ██║   ██╔══╝  ██║     ██╔══██║██╔══██║██║   ██║██╔═══╝     ║
║      ██║   ███████╗╚██████╗██║  ██║██║  ██║╚██████╔╝███████╗    ║
║      ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝ ║
║                                                                  ║
║   🚀 Post-Purchase Email Automation Deployer                    ║
║   Flujo: Generación de Defensores de Marca                      ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
""")

    # Step 1: Create discount code
    discount_ok = create_discount_code()
    if not discount_ok:
        print("\n  ⚠ Hubo un problema creando el descuento. Revisa los errores arriba.")
        print("  Continuando con la generación de templates de todas formas...\n")

    # Step 2: Generate HTML templates
    save_templates()

    # Step 3: Print setup guide
    print_flow_setup_guide()

    print("="*60)
    print("  ✅ DESPLIEGUE COMPLETO")
    print("="*60)
    print(f"""
  Resumen:
  ├── Código de descuento: {DISCOUNT_CODE} ({int(DISCOUNT_PERCENTAGE*100)}% OFF)
  ├── Email 1 (Día +1):   Bienvenido a la Élite
  ├── Email 2 (Día +5):   MasterClass de Mantenimiento
  └── Email 3 (Día +10):  Wall of Love + Código de descuento

  Siguiente paso:
  → Abre cada .html en el navegador para preview
  → Copia el HTML al editor de Shopify Email
  → Configura los triggers en Shopify Automations
  → Activa el flujo.
""")


if __name__ == "__main__":
    main()
