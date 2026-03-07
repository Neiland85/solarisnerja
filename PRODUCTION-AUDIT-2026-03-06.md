# AUDITORÍA DE PRODUCCIÓN — SOLARIS NERJA

**Fecha:** 2026-03-06
**Auditor:** Staff Engineer (independiente)
**Commit base:** HEAD en main
**Alcance:** Full-stack production readiness

---

## 1. MAPA DEL SISTEMA

```
┌───────────────────────────────────────────────────┐
│                   VERCEL EDGE                      │
│  middleware.ts (CSP nonce, CORS, security headers) │
└────────────────────┬──────────────────────────────┘
                     │
┌────────────────────▼──────────────────────────────┐
│              NEXT.JS APP ROUTER                    │
│                                                    │
│  PAGES (Server Components)                         │
│  ├── layout.tsx (metadata, fonts, CookieBanner)    │
│  ├── page.tsx (landing: 6 secciones)               │
│  ├── eventos/page.tsx                              │
│  ├── eventos/[eventId]/page.tsx                    │
│  └── privacidad/page.tsx                           │
│                                                    │
│  API ROUTES                                        │
│  ├── /api/healthz       (liveness)                 │
│  ├── /api/readyz        (readiness + DB check)     │
│  └── /api/v1/leads      (POST, AJV validated)      │
│                                                    │
│  UI COMPONENTS (Client)                            │
│  ├── Header, Footer, HeroSection                   │
│  ├── EventosSection, MercadoSection, Ubicacion     │
│  ├── EventCard, CookieBanner, Reveal, StickyCTA    │
│  ├── TicketmasterWidget, SecureScript, UI          │
│  └── (13 componentes total)                        │
└────────────────────┬──────────────────────────────┘
                     │
┌────────────────────▼──────────────────────────────┐
│              DOMAIN LAYER                          │
│  ├── leads/types.ts     (Lead interface)           │
│  ├── leads/create-lead.ts (factory pura)           │
│  └── contracts/schemas/ (JSON Schema 2020-12)      │
└────────────────────┬──────────────────────────────┘
                     │
┌────────────────────▼──────────────────────────────┐
│              ADAPTERS                              │
│  ├── db/pool.ts         (pg Pool singleton)        │
│  └── db/lead-repository.ts (parameterized SQL)     │
└────────────────────┬──────────────────────────────┘
                     │
┌────────────────────▼──────────────────────────────┐
│              INFRASTRUCTURE                        │
│  ├── PostgreSQL (Supabase, pgbouncer)              │
│  ├── Sentry (client + server + edge)               │
│  ├── Vercel (deploy)                               │
│  └── GitHub Actions (CI)                           │
└───────────────────────────────────────────────────┘
```

**Dependencias críticas:** next@16.1.6, react@19.2.3, pg@8, @sentry/nextjs@10, ajv@8

---

## 2. TOP 10 RIESGOS

| # | Severidad | Prob. | Impacto | Hallazgo | Archivo | Línea |
|---|-----------|-------|---------|----------|---------|-------|
| 1 | **CRÍTICO** | Alta | Data loss | `saveLead()` no persiste `ip_address` ni `consent_given` — columnas en schema pero no en INSERT | `lead-repository.ts` | 7-13 |
| 2 | **CRÍTICO** | Alta | GDPR multa | `consent_given DEFAULT false` en schema pero nunca se escribe `true` — lead siempre sin consentimiento registrado | `schema.sql` + `lead-repository.ts` | 10, 9 |
| 3 | **ALTO** | Media | Crash prod | `TicketmasterWidget` usa `innerHTML = ""` para limpiar DOM + `setLoaded` en effect — potencial XSS si TM widget inyecta contenido, y conflicto con React reconciliation | `TicketmasterWidget.tsx` | 33-37 |
| 4 | **ALTO** | Alta | CI fail | Rate limiter in-memory (`Map`) no persiste entre instancias serverless — en Vercel cada request puede ir a distinta instancia, rate limit inefectivo | `rate-limit.ts` | 11 |
| 5 | **ALTO** | Media | Security | CSP nonce generado en middleware pero NO propagado a layout/componentes — nonce se pasa via `x-nonce` header pero no se lee en ningún componente server | `middleware.ts` + `layout.tsx` | 95, 29-42 |
| 6 | **MEDIO** | Alta | DX/Maint. | Header duplicado en 3 archivos: `eventos/page.tsx`, `eventos/[eventId]/page.tsx`, `privacidad/page.tsx` — cada uno con su propio header inline en vez de usar `Header.tsx` | Múltiples | — |
| 7 | **MEDIO** | Media | SEO | `eventos/page.tsx` y `eventos/[eventId]/page.tsx` no exportan `metadata` — sin título ni OG tags dinámicos | `eventos/page.tsx` | — |
| 8 | **MEDIO** | Media | UX | No hay `loading.tsx` ni `error.tsx` en ninguna ruta — navegación sin feedback visual, errores sin boundary | `src/app/` | — |
| 9 | **MEDIO** | Baja | Perf. | `connect-src` en CSP no incluye Sentry DSN domain — Sentry errores/replay pueden ser bloqueados por CSP en producción | `middleware.ts` | 72 |
| 10 | **BAJO** | Alta | CI | Security headers duplicados: `next.config.ts` y `middleware.ts` aplican exactamente los mismos headers — doble aplicación en cada response | `next.config.ts` + `middleware.ts` | Todos |

