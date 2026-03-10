import Link from "next/link"

import LeadsChart from "@/ui/components/dashboard/LeadsChart"
import ForecastCard from "@/ui/components/dashboard/ForecastCard"
import TrendingCard from "@/ui/components/dashboard/TrendingCard"
import ViralEventCard from "@/ui/components/dashboard/ViralEventCard"
import SystemStatusCard from "@/ui/components/dashboard/SystemStatusCard"

async function getMetrics() {

  const metrics = await fetch("/api/admin/metrics", {
    cache: "no-store"
  }).then(r => r.json())

  const system = await fetch("/api/admin/system", {
    cache: "no-store"
  }).then(r => r.json())

  return {
    metrics,
    system
  }
}

export default async function DashboardPage() {

  const { metrics, system } = await getMetrics()

  return (
    <div className="space-y-10">

      <div>
        <p className="editorial-label mb-3">panel de gestión</p>
        <h1 className="editorial-h2">solaris nerja</h1>
      </div>

      <SystemStatusCard data={system} />

      <LeadsChart data={metrics.events} />

      <div className="grid md:grid-cols-3 gap-6">

        <ForecastCard data={metrics} />

        <TrendingCard data={metrics.events} />

        <ViralEventCard data={metrics.events} />

      </div>

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
