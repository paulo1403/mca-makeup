"use client"

import BookingFlow from './BookingFlow'
import ThemeToggle from './ThemeToggle'

export default function ContactSection() {
  return (
    <section id="contacto" className="py-12 sm:py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Encabezado explicativo */}
        <div className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl text-accent-primary">Contacta y Reserva tu Cita</h2>
          <p className="text-sm sm:text-base text-main max-w-2xl mx-auto">
            Completa el proceso en cinco pasos: selecciona tus servicios, ingresa tus datos, indica la ubicación, elige fecha y horario, y confirma. Te contactaré para coordinar cualquier detalle adicional.
          </p>
          <p className="text-xs sm:text-sm text-muted max-w-2xl mx-auto">
            Puedes avanzar y retroceder entre pasos sin perder tu selección. Si prefieres asistencia, escríbeme y te guío en el proceso.
          </p>
        </div>

        {/* Toggle de tema alineado a la derecha */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        {/* Fila compacta de contacto (solo móvil) */}
        <div className="sm:hidden mb-4">
          <div className="flex items-center gap-3 text-sm flex-col">
            <a href="tel:+51989164990" className="inline-flex items-center gap-2 text-accent-primary font-medium whitespace-nowrap">
              <span className="inline-block w-4 h-4 rounded-full bg-[color:var(--color-accent-primary)]" aria-hidden="true" />
              +51 989 164 990
            </a>
            <span className="text-muted">•</span>
            <a href="mailto:contacto@marcelacordero.com" className="inline-flex items-center gap-2 text-accent-primary font-medium whitespace-nowrap">
              <span className="inline-block w-4 h-4 rounded-full bg-[color:var(--color-accent-secondary)]" aria-hidden="true" />
              contacto@marcelacordero.com
            </a>
          </div>
        </div>

        {/* Flujo de reserva centrado y con ancho limitado en desktop */}
        <div className="mt-2">
          <BookingFlow />
        </div>
      </div>
    </section>
  );
}
