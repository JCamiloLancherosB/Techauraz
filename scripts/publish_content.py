import requests
import json
import os

SHOP_DOMAIN = "7f4c40-fb.myshopify.com"
ACCESS_TOKEN = os.environ.get("SHOPIFY_ADMIN_API_KEY", "")
API_VERSION = "2026-01"
BASE_URL = f"https://{SHOP_DOMAIN}/admin/api/{API_VERSION}"
HEADERS = {
    "X-Shopify-Access-Token": ACCESS_TOKEN,
    "Content-Type": "application/json"
}

def create_page(title, body_html):
    print(f"Creating page: {title}")
    payload = {
        "page": {
            "title": title,
            "body_html": body_html,
            "published": True
        }
    }
    resp = requests.post(f"{BASE_URL}/pages.json", headers=HEADERS, json=payload)
    if resp.status_code == 201:
        data = resp.json()["page"]
        print(f"  ✅ Success. URL: https://{SHOP_DOMAIN}/pages/{data['handle']}")
    else:
        print(f"  ❌ Failed: {resp.text}")

def create_blog_articles():
    # Get blog ID
    resp = requests.get(f"{BASE_URL}/blogs.json", headers=HEADERS)
    blogs = resp.json().get("blogs", [])
    if not blogs:
        print("❌ No blog found on Shopify store.")
        return
    blog_id = blogs[0]["id"]
    print(f"Found blog '{blogs[0]['title']}' con ID {blog_id}")

    articles = [
        {
            "title": '¿Cómo elegir el mejor Power Bank en 2026?',
            "tags": 'guia, power-bank, cargadores, tips',
            "body_html": '''<h2>Guía completa para elegir tu Power Bank ideal</h2>
<p>Elegir el <strong>power bank</strong> correcto puede ser confuso con tantas opciones en el mercado. En TechAuraz hemos preparado esta guía definitiva para que tomes la mejor decisión.</p>
<h3>¿Qué capacidad necesitas?</h3>
<p>La capacidad se mide en <strong>mAh (miliamperios hora)</strong>. Un teléfono promedio tiene una batería de 4.000-5.000 mAh, así que:</p>
<ul>
<li><strong>5.000 mAh:</strong> Para 1 carga completa — ideal para emergencias</li>
<li><strong>10.000 mAh:</strong> Para 2-3 cargas — perfecto para uso diario</li>
<li><strong>20.000 mAh:</strong> Para 4-5 cargas — ideal para viajes largos</li>
</ul>
<h3>Tecnología de carga rápida</h3>
<p>Busca power banks con <strong>carga rápida de 20W o más</strong>. Esto significa que tu teléfono se cargará al 50% en solo 30 minutos.</p>
<h3>Puertos de salida</h3>
<p>Lo ideal es tener al menos <strong>USB-C + USB-A</strong> para cargar diferentes dispositivos simultáneamente.</p>
<p>En <strong>TechAuraz</strong> tenemos power banks desde $35.000 COP con envío gratis a toda Colombia. <a href="/collections/carga-energia-techaura">Ver todos los power banks →</a></p>''',
        },
        {
            "title": '5 Accesorios Tech que Todo Colombiano Necesita en 2026',
            "tags": 'guia, accesorios, tendencias, 2026',
            "body_html": '''<h2>Los accesorios tecnológicos imprescindibles este año</h2>
<p>La tecnología avanza rápido y estos 5 accesorios se han vuelto <strong>esenciales en la vida diaria</strong> de todo colombiano.</p>
<h3>1. Cable USB-C de carga rápida</h3>
<p>Con la adopción masiva del <strong>USB-C</strong>, un buen cable de carga rápida es indispensable. Busca cables con certificación de al menos <strong>60W</strong> para cargar laptop, tablet y teléfono con un solo cable.</p>
<h3>2. Power Bank 20.000 mAh</h3>
<p>Para un país donde pasamos mucho tiempo fuera de casa, una <strong>batería portátil de alta capacidad</strong> es tu mejor aliado contra la ansiedad de batería baja.</p>
<h3>3. Soporte para celular en el carro</h3>
<p>Usar el GPS sin un <strong>soporte magnético</strong> es peligroso e ilegal. Invierte en uno de calidad que no dañe la ventilación de tu vehículo.</p>
<h3>4. Audífonos inalámbricos TWS</h3>
<p>Libertad sin cables. Los <strong>audífonos TWS con ANC</strong> (cancelación de ruido) son perfectos para TransMilenio, trabajar en cafeterías o entrenar en el gimnasio.</p>
<h3>5. Hub USB-C multiconexión</h3>
<p>Si tu laptop solo tiene USB-C, un <strong>hub 8 en 1</strong> te da HDMI, USB-A, lector de tarjetas y más en un solo accesorio compacto.</p>
<p>Encuentra todos estos accesorios en <strong>TechAuraz</strong> con <strong>envío gratis y pago contra entrega</strong>. <a href="/collections/all">Ver catálogo completo →</a></p>''',
        },
        {
            "title": 'Guía: ¿Cómo Comprar en TechAuraz con Pago Contra Entrega?',
            "tags": 'guia, pago-contraentrega, como-comprar, tutorial',
            "body_html": '''<h2>Comprar tecnología online nunca fue tan fácil</h2>
<p>En TechAuraz entendemos que la <strong>confianza</strong> es lo más importante al comprar online. Por eso ofrecemos <strong>pago contra entrega</strong> en toda Colombia.</p>
<h3>Paso 1: Elige tu producto</h3>
<p>Navega nuestro catálogo y agrega al carrito los productos que te gusten. Todos incluyen <strong>envío gratis</strong>.</p>
<h3>Paso 2: Completa tus datos</h3>
<p>Ingresa tu dirección de entrega, nombre y número de teléfono. No necesitas tarjeta de crédito.</p>
<h3>Paso 3: Selecciona "Pago contra entrega"</h3>
<p>En el checkout, selecciona la opción de <strong>pago contra entrega (COD)</strong>. No pagas nada por adelantado.</p>
<h3>Paso 4: Recibe y paga</h3>
<p>Cuando el mensajero llegue a tu puerta, <strong>revisa tu producto</strong> y paga en efectivo o con datáfono. ¡Así de sencillo!</p>
<h3>Nuestra garantía</h3>
<p>Todos los productos tienen <strong>30 días de garantía</strong>. Si no estás satisfecho, te devolvemos tu dinero al 100%.</p>
<p>¿Listo para comprar? <a href="/collections/all">Explorar productos →</a> | ¿Dudas? <a href="https://wa.me/573008602789">Escríbenos por WhatsApp →</a></p>''',
        }
    ]

    for article in articles:
        print(f"Publishing blog article: {article['title']}")
        payload = {"article": article}
        resp = requests.post(f"{BASE_URL}/blogs/{blog_id}/articles.json", headers=HEADERS, json=payload)
        if resp.status_code == 201:
            print("  ✅ Success.")
        else:
            if "already" in resp.text.lower() or "taken" in resp.text.lower():
                 print("  ⏭️ Ya existe.")
            else:
                 print(f"  ❌ Failed: {resp.text}")

