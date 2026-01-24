# 🎨 Referencia Visual: Localización País/Moneda

## 📸 Qué Esperar Ver

Esta guía visual muestra cómo debe lucir el selector de país/moneda después de la implementación.

---

## Escenario A: Negocio Solo Colombia (Recomendado para TechAura)

### ⚙️ Configuración en Shopify
```
Markets: Solo 1 país (Colombia)
Currency: COP
```

### 👁️ Resultado Visual

#### Footer
```
┌─────────────────────────────────────┐
│                                     │
│  Newsletter Sign-Up                 │
│  [Email Input] [→]                  │
│                                     │
│  País/Región                        │
│  Colombia | COP $                   │  ← Texto fijo (no clickable)
│                                     │
│  © 2026 TechAura                    │
└─────────────────────────────────────┘
```

**Características:**
- ✅ Muestra "Colombia | COP $"
- ✅ NO hay dropdown/selector
- ✅ Texto es estático (no se puede hacer clic)
- ✅ NO hay flecha ni indicador de interacción
- ✅ Mismo comportamiento en Header

#### Header Desktop
```
┌─────────────────────────────────────────────┐
│ TechAura          [Search]    🛒 Carrito    │
│                                             │
│  Colombia | COP $  ← Texto fijo             │
└─────────────────────────────────────────────┘
```

#### Header Mobile (Drawer)
```
┌──────────────────┐
│ ☰ Menu           │
│                  │
│ Colombia | COP $ │  ← Texto fijo
│                  │
│ • Inicio         │
│ • Productos      │
│ • Contacto       │
└──────────────────┘
```

---

## Escenario B: Negocio Multi-País

### ⚙️ Configuración en Shopify
```
Markets: Múltiples países
- Colombia → COP
- Portugal → EUR
- USA → USD
```

### 👁️ Resultado Visual

#### Footer - Estado Cerrado
```
┌─────────────────────────────────────┐
│                                     │
│  Newsletter Sign-Up                 │
│  [Email Input] [→]                  │
│                                     │
│  País/Región                        │
│  ┌────────────────────────────┐    │
│  │ Colombia | COP $ ▼         │    │  ← Selector (clickable)
│  └────────────────────────────┘    │
│                                     │
│  © 2026 TechAura                    │
└─────────────────────────────────────┘
```

**Características:**
- ✅ Muestra botón dropdown con país actual
- ✅ Flecha ▼ indica que es clickable
- ✅ Formato: "País | MONEDA Símbolo"
- ✅ Al hacer clic se abre lista

#### Footer - Estado Abierto (Dropdown)
```
┌─────────────────────────────────────┐
│  País/Región                        │
│  ┌────────────────────────────┐    │
│  │ Colombia | COP $ ▲         │    │
│  └────────────────────────────┘    │
│  ┌────────────────────────────┐    │
│  │ Seleccionar país       [×]  │    │  ← Panel abierto
│  │ [Buscar...___________]  🔍  │    │  ← Input de búsqueda (si >9 países)
│  │                             │    │
│  │ ✓ Colombia | COP $          │    │  ← País actual (checkmark)
│  │   Portugal | EUR €          │    │  ← Otros países con sus monedas
│  │   United States | USD $     │    │
│  │   España | EUR €            │    │
│  └────────────────────────────┘    │
└─────────────────────────────────────┘
```

**Características:**
- ✅ Lista muestra TODOS los países configurados
- ✅ Cada país muestra su moneda correcta
- ✅ Checkmark (✓) marca el país actual
- ✅ Si hay >9 países: input de búsqueda disponible
- ✅ Se puede hacer clic en cualquier país para cambiar

#### Header Desktop - Con Selector
```
┌─────────────────────────────────────────────┐
│ TechAura          [Search]    🛒 Carrito    │
│                                             │
│  ┌──────────────────┐                       │
│  │ Colombia | COP $ ▼│  ← Selector          │
│  └──────────────────┘                       │
└─────────────────────────────────────────────┘
```

---

## 🔍 Detalles de Formato

### Formato de Etiqueta País/Moneda
```
[Nombre País] | [Código Moneda] [Símbolo]
      ↓            ↓           ↓
  Colombia    |   COP         $
  Portugal    |   EUR         €
United States |   USD         $
    España    |   EUR         €
```

### Ejemplos Correctos ✅
```
✅ Colombia | COP $
✅ Portugal | EUR €
✅ United States | USD $
✅ España | EUR €
✅ México | MXN $
✅ Argentina | ARS $
```

