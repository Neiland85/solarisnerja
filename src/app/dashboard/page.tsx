import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <div>
        <p className="editorial-label mb-3">panel de gestión</p>
        <h1 className="editorial-h2">solaris nerja</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link
          href="/dashboard/events"
          className="group bg-white rounded-sm border border-[var(--sn-border)] p-8 hover:border-[var(--sn-border-2)] hover:shadow-sm transition-all"
        >
          <p className="editorial-label mb-3">gestionar</p>
          <p className="text-lg font-medium tracking-wide group-hover:tracking-wider transition-all">
            eventos
          </p>
          <p className="text-sm text-[var(--sn-muted)] mt-3 tracking-wide">
            crear, editar y activar eventos del festival
          </p>
        </Link>

        <div className="bg-white rounded-sm border border-dashed border-[var(--sn-border)] p-8 flex items-center justify-center">
          <p className="text-sm text-[var(--sn-muted)] tracking-wide">
            más secciones próximamente
          </p>
        </div>
      </div>
    </div>
  )
}
