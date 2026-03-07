# Production Readiness Assessment — Solaris Nerja

**Fecha:** 2026-03-06
**Rol:** Staff Engineer — pre-deployment review
**Scope:** Next.js best practices, error/loading boundaries, metadata, routing, DB resilience, CI pipeline
**Archivos analizados:** 35 source files + configs + CI

---

## Production Readiness Score: 62 / 100

| Categoría | Peso | Score | Ponderado |
|-----------|------|-------|-----------|
| Error Boundaries | 15% | 15/100 | 2.3 |
| Loading States | 10% | 20/100 | 2.0 |
| Metadata & SEO | 10% | 45/100 | 4.5 |
| Routing Consistency | 10% | 40/100 | 4.0 |
| Database Resilience | 15% | 55/100 | 8.3 |
| CI Pipeline | 10% | 70/100 | 7.0 |
| Security Posture | 15% | 80/100 | 12.0 |
| Next.js Best Practices | 15% | 65/100 | 9.8 |
| **Total** | **100%** | | **62** (redondeado) |

---

## 1. Hechos observables

### Boundaries existentes

| Tipo | Archivo | Existe |
|------|---------|--------|
| `error.tsx` (root) | `src/app/error.tsx` | **NO** |
| `error.tsx` (eventos) | `src/app/eventos/error.tsx` | **NO** |
| `error.tsx` ([eventId]) | `src/app/eventos/[eventId]/error.tsx` | **NO** |
| `global-error.tsx` | `src/app/global-error.tsx` | **NO** |
| `loading.tsx` (root) | `src/app/loading.tsx` | **NO** |
| `loading.tsx` (eventos) | `src/app/eventos/loading.tsx` | **NO** |
| `not-found.tsx` | `src/app/not-found.tsx` | **NO** |
| `layout.tsx` (root) | `src/app/layout.tsx` | **SÍ** |
| `layout.tsx` (eventos) | `src/app/eventos/layout.tsx` | **NO** |

**0 de 6 boundaries recomendados están implementados.**

### Metadata por página

| Ruta | Metadata | generateMetadata | OpenGraph image |
|------|----------|-----------------|-----------------|
| `/` (layout.tsx) | ✓ title + description + OG | — | **NO** |
| `/` (page.tsx) | **NO** | — | — |
| `/eventos` | **NO** | — | — |
| `/eventos/[eventId]` | **NO** | **NO** | — |
| `/privacidad` | ✓ title + description | — | — |

### SEO assets

| Asset | Existe |
|-------|--------|
| `sitemap.ts` / `sitemap.xml` | **NO** |
| `robots.ts` / `robots.txt` | **NO** |
| `opengraph-image.*` | **NO** |
| `favicon.ico` | ✓ (en `src/app/`) |
| `apple-icon.*` | **NO** |

### Routing — Header consistency

| Ruta | Header component | Nav links | Implementación |
|------|-----------------|-----------|----------------|
| `/` | `<Header />` component | Eventos, Mercado, Ubicación | Componente reutilizable |
| `/eventos` | Inline `<header>` | Inicio, Eventos | HTML hardcoded, estilo diferente |
| `/eventos/[eventId]` | Inline `<header>` | Inicio, Eventos | HTML hardcoded, estilo diferente |
| `/privacidad` | Inline `<header>` | Solo logo "Solaris Nerja" | HTML hardcoded, mínimo |

**3 de 4 rutas usan headers inline diferentes.** No hay `layout.tsx` en `/eventos` que unifique.

### Database

| Aspecto | Estado |
|---------|--------|
| Pool singleton | ✓ |
| Connection pooling (max 5) | ✓ |
| connectionTimeoutMillis | ✓ (5s) |
| idleTimeoutMillis | ✓ (10s) |
| Parameterized queries | ✓ ($1, $2, $3, $4) |
| ON CONFLICT handling | ✓ (DO NOTHING) |
| Connection error handling | **Parcial** — throw en getPool si no hay DATABASE_URL, pero sin retry logic |
| Query error handling | **Parcial** — route.ts catch genérico, sin circuit breaker |
| Pool error event listener | **NO** — pool no escucha `pool.on("error")` |
| Health check | ✓ (`/api/readyz` con `SELECT 1`) |

### CI Pipeline

| Step | Existe | Observaciones |
|------|--------|---------------|
| Checkout | ✓ | actions/checkout@v4 |
| pnpm setup | ✓ | pnpm/action-setup@v4, version 10 |
| Node setup | ✓ | node 20, cache pnpm |
| Install | ✓ | `--frozen-lockfile` ✓ |
| Typecheck | ✓ | `tsc --noEmit` |
| Lint | ✓ | `--max-warnings=0` (strict) |
| Test | ✓ | `vitest run` |
| Audit | ✓ | `--audit-level=critical` |
| Build | ✓ | `next build` |
| E2E tests | **NO** | |
| Preview deployment | **NO** | |
| Lighthouse CI | **NO** | |
| Coverage report | **NO** | |
| Branch protection | **Unknown** (not in repo config) | |

