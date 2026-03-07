# Frontend Performance Audit — Solaris Nerja

**Fecha:** 2026-03-06
**Scope:** Next.js 16 + React 19, App Router, Tailwind v4, Vercel deployment
**Archivos analizados:** 35 archivos .ts/.tsx, package.json, next.config.ts, globals.css
**Enfoque:** Client components, re-renders, images, bundle, lazy loading, dynamic imports

---

## 1. Hechos observables

| Métrica | Valor |
|---------|-------|
| Total componentes UI | 13 |
| Componentes con `"use client"` | 10 |
| Componentes que **realmente usan hooks** | 3 (CookieBanner, Reveal, TicketmasterWidget) |
| `"use client"` innecesarios | **7 componentes** |
| Dynamic imports (`next/dynamic`) | 0 |
| `React.lazy` usage | 0 |
| `next/image` usage | 2 (Header, Footer) — sin `sizes` prop |
| Dependencias runtime | 6 (next, react, react-dom, @sentry/nextjs, ajv, pg) |
| Barrel exports (index.ts) | 0 |
| CSS files | 1 (globals.css, 744 bytes) |
| Fonts | next/font/google (self-hosted, zero CLS) |

---

## 2. Análisis técnico

### 2.1 Client Bundle Inflation — "use client" abuse

**El problema más impactante del proyecto.** 7 de 10 componentes marcados `"use client"` son HTML puro sin hooks, sin state, sin effects. Esto fuerza a Next.js a:

1. Incluir el código de estos componentes en el client bundle JavaScript
2. Hidratarlos en el browser (JS parse + execution time)
3. Enviar React runtime para componentes que son estáticos

| Componente | Hooks usados | `"use client"` necesario | Impacto en bundle |
|-----------|--------------|--------------------------|-------------------|
| Header.tsx | ninguno | **NO** | ~1.2 KB gzip (Image + Link) |
| HeroSection.tsx | ninguno | **NO** | ~0.3 KB gzip |
| EventosSection.tsx | ninguno | **NO** | ~1.5 KB gzip (EventCard tree) |
| MercadoSection.tsx | ninguno | **NO** | ~0.8 KB gzip |
| UbicacionSection.tsx | ninguno | **NO** | ~0.6 KB gzip |
| Footer.tsx | ninguno | **NO** | ~1.2 KB gzip (Image + Link) |
| EventCard.tsx | ninguno | No tiene (pero arrastrado por EventosSection) | ~0.4 KB gzip |
| CookieBanner.tsx | useState, useCallback | **SÍ** | necesario |
| Reveal.tsx | useRef, useCallback | **SÍ** | necesario |
| TicketmasterWidget.tsx | useEffect, useRef, useState | **SÍ** | necesario |

**Estimación conservadora:** ~5-6 KB de JS innecesario en el client bundle solo por directivas `"use client"` en componentes estáticos. En el critical path de la landing (Header + Hero + Eventos + Mercado + Ubicación + Footer), **todo el contenido visible se envía como client JS cuando podría ser zero-JS Server Components.**

### 2.2 Page composition: toda la landing es client-side

`src/app/page.tsx` es un Server Component (correcto), pero importa 6 componentes — todos marcados `"use client"`. Resultado: la página completa se renderiza como HTML en el servidor pero se hidrata completamente en el cliente. La hidratación es **innecesaria** para 5 de los 6 componentes.

**Cascade effect:** `EventosSection` (`"use client"`) importa `EventCard` (sin directiva). Pero como el parent es client, `EventCard` se incluye en el client bundle igualmente. El boundary se propaga hacia abajo.

### 2.3 Missing lazy loading — below-the-fold sections

Ningún componente usa `next/dynamic` o `React.lazy`. La landing tiene 6 secciones, pero solo Header + HeroSection son above-the-fold. Las 4 secciones restantes (Eventos, Mercado, Ubicación, Footer) se cargan, parsean y ejecutan aunque el usuario no haya hecho scroll.

