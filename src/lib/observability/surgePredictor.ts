/**
 * M3: Traffic Surge Predictor
 *
 * Predice picos de tráfico usando sliding window analysis (30 buckets × 1 min).
 * Detecta gradientes positivos y emite niveles: NORMAL → ELEVATED → HIGH → SURGE.
 *
 * Patrón derivado de Ticketmaster "Heat Map" para on-sale events
 * y Eventbrite surge detection (15-30 min prediction window).
 *
 * NO modifica lógica existente. Integración: 1 línea en leads POST.
 *   import { recordLead } from "@/lib/observability/surgePredictor"
 *   recordLead()
 *
 * In-memory — se resetea en cold start (aceptable para serverless con ~5 min warm).
 */

// ── Types ───────────────────────────────────────────────

export type SurgeLevel = "NORMAL" | "ELEVATED" | "HIGH" | "SURGE"

export type SurgeSnapshot = {
  level: SurgeLevel
  currentRate: number         // leads/min en bucket actual
  avgRate: number             // leads/min promedio (últimos 30 min)
  peakRate: number            // max leads/min en ventana
  gradient: number            // tasa de cambio (%/min) últimos 3 buckets
  gradientTrend: "rising" | "stable" | "falling"
  prediction15m: number       // estimación leads/min en 15 min si tendencia continúa
  surgeWarning: boolean       // gradient >50% en 3 buckets consecutivos
  windowMinutes: number       // tamaño ventana actual con datos
  buckets: BucketSnapshot[]   // últimos 30 min de actividad
  collectedAt: string
}

export type BucketSnapshot = {
  minuteAgo: number           // 0 = ahora, 1 = hace 1 min, etc.
  count: number
  timestamp: string
}

// ── Config ──────────────────────────────────────────────

const WINDOW_SIZE = 30        // 30 buckets de 1 minuto
const BUCKET_MS = 60_000      // 1 minuto por bucket
const GRADIENT_WINDOW = 3     // buckets para calcular gradient

// Thresholds (leads/min)
const THRESHOLD_ELEVATED = 20
const THRESHOLD_HIGH = 50
const THRESHOLD_SURGE = 100

// Gradient warning: >50% crecimiento sostenido
const GRADIENT_WARNING_PCT = 50

// ── Store ───────────────────────────────────────────────

type Bucket = {
  count: number
  startTime: number           // timestamp del inicio del bucket
}

let buckets: Bucket[] = []
let totalLeads = 0

// ── Internal helpers ────────────────────────────────────

function now(): number {
  return Date.now()
}

/**
 * Garantiza que el array de buckets está actualizado.
 * Crea nuevos buckets vacíos si ha pasado tiempo desde el último.
 */
function ensureBuckets(): void {
  const currentTime = now()

  if (buckets.length === 0) {
    buckets.push({ count: 0, startTime: currentTime })
    return
  }

  const lastBucket = buckets[buckets.length - 1]!
  const elapsed = currentTime - lastBucket.startTime
  const bucketsToAdd = Math.floor(elapsed / BUCKET_MS)

  for (let i = 0; i < bucketsToAdd; i++) {
    buckets.push({
      count: 0,
      startTime: lastBucket.startTime + (i + 1) * BUCKET_MS,
    })
  }

  // Trim a WINDOW_SIZE
  if (buckets.length > WINDOW_SIZE) {
    buckets = buckets.slice(buckets.length - WINDOW_SIZE)
  }
}

function classifyLevel(rate: number): SurgeLevel {
  if (rate >= THRESHOLD_SURGE) return "SURGE"
  if (rate >= THRESHOLD_HIGH) return "HIGH"
  if (rate >= THRESHOLD_ELEVATED) return "ELEVATED"
  return "NORMAL"
}

/**
 * Calcula el gradient (% cambio/min) sobre los últimos N buckets.
 * Retorna: % positivo = crecimiento, negativo = decrecimiento.
 */
function calculateGradient(recentBuckets: Bucket[]): number {
  if (recentBuckets.length < 2) return 0

  const first = recentBuckets[0]!.count
  const last = recentBuckets[recentBuckets.length - 1]!.count

  if (first === 0) {
    return last > 0 ? 100 : 0
  }

  return ((last - first) / first) * 100
}

/**
 * Detecta si el gradient ha sido >50% en los últimos GRADIENT_WINDOW buckets consecutivos.
 */
