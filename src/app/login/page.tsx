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
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6"
      >
        <h1 className="editorial-h2 text-center">solaris admin</h1>

        <div>
          <label htmlFor="password" className="editorial-label block mb-2">
            contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            className="w-full border border-[rgba(0,0,0,0.16)] px-4 py-3 text-sm tracking-wide focus:outline-none focus:border-black transition"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 tracking-wide">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full border-2 border-black px-6 py-3 text-sm font-medium tracking-wide hover:bg-black hover:text-white transition disabled:opacity-40"
        >
          {loading ? "..." : "entrar"}
        </button>
      </form>
    </main>
  )
}
