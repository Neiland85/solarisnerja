"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewEventPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
    }

    try {
      const res = await fetch("/api/v1/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push("/dashboard/events")
      } else {
        setError("Error al crear el evento")
      }
    } catch {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg space-y-8">
      <h1 className="editorial-h2">nuevo evento</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Field label="título" name="title" required />
        <Field label="descripción" name="description" multiline required />
        <Field label="highlight" name="highlight" required />
        <Field label="ticket url" name="ticketUrl" type="url" required />

        {error && <p className="text-sm text-red-600 tracking-wide">{error}</p>}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="border-2 border-black px-8 py-3 text-sm font-medium tracking-wide hover:bg-black hover:text-white transition disabled:opacity-40"
          >
            {loading ? "..." : "crear"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 text-sm tracking-wide hover:opacity-60 transition"
          >
            cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  multiline = false,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  multiline?: boolean
}) {
  const baseClass =
    "w-full border border-[rgba(0,0,0,0.16)] px-4 py-3 text-sm tracking-wide focus:outline-none focus:border-black transition"

  return (
    <div>
      <label htmlFor={name} className="editorial-label block mb-2">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          required={required}
          rows={4}
          className={baseClass}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          className={baseClass}
        />
      )}
    </div>
  )
}
