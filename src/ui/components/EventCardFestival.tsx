"use client"

import Image from "next/image"
import SunriseButton from "@/ui/components/SunriseButton"

type Props = {
  id: string
  title: string
  highlight: string
  ticketUrl: string
  logo?: string
  eventDate?: string
  colorIndex?: number
  /** When provided, SunriseButton click opens ArtistModal instead of direct URL. */
  onSelect?: () => void
}

export default function EventCardFestival({
  id,
  title,
  highlight,
  ticketUrl,
  logo,
  eventDate,
  colorIndex = 0,
  onSelect,
}: Props) {
  const hasRealUrl = ticketUrl && ticketUrl !== "#"

  return (
    <div className="border border-(--sn-border) bg-white p-6 space-y-6 flex flex-col items-center text-center">
      {logo && (
        <div className="h-20 w-full relative">
          <Image
            src={logo}
            alt={title}
            fill
            sizes="(max-width: 768px) 90vw, 320px"
            className="object-contain"
          />
        </div>
      )}

      {eventDate && (
        <p className="text-sm text-(--sn-muted) tracking-wide">
          {new Date(eventDate).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "long",
          })}
        </p>
      )}

      <div>
        <p className="text-lg font-medium tracking-wide">{title}</p>

        <p className="text-sm text-(--sn-muted)">{highlight}</p>
      </div>

      {hasRealUrl ? (
        <>
          <SunriseButton
            artistName={title}
            href={ticketUrl}
            colorIndex={colorIndex}
            onSelect={onSelect}
          />
          <a
            href={ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border-2 border-black px-6 py-2 text-sm font-medium tracking-wide hover:bg-black hover:text-white transition"
          >
            comprar entradas
          </a>
        </>
      ) : (
        <a
          href={`/eventos/${encodeURIComponent(id)}`}
          className="inline-block border-2 border-black/30 px-6 py-2 text-sm font-medium tracking-wide text-black/50 hover:border-black hover:text-black transition"
        >
          más información
        </a>
      )}
    </div>
  )
}
