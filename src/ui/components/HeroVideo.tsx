"use client"

export default function HeroVideo(){

  return(

    <section className="relative w-full h-[90vh] overflow-hidden">
export default function HeroVideo(){

  return (

    <section className="relative w-full h-screen overflow-hidden">

      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute w-full h-full object-cover"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/hero/hero-solaris.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">

        <div className="text-center text-white space-y-6">

          <h1 className="text-5xl md:text-6xl font-semibold tracking-wide">
            Solaris Nerja
          </h1>

          <p className="text-xl opacity-90">
            18 — 28 Junio · El Playazo
          </p>

          <a
            href="#eventos"
            className="inline-block px-10 py-4 bg-white text-black text-lg font-medium rounded-full hover:bg-neutral-200 transition"
          >
            ENTRADAS
          </a>

        </div>
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">

        <h1 className="text-6xl font-light tracking-wide">
          Solaris Nerja
        </h1>

        <p className="mt-6 text-lg tracking-widest">
          Festival cultural en la Costa del Sol
        </p>

        <a
          href="https://www.ticketmaster.es"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 border border-white px-12 py-4 text-lg uppercase tracking-widest hover:bg-white hover:text-black transition"
        >
          Entradas
        </a>

      </div>

    </section>

  )

}
