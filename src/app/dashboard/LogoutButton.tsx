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
      className="hover:opacity-60 transition text-sm tracking-wide"
    >
      salir
    </button>
  )
}