PRIVACY_HTML = """
<h1>Política de Privacidad para Integración de TikTok (TechAuraz)</h1>
<p><strong>Última actualización:</strong> 21 de Abril de 2026</p>

<h2>1. Introducción</h2>
<p>Esta Política de Privacidad describe cómo TechAuraz ("nosotros", "nuestro" o "la Aplicación") recopila, usa y comparte información al conectarse con la API de TikTok. Esta política está diseñada específicamente para cumplir con los requisitos del Centro para Desarrolladores de TikTok para nuestra aplicación de automatización y publicación de contenido.</p>

<h2>2. Información que Recopilamos</h2>
<p>Nuestra aplicación funciona principalmente como una herramienta interna de publicación automatizada (ContentSchedulerWorker) para los perfiles oficiales de TechAuraz. A través de la integración con la API de TikTok, podemos acceder a:</p>
<ul>
    <li><strong>Información Básica del Perfil:</strong> Nombre de usuario, foto de perfil e identificador de cuenta para validar la identidad de la cuenta de destino.</li>
    <li><strong>Permisos de Publicación (Video Publish):</strong> Acceso estrictamente limitado a la capacidad de subir, programar y publicar archivos multimedia a nuestra propia cuenta de TikTok.</li>
</ul>
<p><strong>Cláusula de No-Recopilación Externa:</strong> Nuestra aplicación NO recopila, raspa, almacena ni procesa datos personales, videos, comentarios ni información de terceros de clientes.</p>

<h2>3. Cómo Usamos la Información</h2>
<p>Los tokens de acceso y la información del perfil obtenidos se utilizan <strong>exclusivamente</strong> para:</p>
<ul>
    <li>Autenticar nuestro servidor con los permisos delegados de TikTok.</li>
    <li>Ejecutar la carga (upload) automatizada de contenido promocional.</li>
</ul>

<h2>4. Almacenamiento y Retención de Datos</h2>
<p>Los Tokens de Acceso (Access Tokens) y Refresh Tokens provistos por TikTok se almacenan bajo algoritmos de cifrado de grado militar (AES-256). Si desvinculamos la aplicación de TikTok, todo el caché se purgará atómicamente de nuestros sistemas en los siguientes siete (7) días hábiles.</p>

<h2>5. Responsabilidad Compartida y Terceros</h2>
<p>TechAuraz no comercializa, transfiere ni expone bajo ninguna circunstancia sus credenciales de TikTok a terceros no autorizados.</p>

<h2>6. Solicitudes de Eliminación de Datos</h2>
<p>Si cree que nuestra aplicación ha recopilado algún dato por error o desea exigir la eliminación de la conexión de la API, puede iniciar una Solicitud contactando al administrador del sistema operativo.<br>
<br><strong>Contacto Legal y Soporte:</strong><br>
Email: soporte@techauraz.com<br>
Equipo de Integración Backend - TechAuraz Colombia</p>
"""

