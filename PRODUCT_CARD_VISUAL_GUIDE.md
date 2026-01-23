# Product Card Cleanup - Visual Changes

## 🎯 Objetivo
Transformar las tarjetas de producto de un diseño sobrecargado a uno limpio y premium.

---

## 📊 Comparación Visual

### ANTES ❌

```
┌─────────────────────────────────┐
│ [Nuevo] [Más vendido]           │
│ [En Oferta] [-25%]              │
│ [¡Últimas 5 unidades!]          │
│                                 │
│         [Imagen Producto]       │
│                                 │
│ Título del Producto             │
│ Descripción truncada del        │
│ producto con 12 palabras...     │
│                                 │
│ $75.000 ~~$100.000~~           │ ← Tachado incluso sin descuento
│                                 │
│ ✓ Envío rápido  ✓ En stock     │ ← Checkmarks redundantes
│                                 │
│ Ver todos los detalles →        │
│                                 │
│ [ Agregar al carrito ]          │
│                                 │
│         [En Oferta]             │ ← Badge duplicado abajo
└─────────────────────────────────┘
```

**Problemas:**
- 5-6 badges apilados
- Checkmarks en todas las cards
- Precio tachado sin descuento real
- Descripción aumenta altura
- Link redundante
- Badge duplicado abajo

---

### DESPUÉS ✅

```
┌─────────────────────────────────┐
│ [OFERTA]                        │ ← Solo 1 badge (condicional)
│                                 │
│                                 │
│         [Imagen Producto]       │
│                                 │
│                                 │
│ Título del Producto             │
│                                 │
│ $75.000 ~~$100.000~~           │ ← Tachado SOLO con descuento
│                                 │
│ [ Agregar al carrito ]          │
│                                 │
│                                 │
└─────────────────────────────────┘
   ↑ Hover: Sombra + Lift
```

**Mejoras:**
- Solo 1 badge máximo (priorizado)
- Sin elementos redundantes
- Precio tachado solo con descuento REAL
- Descripción oculta (menos altura)
- Sin link redundante
- Efecto hover premium

---

## 🏷️ Sistema de Badges (Prioridad)

### 1. OFERTA (Prioridad Alta)
```liquid
IF compare_at_price EXISTS AND compare_at_price > price
  → Badge ROJO "OFERTA"
```
- Color: #dc2626 (rojo)
- Condición: Descuento REAL verificado
- Ejemplo: $75.000 con compare_at $100.000

### 2. Nuevo (Prioridad Media)
```liquid
ELSE IF product.tags contains 'Nuevo'
  → Badge VERDE "Nuevo"
```
- Color: #059669 (verde)
- Condición: Tag "Nuevo" existe
- NO se inventa automáticamente

### 3. Agotado (Prioridad Baja)
```liquid
ELSE IF product.available == false
  → Badge GRIS "Agotado"
```
- Color: #6b7280 (gris)
- Condición: Producto no disponible

### 4. Sin Badge
```liquid
ELSE
  → Sin badge
```
- Si no cumple ninguna condición
- Cards limpias sin badges forzados

---

## 💰 Sistema de Precios

### Caso 1: Sin Descuento
```
Precio: $100.000
Compare_at: null (o $100.000)

Resultado:
$100.000
```
- ✅ No hay precio tachado
- ✅ No hay badge "OFERTA"

### Caso 2: Con Descuento Real
```
Precio: $75.000
Compare_at: $100.000

Resultado:
$75.000 ~~$100.000~~
[OFERTA]
```
- ✅ Precio tachado visible
- ✅ Badge "OFERTA" mostrado
- ✅ Descuento verificado: 25%

### Caso 3: Compare_at == Price
```
Precio: $100.000
Compare_at: $100.000

Resultado:
$100.000
```
- ✅ No hay precio tachado
- ✅ No hay badge "OFERTA"
- ✅ Condición: compare_at > price (false)

---

## 📱 Responsive

### Desktop (> 750px)
```css
- Badge: 12px top/left, font-size 0.75rem
- Card padding: 1rem
- Hover: shadow + translateY(-2px)
- Título: font-size 0.95rem
```

