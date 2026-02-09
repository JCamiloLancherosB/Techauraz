# Configuración del Above-the-Fold del PDP

Este documento explica cómo configurar el área "above-the-fold" (ATF) de la página de producto para maximizar la conversión en mobile (360x800).

## Bloques Implementados

### 1. Trust Line (Línea de Confianza)
Un nuevo bloque que muestra dos elementos de confianza en una línea compacta:
- 💵 Contraentrega en Colombia
- ✅ Garantía 30 días

### 2. Wrapper ATF
Se agregó un wrapper `.tech-pdp-atf` que envuelve automáticamente el contenido crítico del ATF para optimizar el espaciado.

## Cómo Configurar

### Paso 1: Agregar el Bloque Trust Line
1. En el editor de temas de Shopify, navega a la sección de producto
2. Haz clic en "Agregar bloque"
3. Selecciona "Línea de Confianza"
4. Configura los textos (opcional):
   - Texto 1: Por defecto "Contraentrega en Colombia"
   - Texto 2: Por defecto "Garantía 30 días"

### Paso 2: Orden Recomendado de Bloques
Para máxima conversión en mobile (360x800), usa este orden:

1. **Título** (title)
2. **Precio** (price)
3. **Línea de Confianza** (trust_line) ← NUEVO
4. **Selector de Variantes** (variant_picker)
5. **Botones de Compra** (buy_buttons)

Los demás bloques (descripción, especificaciones, etc.) quedan debajo y no afectan el ATF.

## Características Técnicas

### Mobile Media Height
- **Desktop/Tablet**: 60vh
- **Mobile (<749px)**: 45vh (optimizado para dejar más espacio al área de compra)

### Espaciado Compacto
El wrapper `.tech-pdp-atf` reduce automáticamente los márgenes entre:
- Título → Precio: 0.375rem
- Precio → Trust Line: 0.375rem
- Trust Line → Variantes: 0.5rem
- Variantes → Botones: 0.5rem (controlado por `.tech-pdp-purchase`)

### Jerarquía de CTAs
Los botones ya están optimizados con las clases existentes:
- **Primario** (`.tech-cta-primary`): "Comprar ahora" - botón de pago dinámico (PayPal, etc.)
- **Secundario** (`.tech-cta-secondary`): "Agregar al carrito" - estilo outline

## Archivos Modificados
1. `/sections/main-product.liquid` - Agregado bloque trust_line y wrapper ATF
2. `/assets/ui-ux-responsive-fixes.css` - CSS para trust line y espaciado ATF

## Verificación
✅ Cart drawer funciona
✅ Variantes funcionan
✅ Payment buttons funcionan
✅ Responsive en 360x800
✅ Sin CSS inline
✅ Máximo 6 archivos modificados (solo 2)

## Pruebas Recomendadas
1. Probar en mobile 360x800 que todo sea visible sin scroll excesivo
2. Verificar que los botones de compra funcionan correctamente
3. Confirmar que el cart drawer se abre correctamente
4. Probar cambio de variantes
5. Verificar que payment buttons (PayPal, etc.) funcionan