---

## 2. Critical Blockers (must fix before production)

### BLOCKER-01: Zero error boundaries — unhandled runtime errors show raw React error

**Impacto:** Si cualquier componente lanza un error en runtime (data corrupta, API timeout, third-party script failure), el usuario ve una pantalla blanca o el error overlay de React. No hay recovery. No hay UX de fallback.

**Componentes en riesgo:**
- `TicketmasterWidget` — carga script externo que puede fallar
- `CookieBanner` — lee `document.cookie` (safe, pero sin boundary)
- `Reveal` — IntersectionObserver edge cases
- Cualquier Server Component que falle en render

**Files necesarios (mínimo):**
1. `src/app/global-error.tsx` — catch de errores en root layout
2. `src/app/error.tsx` — catch de errores en pages
3. `src/app/not-found.tsx` — 404 custom

**Esfuerzo:** 30 min para los 3 archivos

### BLOCKER-02: CSP connect-src bloquea Sentry — observabilidad ciega en producción

**Archivo:** `src/middleware.ts:72`

```
connect-src 'self' https://www.google-analytics.com https://www.facebook.com
```

Sentry envía a `https://*.ingest.de.sentry.io` que NO está en `connect-src`. **Todos los error reports, traces y replays son bloqueados silenciosamente por CSP.** La inversión en Sentry (3 configs, client/server/edge) es inútil sin este fix.

**Esfuerzo:** 1 línea, 2 minutos

### BLOCKER-03: lead-repository INSERT omite ip_address y consent_given (GDPR)

**Archivo:** `src/adapters/db/lead-repository.ts`

```sql
INSERT INTO leads (id, email, event_id, created_at)
```

Si la tabla tiene columnas GDPR (ip_address, consent_given), no se persisten. Esto es bloqueante para operar en la UE bajo RGPD Art. 7.1.

**Esfuerzo:** 2 horas (flujo completo types → domain → repository → route)

### BLOCKER-04: No metadata en páginas dinámicas — SEO vacío para eventos

**Archivos:** `src/app/eventos/page.tsx`, `src/app/eventos/[eventId]/page.tsx`

Estas páginas no exportan `metadata` ni `generateMetadata`. En producción:
- Compartir `/eventos/sunset` en redes sociales muestra el title/description genérico del root layout
- Google indexa todas las páginas de eventos con el mismo title/description
- Zero OG images

**Esfuerzo:** 30 min

---

## 3. Safe Fixes Before Deployment (no riesgo de regresión)

### FIX-01: Crear error boundaries [30 min, zero risk]

**`src/app/global-error.tsx`:**
```tsx
"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="es">
      <body>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Algo salió mal</h2>
          <button onClick={() => reset()}>Intentar de nuevo</button>
        </div>
      </body>
    </html>
  )
}
```

**`src/app/error.tsx`:**
```tsx
"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Error inesperado</h1>
        <p className="text-sm opacity-70">Lo sentimos. Ha ocurrido un problema.</p>
        <button
          onClick={() => reset()}
          className="border-2 border-black px-8 py-3 text-sm font-semibold
            hover:bg-black hover:text-white transition"
        >
          Intentar de nuevo
        </button>
      </div>
    </main>
  )
}
```

**`src/app/not-found.tsx`:**
```tsx
import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-sm opacity-70">Esta página no existe.</p>
        <Link
          href="/"
          className="inline-block border-2 border-black px-8 py-3 text-sm font-semibold
            hover:bg-black hover:text-white transition"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
```

### FIX-02: Crear loading boundaries [15 min, zero risk]

**`src/app/loading.tsx`:**
```tsx
export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-xs tracking-[0.3em] uppercase opacity-60 animate-pulse">
        Cargando…
      </div>
    </main>
  )
}
```

**`src/app/eventos/loading.tsx`:**
```tsx
export default function EventosLoading() {
  return (
    <main className="min-h-screen">
      <div className="px-6 md:px-12 pt-16 md:pt-24 pb-12 max-w-7xl mx-auto">
        <div className="h-12 w-48 bg-gray-100 animate-pulse rounded" />
        <div className="mt-4 h-5 w-80 bg-gray-100 animate-pulse rounded" />
      </div>
      <div className="px-6 md:px-12 py-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-40 bg-gray-50 animate-pulse rounded" />
          ))}
        </div>
      </div>
    </main>
  )
}
```