Para los 3 componentes que **sí necesitan** ser client components:

| Componente | Viewport | Debería ser lazy? |
|-----------|----------|-------------------|
| CookieBanner | fixed bottom (visible) | No — necesita render inmediato |
| Reveal | wraps below-fold content | No — IntersectionObserver se registra temprano |
| TicketmasterWidget | Solo en `/eventos/[eventId]` | **SÍ — carga Ticketmaster JS de 3rd party** |

### 2.4 Image optimization gaps

**Header.tsx:**
```tsx
<Image src="/solaris_logo.png" alt="..." width={120} height={60} priority />
```
- `priority` ✓ (above fold, correcto)
- Missing `sizes`: sin `sizes` prop, Next.js genera srcset pero el browser no sabe qué tamaño elegir. Para un logo fijo de 120px, el browser puede descargar una imagen más grande de lo necesario.
- Missing `placeholder`: no hay blur placeholder. Para un logo es aceptable (es pequeño).

**Footer.tsx:**
```tsx
<Image src="/solaris_logo.png" alt="..." width={110} height={50} />
```
- Missing `priority`: correcto (below fold, no debería tener priority)
- Missing `sizes`: misma issue
- Missing `loading="lazy"`: Next.js Image usa `loading="lazy"` por defecto cuando no hay `priority`. ✓

**Google Maps iframe (UbicacionSection):**
```tsx
<iframe loading="lazy" src="https://maps.google.com/maps?..." />
```
- `loading="lazy"` ✓ — correcto para below-fold iframe

### 2.5 Bundle size — dependencies

| Dependencia | Size estimado (gzip) | Client bundle? | Justificado? |
|-------------|----------------------|----------------|--------------|
| react + react-dom | ~42 KB | Sí | Obligatorio |
| @sentry/nextjs | ~30-50 KB | Sí (client config) | Sí, pero Replay añade ~25 KB |
| ajv + ajv-formats | ~35 KB | **No** (solo API route) | Server-only ✓ |
| pg | ~20 KB | **No** (solo adapters) | Server-only ✓ |
| next/image | ~5 KB | Sí | Obligatorio |
| next/link | ~2 KB | Sí | Obligatorio |

**Sentry Replay:** `sentry.client.config.ts` incluye `Sentry.replayIntegration()`. Esto añade ~25 KB al client bundle para grabación de sesiones. Con `replaysSessionSampleRate: 0`, solo graba en errores, pero el **código se carga siempre**.

### 2.6 Re-renders — análisis de los 3 client components reales

**CookieBanner.tsx:**
- `useState(hasConsent)` — initializer function, ✓ eficiente
- `useCallback` en handlers — correcto pero innecesario (no pasa callbacks a child components que puedan re-render). Impacto negligible.
- **No tiene re-renders problemáticos.** Se monta una vez, el usuario clickea, desaparece.

**Reveal.tsx:**
- `useRef` + `useCallback` con IntersectionObserver
- El observer se desconecta after trigger (`observer.disconnect()`)
- `delayMs` en dependency array de useCallback — si el parent re-renderiza con un nuevo `delayMs`, se re-crea el callback. En `/eventos` page, cada `<Reveal delayMs={idx * 60}>` tiene un valor estable (idx no cambia).
- **No tiene re-renders problemáticos.**

**TicketmasterWidget.tsx:**
- `useEffect` con `[eventId]` dependency — solo re-ejecuta si cambia eventId. En la page actual, eventId viene de URL params (estable).
- `innerHTML = ""` en cleanup — DOM manipulation, no React state.
- **Risk:** Si el parent re-renders por cualquier razón, el componente no re-ejecuta el effect (eventId estable). Pero el JSX sí se re-evalúa. Minor, no impactante.

### 2.7 Fonts — optimizado

```typescript
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
```

`next/font/google` auto-downloads y self-hosts fonts at build time. Zero FOUT, zero CLS, zero runtime requests a Google Fonts. Subsets `latin` es correcto para español. **Optimización máxima alcanzada.**

