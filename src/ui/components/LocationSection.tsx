export default function LocationSection(){

  return (

    <section className="py-24 bg-neutral-100">

      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-4xl mb-12 text-center">
          Ubicación
        </h2>

        <div className="w-full h-[500px]">

          <iframe
            src="https://www.google.com/maps?q=Nerja%20Málaga&output=embed"
            width="100%"
            height="100%"
            loading="lazy"
            className="border-0"
          />

        </div>

      </div>

    </section>

  )

}
