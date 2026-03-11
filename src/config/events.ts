export const HEADER_TICKER =
"19/06 Chambao · 20/06 Bresh Nerja · 21/06 Oh See Málaga · 23/06 Solaris Ritual · 24/06 Injerto Flamenco · 25/06 Injerto Flamenco · 26/06 GOA · 27/06 Tropicalia · 28/06 Tecno Flamenco"

export type EventConfig = {
  id: string
  title: string
  date?: string
  time: string
  description: string
  highlight: string
  ticketUrl: string
  logo?: string
}

export const EVENTS: EventConfig[] = [
  {
    id: "chambao",
    title: "Chambao",
    time: "19/06",
    description: "Concierto de flamenco chill en Solaris Nerja.",
    highlight: "Flamenco chill",
    ticketUrl: "#"
  },
  {
    id: "bresh",
    title: "Bresh Nerja",
    time: "20/06",
    description: "La fiesta más viral llega a la Costa del Sol.",
    highlight: "Fiesta internacional",
    ticketUrl: "#"
  },
  {
    id: "ohsee",
    title: "Oh See Málaga",
    time: "21/06",
    description: "Electrónica contemporánea frente al mar.",
    highlight: "Electrónica",
    ticketUrl: "#"
  },
  {
    id: "goa",
    title: "GOA",
    time: "26/06",
    description: "Sesión electrónica underground.",
    highlight: "Electrónica underground",
    ticketUrl: "#"
  },
  {
    id: "tropicalia",
    title: "Tropicalia",
    time: "27/06",
    description: "Música veraniega y ambiente tropical.",
    highlight: "Summer music",
    ticketUrl: "#"
  },
  {
    id: "tecnoflamenco",
    title: "Tecno Flamenco",
    time: "28/06",
    description: "Fusión de flamenco y electrónica.",
    highlight: "Flamenco electrónico",
    ticketUrl: "#"
  }
]

export function getEvent(id: string) {
  return EVENTS.find(e => e.id === id)
}
