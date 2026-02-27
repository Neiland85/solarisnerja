import Link from "next/link"

export function StickyCTA({ href }: { href: string }) {
  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 px-4 md:hidden">
      <Link
        href={href}
        className="block text-center px-6 py-4 rounded-[var(--sn-radius-pill)]
          bg-[var(--sn-sunset)] text-black font-semibold
          shadow-[var(--sn-glow-sunset)]
          hover:brightness-110 transition"
      >
        Comprar entradas
      </Link>
    </div>
  )
}