### Ejemplos Incorrectos ❌ (Nunca Deberían Aparecer)
```
❌ Portugal | COP $     ← Portugal NO usa COP
❌ Colombia | EUR €     ← Colombia NO usa EUR
❌ USA | COP $          ← USA NO usa COP
❌ España | USD $       ← España NO usa USD
```

---

## 📱 Responsividad

### Desktop (>1200px)
```
Footer: Selector horizontal en la parte inferior
Header: Selector en esquina superior derecha
```

### Tablet (768px-1199px)
```
Footer: Selector se mantiene igual
Header: Selector en menú colapsable
```

### Mobile (<768px)
```
Footer: Selector full-width
Header: Selector en drawer menu
Panel: Ocupa toda la pantalla al abrirse
```

---

## 🎯 Checklist Visual de Validación

### Para Colombia-Only
- [ ] Footer muestra "Colombia | COP $" como texto fijo
- [ ] NO hay flecha ▼ ni indicador de dropdown
- [ ] Texto NO es clickable
- [ ] Header muestra la misma información
- [ ] Consistente en todas las páginas

### Para Multi-País
- [ ] Footer muestra botón dropdown con flecha ▼
- [ ] Botón muestra país actual con formato correcto
- [ ] Al hacer clic se abre panel con lista de países
- [ ] Cada país en la lista muestra SU moneda correcta
- [ ] NO aparece ninguna combinación inválida
- [ ] País actual tiene checkmark ✓
- [ ] Se puede buscar países (si >9 países)
- [ ] Al seleccionar un país, página recarga
- [ ] Selector muestra el nuevo país seleccionado

---

## 🚨 Señales de Problemas

### Problema: "Portugal | COP" Aparece
```
❌ INCORRECTO:
   Portugal | COP $

✅ CORRECTO:
   Portugal | EUR €

Causa: Markets mal configurado en Shopify
Solución: Admin → Settings → Markets → Editar Portugal → Currency: EUR
```

### Problema: Muestra Selector con 1 País
```
❌ INCORRECTO:
   ┌────────────────┐
   │ Colombia ▼     │
   └────────────────┘

✅ CORRECTO:
   Colombia | COP $  (texto fijo)

Causa: Lógica no aplicada correctamente
Solución: Verificar código en country-localization.liquid
```

### Problema: No Muestra Moneda
```
❌ INCORRECTO:
   Colombia

✅ CORRECTO:
   Colombia | COP $

Causa: Template no actualizado o Markets sin moneda
Solución: Verificar Markets configuration
```

---

## 📊 Comparación Antes/Después

### Antes (Problemático)
```
Footer mostraba:
┌─────────────────┐
│ Portugal | COP $ │  ❌ INCOHERENTE
└─────────────────┘

Problemas:
- Portugal con COP (moneda de Colombia)
- Combinación inválida
- Confuso para usuarios
```

### Después (Correcto)
```
Si Portugal está en Markets:
┌─────────────────┐
│ Portugal | EUR € │  ✅ COHERENTE
└─────────────────┘

Beneficios:
- Portugal con EUR (su moneda correcta)
- Coherencia garantizada
- Experiencia clara para usuarios
```

---

## 🎨 Estilos CSS Aplicados

El selector usa las siguientes clases CSS existentes:
```css
.localization-form__select     /* Contenedor del selector/texto */
.disclosure__button            /* Botón del dropdown */
.disclosure__list-wrapper      /* Panel del dropdown */
.country-selector              /* Contenedor de la lista */
.localization-form__currency   /* Estilo de la moneda */
```

**Nota:** NO se modificaron estilos CSS, solo se usa el diseño existente del tema.

---

## ✅ Estado Final

### Implementación
- ✅ Código correcto y documentado
- ✅ Funciona en 4 ubicaciones
- ✅ Se adapta automáticamente
- ✅ Sin combinaciones inválidas

### Visual
- ✅ Formato coherente: "País | MONEDA Símbolo"
- ✅ Comportamiento adaptativo (texto vs selector)
- ✅ Responsive en todos los dispositivos
- ✅ Consistente en todas las páginas

### Próximo Paso
⏳ **Validar visualmente en storefront según esta guía**

---

**Fecha:** 2026-01-24  
**Branch:** `copilot/fix-localization-country-currency`  
**Status:** ✅ READY FOR VISUAL VALIDATION
