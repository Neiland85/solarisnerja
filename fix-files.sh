#!/bin/bash
set -e

echo "==> Fixing 9 files with clean versions..."

# 1. LogoutButton.tsx
cat > src/app/dashboard/LogoutButton.tsx << 'ENDOFFILE'
"use client"

import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/v1/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <button
      onClick={handleLogout}
      className="text-[var(--sn-muted)] hover:text-[var(--sn-text)] transition text-sm tracking-wide"
    >
      salir
    </button>
  )
}
ENDOFFILE

# 2. dashboard/layout.tsx
cat > src/app/dashboard/layout.tsx << 'ENDOFFILE'
import Link from "next/link"
import LogoutButton from "./LogoutButton"

export const metadata = {
  title: "Solaris Admin",
  robots: { index: false, follow: false },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[var(--sn-surface)]">
      <header className="bg-white border-b border-[var(--sn-border)] px-8 py-5 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm font-semibold tracking-wide">
              solaris
            </Link>
            <span className="text-[var(--sn-muted)] text-xs">admin</span>
          </div>
          <nav className="flex items-center gap-8 text-sm tracking-wide">
            <Link
              href="/dashboard"
              className="text-[var(--sn-muted)] hover:text-[var(--sn-text)] transition"
            >
              inicio
            </Link>
            <Link
              href="/dashboard/events"
              className="text-[var(--sn-muted)] hover:text-[var(--sn-text)] transition"
            >
              eventos
            </Link>
            <span className="w-px h-4 bg-[var(--sn-border-2)]" />
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-8 py-10">
        {children}
      </main>
    </div>
  )
}
ENDOFFILE

# 3. dashboard/page.tsx
cat > src/app/dashboard/page.tsx << 'ENDOFFILE'
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <div>
        <p className="editorial-label mb-3">panel de gestión</p>
        <h1 className="editorial-h2">solaris nerja</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link
          href="/dashboard/events"
          className="group bg-white rounded-sm border border-[var(--sn-border)] p-8 hover:border-[var(--sn-border-2)] hover:shadow-sm transition-all"
        >
          <p className="editorial-label mb-3">gestionar</p>
          <p className="text-lg font-medium tracking-wide group-hover:tracking-wider transition-all">
            eventos
          </p>
          <p className="text-sm text-[var(--sn-muted)] mt-3 tracking-wide">
            crear, editar y activar eventos del festival
          </p>
        </Link>

        <div className="bg-white rounded-sm border border-dashed border-[var(--sn-border)] p-8 flex items-center justify-center">
          <p className="text-sm text-[var(--sn-muted)] tracking-wide">
            más secciones próximamente
          </p>
        </div>
      </div>
    </div>
  )
}
ENDOFFILE

# 4. dashboard/events/page.tsx
cat > src/app/dashboard/events/page.tsx << 'ENDOFFILE'
import Link from "next/link"
import { findAllEvents } from "@/adapters/db/event-repository"

export const dynamic = "force-dynamic"

