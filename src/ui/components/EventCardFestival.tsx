import Image from "next/image"
import VinylButton from "@/ui/components/VinylButton"

type Props = {
  id: string
  title: string
  highlight: string
  ticketUrl: string
  logo?: string | null
  eventDate?: string | null
  colorIndex?: number
}

export default function EventCardFestival({
  id,
  title,
  highlight,
  ticketUrl,
  logo,
  eventDate,
  colorIndex = 0
}: Props) {
  const hasRealUrl = ticketUrl && ticketUrl !== "#"

  return (
    <div className="border border-[var(--sn-border)] bg-white p-6 space-y-6 flex flex-col items-center text-center">

      {logo && (
        <div className="h-20 w-full relative">
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

      {hasRealUrl ? (
        <VinylButton
          artistName={title}
          href={ticketUrl}
          colorIndex={colorIndex}
        />
      ) : (
        <a
          href={`/eventos/${id}`}
          className="inline-block border-2 border-black/30 px-6 py-2 text-sm font-medium tracking-wide text-black/50 hover:border-black hover:text-black transition"
        >
          más información
        </a>
      )}

    </div>
  )
}
