# Home Page Layout Alignment - Testing Guide

## Objetivo
Alinear TODAS las secciones de Home a un mismo ancho y spacing consistente.

## Cambios Implementados

### 1. Normalización de Spacing Vertical (ui-ux-responsive-fixes.css)
- **Desktop**: 56px padding-block entre secciones
- **Mobile**: 32px padding-block entre secciones
- **Hero (slideshow)**: Padding reducido para cerrar gap con siguiente sección

### 2. Contenedores Normalizados
Todas estas clases ahora tienen el mismo max-width y padding-inline:
- `.page-width`
- `.category-nav-wrapper`
- `.ta-conv-section-spacing`
- `.modern-feature-cards__wrapper`
- `.trust-badges__container`

**Desktop**: `padding-inline: 2rem` | **Mobile**: `padding-inline: 1rem`

### 3. Títulos H2 Alineados
Todos los títulos principales ahora están centrados con spacing consistente:
- `h2`
- `.title`
- `.category-nav-title`
- `.ta-conv-section-heading`
- `.modern-feature-cards__heading`
- `.testimonials-section__title`
- `.trust-badges__heading`

**Desktop**: `margin-bottom: 2rem (32px)` | **Mobile**: `margin-bottom: 1.5rem (24px)`

### 4. Grid Gaps Normalizados
- `.product-grid`
- `.category-nav-grid`
- `.ta-conv-benefits`
- `.modern-feature-cards__grid`
- `.trust-badges__grid`

**Desktop**: `gap: 2rem (32px)` | **Mobile**: `gap: 1.5rem (24px)`

### 5. Secciones con Wrappers Propios
Estas secciones tienen `padding-inline: 0` para evitar doble padding:
- `.category-nav-section`
- `.ta-conv-section-spacing`
- `.modern-feature-cards`
- `.trust-badges`
- `.testimonials-section`
- `.newsletter`

## Checklist de Validación Visual

### Desktop (> 990px)
- [ ] Todos los títulos H2 están alineados en el mismo eje vertical
- [ ] El spacing entre secciones es consistente (56px)
- [ ] El ancho máximo de todos los contenedores es igual (1200px o --page-width)
- [ ] Los márgenes laterales son consistentes (2rem)
- [ ] No hay "pantallas blancas" entre hero → beneficios → categorías → productos
- [ ] La home se siente "en columna", limpia y sin huecos

### Mobile (< 750px)
- [ ] Todos los títulos H2 están alineados en el mismo eje vertical
- [ ] El spacing entre secciones es consistente (32px)
- [ ] Los márgenes laterales son consistentes (1rem)
- [ ] No hay desbordamiento horizontal
- [ ] La navegación es fluida sin saltos visuales

## Secciones Afectadas en Home
Según `/templates/index.json`:
1. **slideshow_iqMhTA** - Hero/Slideshow
2. **benefits_conversion_home** - Beneficios de conversión
3. **category_navigation** - Categorías destacadas
4. **featured_collection_9GzLFt** - Productos destacados
5. **featured_collection_bestsellers** - Más vendidos
6. **featured_collection_nuevos** - Nuevos
7. **trust_badges_home** - Sellos de confianza
8. **testimonials_home** - Testimonios
9. **newsletter_home** - Newsletter

## Cómo Probar

### Método 1: Inspección Visual
1. Abrir la página de inicio en el navegador
2. Inspeccionar cada sección con DevTools
3. Verificar que:
   - `padding-block` es 56px en desktop / 32px en mobile
   - Todos los contenedores tienen el mismo `max-width`
   - Los títulos están centrados y tienen `margin-bottom` consistente

### Método 2: Medición con Regla
1. En DevTools, usar la herramienta de medición
2. Medir el spacing vertical entre secciones
3. Verificar que sea consistente (56px desktop / 32px mobile)

### Método 3: Overlay Grid
1. Usar extensión de navegador para overlay grid
2. Verificar que todos los elementos principales estén alineados
3. Confirmar que no hay desalineamientos

## Criterios de Éxito
✅ La home se siente "en columna", limpia y sin huecos
✅ Todos los títulos H2 alineados al mismo eje
✅ Espaciado vertical uniforme (56px desktop / 32px mobile)
✅ No hay "pantallas blancas" entre secciones
✅ Navegación fluida de hero → beneficios → categorías → productos

## Archivos Modificados
- `assets/ui-ux-responsive-fixes.css` - Reglas de normalización scoped a `body.template-index`

## Notas Técnicas
- Las reglas están scoped a `body.template-index` para afectar SOLO la home page
- Se usa `!important` en algunos casos para override de estilos inline o específicos
- Los valores están basados en diseño moderno: 56px/32px spacing
- Compatible con todos los navegadores modernos (usa `padding-block` y `padding-inline`)