export default async function EventsListPage() {
  const events = await findAllEvents()
  const activeCount = events.filter((e) => e.active).length

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="editorial-label mb-2">gestión</p>
          <h1 className="editorial-h2">eventos</h1>
        </div>
        <Link
          href="/dashboard/events/new"
          className="border-2 border-black px-6 py-3 text-sm font-medium tracking-wide hover:bg-black hover:text-white transition"
        >
          + nuevo evento
        </Link>
      </div>

      {events.length > 0 && (
        <div className="flex gap-6 text-sm tracking-wide">
          <span className="text-[var(--sn-muted)]">
            {events.length} {events.length === 1 ? "evento" : "eventos"}
          </span>
          <span className="text-[var(--sn-muted)]">
            {activeCount} {activeCount === 1 ? "activo" : "activos"}
          </span>
        </div>
      )}

      {events.length === 0 ? (
        <div className="bg-white rounded-sm border border-dashed border-[var(--sn-border-2)] p-16 text-center">
          <p className="editorial-label mb-4">sin eventos</p>
          <p className="text-sm text-[var(--sn-muted)] tracking-wide mb-6">
            Aún no hay eventos creados. Empieza creando el primero.
          </p>
          <Link
            href="/dashboard/events/new"
            className="inline-block border-2 border-black px-8 py-3 text-sm font-medium tracking-wide hover:bg-black hover:text-white transition"
          >
            crear primer evento
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-sm border border-[var(--sn-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--sn-border)] bg-[var(--sn-surface)]">
                <th className="text-left px-5 py-4 font-medium tracking-wide text-[var(--sn-muted)]">título</th>
                <th className="text-left px-5 py-4 font-medium tracking-wide text-[var(--sn-muted)]">highlight</th>
                <th className="text-center px-5 py-4 font-medium tracking-wide text-[var(--sn-muted)]">estado</th>
                <th className="text-right px-5 py-4 font-medium tracking-wide text-[var(--sn-muted)]">acción</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border-b border-[var(--sn-border)] last:border-b-0 hover:bg-[var(--sn-surface)] transition-colors"
                >
                  <td className="px-5 py-4 tracking-wide font-medium">{event.title}</td>
                  <td className="px-5 py-4 tracking-wide text-[var(--sn-muted)]">{event.highlight}</td>
                  <td className="px-5 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs tracking-wide ${
                        event.active
                          ? "bg-green-50 text-green-700"
                          : "bg-[var(--sn-surface-2)] text-[var(--sn-muted)]"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${event.active ? "bg-green-500" : "bg-[var(--sn-muted)]"}`} />
                      {event.active ? "activo" : "inactivo"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/dashboard/events/edit/${event.id}`}
                      className="text-sm tracking-wide text-[var(--sn-muted)] hover:text-[var(--sn-text)] transition"
                    >
                      editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
ENDOFFILE

# 5. dashboard/events/new/page.tsx
cat > src/app/dashboard/events/new/page.tsx << 'ENDOFFILE'
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
    <div className="max-w-xl">
      <div className="mb-10">
        <p className="editorial-label mb-2">crear</p>
        <h1 className="editorial-h2">nuevo evento</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-sm border border-[var(--sn-border)] p-8 space-y-7">
        <Field label="título" name="title" placeholder="Sunset Sessions" required />
        <Field label="descripción" name="description" placeholder="House, disco y electrónica melódica..." multiline required />
        <Field label="highlight" name="highlight" placeholder="Sunset" required />
        <Field label="ticket url" name="ticketUrl" type="url" placeholder="https://www.ticketmaster.es/..." required />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3">
            <p className="text-sm text-red-700 tracking-wide">{error}</p>
          </div>
        )}

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="border-2 border-black px-8 py-3 text-sm font-medium tracking-wide hover:bg-black hover:text-white transition disabled:opacity-40"
          >
            {loading ? "guardando..." : "crear evento"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 text-sm tracking-wide text-[var(--sn-muted)] hover:text-[var(--sn-text)] transition"
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
  placeholder,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  multiline?: boolean
  placeholder?: string
}) {
  const baseClass =
    "w-full bg-[var(--sn-surface)] border border-[var(--sn-border)] rounded-sm px-4 py-3 text-sm tracking-wide placeholder:text-[var(--sn-muted)] placeholder:opacity-50 focus:outline-none focus:border-[var(--sn-text)] focus:bg-white transition"

  return (
    <div>
      <label htmlFor={name} className="editorial-label block mb-2.5">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          required={required}
          rows={4}
          placeholder={placeholder}
          className={baseClass}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className={baseClass}
        />
      )}
    </div>
  )
}
ENDOFFILE

# 6. dashboard/events/edit/[id]/page.tsx
cat > "src/app/dashboard/events/edit/[id]/page.tsx" << 'ENDOFFILE'
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
    <div className="max-w-xl">
      <div className="mb-10">
        <p className="editorial-label mb-2">editar</p>
        <h1 className="editorial-h2">{event.title}</h1>
      </div>
      <EventEditForm event={event} />
    </div>
  )
}
ENDOFFILE

# 7. dashboard/events/edit/[id]/EventEditForm.tsx
cat > "src/app/dashboard/events/edit/[id]/EventEditForm.tsx" << 'ENDOFFILE'
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
    "w-full bg-[var(--sn-surface)] border border-[var(--sn-border)] rounded-sm px-4 py-3 text-sm tracking-wide placeholder:text-[var(--sn-muted)] placeholder:opacity-50 focus:outline-none focus:border-[var(--sn-text)] focus:bg-white transition"

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-sm border border-[var(--sn-border)] p-8 space-y-7">
      <div>
        <label htmlFor="title" className="editorial-label block mb-2.5">título</label>
        <input id="title" name="title" defaultValue={event.title} required className={inputClass} />
      </div>

      <div>
        <label htmlFor="description" className="editorial-label block mb-2.5">descripción</label>
        <textarea id="description" name="description" defaultValue={event.description} rows={4} required className={inputClass} />
      </div>

      <div>
        <label htmlFor="highlight" className="editorial-label block mb-2.5">highlight</label>
        <input id="highlight" name="highlight" defaultValue={event.highlight} required className={inputClass} />
      </div>

      <div>
        <label htmlFor="ticketUrl" className="editorial-label block mb-2.5">ticket url</label>
        <input id="ticketUrl" name="ticketUrl" type="url" defaultValue={event.ticketUrl} required className={inputClass} />
      </div>

      <div className="flex items-center gap-3 pt-1">
        <input
          id="active"
          name="active"
          type="checkbox"
          defaultChecked={event.active}
          className="w-4 h-4 accent-black rounded-sm"
        />
        <label htmlFor="active" className="text-sm tracking-wide">evento activo</label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3">
          <p className="text-sm text-red-700 tracking-wide">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-[var(--sn-border)]">
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="border-2 border-black px-8 py-3 text-sm font-medium tracking-wide hover:bg-black hover:text-white transition disabled:opacity-40"
          >
            {loading ? "guardando..." : "guardar cambios"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 text-sm tracking-wide text-[var(--sn-muted)] hover:text-[var(--sn-text)] transition"
          >
            cancelar
          </button>
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="text-sm tracking-wide text-red-500 hover:text-red-700 transition disabled:opacity-40"
        >
          {deleting ? "eliminando..." : "eliminar evento"}
        </button>
      </div>
    </form>
  )
}
ENDOFFILE