---

## 3. ISSUES CRÍTICOS

### 3.1 Lead Repository no guarda IP ni consentimiento

**Archivo:** `src/adapters/db/lead-repository.ts:7-13`
**Problema:** El schema SQL define `ip_address TEXT` y `consent_given BOOLEAN NOT NULL DEFAULT false`, pero el INSERT solo inserta `(id, email, event_id, created_at)`. Nunca se escribe `ip_address` ni `consent_given = true`.
**Fix mínimo:**
```typescript
await pool.query(
  `INSERT INTO leads (id, email, event_id, ip_address, consent_given, created_at)
   VALUES ($1, $2, $3, $4, $5, $6)
   ON CONFLICT (email, event_id) DO NOTHING`,
  [lead.id, lead.email, lead.eventId, lead.ipAddress, lead.consentGiven, lead.createdAt]
)
```
Requiere también actualizar `Lead` type y `createLead()`.

### 3.2 TicketmasterWidget: innerHTML + React conflict

**Archivo:** `src/ui/components/TicketmasterWidget.tsx:33-37`
**Problema:** `node.innerHTML = ""` dentro de useEffect bypasses React. Si el widget TM inyecta scripts, React puede crash o crear memory leak. El cleanup `node.innerHTML = ""` no desregistra event listeners del widget.
**Fix mínimo:** Usar un `<div>` independiente fuera del React tree con `ref`, o cargar TM widget via `<iframe>` sandbox.

---

## 4. PRODUCTION RISKS

### 4.1 Rate limiter inefectivo en serverless

**Archivo:** `src/lib/rate-limit.ts`
**Problema:** In-memory `Map` se resetea entre invocaciones en Vercel Serverless/Edge. Cada cold start tiene `store` vacío. Un atacante puede enviar requests ilimitadas.
**Fix:** Aceptable para MVP si el volumen es bajo. Para producción real: Vercel KV, Upstash Redis, o rate limit a nivel CDN/WAF.

### 4.2 Nonce CSP no utilizado

**Archivo:** `src/middleware.ts:95` → `src/app/layout.tsx`
**Problema:** El middleware genera nonce y lo pone en header `x-nonce`, pero `layout.tsx` nunca lee ese header. Los `<script>` inline necesitan `nonce={nonce}` para cumplir CSP. El `style-src 'unsafe-inline'` sigue presente.
**Fix mínimo:** En layout.tsx server component:
```typescript
import { headers } from 'next/headers'
const nonce = (await headers()).get('x-nonce') ?? ''
// Pass nonce to scripts
```

### 4.3 Sentry bloqueado por CSP

**Archivo:** `src/middleware.ts:72`
**Problema:** `connect-src` solo incluye `'self' google-analytics facebook`. Sentry envía datos a `*.ingest.de.sentry.io` que no está en `connect-src`.
**Fix:** Añadir `https://*.ingest.de.sentry.io` a `connect-src`.

---

## 5. PERFORMANCE IMPROVEMENTS

| Archivo | Problema | Fix |
|---------|----------|-----|
| `UbicacionSection.tsx` | Google Maps iframe carga eager en landing — heavy third-party | Añadir `loading="lazy"` ✓ (ya presente) pero envolver en IntersectionObserver para evitar carga hasta scroll |
| `TicketmasterWidget.tsx` | Script TM se carga en useEffect sin nonce — CSP puede bloquearlo | Usar `SecureScript` component o `next/script` con `strategy="lazyOnload"` |
| `layout.tsx` | `Geist_Mono` font loaded but never used visually | Eliminar si no se usa, ahorra ~20KB |
| `Reveal.tsx` | Cada instancia crea su propio `IntersectionObserver` — landing tiene ~8 Reveal = 8 observers | Considerar shared observer singleton |
| `CookieBanner.tsx` | `document.cookie` parseado sincrónicamente en cada render init | Aceptable para un banner, no es un problema real |

