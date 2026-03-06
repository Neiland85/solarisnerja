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
    <div className="min-h-screen bg-white">
      <header className="border-b border-[rgba(0,0,0,0.08)] px-8 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="text-sm font-medium tracking-wide">
            solaris admin
          </Link>
          <nav className="flex items-center gap-6 text-sm tracking-wide">
            <Link href="/dashboard/events" className="hover:opacity-60 transition">
              eventos
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-8 py-12">
        {children}
      </main>
    </div>
  )
}
