type ViralEvent = {
  title: string
  leads_last_hour: number
  leads_last_day: number
}

export default function ViralEventCard({ data }: { data: ViralEvent | null }) {

  if (!data) return null

  return (
    <div className="bg-yellow-50 border border-yellow-200 p-6 space-y-2">

      <p className="text-xs tracking-wide text-yellow-700 uppercase">
        evento viral
      </p>

      <p className="text-lg font-semibold text-yellow-800">
        🔥 crecimiento anómalo detectado
      </p>

      <p className="text-sm text-yellow-700">
        {data.title}
      </p>

      <p className="text-xs text-yellow-700">
        {data.leads_last_hour} leads última hora
      </p>

    </div>
  )
}
