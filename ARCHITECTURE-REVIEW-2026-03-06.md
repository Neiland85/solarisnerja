# REVISIÓN ARQUITECTÓNICA — SOLARIS NERJA

**Fecha:** 2026-03-06
**Rol:** Principal Software Architect
**Alcance:** Component boundaries, client/server, structure, naming, reuse, logic separation
**Regla:** Zero reescrituras. Solo correcciones mínimas.

---

## 1. FORTALEZAS ARQUITECTÓNICAS

### 1.1 Separación de capas — DDD-lite correcta

```
src/
├── domain/leads/     ← business logic pura (no importa Next.js)
├── adapters/db/      ← infraestructura aislada
├── contracts/schemas/ ← JSON Schema como fuente de verdad
├── lib/              ← utilidades transversales
├── config/           ← datos estáticos
├── app/              ← routing + páginas
└── ui/components/    ← presentación
```

La capa `domain/` no importa `next/server`, `pg`, ni React. La función `createLead()` es pura: recibe input tipado, devuelve `Lead`. Esto permite testear sin infraestructura. **Correcto y mantenible.**

### 1.2 API route bien diseñada

`/api/v1/leads/route.ts` sigue una pipeline clara:
```
parse → validate (AJV) → honeypot → rate limit → domain → persist → respond
```
Errores RFC 7807 (`application/problem+json`). IP validation con regex defensivos. Request ID propagado desde middleware. **Nivel profesional.**

### 1.3 Contratos como código

JSON Schema 2020-12 con `additionalProperties: false`. Contract tests en `lead-schema.contract.test.ts`. AJV compilado una sola vez (módulo-level). **Previene drift silencioso entre frontend y backend.**

### 1.4 Middleware de seguridad completo

CSP con nonce per-request, CORS con whitelist, HSTS preload, X-Frame-Options DENY, request ID tracking. **Cubre OWASP top 10 para la superficie expuesta.**

### 1.5 Landing page composable

`page.tsx` final es una composición limpia de 6 componentes:
```tsx
<Header /> → <HeroSection /> → <EventosSection /> → <MercadoSection /> → <UbicacionSection /> → <Footer />
```
Cero lógica en la página raíz. Cada sección encapsulada. **Estructura editorial correcta.**

---

## 2. DEBILIDADES ARQUITECTÓNICAS

### 2.1 `"use client"` innecesario en 5 de 6 secciones

| Componente | `"use client"` | Usa hooks/browser API | Realmente necesita client? |
|---|---|---|---|
| `Header.tsx` | ✅ | NO (solo Link + Image) | **NO** |
| `HeroSection.tsx` | ✅ | NO (solo Link) | **NO** |
| `MercadoSection.tsx` | ✅ | NO (solo HTML estático) | **NO** |
| `UbicacionSection.tsx` | ✅ | NO (solo HTML + iframe) | **NO** |
| `Footer.tsx` | ✅ | NO (solo Link + Image) | **NO** |
| `EventosSection.tsx` | ✅ | NO (solo Link + map) | **NO** |
| `CookieBanner.tsx` | ✅ | SÍ (useState, useCallback, document.cookie) | **SÍ** |
| `Reveal.tsx` | ✅ | SÍ (useRef, useCallback, IntersectionObserver) | **SÍ** |
| `TicketmasterWidget.tsx` | ✅ | SÍ (useEffect, useRef, useState, DOM) | **SÍ** |

**Impacto:** 6 componentes que son HTML puro se envían como client bundles. Esto añade JS innecesario al cliente y deshabilita streaming/RSC para esas secciones.

**Fix:** Eliminar `"use client"` de Header, HeroSection, MercadoSection, UbicacionSection, Footer, EventosSection. Todos ellos solo usan `Link`, `Image`, y HTML — que funcionan en Server Components.

### 2.2 Header duplicado en 3 rutas

| Ruta | Header usado |
|---|---|
| `/` (landing) | `<Header />` componente |
| `/eventos` | Header **inline** (líneas 11-19) |
| `/eventos/[eventId]` | Header **inline** (líneas 26-34) |
| `/privacidad` | Header **inline** (línea 14-18) |

