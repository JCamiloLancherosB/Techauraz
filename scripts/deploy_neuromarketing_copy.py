#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════╗
║  TECHAURAZ — NEUROMARKETING COPY ENGINE v1.0                     ║
║  Reescritura completa del catálogo: Features → Beneficios        ║
║  Deploy automático vía Shopify Admin API                         ║
╚══════════════════════════════════════════════════════════════════╝

Cada producto recibe:
  1. Hook Title (H2) → Ataca el dolor principal del cliente
  2. Bullet Points (5+) → Beneficio emocional + spec técnica
  3. Garantía Sin Riesgo → Envío 24h, toda Colombia, contra entrega
  4. FAQs (3) → Derribo rápido de objeciones

Uso:
  python deploy_neuromarketing_copy.py              # Dry run (solo muestra)
  python deploy_neuromarketing_copy.py --deploy      # Push a Shopify
  python deploy_neuromarketing_copy.py --deploy --id 10453455110453  # Solo 1 producto
"""

import json
import time
import sys
import os
import urllib.request
import urllib.error

# ─── CONFIG ──────────────────────────────────────────────────────
SHOPIFY_STORE = "7f4c40-fb.myshopify.com"
SHOPIFY_TOKEN = os.environ.get("SHOPIFY_ADMIN_API_KEY", "")
API_VERSION = "2026-01"
RATE_LIMIT_SLEEP = 0.6  # seconds between API calls

# ─── GUARANTEE BLOCK (shared across all products) ───────────────
GARANTIA_HTML = """
<h3>🛡️ Garantía Sin Riesgo TechAuraz</h3>
<p><strong>No arriesgas nada.</strong> Tu pedido sale en <strong>24 horas</strong> hacia cualquier ciudad de Colombia. Pagas <strong>contra entrega</strong> — solo si te convence cuando lo tienes en la mano. Tienes <strong>30 días de garantía</strong> contra defectos de fábrica. Y si algo no sale bien, lo resolvemos sin excusas, sin letras chiquitas, sin "escríbanos al correo". <strong>Tu plata está protegida.</strong></p>
"""


def build_html(hook, intro, bullets, faqs):
    """Genera el body_html completo para un producto."""
    bullets_html = "\n".join(
        f'<li><strong>{b[0]}</strong> — {b[1]}</li>' for b in bullets
    )
    faqs_html = "\n".join(
        f'<p><strong>{f[0]}</strong><br>{f[1]}</p>' for f in faqs
    )
    return f"""<h2>{hook}</h2>
<p>{intro}</p>

<h3>✅ Lo que esto cambia para ti</h3>
<ul>
{bullets_html}
</ul>

{GARANTIA_HTML}

