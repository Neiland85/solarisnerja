export default function ProgramTicker() {
  const items = [
    "13:00 · Aperitivo Sessions",
    "16:00 · Creative Market",
    "19:00 · Golden Hour Concerts",
    "21:00 · Sunset DJ Set",
    "22:30 · Digital Night",
  ]

  const content = [...items, ...items]

  return (
    <div className="w-full border-t border-b border-[rgba(0,0,0,0.08)] bg-white overflow-hidden">

      <div className="ticker-track">

        {content.map((item, i) => (
          <span key={i} className="ticker-item">
            {item}
          </span>
        ))}

      </div>

    </div>
  )
}
