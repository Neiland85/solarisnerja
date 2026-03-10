import Image from "next/image"

type Props = {
  id: string
  title: string
  highlight: string
  ticketUrl: string
  logo?: string | null
  eventDate?: string | null
}

export default function EventCardFestival({
  title,
  highlight,
  ticketUrl,
  logo,
  eventDate
}: Props) {
  return (
    <div className="border border-[var(--sn-border)] bg-white p-6 space-y-6">

      {logo && (
        <div className="h-20 relative">
          <Image
            src={logo}
            alt={title}
            fill
            className="object-contain"
          />
        </div>
      )}

      {eventDate && (
        <p className="text-sm text-[var(--sn-muted)] tracking-wide">
          {new Date(eventDate).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long"
          })}
        </p>
      )}

      <div>
        <p className="text-lg font-medium tracking-wide">
          {title}
        </p>

        <p className="text-sm text-[var(--sn-muted)]">
          {highlight}
        </p>
      </div>

      <a
        href={ticketUrl}
        target="_blank"
        className="inline-block border-2 border-black px-6 py-2 text-sm font-medium tracking-wide hover:bg-black hover:text-white transition"
      >
        comprar entradas
      </a>

    </div>
  )
}
