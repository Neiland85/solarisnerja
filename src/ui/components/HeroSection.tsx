import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="bg-white min-h-[80vh] flex flex-col items-center justify-center gap-8">

      <p className="editorial-label">
        mediterranean light culture
      </p>

      <Link
        href="/eventos"
        className="border-2 border-black px-12 py-4 text-lg font-medium tracking-wide
          hover:bg-black hover:text-white transition"
      >
        tickets
      </Link>

    </section>
  )
}
