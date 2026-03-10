export default function CarouselSection(){

  const images = [
    "/carousel/carousel-01.webp",
    "/carousel/carousel-02.webp",
    "/carousel/carousel-03.webp",
    "/carousel/carousel-04.webp",
    "/carousel/carousel-05.webp",
    "/carousel/carousel-06.webp",
    "/carousel/carousel-07.webp"
  ]

  return (

    <section className="py-24 bg-white">

      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-4xl text-center mb-16">
          El ambiente
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {images.map((img,i)=>(
            <img
              key={i}
              src={img}
              className="w-full h-[320px] object-cover rounded-lg"
            />
          ))}

        </div>

      </div>

    </section>

  )

}
