import Link from "next/link"
import LeadsChart from "@/ui/components/dashboard/LeadsChart"
import ForecastCard from "@/ui/components/dashboard/ForecastCard"
import TrendingCard from "@/ui/components/dashboard/TrendingCard"
import ViralEventCard from "@/ui/components/dashboard/ViralEventCard"

async function getMetrics() {
  const res = await fetch("/api/admin/metrics", { cache: "no-store" })
  if (!res.ok) return { leadsTotal: 0, events: [] }
  return res.json()
}

async function getActivity() {
  const res = await fetch("/api/admin/activity", { cache: "no-store" })
  if (!res.ok) return { lastHour: 0, last24h: 0 }
  return res.json()
}

async function getLeadsPerDay() {
  const res = await fetch("/api/admin/leads-per-day", { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

async function getForecast() {
  const res = await fetch("/api/admin/forecast", { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

async function getTrending() {
  const res = await fetch("/api/admin/trending", { cache: "no-store" })
  if (!res.ok) return null
  return res.json()
}

async function getViral() {
  const res = await fetch("/api/admin/viral", { cache: "no-store" })
  if (!res.ok) return null
  return res.json()
}

export default async function DashboardPage() {

  const metrics = await getMetrics()
  const activity = await getActivity()
  const leadsPerDay = await getLeadsPerDay()
  const forecast = await getForecast()
  const trending = await getTrending()
  const viral = await getViral()

  const topEvent = metrics.events?.[0]

  const interest =
    topEvent && topEvent.capacity
      ? ((topEvent.leads / topEvent.capacity) * 100).toFixed(1)
      : "0"

  return (
    <div className="space-y-12">

      <div>
        <p className="editorial-label mb-3">panel de control</p>
        <h1 className="editorial-h2">solaris nerja</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">

        <div className="bg-white border border-[var(--sn-border)] p-6">
          <p className="text-xs tracking-wide text-[var(--sn-muted)] mb-2">
            leads totales
          </p>
          <p className="text-3xl font-semibold">
            {metrics.leadsTotal ?? 0}
          </p>
        </div>

        <div className="bg-white border border-[var(--sn-border)] p-6">
          <p className="text-xs tracking-wide text-[var(--sn-muted)] mb-2">
            eventos
          </p>
          <p className="text-3xl font-semibold">
            {metrics.events?.length ?? 0}
          </p>
        </div>

        <div className="bg-white border border-[var(--sn-border)] p-6">
          <p className="text-xs tracking-wide text-[var(--sn-muted)] mb-2">
            evento con más interés
          </p>

          {topEvent ? (
            <>
              <p className="font-medium">{topEvent.title}</p>
              <p className="text-sm text-[var(--sn-muted)] mt-1">
                {topEvent.leads} interesados
              </p>
            </>
          ) : (
            <p className="text-sm text-[var(--sn-muted)]">sin datos</p>
          )}

        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <ForecastCard data={forecast} />

        <TrendingCard data={trending} />

      </div>

      <ViralEventCard data={viral} />

      <div className="grid gap-6 md:grid-cols-2">

        {topEvent && (
          <div className="bg-white border border-[var(--sn-border)] p-8 space-y-4">

            <p className="editorial-label">
              interés vs aforo
            </p>

            <p className="text-lg font-medium">
              {topEvent.title}
            </p>

            <div className="w-full bg-[var(--sn-surface)] h-3 rounded-sm overflow-hidden">
              <div
                className="bg-black h-full"
                style={{ width: `${interest}%` }}
              />
            </div>

            <p className="text-sm text-[var(--sn-muted)] tracking-wide">
              {topEvent.leads} interesados · aforo {topEvent.capacity} · {interest}%
            </p>

          </div>
        )}

        <div className="bg-white border border-[var(--sn-border)] p-8 space-y-3">

          <p className="editorial-label">
            actividad reciente
          </p>

          <p className="text-lg">
            🔥 {activity.lastHour} interesados última hora
          </p>

          <p className="text-sm text-[var(--sn-muted)] tracking-wide">
            {activity.last24h} últimas 24h
          </p>

        </div>

      </div>

      <LeadsChart data={leadsPerDay} />

      <div className="grid gap-6 md:grid-cols-2">

        <Link
          href="/dashboard/events"
          className="bg-white border border-[var(--sn-border)] p-8 hover:border-black transition"
        >
          <p className="editorial-label mb-2">gestionar</p>
          <p className="text-lg font-medium">eventos</p>
          <p className="text-sm text-[var(--sn-muted)] mt-2">
            crear, editar y activar eventos
          </p>
        </Link>

        <Link
          href="/dashboard/leads"
          className="bg-white border border-[var(--sn-border)] p-8 hover:border-black transition"
        >
          <p className="editorial-label mb-2">marketing</p>
          <p className="text-lg font-medium">leads</p>
          <p className="text-sm text-[var(--sn-muted)] mt-2">
            ver interesados y exportar CSV
          </p>
        </Link>

      </div>

    </div>
  )
}
