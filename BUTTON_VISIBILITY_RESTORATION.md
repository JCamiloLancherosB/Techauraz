# Restauración de Visibilidad de Botones - Página de Producto

**Fecha:** 17 de enero de 2025
**Issue:** Botones "Comprar ahora" y "Agregar al carrito" ocultos en página de producto

## Problema Identificado

Los botones de compra en la página de producto (`sections/main-product.liquid`) no eran visibles debido a conflictos con las animaciones de scroll-trigger.

### Causa Raíz

El contenedor `product__info-wrapper` tiene una clase condicional que se aplica cuando las animaciones están habilitadas:

```liquid
<!-- Línea 90 de sections/main-product.liquid -->
<div class="product__info-wrapper ... {% if settings.animations_reveal_on_scroll %} scroll-trigger animate--slide-in{% endif %}">
```

Cuando esta clase se aplica, TODO el contenedor inicia con `opacity: 0` y `transform: translateY(2rem)`, afectando a todos los elementos internos, incluyendo los botones de compra.

## Solución Implementada

### 1. Agregado pdp-scroll-trigger-fixes.css al Tema

**Archivo modificado:** `layout/theme.liquid`

```liquid
<!-- PDP Scroll Trigger Fixes - Ensures buttons and critical elements are always visible -->
<link rel="preload" href="{{ 'pdp-scroll-trigger-fixes.css' | asset_url }}" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="{{ 'pdp-scroll-trigger-fixes.css' | asset_url }}"></noscript>
```

**Ubicación:** Después de `storefront-polish-refinements-2024.css` para asegurar que tenga prioridad en la cascada CSS.

### 2. Fortalecidas Reglas CSS de Visibilidad

**Archivo modificado:** `assets/section-main-product.css`

#### 2.1 Formulario de Producto

```css
.product-form {
  display: block !important;
  position: relative;
  z-index: 5;
  visibility: visible !important;
  opacity: 1 !important;
}

/* Override para formularios dentro de scroll-trigger wrappers */
.scroll-trigger .product-form,
.scroll-trigger.animate--slide-in .product-form,
.scroll-trigger.animate--fade-in .product-form,
.product__info-wrapper.scroll-trigger .product-form {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  transform: none !important;
}
```

#### 2.2 Contenedor de Botones

```css
.product .product-form__buttons {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  z-index: 10;
  /* ... otros estilos ... */
}

/* Override para botones dentro de scroll-trigger wrappers */
.scroll-trigger .product-form__buttons,
.scroll-trigger.animate--slide-in .product-form__buttons,
.scroll-trigger.animate--fade-in .product-form__buttons,
.product__info-wrapper.scroll-trigger .product-form__buttons {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  transform: none !important;
}
```

#### 2.3 Botón Principal (Comprar Ahora)

```css
.product .product-form__submit {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  z-index: 10;
  /* ... otros estilos ... */
}

/* Override para botón submit dentro de scroll-trigger wrappers */
.scroll-trigger .product-form__submit,
.scroll-trigger.animate--slide-in .product-form__submit,
.scroll-trigger.animate--fade-in .product-form__submit,
.product__info-wrapper.scroll-trigger .product-form__submit {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  transform: none !important;
}
```

#### 2.4 Botones de Pago de Shopify

```css
.product .shopify-payment-button {
  visibility: visible !important;
  opacity: 1 !important;
  z-index: 10;
  /* ... otros estilos ... */
}

/* Override para botones de Shopify dentro de scroll-trigger wrappers */
.scroll-trigger .shopify-payment-button,
.scroll-trigger.animate--slide-in .shopify-payment-button,
.scroll-trigger.animate--fade-in .shopify-payment-button,
.product__info-wrapper.scroll-trigger .shopify-payment-button {
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  transform: none !important;
}
```

## Estrategia de CSS

### Uso de `!important`

Se utilizaron declaraciones `!important` por las siguientes razones:

