type LeadDay = {
  day: string
  leads: number
}

export default function LeadsChart({ data }: { data: LeadDay[] }) {

  const max = Math.max(...data.map(d => d.leads), 1)

  return (
    <div className="bg-white border border-[var(--sn-border)] p-8 space-y-6">

      <p className="editorial-label">
        crecimiento de interés (7 días)
      </p>

      <div className="space-y-3">

        {data.map((d) => {

          const width = (d.leads / max) * 100

          return (
            <div key={d.day} className="space-y-1">

              <div className="flex justify-between text-xs text-[var(--sn-muted)] tracking-wide">
                <span>{new Date(d.day).toLocaleDateString()}</span>
                <span>{d.leads}</span>
              </div>

              <div className="w-full h-2 bg-[var(--sn-surface)] rounded-sm overflow-hidden">
                <div
                  className="h-full bg-black"
                  style={{ width: `${width}%` }}
                />
              </div>

            </div>
          )
        })}

      </div>

    </div>
  )
}
