"use client";

import {
  Clock,
  Instagram,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";
import Button from "./ui/Button";
import Typography from "./ui/Typography";
import TransportCostCalculator from "./TransportCostCalculator";
import "@/styles/components/contact-minimal.css";

type ContactInfoItem = {
  label: string;
  value: string;
  href?: string;
  icon: React.ElementType;
};

const contactInfo: ContactInfoItem[] = [
  {
    label: "Teléfono",
    value: "+51 989 164 990",
    href: "tel:+51989164990",
    icon: Phone,
  },
  {
    label: "Email",
    value: "marcelacordero.bookings@gmail.com",
    href: "mailto:marcelacordero.bookings@gmail.com",
    icon: Mail,
  },
  {
    label: "Ubicación",
    value: "Av. Bolívar 1073, Pueblo Libre, Lima",
    href: "https://maps.google.com/?q=Av.+Bolívar+1073,+Pueblo+Libre,+Lima",
    icon: MapPin,
  },
];

export default function ContactSection() {
  return (
    <section
      id="contacto"
      className="py-12 sm:py-16 md:py-24 bg-[color:var(--color-background)]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16 contact-header-animation">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[color:var(--color-primary)]/10 border border-[color:var(--color-primary)]/20 mb-4 sm:mb-6">
            <span className="text-sm font-medium text-[color:var(--color-primary)]">
              Contacto
            </span>
          </div>

          <Typography
            as="h2"
            variant="h2"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[color:var(--color-heading)] mb-3 sm:mb-4 px-4"
          >
            Hablemos de tu Próximo Look
          </Typography>

          <Typography
            as="p"
            variant="p"
            className="text-sm sm:text-base md:text-lg text-[color:var(--color-body)] max-w-2xl mx-auto leading-relaxed px-4"
          >
            Estoy aquí para hacer realidad el maquillaje de tus sueños.
            Contáctame por WhatsApp o visita el estudio.
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          <div className="space-y-6 sm:space-y-8 contact-info-animation">
            <div className="p-5 sm:p-6 md:p-8 bg-[color:var(--color-surface)] rounded-2xl border border-[color:var(--color-border)]">
              <Typography
                as="h3"
                variant="h3"
                className="text-lg sm:text-xl md:text-2xl font-bold text-[color:var(--color-heading)] mb-5 sm:mb-6"
              >
                Información de Contacto
              </Typography>

              <div className="space-y-4 sm:space-y-5">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 sm:gap-4"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[color:var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[color:var(--color-primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Typography
                          as="p"
                          variant="small"
                          className="text-[color:var(--color-muted)] font-medium mb-1 text-xs sm:text-sm"
                        >
                          {info.label}
                        </Typography>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="text-[color:var(--color-body)] hover:text-[color:var(--color-primary)] transition-colors text-sm sm:text-base break-words"
                            target={
                              info.href.startsWith("http")
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              info.href.startsWith("http")
                                ? "noopener noreferrer"
                                : undefined
                            }
                          >
                            {info.value}
                          </a>
                        ) : (
                          <Typography
                            as="p"
                            variant="p"
                            className="text-[color:var(--color-body)] text-sm sm:text-base"
                          >
                            {info.value}
                          </Typography>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[color:var(--color-border)]">
                <Typography
                  as="p"
                  variant="small"
                  className="text-[color:var(--color-muted)] mb-3 sm:mb-4 text-xs sm:text-sm"
                >
                  Sígueme en redes sociales
                </Typography>
                <div className="flex gap-3">
                  <a
                    href="https://www.instagram.com/marcelacorderobeauty/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[color:var(--color-primary)]/10 flex items-center justify-center hover:bg-[color:var(--color-primary)]/20 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5 text-[color:var(--color-primary)]" />
                  </a>
                  <a
                    href="https://wa.me/51989164990"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[color:var(--color-primary)]/10 flex items-center justify-center hover:bg-[color:var(--color-primary)]/20 transition-colors"
                    aria-label="WhatsApp"
                  >
                    <MessageSquare className="w-5 h-5 text-[color:var(--color-primary)]" />
                  </a>
                </div>
              </div>
            </div>

            <TransportCostCalculator />
          </div>

          <div className="space-y-6 sm:space-y-8 contact-cta-animation">
            <div className="p-5 sm:p-6 md:p-8 bg-[color:var(--color-surface)] rounded-2xl border border-[color:var(--color-border)]">
              <Typography
                as="h3"
                variant="h3"
                className="text-lg sm:text-xl md:text-2xl font-bold text-[color:var(--color-heading)] mb-3 sm:mb-4"
              >
                ¿Lista para Reservar?
              </Typography>

              <Typography
                as="p"
                variant="p"
                className="text-[color:var(--color-body)] mb-5 sm:mb-6 leading-relaxed text-sm sm:text-base"
              >
                Agenda tu cita directamente desde nuestra plataforma de
                reservas. Elige servicios, fecha y horario en pocos pasos.
              </Typography>

              <Button
                as="a"
                href="/reserva"
                variant="primary"
                size="lg"
                className="w-full mb-4"
              >
                Ir a Reservar
              </Button>

              <div className="text-center">
                <Typography
                  as="p"
                  variant="small"
                  className="text-[color:var(--color-muted)] mb-3 text-xs sm:text-sm"
                >
                  o contáctame directamente
                </Typography>
                <Button
                  as="a"
                  href="https://wa.me/51989164990?text=Hola%20Marcela,%20me%20interesa%20agendar%20una%20cita"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </Button>
              </div>
            </div>

            <div className="p-6 sm:p-7 md:p-8 bg-gradient-to-br from-[color:var(--color-primary)]/5 to-[color:var(--color-primary)]/10 rounded-2xl border border-[color:var(--color-primary)]/30">
              <Typography
                as="h4"
                variant="h4"
                className="text-lg sm:text-xl font-bold text-[color:var(--color-heading)] mb-5 sm:mb-6"
              >
                ¿Por qué elegirme?
              </Typography>
              <ul className="space-y-4 sm:space-y-5">
                <li className="flex items-start gap-3 sm:gap-4">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[color:var(--color-primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <Typography
                    as="p"
                    variant="p"
                    className="text-sm sm:text-base text-(--color-body) leading-relaxed"
                  >
                    <span className="font-semibold text-(--color-heading)">
                      +8 años
                    </span>{" "}
                    de experiencia profesional
                  </Typography>
                </li>
                <li className="flex items-start gap-3 sm:gap-4">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-(--color-primary) flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <Typography
                    as="p"
                    variant="p"
                    className="text-sm sm:text-base text-(--color-body) leading-relaxed"
                  >
                    Atención{" "}
                    <span className="font-semibold text-(--color-heading)">
                      personalizada
                    </span>{" "}
                    y productos de{" "}
                    <span className="font-semibold text-[color:var(--color-heading)]">
                      alta calidad
                    </span>
                  </Typography>
                </li>
                <li className="flex items-start gap-3 sm:gap-4">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[color:var(--color-primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <Typography
                    as="p"
                    variant="p"
                    className="text-sm sm:text-base text-[color:var(--color-body)] leading-relaxed"
                  >
                    Servicio a{" "}
                    <span className="font-semibold text-[color:var(--color-heading)]">
                      domicilio
                    </span>{" "}
                    en toda Lima
                  </Typography>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
