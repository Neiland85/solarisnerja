export default function ViralEventCard({ data }: { data: any }) {

  if (!data) return null

  return (
    <div className="bg-white border border-[var(--sn-border)] p-8">
      <p className="editorial-label mb-2">evento viral</p>
      <p className="text-lg font-medium">
        {data.title ?? "sin datos"}
      </p>
      <p className="text-sm text-[var(--sn-muted)]">
        crecimiento rápido
      </p>
    </div>
  )
}
