import Link from "next/link"

export function ButtonPrimary({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http")

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center px-8 py-4 rounded-[var(--sn-radius-pill)]
          bg-[var(--sn-sunset)] text-black font-semibold
          shadow-[var(--sn-glow-sunset)]
          hover:brightness-110 transition-all duration-300"
      >
        {children}
      </a>
    )
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center px-8 py-4 rounded-[var(--sn-radius-pill)]
        bg-[var(--sn-sunset)] text-black font-semibold
        shadow-[var(--sn-glow-sunset)]
        hover:brightness-110 transition-all duration-300"
    >
      {children}
    </Link>
  )
}

export function ButtonGhost({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center px-8 py-4 rounded-[var(--sn-radius-pill)]
        border border-[var(--sn-border-2)] text-white
        hover:bg-white hover:text-black transition-all duration-300"
    >
      {children}
    </Link>
  )
}

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-[var(--sn-radius-xl)] border border-[var(--sn-border)]
        bg-[color:var(--sn-surface)]/70 backdrop-blur
        p-6"
    >
      {children}
    </div>
  )
}