### FIX-03: Añadir Sentry a CSP connect-src [2 min, zero risk]

**Archivo:** `src/middleware.ts:72`

```diff
- "connect-src 'self' https://www.google-analytics.com https://www.facebook.com",
+ "connect-src 'self' https://www.google-analytics.com https://www.facebook.com https://*.ingest.de.sentry.io",
```

### FIX-04: Añadir metadata a páginas de eventos [30 min, zero risk]

**`src/app/eventos/page.tsx` — añadir al top:**
```tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Eventos — SolarisNerja",
  description: "Programa completo de eventos: música electrónica, mercado creativo y experiencias frente al mar.",
}
```

**`src/app/eventos/[eventId]/page.tsx` — añadir generateMetadata:**
```tsx
import type { Metadata } from "next"

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { eventId } = await params
  const event = getEvent(eventId)
  if (!event) return {}
  return {
    title: `${event.title} — SolarisNerja`,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
    },
  }
}
```

### FIX-05: Crear sitemap.ts y robots.ts [15 min, zero risk]

**`src/app/sitemap.ts`:**
```tsx
import type { MetadataRoute } from "next"
import { EVENTS } from "@/config/events"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.solarisnerja.com"
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/eventos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    ...EVENTS.map(e => ({
      url: `${base}/eventos/${e.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: `${base}/privacidad`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ]
}
```

**`src/app/robots.ts`:**
```tsx
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: "https://www.solarisnerja.com/sitemap.xml",
  }
}
```

### FIX-06: Eliminar `"use client"` de 6 componentes estáticos [5 min, zero risk]

**Archivos:** Header.tsx, HeroSection.tsx, EventosSection.tsx, MercadoSection.tsx, UbicacionSection.tsx, Footer.tsx

Eliminar la primera línea `"use client"` de cada archivo. Ninguno usa hooks, state ni browser APIs. Esto convierte ~5-6 KB de client JS innecesario en Server Components con zero hydration.

### FIX-07: Pool error handler [5 min, low risk]

**Archivo:** `src/adapters/db/pool.ts`

```diff
  pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 5_000
  })