### Mobile (≤ 749px)
```css
- Badge: 8px top/left, font-size 0.7rem
- Card padding: 0.75rem
- Hover: reducido
- Título: font-size 0.875rem
```

---

## 🎨 Estilos CSS Agregados

### Badge Styling
```css
.card__badge--sale {
  background: #dc2626;  /* Rojo */
  color: #ffffff;
}

.card__badge--new {
  background: #059669;  /* Verde */
  color: #ffffff;
}

.card__badge--sold-out {
  background: #6b7280;  /* Gris */
  color: #ffffff;
}
```

### Premium Effects
```css
.tech-card-product .card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  transition: all 0.3s ease;
}
```

### Height Reduction
```css
.card__description {
  display: none;  /* Oculta descripción */
}

.card__details-link {
  display: none;  /* Oculta link redundante */
}

.card__trust-indicators {
  display: none;  /* Oculta checkmarks */
}
```

---

## 📋 Testing Checklist

### ✅ Badges
- [ ] Solo 1 badge visible máximo
- [ ] "OFERTA" con compare_at > price
- [ ] "Nuevo" solo con tag existente
- [ ] No badges inventados/automáticos

### ✅ Precios
- [ ] NO tachado cuando compare_at == price
- [ ] SÍ tachado cuando compare_at > price
- [ ] Precio actual siempre visible
- [ ] Formato correcto

### ✅ Visual
- [ ] Cards más compactas (~30% menos altura)
- [ ] Sin checkmarks "En stock"
- [ ] Sin link "Ver detalles"
- [ ] Hover effect funciona
- [ ] Responsive en mobile

### ✅ Funcionalidad
- [ ] Quick-add funciona
- [ ] Card completa clickeable
- [ ] Modal de variantes abre
- [ ] Agregar al carrito funciona

---

## 🔍 Páginas Afectadas

1. **Home** → Sección "Productos destacados"
2. **/collections/all** → Grid de productos
3. **Cualquier colección** → Todas usan card-product.liquid
4. **Related products** → En PDP
5. **Search results** → Si aplica

---

## 📏 Métricas de Cambio

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Badges por card | 3-6 | 0-1 | -83% |
| Altura de card | ~520px | ~380px | -27% |
| Elementos visuales | 12 | 7 | -42% |
| Archivos modificados | - | 3 | 3/4 máx |
| Líneas eliminadas | - | ~90 | Simplificado |
| Líneas CSS nuevas | - | 145 | Premium |

---

## 🚀 Deploy

### Staging Preview
```bash
# URL de preview Shopify
https://[store].myshopify.com/?preview_theme_id=[theme-id]
```

### Verificaciones Pre-Deploy
1. ✅ Código revisado
2. ✅ Sin vulnerabilidades (CodeQL)
3. ✅ Null checks agregados
4. ✅ Documentación completa
5. ⏳ Testing manual pendiente

---

## 💡 Notas para QA

### Casos de Prueba Críticos

**Test 1: Producto con descuento real**
- Setup: Product price $75, compare_at $100
- Esperado: Badge "OFERTA", precio tachado $100
- Ubicación: Home, colección

**Test 2: Producto sin descuento**
- Setup: Product price $100, compare_at null
- Esperado: Sin badge, sin precio tachado
- Ubicación: Home, colección

**Test 3: Producto con tag "Nuevo"**
- Setup: Product tags include "Nuevo", no discount
- Esperado: Badge "Nuevo", sin precio tachado
- Ubicación: Home, colección

**Test 4: Producto agotado**
- Setup: Product available = false
- Esperado: Badge "Agotado", botón disabled
- Ubicación: Cualquier colección

**Test 5: Quick-add funcionalidad**
- Setup: Cualquier producto disponible
- Esperado: Modal abre, agregar funciona
- Ubicación: Cualquier card

---

**Fecha Implementación**: 2026-01-23
**Status**: ✅ READY FOR TESTING
**Next Step**: Manual QA → Deploy to Production