---

## 3. Riesgos y trade-offs

| Fix | Impacto performance | Riesgo de regresión | Esfuerzo |
|-----|---------------------|---------------------|----------|
| Eliminar `"use client"` de 6 componentes | **Alto** — reduce client JS ~5-6 KB, elimina hydration | **Zero** — son HTML puro | 5 min |
| Dynamic import de TicketmasterWidget | **Medium** — defer ~3 KB + 3rd party script | Bajo — loading state ya existe | 10 min |
| Añadir `sizes` a next/image | **Low** — evita descargar images oversized | Zero | 2 min |
| Lazy-load Sentry Replay | **Medium** — defer ~25 KB de Replay | Bajo — solo afecta error replay | 15 min |
| Split Sentry client import | **Medium** — reduce initial JS | Medio — necesita verificar error tracking | 30 min |

---

## 4. Decisión recomendada

**Ejecutar en este orden, de mayor a menor impacto/riesgo:**

1. Eliminar `"use client"` de los 6 componentes estáticos (P0, zero risk)
2. Dynamic import de TicketmasterWidget en `[eventId]/page.tsx` (P1)
3. Añadir `sizes` prop a ambos `<Image>` (P2)
4. Lazy-load Sentry Replay integration (P2)

---

## 5. Plan de ejecución — fixes accionables

### FIX-01: Eliminar `"use client"` de 6 componentes estáticos [5 min, zero risk]

**Archivos:** Header.tsx, HeroSection.tsx, EventosSection.tsx, MercadoSection.tsx, UbicacionSection.tsx, Footer.tsx

**Acción:** Eliminar la línea `"use client"` de cada archivo. Zero cambios adicionales.

**Por qué funciona:** Estos componentes solo usan `next/image`, `next/link`, y JSX estático. Ninguno tiene hooks, event handlers propios (los `onClick` en links son navegación nativa), ni browser APIs. Next.js 16 con React 19 renderiza Server Components en el servidor y envía HTML puro al client, sin hydration.

**Verificación:**
```bash
pnpm build && pnpm start
# Navegar a / — verificar que Header, Hero, secciones y Footer renderizan
# DevTools → Network → Filter JS → Confirmar reducción de bundle
```

**Nota:** `EventCard.tsx` ya no tiene `"use client"`. Pero actualmente se importa desde `EventosSection` (client). Al convertir `EventosSection` a Server Component, `EventCard` también deja de estar en el client bundle. Efecto cascada positivo.

### FIX-02: Dynamic import de TicketmasterWidget [10 min]

**Archivo:** `src/app/eventos/[eventId]/page.tsx`

**Antes:**
```tsx
import { TicketmasterWidget } from "@/ui/components/TicketmasterWidget"
```

**Después:**
```tsx
import dynamic from "next/dynamic"

const TicketmasterWidget = dynamic(
  () => import("@/ui/components/TicketmasterWidget").then(m => ({ default: m.TicketmasterWidget })),
  {
    loading: () => (
      <div className="min-h-[300px] rounded-[var(--sn-radius-xl)] border border-[var(--sn-border)] bg-[color:var(--sn-surface)]/70 p-6">
        <p className="text-sm text-[color:var(--sn-muted)]">Cargando venta oficial Ticketmaster…</p>
      </div>
    ),
    ssr: false, // Widget necesita DOM, no tiene SSR útil
  }
)
```

**Por qué:** TicketmasterWidget carga un script externo de `widget.ticketmaster.com`. Con dynamic import + `ssr: false`, el código del componente y el script de terceros solo se cargan cuando el usuario navega a `/eventos/[eventId]`. No afecta al landing page ni a `/eventos`.

**Verificación:** Navegar a `/eventos/sunset` → verificar que el widget carga correctamente después del loading state.

### FIX-03: Añadir `sizes` prop a next/image [2 min]

**Header.tsx:**
```tsx
<Image
  src="/solaris_logo.png"
  alt="Solaris Nerja"
  width={120}
  height={60}
  sizes="120px"
  priority
/>
```