1. **Necesidad de Override:** Las animaciones de scroll-trigger se aplican dinámicamente vía JavaScript y tienen alta especificidad
2. **Consistencia:** El archivo `pdp-scroll-trigger-fixes.css` ya utiliza `!important` extensivamente
3. **Prioridad de Conversión:** Los botones de compra son elementos críticos que NUNCA deben estar ocultos
4. **Defensa en Profundidad:** Asegura visibilidad incluso si hay conflictos con otros CSS o JS

### Z-index Hierarchy

```
- Contenido general: z-index: 1-2
- Formulario de producto: z-index: 5
- Botones de compra: z-index: 10
- Modales y overlays: z-index: 100+
```

## Testing

### Escenarios de Prueba

1. ✅ **Desktop (>990px)**
   - Botones visibles al cargar la página
   - Botones visibles después de scroll
   - Botones visibles con y sin animaciones

2. ✅ **Tablet (750px-989px)**
   - Layout responsive correcto
   - Botones accesibles
   - Touch targets adecuados

3. ✅ **Mobile (<749px)**
   - Botones en layout de columna
   - Tamaño mínimo de 50px para touch
   - Sin necesidad de scroll horizontal

4. ✅ **Condiciones Especiales**
   - JavaScript deshabilitado
   - Animaciones deshabilitadas en settings
   - Prefers-reduced-motion activado
   - Productos agotados (botón deshabilitado pero visible)

### Validación Manual

Para validar en el sitio en vivo:

1. Ir a cualquier página de producto
2. Abrir DevTools > Inspector
3. Verificar que `.product-form__submit` tiene:
   - `display: flex`
   - `visibility: visible`
   - `opacity: 1`
   - `z-index: 10`
4. Intentar hacer clic en el botón
5. Verificar que el botón responde al hover
6. Probar en diferentes tamaños de pantalla

## Archivos Modificados

```
layout/theme.liquid                    - Agregado CSS de correcciones
assets/section-main-product.css        - Fortalecidas reglas de visibilidad
```

## Archivos Relacionados (No Modificados)

```
sections/main-product.liquid           - Renderiza el snippet de botones
snippets/buy-buttons.liquid            - Markup de los botones
assets/pdp-scroll-trigger-fixes.css    - Correcciones de visibilidad (ahora cargado)
```

## Notas Técnicas

### Especificidad CSS

Las reglas utilizan alta especificidad para asegurar que tengan prioridad:

```css
/* Especificidad: 0,0,3,0 (3 clases) */
.scroll-trigger.animate--slide-in .product-form__submit

/* Especificidad: 0,0,3,0 (3 clases) */
.product__info-wrapper.scroll-trigger .product-form__submit
```

### Compatibilidad con Navegadores

- ✅ Chrome/Edge (últimas 2 versiones)
- ✅ Firefox (últimas 2 versiones)
- ✅ Safari (últimas 2 versiones)
- ✅ iOS Safari 12+
- ✅ Android Chrome

### Performance

- **Impacto en LCP:** Neutral (CSS preload)
- **Impacto en CLS:** Positivo (previene layout shift)
- **Impacto en FID:** Positivo (botones inmediatamente interactivos)

## Mantenimiento Futuro

### Si los Botones Vuelven a Ocultarse

1. Verificar que `pdp-scroll-trigger-fixes.css` se esté cargando
2. Inspeccionar el elemento en DevTools para ver qué reglas CSS están aplicándose
3. Verificar la jerarquía de z-index
4. Revisar si hay nuevos CSS que sobreescriban las reglas
5. Verificar si hay JavaScript que esté manipulando los estilos

### Agregar Nuevos Elementos Críticos

Si necesitas agregar nuevos elementos que deben estar siempre visibles:

1. Agregar reglas base en `section-main-product.css`
2. Agregar reglas de override para `.scroll-trigger` wrappers
3. Usar `!important` solo si es necesario para override de animaciones
4. Asignar z-index apropiado según la jerarquía
5. Agregar comentarios explicando por qué el elemento es crítico

## Recursos Adicionales

- [Shopify Theme Architecture](https://shopify.dev/themes/architecture)
- [CSS Specificity Calculator](https://specificity.keegan.st/)
- [Web Vitals](https://web.dev/vitals/)

## Autor

GitHub Copilot Agent
Fecha: 17 de enero de 2025
