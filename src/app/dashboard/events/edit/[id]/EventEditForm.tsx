"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Event } from "@/domain/events/types"

export default function EventEditForm({ event }: { event: Event }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [deleting, setDeleting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const payload = {
      title: form.get("title") as string,
      description: form.get("description") as string,
      highlight: form.get("highlight") as string,
      ticketUrl: form.get("ticketUrl") as string,
      active: form.get("active") === "on",
    }

    try {
      const res = await fetch(`/api/v1/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push("/dashboard/events")
      } else {
        setError("Error al actualizar")
      }
    } catch {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm("¿Eliminar este evento?")) return
    setDeleting(true)

    try {
      const res = await fetch(`/api/v1/events/${event.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        router.push("/dashboard/events")
      } else {
        setError("Error al eliminar")
      }
    } catch {
      setError("Error de conexión")
    } finally {
      setDeleting(false)
    }
  }

  const inputClass =
    "w-full border border-[rgba(0,0,0,0.16)] px-4 py-3 text-sm tracking-wide focus:outline-none focus:border-black transition"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="editorial-label block mb-2">título</label>
        <input id="title" name="title" defaultValue={event.title} required className={inputClass} />
      </div>

      <div>
        <label htmlFor="description" className="editorial-label block mb-2">descripción</label>
        <textarea id="description" name="description" defaultValue={event.description} rows={4} required className={inputClass} />
      </div>

      <div>
        <label htmlFor="highlight" className="editorial-label block mb-2">highlight</label>
        <input id="highlight" name="highlight" defaultValue={event.highlight} required className={inputClass} />
      </div>

      <div>
        <label htmlFor="ticketUrl" className="editorial-label block mb-2">ticket url</label>
        <input id="ticketUrl" name="ticketUrl" type="url" defaultValue={event.ticketUrl} required className={inputClass} />
      </div>

      <div className="flex items-center gap-3">
        <input
          id="active"
          name="active"
          type="checkbox"
          defaultChecked={event.active}
          className="w-4 h-4 accent-black"
        />
        <label htmlFor="active" className="text-sm tracking-wide">activo</label>
      </div>

      {error && <p className="text-sm text-red-600 tracking-wide">{error}</p>}

      <div className="flex items-center justify-between pt-4">
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="border-2 border-black px-8 py-3 text-sm font-medium tracking-wide hover:bg-black hover:text-white transition disabled:opacity-40"
          >
            {loading ? "..." : "guardar"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 text-sm tracking-wide hover:opacity-60 transition"
          >
            cancelar
          </button>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="text-sm tracking-wide text-red-600 hover:opacity-60 transition disabled:opacity-40"
        >
          {deleting ? "..." : "eliminar"}
        </button>
      </div>
    </form>
  )
}
