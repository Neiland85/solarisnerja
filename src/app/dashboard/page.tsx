import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="editorial-h2">dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/dashboard/events"
          className="border border-[rgba(0,0,0,0.08)] p-6 hover:border-black transition"
        >
          <p className="editorial-label mb-2">gestionar</p>
          <p className="text-lg font-medium tracking-wide">eventos</p>
        </Link>
      </div>
    </div>
  )
}