# 8. login/page.tsx
cat > src/app/login/page.tsx << 'ENDOFFILE'
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push("/dashboard")
      } else {
        setError("Contraseña incorrecta")
      }
    } catch {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[var(--sn-surface)] flex items-center justify-center px-6 solaris-parallax-sun">
      <div className="w-full max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-sm border border-[var(--sn-border)] p-10 space-y-8 shadow-sm"
        >
          <div className="text-center space-y-2">
            <h1 className="editorial-h2">solaris</h1>
            <p className="editorial-label">panel de administración</p>
          </div>

          <div>
            <label htmlFor="password" className="editorial-label block mb-2.5">
              contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              placeholder="introduce la contraseña"
              className="w-full bg-[var(--sn-surface)] border border-[var(--sn-border)] rounded-sm px-4 py-3 text-sm tracking-wide placeholder:text-[var(--sn-muted)] placeholder:opacity-50 focus:outline-none focus:border-[var(--sn-text)] focus:bg-white transition"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3">
              <p className="text-sm text-red-700 tracking-wide">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full border-2 border-black px-6 py-3 text-sm font-medium tracking-wide hover:bg-black hover:text-white transition disabled:opacity-40"
          >
            {loading ? "accediendo..." : "entrar"}
          </button>
        </form>

        <p className="text-center mt-8 text-xs text-[var(--sn-muted)] tracking-widest">
          solaris nerja
        </p>
      </div>
    </main>
  )
}
ENDOFFILE

# 9. LineupSection.tsx
cat > src/ui/components/LineupSection.tsx << 'ENDOFFILE'
export default function LineupSection() {
  return (
    <section id="lineup" className="section-editorial bg-white">

      <div className="editorial-grid max-w-6xl mx-auto">

        <div className="col-span-12 md:col-span-6 md:col-start-4 text-center">

          <h2 className="editorial-h2 mb-20">
            lineup
          </h2>

          <div className="space-y-16">

            <div>
              <p className="editorial-label">sunset session</p>
              <p className="text-3xl font-medium tracking-tight">
                nicola cruz
              </p>
            </div>

            <div>
              <p className="editorial-label">golden hour</p>
              <p className="text-3xl font-medium tracking-tight">
                sofia kourtesis
              </p>
            </div>

            <div>
              <p className="editorial-label">digital night</p>
              <p className="text-3xl font-medium tracking-tight">
                henri bergmann
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>
  )
}
ENDOFFILE

echo ""
echo "==> 9 files fixed. Staging and committing..."
git add \
  src/app/dashboard/LogoutButton.tsx \
  src/app/dashboard/layout.tsx \
  src/app/dashboard/page.tsx \
  src/app/dashboard/events/page.tsx \
  src/app/dashboard/events/new/page.tsx \
  "src/app/dashboard/events/edit/[id]/page.tsx" \
  "src/app/dashboard/events/edit/[id]/EventEditForm.tsx" \
  src/app/login/page.tsx \
  src/ui/components/LineupSection.tsx

git commit -m "fix: resolve merge conflicts in dashboard, login and lineup files

Clean up duplicated JSX content caused by unresolved merge conflicts
between main and feature branch. All 9 affected files rewritten to
correct versions with improved design tokens.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"

echo ""
echo "==> Done. Now push with:"
echo "    git push origin feat/events-dashboard"
echo ""
echo "==> After Vercel preview passes, merge to main (prod):"
echo "    git checkout main && git merge feat/events-dashboard && git push origin main"