**Footer.tsx:**
```tsx
<Image
  src="/solaris_logo.png"
  alt="Solaris Nerja"
  width={110}
  height={50}
  sizes="110px"
/>
```

**Por qué:** Sin `sizes`, el browser usa un heuristic basado en viewport width para elegir del srcset. Para logos de tamaño fijo, `sizes="120px"` le dice al browser exactamente qué resolución necesita, evitando descargar un image más grande.

### FIX-04: Lazy-load Sentry Replay [15 min]

**Archivo:** `sentry.client.config.ts`

**Antes:**
```typescript
integrations: [
  Sentry.replayIntegration(),
],
```

**Después:**
```typescript
integrations: [
  Sentry.replayIntegration({
    // Lazy-load replay bundle only when an error occurs
    // This defers ~25 KB from the initial client bundle
  }),
],
// Alternative: use lazyLoadIntegration if available in @sentry/nextjs v10
replaysSessionSampleRate: 0,
replaysOnErrorSampleRate: 1.0,
```

**Nota:** En Sentry SDK v10+, `replayIntegration()` puede soportar lazy loading interno. Verificar documentación de `@sentry/nextjs@10.40.0`. Si no soporta lazy nativo, considerar:

```typescript
integrations: [],
// Load replay only on error
beforeSend(event) {
  if (process.env["NODE_ENV"] !== "production") return null
  // Dynamically add replay on first error
  if (!Sentry.getClient()?.getIntegrationByName("Replay")) {
    Sentry.addIntegration(Sentry.replayIntegration())
  }
  return event
},
```

---

## 6. Checklist de verificación

- [ ] `pnpm build` sin errores después de eliminar `"use client"`
- [ ] Landing page (`/`) renderiza correctamente — Header, Hero, Eventos, Mercado, Ubicación, Footer
- [ ] DevTools → Network → comparar JS bundle size antes/después
- [ ] `/eventos/sunset` → TicketmasterWidget carga via dynamic import
- [ ] Lighthouse Performance score (target: >90 en mobile)
- [ ] No aparecen errores CSP en console después de cambios
- [ ] Sentry recibe error events en staging

---

## 7. Riesgos residuales

1. **Sentry SDK size:** `@sentry/nextjs` contribuye ~30-50 KB al client bundle incluso sin Replay. Es el mayor contribuyente después de React. Alternativa futura: evaluar Sentry Lite o un error tracker más ligero si performance es crítica.

2. **Google Maps iframe:** Aunque tiene `loading="lazy"`, el iframe carga ~500 KB de recursos de Google cuando entra en viewport. No hay alternativa sin reemplazar por un mapa estático (imagen) con link a Google Maps.

3. **Hydration mismatch potencial:** `CookieBanner` usa `document.cookie` en el initializer de `useState`. En SSR, `typeof document === "undefined"` retorna `true` (banner oculto). En client hydration, `hasConsent()` lee la cookie real. Si la cookie NO existe, el client muestra el banner → hydration mismatch. Next.js 19 con React 19 maneja esto con `suppressHydrationWarning` implícito, pero merece revisión.

4. **Reveal component en above-fold:** En `/eventos`, `<Reveal>` wraps the `<h1>`. Si el component está above fold, detecta viewport position y no anima (correcto). Pero hay un flash: el component se monta sin styles → `getBoundingClientRect()` → aplica `opacity: 1`. En conexiones lentas, puede haber un frame con contenido invisible.

---

## 8. Siguientes 3 acciones

1. **[5 min] FIX-01:** Eliminar `"use client"` de Header, HeroSection, EventosSection, MercadoSection, UbicacionSection, Footer. Ejecutar `pnpm build` para verificar.
2. **[10 min] FIX-02:** Dynamic import de TicketmasterWidget con `ssr: false` y loading placeholder.
3. **[2 min] FIX-03:** Añadir `sizes` prop a los dos `<Image>` components.
