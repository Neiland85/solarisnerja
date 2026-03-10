type Trending = {
  title: string
  leads_last_hour: number
  percent: number
}

export default function TrendingCard({ data }: { data: Trending | null }) {

  if (!data) return null

  return (
    <div className="bg-white border border-[var(--sn-border)] p-8 space-y-4">

      <p className="editorial-label">
        evento trending
      </p>

      <p className="text-lg font-medium">
        {data.title}
      </p>

      <p className="text-sm text-[var(--sn-muted)] tracking-wide">
        {data.leads_last_hour} interesados última hora
      </p>

      <div className="w-full bg-[var(--sn-surface)] h-3 rounded-sm overflow-hidden">
        <div
          className="bg-black h-full"
          style={{ width: `${data.percent}%` }}
        />
      </div>

      <p className="text-xs text-[var(--sn-muted)]">
        ritmo de interés actual
      </p>

    </div>
  )
}