+ pool.on("error", (err) => {
+   console.error("pg_pool_unexpected_error", { error: err.message })
+ })
```

Sin este listener, un error inesperado en una idle connection hace crash del proceso Node.js (unhandled error event).

### FIX-08: Unificar Header con layout de eventos [45 min, low risk]

Crear `src/app/eventos/layout.tsx` con el Header compartido, eliminando los 3 headers inline en `/eventos`, `/eventos/[eventId]`, y `/privacidad`. Reduce duplicación, asegura consistencia de navegación.

---

## 4. Scoring Breakdown Detallado

### Error Boundaries — 15/100

| Criterio | Score | Nota |
|----------|-------|------|
| global-error.tsx | 0 | No existe |
| error.tsx root | 0 | No existe |
| error.tsx subrutas | 0 | No existe |
| not-found.tsx | 0 | No existe — Next.js muestra default genérico |
| API route error handling | 80 | try/catch + RFC 7807 problem responses ✓ |
| DB query error propagation | 50 | catch genérico, sin retry/circuit breaker |

### Loading States — 20/100

| Criterio | Score | Nota |
|----------|-------|------|
| loading.tsx root | 0 | No existe |
| loading.tsx subrutas | 0 | No existe |
| Suspense boundaries | 0 | No existen |
| TicketmasterWidget loading | 80 | Tiene loading indicator mientras carga script |
| Maps iframe | 80 | `loading="lazy"` ✓ |

### Metadata & SEO — 45/100

| Criterio | Score | Nota |
|----------|-------|------|
| Root layout metadata | 90 | title + description + metadataBase + OG ✓ |
| Page-level metadata | 20 | Solo `/privacidad` tiene metadata |
| generateMetadata (dynamic) | 0 | `/eventos/[eventId]` sin generateMetadata |
| sitemap.xml | 0 | No existe |
| robots.txt | 0 | No existe |
| OG images | 0 | No existen |
| Structured data (JSON-LD) | 0 | No existe |

### Routing Consistency — 40/100

| Criterio | Score | Nota |
|----------|-------|------|
| Header unificado | 25 | 3 implementaciones diferentes |
| Footer unificado | 25 | 3 implementaciones diferentes (landing usa Footer component, subrutas inline) |
| Nested layouts | 0 | No hay layout.tsx en /eventos |
| Navigation active state | 50 | /eventos page marca "Eventos" como active, otras no |
| URL convention | 90 | Consistente (kebab-case, español) |

### Database Resilience — 55/100

| Criterio | Score | Nota |
|----------|-------|------|
| Connection pooling | 90 | Singleton + max 5 + timeouts |
| Parameterized queries | 100 | $1 placeholders ✓ |
| Error propagation | 50 | catch genérico |
| Pool error listener | 0 | No — process crash on idle error |
| Retry logic | 0 | No existe |
| Circuit breaker | 0 | No existe |
| Health check | 90 | `/api/readyz` con SELECT 1 |
| Idempotency | 90 | ON CONFLICT DO NOTHING ✓ |

### CI Pipeline — 70/100

| Criterio | Score | Nota |
|----------|-------|------|
| Typecheck | 100 | strict + noEmit |
| Lint | 100 | max-warnings=0 |
| Tests | 80 | vitest run, 4 test files, passWithNoTests: false |
| Audit | 80 | audit-level=critical |
| Build | 100 | next build |
| Frozen lockfile | 100 | --frozen-lockfile |
| E2E tests | 0 | No existen |
| Coverage | 0 | No configurado |
| Preview deploy | 0 | No existe en CI |

### Security Posture — 80/100

| Criterio | Score | Nota |
|----------|-------|------|
| CSP | 70 | Nonce-based ✓, pero connect-src incompleta y nonce no propagado |
| HSTS | 100 | preload + includeSubDomains |
| Headers | 95 | X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy |
| CORS | 90 | Whitelist explícita |
| Input validation | 95 | AJV + additionalProperties:false |
| Rate limiting | 40 | In-memory, inefectivo en serverless |
| Secrets | 90 | .env.local en .gitignore, no trackeado |
| poweredByHeader | 100 | false ✓ |

### Next.js Best Practices — 65/100

| Criterio | Score | Nota |
|----------|-------|------|
| App Router usage | 90 | Correcto |
| Server vs Client components | 30 | 7 de 10 `"use client"` innecesarios |
| Fonts optimization | 100 | next/font/google self-hosted |
| Image optimization | 60 | next/image sin `sizes` prop |
| Dynamic imports | 20 | Zero dynamic imports, TicketmasterWidget debería ser lazy |
| reactStrictMode | 100 | true ✓ |
| TypeScript strict | 100 | strict + noUncheckedIndexedAccess |
| Cache headers | 90 | Correctos para HTML, API, static |

---

## 5. Checklist de Verificación Pre-Deploy

- [ ] `pnpm build` sin errores ni warnings
- [ ] `pnpm test` — todos los tests pasan
- [ ] `pnpm lint` — 0 warnings
- [ ] `pnpm typecheck` — sin errores
- [ ] Verificar `global-error.tsx` — provocar error en layout, ver fallback
- [ ] Verificar `error.tsx` — provocar error en page, ver fallback + reset
- [ ] Verificar `not-found.tsx` — navegar a `/ruta-que-no-existe`, ver 404 custom
- [ ] Verificar Sentry — provocar error en staging, confirmar que llega a dashboard
- [ ] Verificar sitemap — `curl https://www.solarisnerja.com/sitemap.xml`
- [ ] Verificar robots — `curl https://www.solarisnerja.com/robots.txt`
- [ ] Verificar metadata — compartir `/eventos/sunset` en Open Graph debugger
- [ ] Verificar CSP — no violations en console de producción
- [ ] Verificar DB resilience — `pool.on("error")` logea correctamente

---

## 6. Riesgos residuales (post-fixes)

1. **Rate limiter seguirá siendo in-memory.** Funcional como protección básica, pero bypassable con requests distribuidos. Migrar a Upstash Redis si el tráfico crece.
2. **Sin E2E tests.** Los test unitarios cubren API y domain, pero no hay Playwright/Cypress para flujos de usuario completos.
3. **Sin monitoring de Web Vitals.** Sentry traces miden server performance, pero no hay reporte de LCP/FID/CLS real de usuarios.
4. **GDPR consent persistence** (BLOCKER-03) requiere coordinar con el esquema de DB existente antes de implementar.

---

## 7. Siguientes 3 acciones

1. **[30 min] Crear error boundaries** — `global-error.tsx`, `error.tsx`, `not-found.tsx`. Son los blockers con mayor impacto en UX y menor esfuerzo.
2. **[2 min] Fix CSP connect-src** — Añadir Sentry domain. Desbloquea toda la inversión en observabilidad.
3. **[30 min] Añadir metadata + sitemap + robots** — Desbloquea SEO para todas las páginas de eventos.

**Con estos 3 fixes (≈1 hora), el score sube de 62 a ~78.** Los demás fixes (eliminar `"use client"`, unificar headers, pool error handler) pueden ir en el sprint siguiente sin bloquear el deploy.