function detectSurgeWarning(recentBuckets: Bucket[]): boolean {
  if (recentBuckets.length < GRADIENT_WINDOW) return false

  // Verificar crecimiento consecutivo en cada par
  for (let i = 1; i < recentBuckets.length; i++) {
    const prev = recentBuckets[i - 1]!.count
    const curr = recentBuckets[i]!.count
    // Si no crece significativamente entre pares, no es warning
    if (prev === 0 && curr === 0) return false
    if (prev > 0 && ((curr - prev) / prev) * 100 < GRADIENT_WARNING_PCT) return false
  }

  return true
}

/**
 * Predicción lineal simple a 15 minutos basada en gradient actual.
 */
function predict15m(currentRate: number, gradient: number): number {
  if (gradient <= 0) return Math.max(0, currentRate)
  // Extrapolar: rate * (1 + gradient/100)^15 (compuesto), capped
  const predicted = currentRate * Math.pow(1 + gradient / 100, 15)
  return Math.min(Math.round(predicted), 10000) // cap razonable
}

// ── Public API ──────────────────────────────────────────

/**
 * Registra un lead entrante. Llamar desde leads POST handler.
 * Una sola línea de integración: recordLead()
 */
export function recordLead(): void {
  ensureBuckets()
  const currentBucket = buckets[buckets.length - 1]!
  currentBucket.count++
  totalLeads++
}

/**
 * Devuelve snapshot completo del estado de tráfico.
 */
export function getSurgeStatus(): SurgeSnapshot {
  ensureBuckets()

  const currentRate = buckets.length > 0 ? buckets[buckets.length - 1]!.count : 0

  // Promedio de todos los buckets con datos
  const activeBuckets = buckets.filter((b) => b.count > 0)
  const avgRate =
    activeBuckets.length > 0
      ? activeBuckets.reduce((sum, b) => sum + b.count, 0) / activeBuckets.length
      : 0

  const peakRate = buckets.reduce((max, b) => Math.max(max, b.count), 0)

  // Gradient: últimos GRADIENT_WINDOW buckets
  const recentForGradient = buckets.slice(-GRADIENT_WINDOW)
  const gradient = calculateGradient(recentForGradient)

  const gradientTrend: "rising" | "stable" | "falling" =
    gradient > 10 ? "rising" : gradient < -10 ? "falling" : "stable"

  const surgeWarning = detectSurgeWarning(recentForGradient)
  const prediction15m = predict15m(currentRate, gradient)

  // Nivel basado en rate actual
  const level = classifyLevel(currentRate)

  // Bucket snapshots (más reciente primero)
  const bucketSnapshots: BucketSnapshot[] = buckets
    .map((b, i) => ({
      minuteAgo: buckets.length - 1 - i,
      count: b.count,
      timestamp: new Date(b.startTime).toISOString(),
    }))
    .reverse()

  return {
    level,
    currentRate,
    avgRate: Math.round(avgRate * 10) / 10,
    peakRate,
    gradient: Math.round(gradient * 10) / 10,
    gradientTrend,
    prediction15m,
    surgeWarning,
    windowMinutes: buckets.length,
    buckets: bucketSnapshots,
    collectedAt: new Date().toISOString(),
  }
}

/**
 * Resetea el predictor. Uso: tests.
 */
export function resetSurgePredictor(): void {
  buckets = []
  totalLeads = 0
}

/**
 * Inyecta datos en un bucket específico (para testing).
 * minuteAgo: 0 = bucket actual, 1 = hace 1 min, etc.
 */
export function _injectBucket(minuteAgo: number, count: number): void {
  ensureBuckets()

  // Asegurar que hay suficientes buckets
  while (buckets.length <= minuteAgo) {
    const lastStart = buckets.length > 0
      ? buckets[0]!.startTime - BUCKET_MS
      : now() - minuteAgo * BUCKET_MS
    buckets.unshift({ count: 0, startTime: lastStart })
  }

  // Trim a WINDOW_SIZE
  if (buckets.length > WINDOW_SIZE) {
    buckets = buckets.slice(buckets.length - WINDOW_SIZE)
  }

  const idx = buckets.length - 1 - minuteAgo
  if (idx >= 0 && idx < buckets.length) {
    buckets[idx]!.count = count
  }
}
