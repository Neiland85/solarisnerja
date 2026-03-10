import Link from "next/link"
import CapacityProgress from "@/ui/components/dashboard/CapacityProgress"

async function getCapacity() {
  const res = await fetch("/api/admin/capacity", { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

export default async function DashboardPage() {

  const capacity = await getCapacity()

  return (
    <div className="space-y-12">

      <div>
        <p className="editorial-label mb-3">panel de control</p>
        <h1 className="editorial-h2">solaris nerja</h1>
      </div>

      <CapacityProgress events={capacity} />

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
