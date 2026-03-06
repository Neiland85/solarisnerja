import { findEventById } from "@/adapters/db/event-repository"
import { notFound } from "next/navigation"
import EventEditForm from "./EventEditForm"

export const dynamic = "force-dynamic"

type Props = { params: Promise<{ id: string }> }

export default async function EditEventPage({ params }: Props) {
  const { id } = await params
  const event = await findEventById(id)

  if (!event) {
    notFound()
  }

  return (
    <div className="max-w-lg space-y-8">
      <h1 className="editorial-h2">editar evento</h1>
      <EventEditForm event={event} />
    </div>
  )
}