TERMS_HTML = """
<h1>Términos de Servicio API (TechAuraz Content Engine)</h1>
<p><strong>Última actualización:</strong> 21 de Abril de 2026</p>

<h2>1. Propósito y Alcance</h2>
<p>Estos Términos de Servicio ("Términos") rigen el marco operativo, responsabilidades y uso de la aplicación de automatización "TechAuraz" (desarrollada internamente) en su interacción con el portal para Desarrolladores de TikTok y la API de Publicación de Contenido. Esta aplicación no está destinada a usuarios finales.</p>

<h2>2. Funcionamiento de la Aplicación</h2>
<p>TechAuraz Content Engine (ContentSchedulerWorker) es un componente de software diseñado para orquestar la distribución de contenido promocional. Al vincular nuestra cuenta de TikTok, la Aplicación automatizará tareas bajo estricta vigilancia humana.</p>

<h2>3. Cumplimiento con las Directrices de TikTok</h2>
<p>Al utilizar las APIs de TikTok a través de esta aplicación, nos comprometemos corporativamente a:</p>
<ul>
    <li>Respetar todos los Términos de Servicio de TikTok.</li>
    <li>No publicar contenido que infrinja derechos de marca, Copyright (DMCA) o pautas de la comunidad.</li>
    <li>Limitar el uso de la API a tasas de carga razonables sin ejecutar tácticas de denegación de servicio.</li>
</ul>

<h2>4. Limitación de Responsabilidades y Seguridad</h2>
<p>TechAuraz asume total responsabilidad sobre el software cliente y las contraseñas/tokens vinculados a esta integración. Proveemos protocolos estandarizados (Zero Trust Architecture).</p>

<h2>5. Modificaciones y Desvinculación</h2>
<p>Nos reservamos el derecho de modificar estos Términos o de retirar permanentemente la aplicación si el modelo de red o endpoints de TikTok son alterados. Esta herramienta puede ser revocada en cualquier instante ("Revocar acceso").</p>

<h2>6. Contacto Legal</h2>
<p>Para asuntos relacionados con cumplimiento normativo de la API, suspensiones o consultas corporativas:<br><br>
<strong>SRE & Compliance Engineering Team</strong><br>
Email: soporte@techauraz.com<br>
Bogotá, Colombia</p>
"""

if __name__ == "__main__":
    print("🚀 Pushing pages to Shopify via Admin API...")
    create_page("TikTok Privacy Policy", PRIVACY_HTML)
    create_page("TikTok Terms of Service", TERMS_HTML)
    print("\\n🚀 Pushing pending blogs to Shopify...")
    create_blog_articles()
    print("\\n✅ Done!")
