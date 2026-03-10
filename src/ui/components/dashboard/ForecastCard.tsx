type Forecast = {
  title: string
  leads: number
  capacity: number
  predicted: number
  fillPercent: number
}

export default function ForecastCard({ data }: { data: Forecast[] }) {

  const top = data?.[0]

  if (!top) return null

  return (
    <div className="bg-white border border-[var(--sn-border)] p-8 space-y-4">

      <p className="editorial-label">
        predicción de aforo
      </p>

      <p className="text-lg font-medium">
        {top.title}
      </p>

      <div className="w-full bg-[var(--sn-surface)] h-3 rounded-sm overflow-hidden">
        <div
          className="bg-black h-full"
          style={{ width: `${top.fillPercent}%` }}
        />
      </div>

      <div className="text-sm text-[var(--sn-muted)] tracking-wide space-y-1">
        <p>interesados actuales: {top.leads}</p>
        <p>predicción: {top.predicted}</p>
        <p>aforo: {top.capacity}</p>
        <p>ocupación estimada: {top.fillPercent}%</p>
      </div>

    </div>
  )
}
