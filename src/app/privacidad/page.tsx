import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Política de Privacidad — SolarisNerja",
  description: "Política de privacidad y protección de datos de SolarisNerja.",
}

export default function PrivacidadPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[color:var(--sn-bg)]" />
      <div className="sn-grain" />

      <section className="relative z-10 px-6 pt-16 pb-24 max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-sm text-[color:var(--sn-muted)] hover:text-white transition"
        >
          ← Volver al inicio
        </Link>

        <h1 className="mt-8 text-3xl md:text-4xl font-bold tracking-tight">
          Política de Privacidad
        </h1>
        <p className="mt-2 text-sm text-[color:var(--sn-muted)]">
          Última actualización: marzo 2026
        </p>

        <div className="mt-10 space-y-8 text-[color:var(--sn-muted)] leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              1. Responsable del tratamiento
            </h2>
            <p>
              SolarisNerja es una plataforma de eventos gestionada desde Nerja, Málaga, España.
              Para cualquier consulta sobre protección de datos, puedes contactarnos
              en la dirección indicada en la sección de contacto.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              2. Datos que recopilamos
            </h2>
            <p>Recopilamos los siguientes datos personales:</p>
            <ul className="mt-2 ml-4 space-y-1 list-disc">
              <li>
                <strong className="text-white">Email:</strong> cuando te registras
                para recibir información sobre eventos.
              </li>
              <li>
                <strong className="text-white">Datos de navegación:</strong> dirección IP,
                tipo de navegador, páginas visitadas (mediante cookies analíticas).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              3. Finalidad del tratamiento
            </h2>
            <ul className="ml-4 space-y-1 list-disc">
              <li>Enviarte información sobre eventos de SolarisNerja.</li>
              <li>Analizar el uso de la plataforma para mejorar la experiencia.</li>
              <li>Gestionar la venta de entradas a través de Ticketmaster.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              4. Base legal
            </h2>
            <p>
              El tratamiento se basa en tu consentimiento (art. 6.1.a RGPD) al
              registrarte o aceptar cookies, y en el interés legítimo (art. 6.1.f RGPD)
              para el funcionamiento técnico de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              5. Cookies
            </h2>
            <p>SolarisNerja utiliza las siguientes cookies:</p>
            <ul className="mt-2 ml-4 space-y-1 list-disc">
              <li>
                <strong className="text-white">sn_cookie_consent:</strong> registra tu
                preferencia de cookies (propia, 180 días).
              </li>
              <li>
                <strong className="text-white">Google Analytics:</strong> cookies analíticas
                de terceros para medir el tráfico (solo si aceptas).
              </li>
              <li>
                <strong className="text-white">Facebook Pixel:</strong> cookies de marketing
                de terceros (solo si aceptas).
              </li>
            </ul>
            <p className="mt-2">
              Puedes gestionar tus preferencias en cualquier momento eliminando
              las cookies de tu navegador.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              6. Terceros y transferencias
            </h2>
            <ul className="ml-4 space-y-1 list-disc">
              <li>
                <strong className="text-white">Ticketmaster:</strong> gestiona la venta de
                entradas. Su política de privacidad aplica a las transacciones.
              </li>
              <li>
                <strong className="text-white">Vercel:</strong> alojamiento de la plataforma
                (servidores en la UE/EE.UU. con cláusulas contractuales tipo).
              </li>
              <li>
                <strong className="text-white">Google/Facebook:</strong> analítica y marketing
                (solo si aceptas cookies).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              7. Tus derechos (RGPD)
            </h2>
            <p>Tienes derecho a:</p>
            <ul className="mt-2 ml-4 space-y-1 list-disc">
              <li>Acceder a tus datos personales.</li>
              <li>Rectificar datos incorrectos.</li>
              <li>Solicitar la supresión de tus datos.</li>
              <li>Oponerte al tratamiento.</li>
              <li>Solicitar la portabilidad de tus datos.</li>
              <li>Retirar tu consentimiento en cualquier momento.</li>
            </ul>
            <p className="mt-2">
              Para ejercer estos derechos, contacta con nosotros. También puedes
              presentar una reclamación ante la Agencia Española de Protección
              de Datos (AEPD).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">
              8. Contacto
            </h2>
            <p>
              Para cuestiones de privacidad, escríbenos a la dirección de correo
              electrónico indicada en nuestra página de contacto.
            </p>
          </section>
        </div>
      </section>
    </main>
  )
}
