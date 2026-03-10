import dynamic from "next/dynamic"

const ImageCarousel = dynamic(() => import("./ImageCarousel"), {
  ssr: false,
  loading: () => (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="aspect-[2.4/1] w-full bg-[var(--sn-surface)] animate-pulse" />
    </section>
  ),
})

export default function LazyCarousel() {
  return <ImageCarousel />
}