Cada subruta tiene su propio header copiado a mano con variaciones: diferentes max-width, diferentes links activos, diferente logo (texto vs imagen).

**Causa raíz:** El `Header.tsx` se creó después de las subrutas y nunca se propagó.

**Fix:** Usar `Header.tsx` en todas las rutas. Si se necesita variación (link activo), añadir prop `activeRoute`:
```tsx
<Header activeRoute="/eventos" />
```

### 2.3 Dos fuentes de datos de eventos incompatibles

| Fuente | Ubicación | Shape |
|---|---|---|
| `config/events.ts` | EVENTS array | `{ id, title, tagline, description, highlight, ticketUrl }` |
| `EventosSection.tsx` | Inline const | `{ id, title, time, description }` |

La landing usa datos inline con IDs distintos (`aperitivo`, `golden`, `digital`) y campos distintos (`time` vs `highlight`). La ruta `/eventos` usa `config/events.ts` con IDs distintos (`sunset`, `night`, `market`, `music`) y hace mapping `highlight → time`.

**Impacto:** Dos verdades para el mismo concepto. Si alguien edita `config/events.ts`, la landing no refleja el cambio.

**Fix:** Una sola fuente de verdad. Mover los datos de landing a `config/events.ts` o crear `config/landing-events.ts` con un comentario explícito de que son diferentes.

### 2.4 EventCard con dos contratos diferentes

El `EventCard` original usaba `Event` type del dominio (`highlight`, `ticketUrl`). El actual usa `{ id, title, time, description }`. La ruta `/eventos/page.tsx` hace un mapping manual:
```tsx
event={{ id: e.id, title: e.title, time: e.highlight, description: e.description }}
```

**Impacto:** Fragilidad. Un refactor de EventCard rompe silenciosamente `/eventos`.

**Fix:** Exportar el type de EventCard y usarlo como contrato:
```tsx
export interface EventCardEvent { id: string; title: string; time: string; description: string }
```

### 2.5 Componentes huérfanos

| Componente | Usado en producción? |
|---|---|
| `StickyCTA.tsx` | **NO** — importado en ningún page.tsx activo |
| `SecureScript.tsx` | **NO** — nunca importado |
| `UI.tsx` (ButtonGhost, Card) | **Parcial** — solo `ButtonPrimary` en `[eventId]/page.tsx` |
| `Reveal.tsx` | **Parcial** — solo en subrutas, eliminado de landing |

**Impacto:** Dead code en el repo. No rompe nada pero indica drift.

**Fix:** Mover `StickyCTA.tsx` y `SecureScript.tsx` a `.wip/` o eliminar. No hay riesgo.

---

## 3. RIESGOS DE DRIFT

### 3.1 Layout pattern inconsistente

La landing usa **composición de componentes** (Header + Footer como componentes).
Las subrutas usan **layout inline** (header/footer copiados dentro del page).
No existe `layout.tsx` por ruta que encapsule la estructura.

**Riesgo:** Cada nueva página copiará header/footer de otro page.tsx → divergencia acumulativa.

**Fix recomendado:** Crear un layout compartido o al menos reutilizar `<Header />` y `<Footer />` en todas las rutas.

### 3.2 Convenciones de nombrado divergentes

| Patrón | Archivos |
|---|---|
| `default export` | Header, Footer, HeroSection, EventosSection, MercadoSection, UbicacionSection, EventCard |
| `named export` | CookieBanner, Reveal, StickyCTA, TicketmasterWidget, SecureScript, UI (ButtonPrimary, ButtonGhost, Card) |

**Impacto:** Los imports son inconsistentes (`import X from` vs `import { X } from`). No rompe nada pero dificulta búsqueda y refactoring.

**Fix:** Elegir una convención. Recomendación: `default export` para componentes de página/sección, `named export` para utilidades reutilizables. Documentar en CONTRIBUTING.md.

### 3.3 Design tokens vs inline styles

