# Guía de Validación: Corrección de Localización País-Moneda

## Cambios Implementados

Se modificó `snippets/country-localization.liquid` para evitar mostrar combinaciones incoherentes como "Portugal | COP".

### Comportamiento Nuevo

#### Opción A: Un Solo País (Colombia)
**Si solo hay 1 país configurado en Shopify Markets:**
- ✅ Muestra texto estático: "Colombia | COP $"
- ✅ No hay selector dropdown
- ✅ No se puede cambiar de país/moneda

#### Opción B: Múltiples Países
**Si hay múltiples países configurados:**
- ✅ Muestra selector dropdown normal
- ⚠️ Requiere configuración correcta en Shopify Markets para cada país

## Pasos de Validación

### 1. Verificar Configuración de Markets

En Shopify Admin:
1. Ir a **Settings → Markets**
2. Verificar cuántos mercados/países están configurados
3. Para cada país, confirmar que tiene la moneda correcta asignada:
   - 🇨🇴 Colombia → COP (Peso colombiano)
   - 🇵🇹 Portugal → EUR (Euro)
   - 🇺🇸 Estados Unidos → USD (Dólar)
   - etc.

### 2. Validar en Páginas

Verificar en las siguientes páginas:

#### Home Page (/)
- [ ] Footer muestra correctamente país y moneda
- [ ] No aparece "Portugal | COP" u otra combinación inválida
- [ ] Si hay un solo país: muestra texto estático sin selector
- [ ] Si hay múltiples países: selector funciona correctamente

#### Product Detail Page (PDP)
Ejemplo: `/products/power-bank-transparente-670-20-000-mah`
- [ ] Footer muestra correctamente país y moneda
- [ ] Comportamiento consistente con Home
- [ ] Selector (si aplica) funciona correctamente

#### Header/Menu
- [ ] Localization en header muestra correctamente
- [ ] Consistente con footer

### 3. Escenarios de Prueba

#### Escenario 1: Solo Colombia Configurado
**Setup:** Un solo mercado (Colombia) en Markets
**Esperado:**
- Texto estático "Colombia | COP $"
- Sin selector dropdown
- En todos los lugares (footer, header, announcement bar)

#### Escenario 2: Múltiples Países Correctamente Configurados
**Setup:** Colombia (COP), USA (USD), México (MXN), etc.
**Esperado:**
- Selector dropdown visible
- Al seleccionar Colombia: "Colombia | COP $"
- Al seleccionar USA: "United States | USD $"
- Al seleccionar México: "México | MXN $"
- Cada país muestra SU moneda correcta

#### Escenario 3: Detectar Configuración Incorrecta
**Si ves:** "Portugal | COP" o cualquier combinación inválida
**Acción:** Ir a Shopify Admin → Settings → Markets y corregir la asignación de moneda para ese país

## Ubicaciones del Selector

El snippet `country-localization.liquid` se usa en:
1. ✅ Footer (`sections/footer.liquid`)
2. ✅ Header desktop (`sections/header.liquid`)
3. ✅ Header mobile/drawer (`snippets/header-drawer.liquid`)
4. ✅ Announcement bar (`sections/announcement-bar.liquid`)

El cambio aplica automáticamente a todas estas ubicaciones.

## Solución de Problemas

### Problema: Sigue mostrando "Portugal | COP"
**Causa:** Múltiples países configurados en Markets, pero Portugal tiene COP asignado
**Solución:** 
1. Ir a Shopify Admin → Settings → Markets
2. Editar el mercado de Portugal
3. Cambiar moneda de COP a EUR
4. Guardar cambios

### Problema: No muestra selector aunque hay múltiples países
**Causa:** `enable_country_selector` está desactivado en footer settings
**Solución:**
1. Ir a Theme Editor
2. Editar Footer section
3. Activar "Enable country selector"
4. Guardar

### Problema: No muestra nada de país/moneda
**Causa:** Configuración del footer o Markets
**Verificar:**
1. En Theme Editor → Footer: "Enable country selector" debe estar activado
2. En Shopify Admin → Markets: Al menos un mercado debe estar configurado
3. En Theme settings: Verificar que Markets esté habilitado

## Archivos Modificados

- `snippets/country-localization.liquid` - Único archivo modificado
- Sin cambios en CSS, JS, ni otros archivos
- Cambio mínimo y quirúrgico

## Compatibilidad

✅ Compatible con Shopify Markets
✅ Compatible con múltiples idiomas
✅ Compatible con todos los themes Dawn-based
✅ No rompe funcionalidad existente
✅ Retrocompatible

## Notas Técnicas

- La lógica usa `localization.available_countries.size` para determinar cuántos países hay
- Si `size <= 1`: renderiza texto estático
- Si `size > 1`: renderiza selector completo
- El objeto `localization.country.currency` siempre debe proveer la moneda correcta según Markets
- Si Markets está mal configurado, la moneda incorrecta viene de Shopify, no del theme
