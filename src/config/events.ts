export type EventId =
  | "sunset"
  | "night"
  | "market"
  | "chill"
  | "food"
  | "art"
  | "kids"
  | "music"

export type Event = {
  id: EventId
  title: string
  tagline: string
  description: string
  highlight: string
  ticketUrl: string
}

export const EVENTS: Event[] = [
  {
    id: "sunset",
    title: "Sunset Sessions",
    tagline: "Tarde frente al mar",
    description: "House, disco y electrónica melódica para el atardecer.",
    highlight: "Sunset",
    ticketUrl: "https://www.ticketmaster.es/"
  },
  {
    id: "night",
    title: "Night Club",
    tagline: "Noche cuidada",
    description: "Groove, tech-house y sets invitados.",
    highlight: "Night",
    ticketUrl: "https://www.ticketmaster.es/"
  },
  {
    id: "market",
    title: "Mercado Creativo",
    tagline: "Diseño, vinilos y arte",
    description: "Stands seleccionados y cultura local.",
    highlight: "Market",
    ticketUrl: "https://www.ticketmaster.es/"
  },
  {
    id: "music",
    title: "Music Experience",
    tagline: "Electrónica frente al mar",
    description: "El núcleo del fin de semana: sesiones electrónicas cuidadosamente curadas.",
    highlight: "Music",
    ticketUrl: "https://www.ticketmaster.es/"
  }
]

export function getEvent(eventId: string) {
  return EVENTS.find((e) => e.id === eventId)
}