Las subrutas (`eventos/`, `[eventId]/`, `privacidad/`) usan CSS variables (`var(--sn-muted)`, `var(--sn-border)`). Los componentes de landing usan valores directos (`opacity-70`, `text-black`, `bg-white`) y `style={{ background: "radial-gradient(...)" }}`.

**Riesgo:** Si se cambia el brand (ej: modo dark), las subrutas se adaptan via CSS vars pero la landing no.

**Fix mínimo:** Migrar al menos los colores base de la landing a CSS variables existentes. Las texturas radiales como inline style son aceptables (son por-componente y no temáticas).

---

## 4. CORRECCIONES MÍNIMAS (ordenadas por impacto/esfuerzo)

| # | Archivo | Cambio | Esfuerzo | Impacto |
|---|---------|--------|----------|---------|
| 1 | `Header.tsx` | Eliminar `"use client"` | 1 línea | Perf (RSC) |
| 2 | `HeroSection.tsx` | Eliminar `"use client"` | 1 línea | Perf (RSC) |
| 3 | `Footer.tsx` | Eliminar `"use client"` | 1 línea | Perf (RSC) |
| 4 | `MercadoSection.tsx` | Eliminar `"use client"` | 1 línea | Perf (RSC) |
| 5 | `UbicacionSection.tsx` | Eliminar `"use client"` | 1 línea | Perf (RSC) |
| 6 | `EventosSection.tsx` | Eliminar `"use client"` | 1 línea | Perf (RSC) |
| 7 | `EventCard.tsx` | Exportar interface `EventCardEvent` | 3 líneas | Type safety |
| 8 | `eventos/page.tsx` | Reemplazar header inline por `<Header />` | ~10 líneas | Consistencia |
| 9 | `eventos/[eventId]/page.tsx` | Reemplazar header inline por `<Header />` | ~10 líneas | Consistencia |
| 10 | `privacidad/page.tsx` | Reemplazar header inline por `<Header />` | ~10 líneas | Consistencia |
| 11 | `StickyCTA.tsx`, `SecureScript.tsx` | Mover a `.wip/` | mv | Limpieza |
| 12 | `eventos/page.tsx` | Añadir `export const metadata` | 5 líneas | SEO |

**Total estimado: 2-3 horas de trabajo. Zero riesgo de regresión.**

---

## 5. DIAGRAMA DE DEPENDENCIAS DE COMPONENTES

```
layout.tsx
├── globals.css
└── CookieBanner ← "use client" ✓ (necesita hooks)

page.tsx (landing)
├── Header         ← "use client" INNECESARIO
├── HeroSection    ← "use client" INNECESARIO
├── EventosSection ← "use client" INNECESARIO
│   └── EventCard  ← Server Component ✓
├── MercadoSection ← "use client" INNECESARIO
├── UbicacionSection ← "use client" INNECESARIO
└── Footer         ← "use client" INNECESARIO

eventos/page.tsx
├── header INLINE  ← debería usar Header.tsx
├── Reveal         ← "use client" ✓ (IntersectionObserver)
├── EventCard      ← Server Component ✓
└── footer INLINE  ← debería usar Footer.tsx

eventos/[eventId]/page.tsx
├── header INLINE  ← debería usar Header.tsx
├── Reveal         ← "use client" ✓
├── ButtonPrimary  ← Server Component ✓
├── TicketmasterWidget ← "use client" ✓ (DOM manipulation)
└── footer INLINE  ← debería usar Footer.tsx
```

---

## 6. VEREDICTO

**Arquitectura: SÓLIDA con drift cosmético.**

La separación domain/adapters/contracts/ui es correcta y está bien ejecutada. La API route es profesional. Los contratos como código previenen problemas reales. El middleware de seguridad es completo.

Las debilidades son todas de plomería UI: `"use client"` sobrante, headers duplicados, dos fuentes de datos de eventos, componentes huérfanos. Ninguna requiere cambios arquitectónicos — solo disciplina de refactoring incremental.

**Prioridad #1:** Eliminar `"use client"` de los 6 componentes estáticos. Es la corrección con mayor impacto (RSC streaming, menor JS bundle) y menor riesgo (1 línea por archivo, zero cambio de comportamiento).