---

## 6. CODE QUALITY IMPROVEMENTS

### 6.1 TypeScript

| Archivo | Línea | Problema | Fix |
|---------|-------|----------|-----|
| `EventCard.tsx` | 1-8 | Interface inline, no exportada — `/eventos/page.tsx` construye el objeto manualmente | Exportar type y unificar con `Event` del config |
| `tracking.ts` | 1-6 | `declare global { Window }` modifica global namespace — puede conflictar | Mover a archivo `.d.ts` separado |
| `UI.tsx` | 3 | `ButtonPrimary` props no tiene `className` ni `target` override | Aceptable para alcance actual |
| `StickyCTA.tsx` | — | No tiene `"use client"` pero usa hooks indirectamente via Link | No es problema — `Link` es auto-client |

### 6.2 Next.js Best Practices

| Archivo | Problema | Fix |
|---------|----------|-----|
| `eventos/page.tsx` | No exporta `metadata` | Añadir `export const metadata: Metadata = { title: "Eventos" }` |
| `eventos/[eventId]/page.tsx` | No exporta `generateMetadata` dinámico | Añadir `export async function generateMetadata({ params })` |
| `privacidad/page.tsx` | ✓ Tiene metadata | OK |
| `src/app/` | No existe `not-found.tsx` global | Crear para UX consistente |
| `src/app/` | No existe `error.tsx` en ninguna ruta | Crear al menos en root para error boundary |
| `src/app/` | No existe `loading.tsx` | Crear para feedback durante navegación |
| `eventos/[eventId]/page.tsx` | `Reveal` (client) wrapping `ButtonPrimary` — server component renders client component inside client wrapper | No es error técnico pero añade complejidad innecesaria |

### 6.3 Componentes huérfanos / no usados en landing

| Componente | Usado en landing? | Usado en subrutas? |
|------------|-------------------|---------------------|
| `StickyCTA.tsx` | **NO** (eliminado de page.tsx) | NO |
| `UI.tsx` (`ButtonPrimary`, `ButtonGhost`, `Card`) | **NO** | `ButtonPrimary` en `[eventId]/page.tsx` |
| `SecureScript.tsx` | **NO** | NO |
| `Reveal.tsx` | **NO** (eliminado de page.tsx) | `eventos/`, `[eventId]/` |

---

## 7. CI/CD IMPROVEMENTS

### 7.1 CI Workflow actual

```yaml
install → typecheck → lint → test → audit → build
```

**Evaluación:** ✓ Orden correcto. ✓ `--frozen-lockfile`. ✓ `cache: 'pnpm'`.

| Problema | Severidad | Fix |
|----------|-----------|-----|
| `pnpm audit --audit-level=critical` — solo critical, ignora high | Medio | Cambiar a `--audit-level=high` |
| No hay paso de verificación de build output (bundle size) | Bajo | Añadir `pnpm build && ls -la .next/` o usar `@next/bundle-analyzer` |
| No hay matrix para Node versions | Bajo | Aceptable para proyecto single-version |
| `vitest` con `passWithNoTests: false` — CI fallará si se borran tests | Info | Intencional y correcto |

### 7.2 Dependabot

✓ npm weekly (monday)
✓ github-actions weekly
✓ Groups minor+patch
⚠ `reviewers: []` — PRs de Dependabot sin revisor asignado

---

## 8. SEGURIDAD

### 8.1 OWASP Assessment

| Check | Estado | Evidencia |
|-------|--------|-----------|
| SQL Injection | ✅ Protegido | Parameterized queries en `lead-repository.ts` |
| XSS | ⚠ Parcial | CSP con nonce pero nonce no propagado a componentes |
| CSRF | ⚠ WIP | Archivos en `.wip/` — no implementado |
| Input Validation | ✅ | AJV + JSON Schema + `additionalProperties: false` |
| Auth | N/A | No hay autenticación (es un landing + lead capture) |
| Rate Limiting | ⚠ Inefectivo | In-memory, no persiste en serverless |
| Security Headers | ✅ | HSTS preload, X-Frame-Options DENY, nosniff, Permissions-Policy |
| CORS | ✅ | Whitelist + preflight handling |

### 8.2 Gestión de secretos