<h3>❓ Preguntas Frecuentes</h3>
{faqs_html}
"""


# ═══════════════════════════════════════════════════════════════════
#  CATÁLOGO COMPLETO — COPY DE NEUROMARKETING
# ═══════════════════════════════════════════════════════════════════

PRODUCTS = {}

# ───────────────────────────────────────────────────────────────────
# 1. CARGADOR DE PARED TIPO C 125W MOTOROLA
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453453799733] = build_html(
    hook="Deja de perder mañanas esperando a que cargue tu celular",
    intro="Enchufas. Te duchas. Cuando sales, tu celular está al 100%. Así de rápido es cargar con 125W reales. El Cargador Motorola Tipo C 125W no es un cargador más — es <strong>tiempo que recuperas cada día</strong>.",
    bullets=[
        ("Gana 70% de batería mientras desayunas", "Carga ultra-rápida de 125W Power Delivery que llena tu celular en minutos, no en horas."),
        ("Un cargador para TODO", "Puerto USB-C universal compatible con iPhone 15+, Samsung, Xiaomi, iPad, MacBook Air y más."),
        ("No se daña a los 2 meses como los genéricos", "Certificación Motorola con protección anti-sobrecarga, anti-cortocircuito y regulación térmica inteligente."),
        ("Compacto: cabe en cualquier bolso o maleta", "Diseño compacto de viaje sin transformadores gigantes — lo llevas a la oficina, universidad o viaje sin estorbar."),
        ("Tu batería no se degrada", "Carga inteligente que ajusta la potencia según el dispositivo para proteger la vida útil de tu batería."),
    ],
    faqs=[
        ("¿Funciona con mi celular?", "Sí. Si tu celular carga con cable Tipo C (Samsung, Xiaomi, Motorola, iPhone 15+, Huawei), este cargador le da la máxima velocidad posible. También carga tablets y laptops livianas."),
        ("¿125W no le hace daño a la batería?", "No. El cargador tiene chip inteligente que <strong>ajusta la potencia automáticamente</strong> al máximo que tu celular soporte. Si tu celular acepta 25W, le da 25W. Si acepta 125W, le da 125W. Cero riesgo."),
        ("¿Incluye el cable?", "Incluye el cargador de pared. Te recomendamos usar un cable USB-C de buena calidad (también disponible en nuestra tienda) para aprovechar la velocidad completa."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 2. CARGADOR DE PARED TIPO C 40W CATERPILLAR
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453453766965] = build_html(
    hook="El último cargador que vas a comprar (en serio)",
    intro="¿Cansado de cargadores que duran 3 meses y se mueren? El Cargador Caterpillar 40W está construido con la misma filosofía de la marca: <strong>que aguante todo</strong>. Carga rápida real con la durabilidad que los genéricos no te dan.",
    bullets=[
        ("Carga rápida sin esperar: de 0 a 60% en 30 minutos", "Tecnología de 40W optimizada que entrega la máxima velocidad que tu celular soporte."),
        ("Construido para durar años, no meses", "Calidad Caterpillar — materiales industriales resistentes a golpes, caídas y desgaste diario."),
        ("Protege tu celular mientras carga", "Triple protección: anti-sobrecarga, anti-cortocircuito y control de temperatura que cuida tu batería."),
        ("Compatible con todo lo que tengas", "USB-C universal: Samsung, iPhone 15+, Xiaomi, Motorola, Huawei, tablets y más."),
        ("No te estorba en el enchufe", "Diseño compacto que no bloquea la toma de al lado — puedes conectar otras cosas sin problema."),
    ],
    faqs=[
        ("¿En qué se diferencia de un cargador genérico de $20.000?", "Los genéricos prometen 40W pero entregan 10W. Este es <strong>certificado Caterpillar</strong> con protección real, materiales que no se derriten y potencia verificada. Es la diferencia entre cargar en 30 minutos y cargar en 3 horas."),
        ("¿Sirve para iPhone?", "Sí, para iPhone 15 y superiores que usan USB-C. Para iPhones con Lightning, necesitas un cable adaptador."),
        ("¿Viene con garantía?", "30 días de garantía TechAuraz contra defectos. Si falla, lo reemplazamos sin preguntas."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 3. CARGADOR PARA CARRO 38W
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453455110453] = build_html(
    hook="Nunca más llegues a una reunión con el celular muerto",
    intro="Subes al carro con 15% de batería. Llegas a tu destino con batería de sobra. El Cargador de Carro 38W convierte cada trayecto en <strong>tiempo de carga productivo</strong> — GPS encendido, música sonando, y la batería subiendo.",
    bullets=[
        ("Tu trayecto al trabajo = carga completa", "38W de carga rápida QC que recupera batería significativa incluso en viajes cortos de 20 minutos."),
        ("GPS + Spotify + carga al mismo tiempo", "Potencia suficiente para mantener todas tus apps activas mientras carga — no baja la batería ni usando Waze."),
        ("Carga 2 celulares a la vez sin pelear", "Puerto dual para que tú y tu copiloto carguen al mismo tiempo, sin turnos."),
        ("Tu carro no sufre", "Protección anti-cortocircuito y anti-sobrecalentamiento que cuida tanto tu celular como el sistema eléctrico del vehículo."),
        ("Ni lo notas: pequeño y elegante", "Diseño compacto minimalista que no estorba en la consola central ni se ve feo."),
    ],
    faqs=[
        ("¿Funciona con el encendedor de cualquier carro?", "Sí. Se conecta al puerto de 12V/24V estándar (encendedor de cigarrillos) que tienen todos los carros, camionetas y SUVs."),
        ("¿Carga rápido de verdad o es marketing?", "38W QC 3.0 es <strong>carga rápida real</strong>. En un viaje de 30 minutos puedes ganar entre 40-60% de batería dependiendo de tu celular."),
        ("¿Se calienta mucho?", "No. Tiene chip de regulación térmica que mantiene la temperatura controlada. Está diseñado para funcionar incluso en el calor colombiano sin riesgo."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 4. CARGADOR PARA CARRO 4 EN 1 66W
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453453734197] = build_html(
    hook="Todo el carro cargado: tú, tu copiloto, y hasta los de atrás",
    intro="¿Viaje familiar y todos peleando por el cargador? Se acabó. El Cargador 4 en 1 de 66W tiene <strong>4 puertos de carga rápida</strong> para que cada pasajero cargue su celular al mismo tiempo. Cero peleas, 100% batería.",
    bullets=[
        ("4 dispositivos cargando al mismo tiempo — sin pelear", "4 puertos independientes (USB-C + USB-A) que reparten 66W de potencia inteligente entre todos los dispositivos."),
        ("El conductor carga mientras usa GPS sin que baje la batería", "Puerto principal de alta potencia que carga más rápido de lo que Waze consume — llegas cargado."),
        ("Viajes largos sin ansiedad de batería", "66W totales aseguran que en viajes de 2+ horas todos los celulares lleguen al 100%."),
        ("No daña el sistema eléctrico del carro", "Protección completa: anti-cortocircuito, anti-sobrecarga, regulación de voltaje y control térmico."),
        ("Diseño premium que combina con tu carro", "Acabado elegante, compacto, con indicador LED suave que no distrae al conducir."),
    ],
    faqs=[
        ("¿Los 4 puertos cargan rápido o solo uno?", "El puerto principal USB-C entrega la máxima potencia de carga rápida. Los demás puertos cargan a velocidad optimizada. <strong>Los 4 cargan simultáneamente</strong> — ninguno se apaga."),
        ("¿Sirve para tablets también?", "Sí. Carga celulares, tablets, cámaras GoPro, audífonos y cualquier dispositivo USB."),
        ("¿Funciona en carros viejos?", "Sí. Se conecta al puerto estándar de 12V (encendedor) que tienen todos los carros."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 5. CARGADOR PARA CARRO USB + CABLE GAR116
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453455143221] = build_html(
    hook="Conectas, cargas, listo — kit completo para tu carro",
    intro="Sin buscar cables compatibles, sin comprar por partes. Este kit incluye <strong>cargador de carro + cable</strong> para que conectes y olvides. Carga rápida desde el primer segundo.",
    bullets=[
        ("Todo incluido: cargador + cable, listo para usar", "Kit completo que funciona desde que lo sacas de la caja — no necesitas comprar nada más."),
        ("Carga rápida real en cada viaje", "Tecnología QC optimizada para recuperar batería incluso en trayectos cortos."),
        ("Cable que no se rompe al mes", "Cable reforzado incluido, diseñado para el uso diario en el carro sin doblarse ni dañarse."),
        ("Protege tu celular y tu carro", "Protección anti-cortocircuito y anti-sobrecarga que cuida ambos."),
        ("Compacto y discreto", "No estorba en la consola, no se ve feo, no molesta a los pasajeros."),
    ],
    faqs=[
        ("¿Qué tipo de cable incluye?", "Incluye cable compatible con los celulares más populares. Verifica en las especificaciones del producto el tipo de conector."),
        ("¿Puedo usar mi propio cable?", "Sí. El cargador funciona con cualquier cable USB. El cable incluido es un bonus."),
        ("¿Carga mientras uso el GPS?", "Sí. La potencia es suficiente para cargar mientras usas Waze/Google Maps."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 6. POWER BANK PANEL SOLAR 12000mAh
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453439381813] = build_html(
    hook="Energía infinita: el sol carga tu Power Bank mientras tú vives",
    intro="Camping, finca, paseo, emergencia — da igual dónde estés. Esta Power Bank con <strong>panel solar integrado</strong> se recarga con el sol mientras está en tu mochila. Nunca dependes de un enchufe.",
    bullets=[
        ("Carga tu celular 3 veces sin buscar un enchufe", "12.000 mAh de capacidad que dan 2-3 cargas completas a la mayoría de celulares modernos."),
        ("Se recarga sola con el sol — literalmente gratis", "Panel solar integrado que absorbe energía mientras caminas, acampas o estás en la finca."),
        ("Linterna de emergencia integrada", "LED dual potente para emergencias, camping o simplemente cuando se va la luz en tu barrio."),
        ("Carga 2 dispositivos al mismo tiempo", "Puertos duales para cargar tu celular y el de alguien más simultáneamente."),
        ("Resistente a la vida real", "Diseño robusto para exteriores — no es un aparato de vitrina, es un compañero de aventuras."),
    ],
    faqs=[
        ("¿El panel solar carga rápido?", "La carga solar es complementaria — ideal para mantener la carga o recargar lentamente en emergencias. Para carga completa rápida, usa el puerto USB con un cargador de pared. Es como tener un <strong>plan B infinito</strong>."),
        ("¿12.000 mAh cuántas cargas son?", "Aproximadamente 2-3 cargas completas para celulares con batería de 4000-5000 mAh (Samsung, iPhone, Xiaomi promedio)."),
        ("¿Es pesada?", "Pesa lo justo para la capacidad que ofrece. Cabe cómodamente en mochila o bolso."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 7. POWER BANK PORTÁTIL 4 EN 1
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453439414581] = build_html(
    hook="Un solo dispositivo carga todo — sin cargar cables extra",
    intro="¿Cansado de llevar 3 cables para 3 dispositivos? Esta Power Bank 4 en 1 trae <strong>cables integrados para todo</strong>: Tipo C, Lightning, Micro USB y USB. Sacas la power bank del bolso, conectas y listo.",
    bullets=[
        ("Cero cables sueltos en tu bolso", "4 tipos de conexión integrados en el cuerpo de la power bank — nunca más busques cables."),
        ("Carga tu celular, audífonos y reloj al mismo tiempo", "Múltiples puertos de salida para cargar varios dispositivos simultáneamente."),
        ("Se recarga con el sol como plan B", "Panel solar complementario para emergencias y situaciones sin acceso a enchufe."),
        ("Linterna LED integrada para emergencias", "Iluminación dual incluida — útil en apagones, camping o caminatas nocturnas."),
        ("Cabe en tu bolsillo, no en tu maleta", "Diseño compacto pensado para el día a día, no solo para viajes."),
    ],
    faqs=[
        ("¿Qué dispositivos puedo cargar?", "Prácticamente todos: iPhone (Lightning), Samsung/Xiaomi/Motorola (Tipo C), y dispositivos más antiguos (Micro USB). También audífonos, smartwatch y tablets."),
        ("¿El panel solar realmente funciona?", "Sí, mantiene la carga activa bajo el sol. No es tan rápida como el enchufe, pero es un <strong>respaldo invaluable</strong> cuando no tienes dónde enchufar."),
        ("¿Cuántas cargas completas da?", "Dependiendo de tu celular, entre 2-3 cargas completas."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 8. CINTA LED SENCILLA 5 METROS
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453456322869] = build_html(
    hook="Tu cuarto va a parecer otro — y tus amigos van a preguntar",
    intro="5 metros de iluminación LED RGB que transforman cualquier espacio en un <strong>lugar que da ganas de quedarse</strong>. Detrás de la TV, alrededor del escritorio, debajo de la cama. Tú pones el color, tú creas el ambiente.",
    bullets=[
        ("16 millones de colores: el ambiente que tú quieras, cuando quieras", "Chip RGB con 16M+ de combinaciones de color para crear desde un ambiente relax hasta una fiesta."),
        ("Modo música: tus luces bailan al ritmo de lo que suena", "Sensor de sonido integrado que sincroniza los LEDs con la música automáticamente."),
        ("Se instala en 10 minutos sin herramientas", "Adhesivo 3M de alta adherencia — se pega en cualquier superficie lisa. Corta a la medida con tijeras."),
        ("Control total desde el sofá", "Control remoto incluido para cambiar colores, brillo y modos sin levantarte."),
        ("Consume casi nada de electricidad", "LEDs de bajo consumo que iluminan toda la noche sin impacto en el recibo de luz."),
        ("5 metros cubren paredes, escritorio, cama y TV completa", "Longitud generosa que alcanza para decorar un espacio grande o dividir en varias zonas."),
    ],
    faqs=[
        ("¿Se pega bien o se cae?", "Trae adhesivo 3M industrial. <strong>Se pega y se queda</strong>. Funciona en paredes lisas, madera, vidrio y plástico. Solo asegúrate de limpiar la superficie antes de pegar."),
        ("¿Puedo cortarla si me sobra?", "Sí. Tiene marcas de corte cada pocos centímetros. Cortas con tijeras y listo — sigue funcionando perfectamente."),
        ("¿Se conecta al celular?", "Este modelo funciona con control remoto incluido. Plug & play: la conectas, funciona."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 9. COMBO SMARTWATCH + LENTES + AFEITADORA
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453435318581] = build_html(
    hook="3 accesorios que necesitas — 1 solo precio que te conviene",
    intro="Comprar cada cosa por separado te sale el doble. Este combo TechAuraz te da un <strong>Smartwatch funcional + Lentes de sol + Afeitadora portátil</strong> en un solo paquete. Lo que necesitas para verte bien y estar conectado.",
    bullets=[
        ("Smartwatch que te mantiene al día sin sacar el celular", "Notificaciones, pasos, calorías y control de música directo en tu muñeca."),
        ("Lentes de sol con estilo que protegen de verdad", "Protección UV para el sol colombiano — no son lentes de $10.000 que no filtran nada."),
        ("Afeitadora portátil para retoques rápidos", "Siempre presentable: retoca en la oficina, el carro o antes de una cita."),
        ("Ahorras comprando junto vs. por separado", "Precio de combo diseñado para que te lleves los 3 sin remordimiento."),
        ("Regalo perfecto: sorprendes con un combo completo", "Ideal para regalo de cumpleaños, día del padre o para darte un gusto."),
    ],
    faqs=[
        ("¿El smartwatch se conecta a mi celular?", "Sí. Se conecta por Bluetooth a iPhone y Android. Descargas la app, sincronizas y listo."),
        ("¿La afeitadora viene con carga?", "Sí. Viene lista para usar y es recargable por USB."),
        ("¿Puedo elegir el color de los lentes?", "El combo viene en colores seleccionados. Revisa las variantes disponibles en esta página."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 10. DIADEMA GAMER AKZ-022
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453442887989] = build_html(
    hook="Escucha sus pasos antes de que te vean — y gana esa partida",
    intro="En los shooters, <strong>quien oye primero dispara primero</strong>. La Diadema Gamer AKZ-022 te da sonido envolvente para detectar enemigos por posición, y un micrófono claro para que tu squad te escuche sin distorsión.",
    bullets=[
        ("Detecta enemigos por el sonido de sus pasos", "Driver de audio optimizado para frecuencias de juegos — pisadas, recargas y explosiones con posición clara."),
        ("Tu equipo te escucha sin ruido de fondo", "Micrófono con cancelación de ruido que filtra ventiladores, familiares y ruido ambiente."),
        ("Sesiones largas sin dolor de cabeza", "Almohadillas over-ear suaves con espuma de memoria que no presionan ni calientan."),
        ("Setup con estilo: iluminación RGB integrada", "LEDs RGB que le dan personalidad a tu setup gamer — se ve profesional."),
        ("Funciona con TODO: PC, PS4, PS5, Xbox, Switch, celular", "Jack 3.5mm universal + adaptador incluido. Conecta y juega en cualquier plataforma."),
    ],
    faqs=[
        ("¿Funciona con PS5?", "Sí. Jack 3.5mm universal que funciona con <strong>PC, PS4, PS5, Xbox, Nintendo Switch y celular</strong>. Plug & play, sin drivers."),
        ("¿Tiene sonido 7.1?", "Tiene drivers optimizados para gaming que simulan sonido envolvente. Perfecta para shooters y juegos competitivos."),
        ("¿El micrófono se puede apagar?", "Sí. El micrófono es flexible y se puede posicionar lejos de tu boca para silenciarlo funcionalmente."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 11. DIADEMA GAMER G9000 RGB
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453442920757] = build_html(
    hook="Sesiones de 6 horas sin dolor: tu equipo te escucha y tú los dominas",
    intro="Maratón de gaming sin que te duela la cabeza. La G9000 tiene <strong>espuma de memoria que se adapta a tu cabeza</strong> y sonido envolvente que te mete dentro del juego. Tu squad te escucha perfecto y tú escuchas todo.",
    bullets=[
        ("6+ horas de gaming sin molestia — probada por gamers reales", "Almohadillas de espuma de memoria con diseño over-ear que distribuyen la presión uniformemente."),
        ("Sonido envolvente 7.1 virtual: siente de dónde vienen los disparos", "Drivers de 50mm con simulación surround 7.1 para posicionamiento de audio preciso."),
        ("Comunicación cristalina con tu squad", "Micrófono retráctil con cancelación de ruido — tu equipo te escucha sin eco ni distorsión."),
        ("RGB que hace que tu setup se vea level pro", "Iluminación LED RGB en los auriculares que reacciona y le da vida a tu estación."),
        ("Compatible con todo sin instalar nada", "Jack 3.5mm + USB (para RGB): PC, PS4, PS5, Xbox, Switch, celular. Conectas y funciona."),
    ],
    faqs=[
        ("¿En qué se diferencia de la AKZ-022?", "La G9000 tiene <strong>drivers más grandes (50mm)</strong>, espuma de memoria premium y sonido 7.1 virtual. Si juegas competitivo más de 2 horas al día, esta es tu opción."),
        ("¿El cable es largo?", "Sí. Cable de ~2 metros diseñado para gaming de escritorio — te da libertad de movimiento."),
        ("¿Funciona para streaming?", "Sí. El micrófono tiene calidad suficiente para streams casuales y Discord."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 12. DIADEMA GAMER PSH-400 7.1
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453442953525] = build_html(
    hook="Sonido 7.1 real: siente la bala pasar a tu izquierda",
    intro="Esta no es una diadema — es una <strong>ventaja competitiva</strong>. La PSH-400 con sonido 7.1 te da posicionamiento de audio tan preciso que literalmente sabes por dónde viene cada enemigo antes de verlo.",
    bullets=[
        ("Ventaja competitiva: escuchas lo que otros jugadores no", "Audio surround 7.1 que separa sonidos en 7 canales — pisadas, disparos y recargas con dirección exacta."),
        ("Tu equipo te escucha como si estuvieras al lado", "Micrófono profesional con cancelación de ruido activa para comunicación táctica perfecta."),
        ("Maratones de gaming sin fatiga", "Diadema ajustable con almohadillas premium over-ear de espuma de memoria — distribución de peso perfecta."),
        ("Setup de streamer profesional", "Diseño agresivo con RGB que se ve brutal en cámara y en tu setup."),
        ("Toda plataforma, cero complicaciones", "Compatibilidad universal: PC, PS4, PS5, Xbox One/Series, Switch, celular."),
    ],
    faqs=[
        ("¿El 7.1 es real o simulado?", "Es sonido surround virtual 7.1 de alta calidad con drivers de gran tamaño. En la práctica, <strong>sí escuchas la dirección exacta de los sonidos</strong> — que es lo que importa para ganar."),
        ("¿Cuál es mejor: la G9000 o la PSH-400?", "La PSH-400 es el modelo premium con mejor respuesta de audio envolvente. Si el sonido posicional es tu prioridad (#1 en competitivo), elige esta."),
        ("¿Es pesada?", "Tiene un peso equilibrado con distribución en la diadema ajustable. No sientes la presión incluso en sesiones largas."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 13. ENCHUFE INTELIGENTE PARA ALEXA
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453438562613] = build_html(
    hook="Apaga la luz desde la cama — bienvenido al futuro por $49.900",
    intro="\"Alexa, apaga el ventilador.\" Y se apaga. Sin levantarte. Sin caminar en la oscuridad. El Enchufe Inteligente WiFi convierte <strong>cualquier aparato en smart</strong> — ventilador, lámpara, cafetera, lo que quieras.",
    bullets=[
        ("Controla cualquier aparato con tu voz", "Compatible con Alexa y Google Home — dale órdenes por voz y obedece al instante."),
        ("Programa horarios: que las cosas se prendan y apaguen solas", "Temporizador y programación por app para automatizar tu rutina diaria."),
        ("Control desde el celular aunque no estés en casa", "App WiFi que te permite prender y apagar cosas desde la oficina, la calle o de vacaciones."),
        ("Ahorra luz sin pensarlo", "Programa el ventilador para que se apague solo a las 2 AM y deja de pagar por energía que no usas."),
        ("Se instala en 30 segundos: enchufas y listo", "No necesitas electricista, no necesitas cables nuevos. Enchufas el dispositivo inteligente en la pared, conectas tu aparato y configuras la app."),
    ],
    faqs=[
        ("¿Necesito Alexa para usarlo?", "No es obligatorio. Puedes controlarlo solo con la app desde tu celular. Alexa y Google Home son <strong>opcionales pero deliciosos</strong> — le sumas control por voz."),
        ("¿Funciona con mi WiFi?", "Sí. Funciona con redes WiFi 2.4GHz estándar (la que tienen todos los routers colombianos). Configuración en 2 minutos."),
        ("¿Aguanta aparatos de alto consumo como el ventilador?", "Sí. Soporta aparatos de hasta 10A/2200W — suficiente para ventiladores, lámparas, cafeteras y más."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 14. ENCHUFE INTELIGENTE DOBLE
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453459927349] = build_html(
    hook="Dos enchufes inteligentes, una sola app — controla tu casa completa",
    intro="¿El ventilador Y la lámpara? Con el Enchufe Inteligente Doble controlas <strong>2 aparatos de forma independiente</strong> desde una sola toma. Duplicas la inteligencia de tu hogar sin duplicar los cables.",
    bullets=[
        ("Controla 2 aparatos por separado desde tu celular", "Cada toma se programa y enciende de forma independiente — ventilador a las 8 PM, lámpara a las 6 AM."),
        ("Compatible con Alexa y Google Home", "\"Alexa, apaga la lámpara pero deja el ventilador\" — y funciona exactamente como lo pides."),
        ("Programa y automatiza tu rutina completa", "Horarios, temporizadores y escenas inteligentes para que tu casa funcione sola."),
        ("Control remoto desde cualquier parte del mundo", "App WiFi que funciona aunque estés en la oficina — revisa si dejaste algo encendido y apágalo."),
        ("Una sola toma de pared, dos aparatos inteligentes", "Maximiza tus enchufes. No necesitas 2 aparatos separados ni adaptadores."),
    ],
    faqs=[
        ("¿Puedo controlar cada toma por separado?", "Sí. Cada una aparece como dispositivo independiente en la app. <strong>Prendes uno y apagas el otro</strong> sin problema."),
        ("¿Funciona sin internet?", "Necesitas WiFi para configurar y controlar. Sin internet, los aparatos mantienen su último estado (encendido o apagado)."),
        ("¿Cuántos vatios soporta?", "Cada toma soporta hasta 10A — suficiente para la mayoría de aparatos domésticos comunes."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 15. GIMBAL ESTABILIZADOR Q08
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453451931957] = build_html(
    hook="Tus videos van a parecer grabados con equipo profesional",
    intro="Se acabaron los videos temblorosos que nadie quiere ver. El Gimbal Q08 <strong>estabiliza tu celular en tiempo real</strong> para que cada video de TikTok, Instagram o YouTube se vea suave, cinematográfico y profesional.",
    bullets=[
        ("Videos suaves como de cine — grabados con tu celular", "Estabilización en 3 ejes que elimina temblores, sacudidas y movimientos bruscos automáticamente."),
        ("Tracking facial: la cámara te sigue mientras te mueves", "Seguimiento automático de rostro para que nunca te salgas del cuadro — perfecto para TikTok y tutoriales."),
        ("Trípode integrado: se para solo", "Base con trípode incluida para timelapses, fotos grupales y videollamadas con manos libres."),
        ("Controla todo desde el handle — sin tocar la pantalla", "Joystick y botones integrados para grabar, hacer zoom y cambiar de cámara sin soltar el gimbal."),
        ("5+ horas de batería por carga", "Batería de larga duración para grabar todo el evento, toda la tarde o todo el paseo sin quedarte sin energía."),
        ("Compatible con cualquier celular", "Pinza ajustable que sostiene desde iPhone SE hasta Samsung Ultra — todos los tamaños."),
    ],
    faqs=[
        ("¿Sirve para TikTok?", "Fue <strong>prácticamente diseñado para TikTok</strong>. Tracking facial, transiciones suaves, y estabilización perfecta para videos en movimiento."),
        ("¿Es difícil de usar?", "No. Lo sacas, pones el celular, lo enciendes y funciona. Sin apps complicadas, sin calibración — plug & play."),
        ("¿Cabe en el bolso?", "Sí. Se pliega compacto para llevarlo a cualquier parte sin estorbar."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 16. HUB USB 2.0 7 PUERTOS
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10381642203445] = build_html(
    hook="De 2 puertos a 7: nunca más desconectes algo para conectar otra cosa",
    intro="Tu laptop tiene 2 puertos USB y necesitas conectar mouse, teclado, disco duro, cámara web, memoria USB y cargador de audífonos. <strong>La cuenta no da</strong>. Este Hub te da 7 puertos USB con interruptores individuales.",
    bullets=[
        ("7 puertos USB con interruptores individuales", "Enciende solo lo que necesitas — apaga el disco duro sin desconectarlo, mantén el mouse siempre encendido."),
        ("No más conectar/desconectar todo el día", "Mouse, teclado, webcam, USB, disco duro — todo conectado permanentemente, todo accesible."),
        ("Interruptores LED que te dicen qué está activo", "Indicadores luminosos individuales para cada puerto — sabes exactamente qué está encendido."),
        ("Plug & Play: sin drivers, sin configuración", "Lo conectas al USB de tu laptop y funciona en Windows, Mac y Linux al instante."),
        ("Setup organizado: un solo cable sale de tu laptop", "En vez de 7 cables sueltos, todo converge en un hub ordenado con un solo cable principal."),
    ],
    faqs=[
        ("¿Puedo conectar un disco duro externo?", "Sí. USB 2.0 funciona perfecto para discos duros, memorias USB, teclados, mouse, cámaras web y más. Para transferencias de archivos pesados muy frecuentes, considera el Hub USB 3.0."),
        ("¿Funciona con Mac?", "<strong>Sí.</strong> Compatible con Windows, macOS y Linux. Plug & play sin drivers."),
        ("¿Necesita fuente de energía externa?", "No. Se alimenta directamente del puerto USB de tu laptop. Para dispositivos de alto consumo, algunos laptops pueden necesitar un hub con alimentación externa."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 17. HUB USB 3.0 DE 4 PUERTOS
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10381642334517] = build_html(
    hook="Archivos pesados, velocidad real — 4 puertos USB 3.0 para tu laptop",
    intro="Si mueves archivos pesados — videos, fotos, backups — a USB 2.0, estás perdiendo horas de tu vida. Este Hub USB 3.0 transfiere <strong>hasta 10x más rápido</strong> y te da 4 puertos donde tu laptop solo tenía uno.",
    bullets=[
        ("Transferencias 10x más rápido que USB 2.0", "USB 3.0 con velocidades de hasta 5Gbps — lo que antes tomaba 10 minutos ahora toma 1."),
        ("4 puertos donde antes tenías 1", "Conecta disco duro, memoria USB, webcam y más — todo al mismo tiempo, todo a máxima velocidad."),
        ("Ideal para creadores de contenido y estudiantes", "Mueve videos 4K, carpetas pesadas de la U y backups sin esperar eternamente."),
        ("Compatible con USB 2.0 también", "Retrocompatible — tus dispositivos viejos USB 2.0 funcionan perfecto aquí."),
        ("Portátil y liviano", "Lo llevas en el bolso a la universidad o coworking sin que pese ni estorbe."),
    ],
    faqs=[
        ("¿Cuál es la diferencia con el de 7 puertos USB 2.0?", "Este tiene <strong>4 puertos más rápidos</strong> (USB 3.0 = 5Gbps). El de 7 puertos usa USB 2.0 (480Mbps). Si priorizas velocidad, elige este. Si necesitas conectar muchas cosas, el de 7."),
        ("¿Funciona con Mac y Windows?", "Sí. Plug & play sin drivers en Windows, macOS y Linux."),
        ("¿Puedo conectar un SSD externo?", "Sí. Es ideal para SSDs externos — aprovechas la velocidad USB 3.0 al máximo."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 18. HUB USB-C 8 EN 1
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10381642236213] = build_html(
    hook="Tu laptop minimalista ahora tiene HDMI, USB, SD y todo lo que le falta",
    intro="Las laptops modernas vienen con 1-2 puertos USB-C y nada más. Sin HDMI para presentaciones, sin lector SD para fotos, sin USB-A para memorias. Este Hub 8 en 1 le <strong>devuelve todo lo que le quitaron</strong>.",
    bullets=[
        ("Conecta tu laptop a cualquier TV o proyector al instante", "Puerto HDMI 4K para presentaciones, películas y extender pantalla — plug & play."),
        ("Lee tarjetas SD y MicroSD sin adaptadores", "Lector dual integrado para fotógrafos, camarógrafos y cualquiera que use cámaras."),
        ("Puertos USB-A para tus dispositivos de siempre", "Conecta memorias USB, mouse, teclado y discos duros — los clásicos que nunca mueren."),
        ("Puerto Ethernet para internet estable", "RJ45 con conexión por cable cuando el WiFi no es confiable — ideal para Zoom, gaming y descargas."),
        ("Carga tu laptop mientras usas el hub", "Puerto USB-C con Power Delivery pass-through — el hub no te quita el puerto de carga."),
        ("Un solo cable: 8 conexiones", "Todo converge en un hub elegante que se conecta por USB-C a tu laptop."),
    ],
    faqs=[
        ("¿Funciona con MacBook?", "<strong>Sí.</strong> Diseñado especialmente para MacBook Air/Pro y cualquier laptop con USB-C (Dell, HP, Lenovo, ASUS)."),
        ("¿La salida HDMI es 4K?", "Sí. Soporta salida HDMI hasta 4K@30Hz — perfecto para presentaciones, Netflix y extender escritorio."),
        ("¿Puedo cargar la laptop mientras lo uso?", "Sí. El puerto USB-C PD permite carga pass-through — tu laptop se carga normalmente mientras usas los 8 puertos."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 19. MICRÓFONO CONDENSADOR GAMER USB ME6P RGB
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453434204469] = build_html(
    hook="Tu voz con calidad de estudio — tus viewers van a notar la diferencia",
    intro="Tus viewers se quedan por tu contenido pero <strong>se van por tu audio</strong>. El ME6P es un micrófono condensador USB con calidad de estudio que hace que tu voz suene profesional en streams, podcasts, clases online y Discord.",
    bullets=[
        ("Audio de estudio directo a tu PC — sin interface de sonido", "Conexión USB plug & play: lo conectas y tienes calidad de micrófono condensador profesional sin equipos extra."),
        ("Tu voz, no el ruido del ventilador", "Patrón cardioide que captura tu voz desde el frente e ignora el ruido de los lados y atrás."),
        ("RGB que le da nivel a tu setup de streaming", "Iluminación RGB personalizable que se ve brutal en cámara y combina con tu setup gamer."),
        ("Base sólida anti-vibraciones", "Soporte de escritorio con absorción de vibraciones para que golpes en la mesa no se escuchen."),
        ("Compatible con OBS, Discord, Zoom y todo lo que uses", "Funciona al instante con cualquier app de streaming, grabación o videollamada. Sin drivers."),
    ],
    faqs=[
        ("¿Necesito una tarjeta de sonido o interface?", "<strong>No.</strong> Se conecta directo por USB a tu PC o laptop. Plug & play — el sistema lo reconoce en segundos."),
        ("¿Sirve para streaming profesional?", "Sí. Calidad de condensador para Twitch, YouTube y TikTok Live. Si estás empezando, este es tu mic."),
        ("¿Se escucha el teclado cuando escribo?", "El patrón cardioide reduce significativamente los sonidos laterales. Para mejor resultado, posiciona el mic cerca de tu boca y el teclado al lado."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 20. MICRÓFONO CONDENSADOR PROFESIONAL
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453434171701] = build_html(
    hook="Deja de sonar amateur — calidad de locutor profesional por menos de $80K",
    intro="¿Clases online donde no te entienden? ¿Podcasts que suenan a teléfono viejo? El Micrófono Condensador Profesional te da <strong>voz de locutor</strong> por el precio de unos audífonos promedio.",
    bullets=[
        ("Tu voz suena clara, profesional y sin ruido", "Cápsula de condensador de alta sensibilidad que captura cada matiz de tu voz con claridad cristalina."),
        ("Perfecto para clases online, Zoom y entrevistas", "Tus alumnos, colegas o clientes te escuchan sin pedirte que repitas — profesionalismo puro."),
        ("Ideal para iniciar tu podcast", "Calidad de audio suficiente para publicar en Spotify, Apple Podcasts y YouTube sin vergüenza."),
        ("Se conecta y funciona — sin complicaciones", "Configuración simple para que no pierdas tiempo con manuales. Conecta y graba."),
        ("Construcción metálica duradera", "No es plástico barato. Cuerpo metálico con peso que se siente sólido y profesional."),
    ],
    faqs=[
        ("¿Es mejor que el micrófono del portátil?", "<strong>Incomparablemente mejor.</strong> El mic del portátil captura todo el ruido ambiente. Este aísla tu voz y la entrega con claridad profesional."),
        ("¿Funciona con celular?", "Depende del modelo de conexión. Funciona perfecto con PC y laptop. Para celular, puede requerir adaptador."),
        ("¿Incluye soporte?", "Viene con su base de soporte incluida. Listo para poner en tu escritorio y empezar."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 21. MICRÓFONO CONDENSADOR USB RGB SF-666R
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453434237237] = build_html(
    hook="El mic que tu setup necesitaba: sonido pro + RGB que impone",
    intro="Tu setup tiene RGB en el teclado, en el mouse, en la diadema... <strong>pero el micrófono se ve genérico</strong>. El SF-666R cierra el ciclo: micrófono condensador USB con iluminación RGB que suena tan bien como se ve.",
    bullets=[
        ("Audio nítido por USB: conectas y grabas", "Conexión USB directa con calidad de condensador — sin tarjeta de sonido, sin interface, sin lío."),
        ("RGB que completa tu setup de streaming", "Iluminación RGB en el cuerpo del micrófono que combina con tu teclado, mouse y diadema."),
        ("Tu squad te escucha perfecto en Discord", "Patrón cardioide que prioriza tu voz y reduce el ruido ambiente."),
        ("Base estable que no se tumba", "Soporte robusto con amortiguación — se queda en su lugar incluso si golpeas la mesa."),
        ("Compatible con todo: Windows, Mac, PS4, PS5", "Plug & play en cualquier sistema operativo. Sin drivers, sin setup complicado."),
    ],
    faqs=[
        ("¿Se ve bien en cámara para streaming?", "<strong>Sí, brutal.</strong> El RGB le da presencia visual en tu stream — tus viewers notan el upgrade."),
        ("¿Es bueno para voiceover y YouTube?", "Sí. Calidad de condensador más que suficiente para YouTube, TikTok, podcasts y producción de contenido."),
        ("¿El RGB se puede apagar?", "Sí. Puedes cambiar los modos de iluminación según tu preferencia."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 22. MINI ASPIRADORA 3 EN 1 PORTÁTIL
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453437153589] = build_html(
    hook="Adiós migajas del teclado — limpieza express en 30 segundos",
    intro="Tu teclado está sucio. Tu escritorio tiene polvo. El interior del carro tiene migajas. Lo sabes, pero la aspiradora grande <strong>es mucho show para algo tan simple</strong>. La Mini Aspiradora 3 en 1 limpia todo eso en segundos.",
    bullets=[
        ("Teclado limpio en 30 segundos — sin desmontarlo", "Boquilla delgada que llega entre las teclas y succiona polvo, migajas y pelos sin esfuerzo."),
        ("3 boquillas para todo: teclado, escritorio, carro", "3 accesorios intercambiables que se adaptan a cada superficie y rincón."),
        ("Recargable por USB — sin pilas", "Batería recargable que se carga con el mismo cable de tu celular. Sin pilas que mueren en un mes."),
        ("Cabe en el cajón del escritorio", "Tamaño mini que guardas en cualquier parte — siempre a mano cuando la necesitas."),
        ("Succiona de verdad — no es de juguete", "Motor optimizado que sorprende por su potencia para el tamaño que tiene."),
    ],
    faqs=[
        ("¿Tiene suficiente potencia?", "Sí. No es para aspirar la sala, pero para <strong>teclados, escritorios, cajones, consolas y carros</strong> funciona perfectamente."),
        ("¿Cómo se limpia?", "El depósito se abre y se vacía. Sin bolsas, sin filtros caros de reemplazar."),
        ("¿Cuánto dura la batería?", "Suficiente para varias sesiones de limpieza de escritorio antes de recargar."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 23. MINI ASPIRADORA USB FD-368
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453437186357] = build_html(
    hook="Tu escritorio limpio como nuevo — sin levantarte de la silla",
    intro="Polvo en los parlantes, migajas al lado del mouse, pelusa en el monitor. <strong>Con un botón</strong>, la Mini Aspiradora FD-368 limpia tu zona de trabajo en un minuto. Escritorio de revista sin esfuerzo.",
    bullets=[
        ("Limpieza rápida sin interrumpir tu trabajo", "Motor silencioso que limpia mientras sigues trabajando o jugando — sin show."),
        ("USB: carga con el cable de tu celular", "Sin pilas, sin cargador especial. Cualquier cable USB la carga."),
        ("Diseño compacto que parece accesorio de setup", "Se ve bien en tu escritorio. No es un aparato feo que quieres esconder."),
        ("Boquilla fina para rincones difíciles", "Limpia entre teclas, puertos USB, rejillas de laptop y rincones del escritorio."),
        ("Depósito fácil de vaciar", "Lo abres, lo vacías, lo cierras. Sin bolsas, sin filtros costosos."),
    ],
    faqs=[
        ("¿Cuál es la diferencia con la 3 en 1?", "La FD-368 es más compacta y silenciosa — ideal si la usas principalmente en el escritorio. La 3 en 1 tiene más accesorios para múltiples superficies."),
        ("¿Funciona para el carro?", "Puede funcionar para limpieza ligera del tablero, pero está optimizada para escritorios y teclados."),
        ("¿Cuánto pesa?", "Menos que tu celular. La guardas en cualquier cajón."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 24. MINI TECLADO PLEGABLE BLUETOOTH
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453437579573] = build_html(
    hook="Convierte tu celular en laptop — teclado portátil que cabe en tu bolsillo",
    intro="Escribir emails largos en el celular es una tortura. Este Mini Teclado Bluetooth se pliega al tamaño de tu billetera y se conecta a tu celular o tablet para que <strong>escribas como si fuera un computador</strong>.",
    bullets=[
        ("Escribe emails, documentos y mensajes 5x más rápido", "Teclado físico real con layout completo — se acabó el teclado virtual que no deja ver la pantalla."),
        ("Se pliega y cabe literalmente en tu bolsillo", "Diseño plegable ultra-compacto que llevas a la oficina, universidad o café sin estorbar."),
        ("Conecta con celular, tablet y laptop por Bluetooth", "Emparejamiento instantáneo sin cables con Android, iOS, Windows y macOS."),
        ("Batería que dura semanas", "Batería recargable de larga duración — usas horas al día y recargas cada semana o más."),
        ("Teclas de verdad: silenciosas y cómodas", "No son teclas de membrana barata. Tacto real con recorrido satisfactorio para escritura prolongada."),
    ],
    faqs=[
        ("¿Funciona con iPhone?", "<strong>Sí.</strong> Compatible con iOS, Android, Windows y macOS. Emparejamiento Bluetooth universal."),
        ("¿Se siente como teclado de laptop?", "Se siente cómodo y las teclas tienen buen recorrido. Es más compacto que un teclado de laptop pero perfectamente funcional para escribir rápido."),
        ("¿Incluye soporte para el celular?", "Revisa las especificaciones del producto. Recomendamos nuestro Soporte de Escritorio para celular para la experiencia completa de 'laptop'."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 25-27. MOUSE PADS GAMER (3 modelos)
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453436498229] = build_html(
    hook="Escritorio completo cubierto: mouse + teclado sobre un solo pad gigante",
    intro="Tu mouse se sale del pad, tu teclado raya la mesa, tu setup se ve incompleto. El Mouse Pad XXL de 90cm cubre <strong>todo tu escritorio</strong>: mouse y teclado sobre una superficie premium, suave y antideslizante.",
    bullets=[
        ("Cubre todo el escritorio: mouse + teclado en un solo pad", "Tamaño XXL que protege toda tu superficie de trabajo de rayones y desgaste."),
        ("Precisión total: el mouse hace lo que tu mano le dice", "Superficie micro-texturizada optimizada para sensores ópticos y láser de cualquier DPI."),
        ("No se mueve ni un milímetro", "Base de goma antideslizante que se queda exactamente donde la pones — cero frustraciones."),
        ("Bordes cosidos que no se deshilachan", "Refuerzo perimetral cosido para que el pad dure meses, no semanas."),
        ("Setup con estilo gamer profesional", "Diseño que le da identidad visual a tu estación de trabajo o gaming."),
    ],
    faqs=[
        ("¿De qué tamaño es exactamente?", "Formato XXL que cubre la zona de teclado + mouse completa. Revisa las dimensiones exactas en las especificaciones."),
        ("¿Se puede lavar?", "Sí. Limpieza con paño húmedo o lavado suave a mano. Deja secar al aire."),
        ("¿Funciona con cualquier mouse?", "<strong>Sí.</strong> Superficie optimizada para mouse óptico y láser — gaming o de oficina."),
    ]
)

PRODUCTS[10453436563765] = build_html(
    hook="Más espacio, más precisión — el pad XL que no limita tu juego",
    intro="Si tu mouse se sale del pad en medio de un flick shot, el pad es el problema 🎯. El Mouse Pad XL te da <strong>el espacio que necesitas para moverte libre</strong> sin límites.",
    bullets=[
        ("Espacio amplio para movimientos FPS de bajo DPI", "Formato XL perfecto para gamers que usan sensibilidad baja y necesitan rango de movimiento."),
        ("Superficie suave: el mouse desliza como mantequilla", "Textura optimizada para tracking preciso en cada movimiento — lento o rápido."),
        ("Base antideslizante: se queda quieto", "Goma inferior que no se mueve con movimientos bruscos."),
        ("Bordes cosidos reforzados", "Costuras perimetrales que evitan que se deshilache con el uso diario."),
        ("Diseño gamer que eleva tu setup", "Estética pensada para complementar setups gaming — no es un pad genérico de oficina."),
    ],
    faqs=[
        ("¿Cuál es la diferencia con el XXL?", "El XL es ligeramente más compacto — ideal si tu escritorio no es tan grande pero quieres más espacio que un pad normal."),
        ("¿Sirve para diseño gráfico?", "Sí. La superficie de precisión funciona excelente con mouse ópticos para diseño y edición."),
        ("¿Se enrolla después de un tiempo?", "No. Material plano que mantiene su forma con uso regular."),
    ]
)

PRODUCTS[10453436530997] = build_html(
    hook="El pad que hace que tu setup cuente una historia",
    intro="Tu setup necesita personalidad. El Mouse Pad Mapamundi XXL no solo cubre tu escritorio completo — <strong>lo convierte en una pieza de decoración</strong> que todos comentan. Funcional, hermoso y gigante.",
    bullets=[
        ("Diseño de mapamundi que es decoración + funcionalidad", "Estética única que transforma tu escritorio de genérico a memorable — todos preguntan dónde lo compraste."),
        ("Tamaño XXL: 40x90cm que cubre todo", "Mouse + teclado sobre una misma superficie premium de 90cm de largo."),
        ("Superficie de precisión para gaming y trabajo", "Texturizado micro-fino que funciona perfecto con cualquier mouse óptico o láser."),
        ("Base antideslizante de goma pesada", "Se queda firme en tu lugar — no se mueve con flick shots ni movimientos rápidos."),
        ("Bordes cosidos anti-deshilachado", "Costuras reforzadas para que la estética se mantenga como nueva por meses."),
    ],
    faqs=[
        ("¿El diseño se borra con el uso?", "No. Impresión de alta definición protegida contra desgaste. Mantenlo limpio con paño húmedo y dura perfectamente."),
        ("¿Las medidas exactas?", "40cm x 90cm — cubre un escritorio estándar completo."),
        ("¿Sirve como regalo?", "<strong>Perfecto como regalo.</strong> Llega en buena presentación y es un detalle que cualquier gamer o trabajador remoto aprecia."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 28. PARLANTE BLUETOOTH KTS-2465
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453450359093] = build_html(
    hook="Llena la sala completa de sonido — tus reuniones nunca van a sonar igual",
    intro="Un parlante de celular no llena una sala. Este sí. El KTS-2465 entrega <strong>bajos profundos y volumen alto sin distorsión</strong>. Ponlo en la sala, en el patio o en la reunión y siente la diferencia.",
    bullets=[
        ("Bajos que se sienten, no solo se oyen", "Driver de graves potente que entrega bajos profundos y envolventes — la música cobra vida."),
        ("Volumen alto sin distorsión", "A todo volumen sigue sonando limpio — nada de agudos metálicos distorsionados."),
        ("Bluetooth + USB + AUX + MicroSD", "4 formas de reproducir música: inalámbrico desde tu celular, USB, auxiliar o tarjeta de memoria."),
        ("Luces LED que crean el ambiente", "Iluminación integrada que le pone onda a la reunión, el asado o la previa."),
        ("Batería de larga duración", "Horas de música continua con una sola carga — la fiesta no para."),
    ],
    faqs=[
        ("¿Qué tan duro suena?", "Suficiente para llenar una sala grande, un patio o una reunión de 15+ personas. <strong>No es un parlantito de escritorio</strong> — esto suena de verdad."),
        ("¿Se conecta con cualquier celular?", "Sí. Bluetooth universal compatible con iPhone, Samsung, Xiaomi, Motorola y cualquier celular/tablet."),
        ("¿Cuánto dura la batería?", "Varias horas de reproducción continua a volumen medio-alto. Perfecto para una reunión completa."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 29. PARLANTE FLIP6 BLUETOOTH
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453450195253] = build_html(
    hook="Piscina, ducha, camping — tu música te sigue a donde sea, sin miedo al agua",
    intro="La música se para cuando llegas a la piscina porque le tienes miedo al agua. <strong>Con este parlante no</strong>. Resistente al agua, portable e inalámbrico — llévalo a la ducha, el río, el paseo o la terraza sin preocuparte.",
    bullets=[
        ("Resistente al agua: piscina, lluvia, ducha... sin estrés", "Protección contra salpicaduras que te deja disfrutar la música en cualquier situación con agua."),
        ("Buen sonido en un tamaño que cabe en tu mano", "Driver potente con graves sorprendentes para su tamaño compacto."),
        ("Portabilidad real: cabe en el bolsillo o en la mochila", "Diseño cilíndrico compacto que llevas a donde quieras sin sacrificar sonido."),
        ("Bluetooth sin cortes ni lag", "Conexión estable con tu celular hasta varios metros de distancia."),
        ("Batería para todo el paseo", "Horas de reproducción por carga — el paseo se acaba antes que la batería."),
    ],
    faqs=[
        ("¿Lo puedo meter al agua?", "Resiste salpicaduras y lluvia. No recomendamos sumergirlo completamente, pero <strong>el agua no lo daña en uso normal</strong> (piscina, ducha, playa)."),
        ("¿Suena fuerte para su tamaño?", "Sorprendentemente fuerte. No compite con una torre de sonido, pero llena perfectamente un cuarto, terraza o reunión pequeña."),
        ("¿Cuánto dura la batería?", "Varias horas de música continua. Perfecto para un día de paseo completo."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 30. PARLANTE LZ 805
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453450064181] = build_html(
    hook="Potencia que se siente en el pecho — no solo se oye, se vive",
    intro="Si quieres un parlante que cuando suena, <strong>todo el mundo voltea</strong>, este es. El LZ 805 tiene potencia real con bajos profundos, agudos limpios y un volumen que llena espacios abiertos sin distorsión.",
    bullets=[
        ("Bajos profundos que sientes en el cuerpo", "Woofer de alta excursión que produce graves físicos — la música no solo se escucha, se siente."),
        ("Volumen para exteriores sin distorsión", "Potencia suficiente para fiestas al aire libre, asados y reuniones grandes con sonido limpio."),
        ("Bluetooth + USB + AUX + MicroSD + Radio FM", "Todas las formas de reproducir música — siempre tienes una opción disponible."),
        ("Iluminación LED que arma la fiesta", "Luces integradas que reaccionan a la música y crean ambiente automáticamente."),
        ("Batería potente de larga duración", "Horas y horas de fiesta sin enchufar — libertad total de ubicación."),
    ],
    faqs=[
        ("¿Para cuántas personas alcanza?", "Fácilmente para reuniones de 20-30+ personas en espacio abierto. <strong>Llena un patio completo.</strong>"),
        ("¿Tiene entrada para micrófono?", "Revisa las especificaciones de conectividad. Varios parlantes de esta línea incluyen entrada auxiliar que funciona con micrófono."),
        ("¿Se puede poner en el piso o necesita mesa?", "Funciona perfecto en el piso, en una mesa o en cualquier superficie plana. La base es estable."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 31. PARLANTE TORRE DOBLE GD2137
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453450096949] = build_html(
    hook="Tu propia torre de sonido profesional: adiós al alquiler de parlantes",
    intro="Alquilar un equipo de sonido para cada fiesta cuesta $200-300K por noche. ¿Y si la torre fuera <strong>tuya</strong>? La Torre Doble GD2137 es sonido profesional de fiestas y eventos que pagas una vez y disfrutas siempre.",
    bullets=[
        ("Sonido de evento profesional — en tu casa", "Sistema de torre dual con woofers de alta potencia que llena salones, terrazas y fincas."),
        ("Karaoke incluido: micrófono inalámbrico integrado", "Micrófono wireless para karaoke, discursos o animación — la fiesta la armas tú."),
        ("Se paga solo: adiós al alquiler de sonido", "Una inversión que reemplaza el gasto recurrente de alquilar parlantes para cada evento."),
        ("Bluetooth + USB + AUX + Radio FM + Micrófono", "Conectividad total: reproduce desde el celular, USB, radio o canta con el mic inalámbrico."),
        ("Iluminación LED de fiesta integrada", "Juego de luces que reacciona a la música — crea ambiente de evento sin equipo extra."),
        ("Batería recargable: llévatela a la finca", "No dependes de enchufe. Llévala al patio, la finca o el campo y suena igual de duro."),
    ],
    faqs=[
        ("¿Realmente reemplaza un equipo de alquiler?", "<strong>Para fiestas caseras y reuniones, sí.</strong> No es un equipo de tarima profesional, pero para tu casa, finca, cumpleaños y reuniones de hasta 50+ personas, sobra."),
        ("¿El micrófono viene incluido?", "Sí. Incluye micrófono inalámbrico para karaoke y animación."),
        ("¿Cuánto dura la batería?", "Varias horas de reproducción a volumen alto. Suficiente para una fiesta completa."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 32. PARLANTE TORRE KARAOKE YX-H8307A
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453450129717] = build_html(
    hook="La fiesta es en tu casa: karaoke profesional con micrófono incluido",
    intro="¿Quién necesita ir a un bar de karaoke cuando puedes <strong>tener el karaoke en tu sala</strong>? La Torre YX-H8307A combina sonido potente + micrófono inalámbrico + luces LED en un solo equipo que arma la fiesta donde quieras.",
    bullets=[
        ("Karaoke en casa: micrófono inalámbrico incluido", "Canta tus canciones favoritas con mic wireless — YouTube + esta torre = karaoke profesional gratis."),
        ("Sonido de fiesta que llena la sala completa", "Torre de alta potencia con bajos reales que se sienten — esto no es un parlantito."),
        ("Luces LED de discoteca integradas", "Efectos de luz que reaccionan a la música y crean ambiente de fiesta automáticamente."),
        ("Batería portátil: fiesta en la terraza sin cables", "Recargable para que la lleves al patio, balcón, finca o paseo."),
        ("Bluetooth + USB + AUX + Radio FM", "Conecta tu celular, USB o radio — siempre suena algo."),
    ],
    faqs=[
        ("¿Incluye el micrófono?", "<strong>Sí.</strong> Viene con micrófono inalámbrico listo para usar — sácalo, enciéndelo y canta."),
        ("¿Cómo pongo karaoke?", "Fácil: abres YouTube, buscas la canción con 'karaoke' y la conectas por Bluetooth a la torre. Cantas con el micrófono incluido."),
        ("¿Es suficiente para una fiesta de 20 personas?", "De sobra. Llena una sala grande o terraza cubierta con sonido potente y limpio."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 33. POWER BANK 20.000 mAh
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10381641908533] = build_html(
    hook="4 cargas completas — nunca más el susto de 5% de batería",
    intro="Esas notificaciones de \"batería baja\" en mitad del día se acabaron. La Power Bank de 20.000 mAh te da <strong>hasta 4 cargas completas</strong> de tu celular. Sales de tu casa con ella en el bolso y no vuelves a pensar en batería.",
    bullets=[
        ("4 cargas completas de tu celular — batería para 3 días", "20.000 mAh reales que cargan tu celular hasta 4 veces dependiendo del modelo."),
        ("Carga rápida: recupera batería en minutos, no horas", "Tecnología de carga rápida que llena tu celular significativamente durante un almuerzo."),
        ("Carga 2 dispositivos al mismo tiempo", "Puertos duales para cargar tu celular y audífonos/tablet/reloj simultáneamente."),
        ("Display LED que te dice cuánta energía le queda", "Indicador digital preciso — siempre sabes exactamente cuánta carga tienes disponible."),
        ("Protección inteligente para tu celular", "Circuito anti-sobrecarga, anti-cortocircuito y regulación térmica que cuida tu batería."),
    ],
    faqs=[
        ("¿20.000 mAh cuántas cargas reales son?", "Depende de tu celular: iPhone 14/15 ≈ 4 cargas. Samsung S24 ≈ 3.5 cargas. <strong>Mínimo 3 cargas completas</strong> para cualquier celular moderno."),
        ("¿Cuánto pesa?", "Tiene el peso esperado para 20.000 mAh — cabe cómodamente en bolso o mochila para uso diario."),
        ("¿Carga mientras la power bank se recarga?", "Sí. Función pass-through que permite cargar tu celular mientras la power bank se recarga (no recomendado como uso habitual para preservar la batería)."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 34. POWER BANK Q6 20.000 mAh
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10381639450933] = build_html(
    hook="20.000 mAh que caben en tu bolsillo — energía para 3 días",
    intro="Power Bank de alta capacidad que no parece de alta capacidad. La Q6 guarda <strong>20.000 mAh en un cuerpo compacto</strong> que llevas a todas partes sin sentir que cargas un ladrillo.",
    bullets=[
        ("20.000 mAh en formato compacto", "Toda la potencia de una power bank grande en un cuerpo diseñado para caber en tu bolsillo o bolso pequeño."),
        ("3-4 cargas completas de cualquier celular", "Capacidad suficiente para un fin de semana entero sin buscar enchufes."),
        ("Carga rápida que no te hace esperar", "Tecnología de carga optimizada para recuperar batería durante un café o un almuerzo."),
        ("Diseño premium que combina con tu estilo", "Acabado elegante y moderno — no es una caja plástica genérica."),
        ("Protección completa para tus dispositivos", "Anti-sobrecarga, anti-cortocircuito, regulación de temperatura integrada."),
    ],
    faqs=[
        ("¿En qué se diferencia de la Power Bank de $169.900?", "La Q6 prioriza la <strong>portabilidad y relación precio-capacidad</strong>. Ambas son 20.000 mAh, pero la Q6 ofrece el mejor valor si buscas potencia sin pagar de más."),
        ("¿Carga laptops?", "Está diseñada para celulares, tablets, audífonos y dispositivos USB. Para laptops se necesita una power bank con USB-C PD de mayor voltaje."),
        ("¿Cuánto tarda en recargarse la power bank?", "Entre 6-8 horas con un cargador de 2A estándar. La enchufas de noche y amanece lista."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 35. POWER BANK TRANSPARENTE 20.000 mAh
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10381641384245] = build_html(
    hook="Potencia que se ve: el diseño que todos van a preguntarte dónde lo compraste",
    intro="¿Una Power Bank que es accesorio de moda? La Power Bank Transparente te deja ver los circuitos internos a través de su <strong>carcasa cristalina</strong>. 20.000 mAh de potencia real con un diseño que nadie más tiene.",
    bullets=[
        ("Diseño transparente que voltea cabezas", "Carcasa cristalina que muestra la tecnología interior — parece sacado de una película de ciencia ficción."),
        ("20.000 mAh: 3-4 cargas completas", "La misma potencia de cualquier power bank premium, pero con un look que ninguna otra ofrece."),
        ("Carga rápida para no esperar", "Tecnología de carga optimizada que recupera batería rápidamente."),
        ("Display digital elegante", "Indicador LED integrado que muestra el porcentaje exacto de carga restante."),
        ("Protección completa anti-accidentes", "Circuitos de protección anti-sobrecarga, anti-cortocircuito y control térmico — bonito por fuera, seguro por dentro."),
    ],
    faqs=[
        ("¿La carcasa transparente es frágil?", "<strong>No.</strong> Es policarbonato resistente — el mismo material de protectores de celular premium. Transparente pero robusto."),
        ("¿Funciona igual que una power bank normal?", "Exactamente igual en rendimiento. 20.000 mAh reales con carga rápida. La diferencia es puramente estética — y esa diferencia es brutal."),
        ("¿Sirve como regalo?", "Es uno de los regalos tech más populares por su diseño único. <strong>Sorprendes garantizado</strong> porque nadie espera una power bank tan bonita."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 36. SOPORTE AJUSTABLE PARA LAPTOP (Premium)
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10381642727733] = build_html(
    hook="Adiós dolor de cuello: tu laptop a la altura correcta desde hoy",
    intro="Llevas meses con la laptop sobre la mesa y el cuello inclinado hacia abajo. <strong>Eso tiene un costo en tu salud</strong>. Este soporte eleva tu pantalla a la altura de tus ojos — la postura correcta que tu cuello y espalda agradecen.",
    bullets=[
        ("Tu cuello deja de sufrir desde el primer día", "Elevación ajustable que pone tu pantalla a la altura de tus ojos — postura ergonómica inmediata."),
        ("Ángulo ajustable: encuentra tu posición perfecta", "Múltiples ángulos de inclinación para que trabajes cómodo según tu silla y escritorio."),
        ("Tu laptop respira mejor y no se recalienta", "Diseño abierto con ventilación que mejora el flujo de aire — laptop más fría, rendimiento más estable."),
        ("Setup profesional que se ve organizado", "Eleva la laptop y ganas espacio debajo para teclado, cuadernos o almacenamiento."),
        ("Construcción metálica: no se tambalea, no se rompe", "Aluminio/metal sólido que soporta laptops pesadas sin flexión ni inestabilidad."),
    ],
    faqs=[
        ("¿Sirve para MacBook?", "<strong>Sí.</strong> Compatible con MacBook Air, Pro y cualquier laptop de 10\" a 17\"."),
        ("¿Necesito teclado externo?", "Se recomienda usar teclado y mouse externo para la postura ergonómica completa. La idea es que la pantalla quede a la altura de tus ojos y escribas con los brazos en 90°."),
        ("¿Se mueve cuando escribo?", "No. Base estable con almohadillas antideslizantes que mantienen el soporte firme en tu escritorio."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 37. SOPORTE AJUSTABLE PARA LAPTOP (Económico)
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10381642760501] = build_html(
    hook="Laptop fresca + postura perfecta — el upgrade que tu espalda necesitaba",
    intro="El upgrade más barato que puedes hacerle a tu salud. Por $75.000 tu laptop se eleva, tu cuello se alinea, tu laptop se enfría y tu escritorio <strong>se ve como de profesional</strong>.",
    bullets=[
        ("Postura correcta por el precio de una comida + café", "Inversión mínima que elimina el dolor de cuello y espalda por trabajar inclinado todo el día."),
        ("Laptop más fría = rendimiento más estable", "Elevación que mejora la ventilación natural de tu laptop — menos calor, menos lag."),
        ("Ángulos ajustables para tu comodidad", "Inclinación variable para encontrar tu posición perfecta de trabajo."),
        ("Plegable: lo guardas cuando no lo usas", "Se pliega plano para guardarlo en un cajón o llevarlo en tu mochila."),
        ("Compatible con cualquier laptop", "Diseño universal que funciona con laptops de 10\" a 15\"."),
    ],
    faqs=[
        ("¿Cuál es la diferencia con el de $129.900?", "Este es más compacto y plegable — ideal si necesitas portabilidad o tienes presupuesto ajustado. El premium es más robusto para uso permanente en escritorio."),
        ("¿Aguanta laptops de gaming pesadas?", "Soporta laptops estándar. Para laptops gaming ultra-pesadas (+3kg), recomendamos el modelo premium."),
        ("¿Se resbala la laptop?", "No. Tiene topes y almohadillas de silicona que mantienen tu laptop firme en su posición."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 38. SOPORTE CELULAR MAGNÉTICO CON VENTOSA
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453442134325] = build_html(
    hook="GPS a la vista, manos al volante — maneja seguro",
    intro="Manejar con el celular en la mano o en el regazo es un riesgo que <strong>no vale la pena</strong>. Este soporte magnético con ventosa se pega al parabrisas y sostiene tu celular a la vista — GPS, llamadas y música sin soltar el volante.",
    bullets=[
        ("Seguridad vial: manos libres de verdad", "Tu celular queda fijo a la altura de tu vista — no necesitas bajar la mirada ni soltar el volante."),
        ("Se pega con ventosa industrial — no se cae", "Ventosa de succión reforzada que se adhiere al parabrisas y aguanta baches, huecos y frenazos."),
        ("Magnético: pones y quitas el celular en 1 segundo", "Imán potente que sostiene tu celular al instante — no hay pinzas que abrir ni ajustar."),
        ("Gira 360°: posición horizontal o vertical", "Rotación completa para usar GPS en horizontal o ver notificaciones en vertical."),
        ("Universal: funciona con cualquier celular", "Compatible con todos los tamaños de celular con la plaqueta magnética incluida."),
    ],
    faqs=[
        ("¿El imán daña mi celular?", "<strong>No.</strong> El imán está diseñado para uso con celulares y no afecta el funcionamiento del teléfono."),
        ("¿Se cae con los huecos de las calles colombianas?", "La ventosa es de grado industrial. Una vez pegada, aguanta vibración fuerte, baches y frenazos. Si se afloja, solo la humedeces y la vuelves a pegar."),
        ("¿Funciona con case/funda?", "Sí. La plaqueta magnética va entre tu celular y la funda, y el imán sostiene a través de la funda sin problema."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 39. SOPORTE DE ESCRITORIO PARA CELULAR
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453432271157] = build_html(
    hook="Tu celular siempre visible: videollamadas, notificaciones y contenido sin sostenerlo",
    intro="¿Cuántas veces al día agarras tu celular solo para ver una notificación? Ponlo en el soporte y <strong>ves todo sin tocarlo</strong> — perfecto para videollamadas, ver recetas, seguir tutoriales o simplemente tenerlo a la vista.",
    bullets=[
        ("Videollamadas sin sostener el celular 30 minutos", "Ángulo perfecto para Zoom, Google Meet y WhatsApp video — tus manos quedan libres."),
        ("Ve notificaciones de un vistazo sin interrumpir tu trabajo", "Tu celular siempre visible en tu escritorio — decides si vale la pena agarrarlo."),
        ("Perfecto para seguir recetas, tutoriales o clases", "Cocina, estudia o trabaja con el celular a la vista en el ángulo perfecto."),
        ("Ángulo ajustable para tu comodidad", "Inclinación variable para adaptar la vista según tu posición."),
        ("Compacto: no ocupa espacio en tu escritorio", "Base mínima que sostiene sin invadir tu zona de trabajo."),
    ],
    faqs=[
        ("¿Funciona con celulares grandes?", "Sí. Compatible con celulares de todos los tamaños, desde iPhone SE hasta Samsung Ultra. También sostiene tablets pequeños."),
        ("¿Funciona con funda?", "Sí. Funciona perfectamente con funda/case puesta."),
        ("¿Es estable o se tumba?", "Base estable con contrapeso diseñado. <strong>Se queda firme</strong> incluso tocando la pantalla."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 40. SOPORTE PARA MOTO ANTILLUVIA
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453463990581] = build_html(
    hook="GPS en tu moto sin importar si llueve — tu celular 100% protegido",
    intro="Necesitas GPS en la moto pero le tienes miedo a la lluvia. Este soporte tiene <strong>funda impermeable integrada</strong> que protege tu celular del agua, el polvo y los golpes mientras navegas tranquilo.",
    bullets=[
        ("Funda impermeable: lluvia, polvo, barro — tu celular intacto", "Protección sellada contra agua que te deja usar GPS bajo el aguacero colombiano sin estrés."),
        ("Pantalla táctil funciona a través de la funda", "No necesitas sacar el celular para operar el GPS — tocas a través del protector transparente."),
        ("Agarre firme que aguanta baches y velocidad", "Sistema de sujeción al manubrio que no vibra ni se afloja con el movimiento de la moto."),
        ("Rotación 360°: posición perfecta para tu vista", "Ajusta el ángulo para ver el GPS sin bajar la mirada del camino."),
        ("Compatible con celulares de todos los tamaños", "Funda expandible que se adapta desde celulares compactos hasta los más grandes del mercado."),
    ],
    faqs=[
        ("¿Realmente protege de la lluvia?", "<strong>Sí.</strong> Funda sellada contra salpicaduras y lluvia directa. Tu celular se mantiene seco mientras manejas bajo la lluvia."),
        ("¿Se puede instalar en cualquier moto?", "Sí. Se sujeta al manubrio estándar de cualquier moto o bicicleta con abrazadera universal ajustable."),
        ("¿El celular se calienta dentro de la funda?", "Para recorridos normales no hay problema. En trayectos muy largos bajo sol directo, recomendamos hacer paradas periódicas."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 41. SOPORTE MOTO/BICICLETA (básico)
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453463957813] = build_html(
    hook="Nunca más te pierdas en moto: GPS firme y a la vista",
    intro="Manejar con el celular en el bolsillo mientras intentas recordar la dirección <strong>es un desastre esperando a pasar</strong>. Este soporte pone tu GPS al frente, firme y visible. Llegas a donde vas, sin rodeos.",
    bullets=[
        ("GPS siempre visible sin soltar el manubrio", "Tu celular queda al frente, a la altura de tu vista — navegas sin desviar la atención del camino."),
        ("Instalación en 2 minutos sin herramientas", "Abrazadera de ajuste rápido que se monta en cualquier manubrio de moto o bicicleta."),
        ("Agarre firme en baches y velocidad", "Sistema de sujeción con goma antivibración que mantiene tu celular estable."),
        ("Rotación ajustable para el ángulo perfecto", "Gira y ajusta para la posición que mejor te funcione según tu moto."),
        ("Precio justo por seguridad real", "Inversión mínima que evita accidentes por estar mirando el celular en la mano."),
    ],
    faqs=[
        ("¿Sirve para bicicleta también?", "<strong>Sí.</strong> Se monta en el manubrio de motos y bicicletas con el mismo sistema de sujeción."),
        ("¿El celular se cae con los huecos?", "No. El agarre con goma de presión mantiene el celular seguro. En baches extremos, asegúrate de que esté bien ajustado."),
        ("¿Protege de la lluvia?", "Este modelo no tiene protección impermeable. Si necesitas usar GPS bajo lluvia, mira nuestro Soporte Antilluvia con funda impermeable."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 42. SOPORTE MAGNÉTICO CON VENTOSA K007
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453442101557] = build_html(
    hook="Se pega y no se cae: el soporte magnético que realmente aguanta",
    intro="¿Has comprado soportes de celular para el carro que se caen con el primer hueco? Este no. La ventosa K007 tiene <strong>succión de grado industrial</strong> y un imán potente que sostiene tu celular firme, pase lo que pase en la vía.",
    bullets=[
        ("Ventosa que realmente se queda pegada", "Succión industrial que se adhiere al parabrisas y NO se despega con huecos, frenazos ni calor."),
        ("Magnético: celular puesto en 1 segundo", "Imán potente — acercas el celular y se queda. Sin pinzas, sin ajustes, sin esperar."),
        ("Tu GPS siempre a la vista — manejo seguro", "Celular fijo a la altura de tu vista para GPS, llamadas y música sin soltar el volante."),
        ("Gira 360° para horizontal o vertical", "Rotación completa para GPS en horizontal o notificaciones en vertical — tú decides."),
        ("Compatible con cualquier celular + funda", "Funciona con la plaqueta magnética incluida a través de cualquier funda o case."),
    ],
    faqs=[
        ("¿Cuánto peso aguanta?", "Sostiene celulares de todos los tamaños y pesos del mercado actual — desde iPhone SE hasta Samsung S24 Ultra con funda. <strong>No se cae.</strong>"),
        ("¿Se pega en parabrisas polarizado?", "Sí. La ventosa se adhiere a cualquier superficie lisa: parabrisas (con o sin polarizado), tablero liso, vidrio."),
        ("¿La plaqueta magnética es reutilizable?", "Sí quedan adhesivas por mucho tiempo. Si cambias de celular, puedes pegarla en el nuevo."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 43. SOPORTE PLEGABLE PARA LAPTOP
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10381642793269] = build_html(
    hook="Setup minimalista: tu laptop elevada, tu escritorio despejado",
    intro="Un escritorio desordenado es una mente desordenada. El Soporte Plegable eleva tu laptop, libera espacio debajo y le da a tu zona de trabajo ese <strong>look minimalista de coworking premium</strong>.",
    bullets=[
        ("Elevación ergonómica que cuida tu cuello y espalda", "Pone la pantalla a una altura más cómoda para reducir la tensión cervical."),
        ("Plegable: se guarda en segundos", "Lo pliegas plano y lo guardas en el cajón o mochila — perfecto para nómadas digitales."),
        ("Espacio libre debajo para teclado o cuadernos", "Eleva la laptop y ganas superficie útil de escritorio."),
        ("Ultra-liviano pero estable", "Diseño minimalista que pesa poco pero sostiene tu laptop con firmeza."),
        ("Ventilación natural para tu laptop", "La elevación mejora el flujo de aire — laptop más fría durante sesiones largas de trabajo."),
    ],
    faqs=[
        ("¿Funciona con MacBook y Windows?", "<strong>Sí.</strong> Compatible con cualquier laptop de 10\" a 15.6\"."),
        ("¿Es estable para escribir?", "Sí, con teclado externo. La laptop se mantiene firme en su posición. Para escribir directamente en el teclado de la laptop, funciona pero es más cómodo con un teclado externo."),
        ("¿Cuánto pesa?", "Ultra-liviano. Lo llevas en la mochila sin sentir que cargas algo extra."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 44. SOPORTE TV MONITOR
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10453462876469] = build_html(
    hook="TV flotante en la pared: más espacio, mejor vista, cero riesgo",
    intro="La TV en un mueble ocupa media sala y está a una altura incómoda. <strong>Ponla en la pared</strong>: ganas espacio, la ves mejor, y se ve 10 veces más elegante. Instalación simple, cualquiera puede.",
    bullets=[
        ("Ganas espacio: eliminas el mueble de la TV", "Tu TV queda flotando en la pared — recuperas metros cuadrados de sala."),
        ("Altura perfecta para ver desde el sofá", "Montas la TV a la altura exacta para tu sofá — adiós tortícolis por ver TV inclinado."),
        ("Instalación simple con guía incluida", "Tornillos y guía de instalación incluidos. Cualquier persona con un taladro lo puede montar."),
        ("Tu sala se ve moderna y organizada", "TV en pared = look de apartamento premium. Se acabó el mueble genérico con cables colgando."),
        ("Compatibilidad universal VESA", "Patrón de montaje estándar VESA compatible con la mayoría de TVs y monitores del mercado."),
    ],
    faqs=[
        ("¿Funciona con mi TV?", "Compatible con TVs y monitores con patrón VESA estándar. <strong>La mayoría de TVs Samsung, LG, Hisense y Xiaomi son compatibles.</strong> Revisa las especificaciones VESA de tu TV."),
        ("¿Necesito contratar instalación?", "Puedes instalarlo tú mismo con un taladro y los tornillos incluidos. Es más simple de lo que parece. Si prefieres, cualquier técnico local lo monta en 30 minutos."),
        ("¿Aguanta TVs pesadas?", "Diseñado para TVs estándar. Revisa el peso máximo soportado en las especificaciones para confirmar compatibilidad con tu modelo."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 45. SWITCH HDMI 4K
# ───────────────────────────────────────────────────────────────────
PRODUCTS[10381642268981] = build_html(
    hook="PS5, Xbox, PC — cambia de consola con 1 clic, sin tocar un cable",
    intro="Si cada vez que quieres jugar PS5 tienes que desconectar el Xbox del HDMI, <strong>ya perdiste tiempo y paciencia</strong>. El Switch HDMI 4K conecta 3 dispositivos a una sola entrada HDMI y cambias entre ellos con un botón.",
    bullets=[
        ("3 consolas/dispositivos en 1 solo HDMI", "Conecta PS5 + Xbox + PC (o Chromecast, laptop, lo que sea) a una sola entrada HDMI de tu TV."),
        ("Cambias de dispositivo con 1 clic", "Botón físico o control remoto para switchear al instante — sin desconectar ni reconectar cables jamás."),
        ("Calidad 4K sin pérdida de imagen", "Switch que mantiene resolución 4K completa — no degrada la calidad de video ni introduce lag."),
        ("Se acabaron los cables HDMI colgando detrás de la TV", "3 cables organizados que van al switch, y 1 solo cable del switch a la TV. Limpio."),
        ("Compatible con todo dispositivo HDMI", "PS5, PS4, Xbox Series, Nintendo Switch, PC, laptop, Chromecast, Fire Stick, Roku — todo funciona."),
    ],
    faqs=[
        ("¿Introduce lag o delay?", "<strong>No.</strong> Switching pasivo que no agrega latencia. La señal pasa directa sin procesamiento — los gamers no notan diferencia alguna."),
        ("¿Necesita fuente de alimentación?", "Se alimenta directamente de la señal HDMI — no necesitas enchufar nada extra."),
        ("¿Funciona con barras de sonido y sistemas de audio?", "Sí. La señal HDMI incluye audio. Si tu TV sale a barra de sonido, todo funciona igual."),
    ]
)

# ───────────────────────────────────────────────────────────────────
# 46. TECNOLOGÍA PORTÁTIL (Smartwatch / Audífonos Cyberpunk)
# ───────────────────────────────────────────────────────────────────
_wearable_html = build_html(
    hook="Diseño del futuro, sonido del presente — tecnología que voltea cabezas",
    intro="Esto no es un accesorio más. Es una <strong>declaración de estilo</strong>. Tecnología portátil con estética cyberpunk que combina diseño futurista con funcionalidad real. Cada vez que alguien te vea usándola, va a preguntar: ¿dónde lo compraste?",
    bullets=[
        ("Sonido envolvente con cancelación de ruido", "Auriculares con cancelación activa que te aíslan del ruido y te sumergen en tu música, podcast o llamada."),
        ("Estética holográfica que nadie más tiene", "Diseño cyberpunk futurista con acabados que se ven de otro planeta — hecho para destacar."),
        ("Batería que dura todo el día real", "Horas de uso continuo con estuche de carga — sales de tu casa a las 6 AM y llegas a las 10 PM con batería."),
        ("Conectividad Bluetooth estable", "Emparejamiento instantáneo con iPhone y Android — sin cortes, sin lag, sin desconexiones."),
        ("Comodidad para todo el día", "Diseño ergonómico que no molesta ni se cae — los usas para trabajar, entrenar o pasear."),
        ("Llamadas con claridad total", "Micrófono integrado con reducción de ruido para que te escuchen perfectamente en llamadas."),
    ],
    faqs=[
        ("¿La cancelación de ruido es real?", "<strong>Sí.</strong> Cancelación activa que reduce significativamente el ruido del bus, la calle, la oficina y el gimnasio. Tu música, sin interrupciones."),
        ("¿Son resistentes al sudor?", "Diseñados para uso diario incluyendo ejercicio moderado. Resistencia a salpicaduras y sudor."),
        ("¿Funcionan con iPhone y Android?", "Sí. Bluetooth universal compatible con cualquier celular, tablet o laptop con Bluetooth."),
    ]
)

# Apply to all wearable variant product IDs
WEARABLE_IDS = [
    10470721814837, 10470726533429, 10470727418165, 10470728139061,
    10470746226997, 10470746947893, 10470759334197, 10470759465269,
    10470760415541, 10470761300277, 10470761496885
]
for wid in WEARABLE_IDS:
    PRODUCTS[wid] = _wearable_html


# ═══════════════════════════════════════════════════════════════════
#  DEPLOYMENT ENGINE
# ═══════════════════════════════════════════════════════════════════

def update_product(product_id: int, body_html: str, dry_run: bool = True) -> bool:
    """Push updated body_html to Shopify via Admin API."""
    url = f"https://{SHOPIFY_STORE}/admin/api/{API_VERSION}/products/{product_id}.json"
    
    payload = json.dumps({
        "product": {
            "id": product_id,
            "body_html": body_html
        }
    }).encode("utf-8")
    
    if dry_run:
        preview = body_html[:200].replace('\n', ' ')
        print(f"  [DRY RUN] Would update product {product_id}")
        print(f"  Preview: {preview}...")
        return True
    
    try:
        req = urllib.request.Request(
            url,
            data=payload,
            headers={
                "X-Shopify-Access-Token": SHOPIFY_TOKEN,
                "Content-Type": "application/json"
            },
            method="PUT"
        )
        with urllib.request.urlopen(req) as resp:
            if resp.status == 200:
                data = json.loads(resp.read().decode())
                print(f"  ✅ Updated: {data['product']['title']}")
                return True
            else:
                print(f"  ❌ HTTP {resp.status} for product {product_id}")
                return False
    except urllib.error.HTTPError as e:
        error_body = e.read().decode() if e.fp else "N/A"
        print(f"  ❌ HTTP {e.code} for product {product_id}: {error_body[:200]}")
        return False
    except Exception as e:
        print(f"  ❌ Error for product {product_id}: {e}")
        return False


def main():
    deploy = "--deploy" in sys.argv
    single_id = None
    
    for i, arg in enumerate(sys.argv):
        if arg == "--id" and i + 1 < len(sys.argv):
            single_id = int(sys.argv[i + 1])
    
    mode = "🚀 DEPLOY MODE" if deploy else "👀 DRY RUN MODE (use --deploy to push)"
    
    print("=" * 65)
    print("  TECHAURAZ — NEUROMARKETING COPY DEPLOYMENT ENGINE")
    print(f"  Mode: {mode}")
    print(f"  Products: {len(PRODUCTS)} descriptions ready")
    if single_id:
        print(f"  Filter: Only product {single_id}")
    print("=" * 65)
    print()
    
    success = 0
    failed = 0
    skipped = 0
    
    for pid, html in PRODUCTS.items():
        if single_id and pid != single_id:
            skipped += 1
            continue
        
        print(f"[{success + failed + 1}/{len(PRODUCTS)}] Processing product {pid}...")
        
        if update_product(pid, html, dry_run=not deploy):
            success += 1
        else:
            failed += 1
        
        if deploy:
            time.sleep(RATE_LIMIT_SLEEP)
    
    print()
    print("=" * 65)
    print(f"  RESULTS: ✅ {success} updated | ❌ {failed} failed | ⏭️ {skipped} skipped")
    if not deploy:
        print("  ⚠️  This was a DRY RUN. Run with --deploy to push to Shopify.")
    print("=" * 65)


if __name__ == "__main__":
    main()
