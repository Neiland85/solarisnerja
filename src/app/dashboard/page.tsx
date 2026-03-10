import Link from "next/link"

import LeadsChart from "@/ui/components/dashboard/LeadsChart"
import ForecastCard from "@/ui/components/dashboard/ForecastCard"
import TrendingCard from "@/ui/components/dashboard/TrendingCard"
import ViralEventCard from "@/ui/components/dashboard/ViralEventCard"
import SystemStatusCard from "@/ui/components/dashboard/SystemStatusCard"
import AttendanceForecastCard from "@/ui/components/dashboard/AttendanceForecastCard"
import FestivalHealthCard from "@/ui/components/dashboard/FestivalHealthCard"

async function getMetrics() {
  const res = await fetch("/api/admin/metrics", { cache: "no-store" })
  if (!res.ok) return { leadsTotal: 0, events: [] }
  return res.json()
}

async function getForecast() {
  const res = await fetch("/api/admin/forecast", { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

async function getTrending() {
  const res = await fetch("/api/admin/trending", { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

async function getSystem() {
  const res = await fetch("/api/admin/system", { cache: "no-store" })
  if (!res.ok) return {}
  return res.json()
}

async function getHealth() {
  const res = await fetch("/api/admin/health", { cache: "no-store" })
  if (!res.ok) return null
  return res.json()
}

export default async function DashboardPage() {

  const metrics = await getMetrics()
  const forecast = await getForecast()
  const trending = await getTrending()
  const system = await getSystem()
  const health = await getHealth()

  return (

    <div className="space-y-12">

      <div>
        <p className="editorial-label mb-2">control center</p>
        <h1 className="editorial-h2">solaris nerja dashboard</h1>
      </div>

      {health && <FestivalHealthCard data={health} />}

      <SystemStatusCard data={system} />

      <LeadsChart data={metrics.events} />

      <ForecastCard data={metrics} />

      <TrendingCard data={trending} />

      <ViralEventCard data={trending} />

      <AttendanceForecastCard data={forecast} />

      <div className="grid md:grid-cols-2 gap-6">

        <Link
          href="/dashboard/events"
          className="bg-white border border-[var(--sn-border)] p-8 hover:border-black transition"
        >
          <p className="editorial-label mb-2">gestionar</p>
          <p className="text-lg font-medium">eventos</p>
        </Link>

        <Link
          href="/dashboard/leads"
          className="bg-white border border-[var(--sn-border)] p-8 hover:border-black transition"
        >
          <p className="editorial-label mb-2">marketing</p>
          <p className="text-lg font-medium">leads</p>
        </Link>

      </div>

    </div>

  )

}