| Check | Estado |
|-------|--------|
| `.env.local` en `.gitignore` | ✅ |
| `.env.example` sin valores reales | ✅ |
| Secrets en código fuente | ✅ Ninguno encontrado |
| `SENTRY_AUTH_TOKEN` en env vars | ✅ Solo server-side |
| `NEXT_PUBLIC_*` vars | ⚠ DSN de Sentry es público por diseño — OK |

### 8.3 Supply Chain

| Check | Estado |
|-------|--------|
| pnpm overrides para CVEs | ✅ minimatch, ajv, serialize-javascript |
| Dependabot activo | ✅ |
| `--frozen-lockfile` en CI | ✅ |
| Audit en CI | ✅ (solo critical — debería ser high) |

---

## 9. OBSERVABILIDAD

| Check | Estado | Notas |
|-------|--------|-------|
| Error tracking | ✅ | Sentry client + server + edge |
| Structured logging | ✅ | `lib/logger.ts` con JSON structured |
| Request ID | ✅ | `x-request-id` en middleware |
| Health probe | ✅ | `/api/healthz` |
| Readiness probe | ✅ | `/api/readyz` (con DB check) |
| Analytics | ✅ | GA4 + Meta Pixel (con consent) |
| Bundle size monitoring | ❌ | No evidenciado |
| Uptime monitoring | ❌ | No evidenciado |

---

## 10. ROADMAP

### Quick Wins (24-72h)

1. **Fix lead-repository INSERT** — añadir `ip_address` y `consent_given` a la query
2. **Añadir Sentry domain a CSP `connect-src`** — `https://*.ingest.de.sentry.io`
3. **Crear `error.tsx` en `src/app/`** — error boundary mínimo
4. **Crear `not-found.tsx` en `src/app/`** — 404 page branded
5. **Añadir `metadata` a `eventos/page.tsx`** — SEO básico
6. **Eliminar headers duplicados** — quitar de `next.config.ts` (dejar en middleware que maneja nonce)
7. **Cambiar audit level a `high`** en CI

### Medio plazo (2-4 semanas)

8. **Propagar nonce CSP** — leer `x-nonce` en layout, pasar a scripts
9. **CSRF implementation** — migrar archivos de `.wip/` a producción
10. **Rate limit con Upstash/Vercel KV** — reemplazar in-memory Map
11. **`generateMetadata` dinámico** en `[eventId]/page.tsx`
12. **Unificar Header component** — eliminar headers inline en subrutas
13. **Crear `loading.tsx`** para feedback de navegación
14. **Bundle analyzer** — verificar que no hay dependencias oversized

### Largo plazo (2-3 meses)

15. **E2E tests** — Playwright para flujos críticos (landing → eventos → lead capture)
16. **Staging environment** — preview deploys con DB aislada
17. **GDPR data export/delete** — endpoint para subject access requests
18. **Monitoring dashboards** — Sentry performance + uptime alerts
19. **CDN rate limiting** — Vercel WAF o Cloudflare rules

---

## 11. CHECKLIST DE VERIFICACIÓN

```
[ ] lead-repository.ts persiste ip_address y consent_given
[ ] CSP connect-src incluye *.ingest.de.sentry.io
[ ] error.tsx existe en src/app/
[ ] not-found.tsx existe en src/app/
[ ] eventos/page.tsx exporta metadata
[ ] eventos/[eventId]/page.tsx exporta generateMetadata
[ ] Headers de seguridad NO duplicados (solo en middleware)
[ ] CI audit level = high
[ ] pnpm audit devuelve 0 vulnerabilidades
[ ] pnpm typecheck pasa sin errores
[ ] pnpm lint pasa con 0 warnings
[ ] Build completa sin errores
[ ] Sentry reporta errores correctamente en preview
[ ] /api/healthz devuelve 200
[ ] /api/readyz devuelve 200 con DB conectada
```

---

## 12. VEREDICTO

**Estado general: APTO PARA MVP / NO APTO PARA PRODUCCIÓN COMPLETA**

El proyecto tiene una arquitectura sólida (DDD-lite, contratos, CSP, structured logging, probes) y está bien preparado para un MVP. Los issues críticos (#1 y #2) son de data integrity y GDPR compliance — deben resolverse antes de capturar leads reales. El rate limit inefectivo (#4) es aceptable para un MVP con bajo tráfico pero no para producción con marketing activo.

La calidad de ingeniería está por encima de la media para un proyecto de este tamaño: TypeScript strict, AJV validation, parameterized queries, RFC 7807 errors, security headers completos. La principal deuda técnica es de plomería (nonce no propagado, headers duplicados, header component no unificado) — no de arquitectura.
