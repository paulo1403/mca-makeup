"use client";

import useServiceGroups, { type ServiceGroup } from "@/hooks/useServiceGroups";
import { ArrowRight, Check } from "lucide-react";
import Button from "./ui/Button";
import Typography from "./ui/Typography";
import "@/styles/components/services.css";

type UIServiceGroup = ServiceGroup & { badge?: string };

function ServiceCard({ service }: { service: UIServiceGroup }) {
  return (
    <article className="service-card group">
      <div className="h-full p-6 sm:p-8 bg-[color:var(--color-surface)] rounded-2xl border border-[color:var(--color-border)] hover:border-[color:var(--color-primary)]/30 transition-colors">
        <div className="flex flex-col h-full">
          <div className="mb-6">
            <Typography
              as="h3"
              variant="h3"
              className="text-xl sm:text-2xl font-bold text-[color:var(--color-heading)] mb-3"
            >
              {service.title}
            </Typography>

            <div className="space-y-2.5">
              {service.features.slice(0, 3).map((feature, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[color:var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check
                      className="w-3 h-3 text-[color:var(--color-primary)]"
                      strokeWidth={2.5}
                    />
                  </div>
                  <Typography
                    as="p"
                    variant="p"
                    className="text-sm text-[color:var(--color-body)]"
                  >
                    {feature}
                  </Typography>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-[color:var(--color-border)]">
            <div className="flex items-end justify-between gap-4">
              <div>
                <Typography
                  as="p"
                  variant="small"
                  className="text-xs text-[color:var(--color-muted)] mb-1 uppercase tracking-wider font-medium"
                >
                  Desde
                </Typography>
                <Typography
                  as="p"
                  variant="h4"
                  className="text-2xl sm:text-3xl font-bold text-[color:var(--color-primary)]"
                >
                  {service.price}
                </Typography>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.open(service.portfolioUrl, "_blank")}
              >
                Ver más
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ServicesSection() {
  const { data: serviceGroups = [], isLoading } = useServiceGroups();

  return (
    <section
      id="servicios"
      className="relative py-16 sm:py-24 bg-[color:var(--color-background)]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 animate-slideUp">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[color:var(--color-primary)]/10 border border-[color:var(--color-primary)]/20 mb-6">
            <span className="text-sm font-medium text-[color:var(--color-primary)]">
              Servicios Profesionales
            </span>
          </div>

          <Typography
            as="h2"
            variant="h2"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[color:var(--color-heading)] mb-4"
          >
            Nuestros Servicios
          </Typography>

          <Typography
            as="p"
            variant="p"
            className="text-base sm:text-lg text-[color:var(--color-body)] max-w-2xl mx-auto leading-relaxed"
          >
            Maquillaje profesional diseñado para cada ocasión, con atención
            personalizada y productos de alta calidad.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {isLoading
            ? Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 rounded-2xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)] animate-pulse"
                />
              ))
            : serviceGroups.map((service) => (
                <ServiceCard key={service.title} service={service} />
              ))}
        </div>

        <div className="max-w-3xl mx-auto p-8 sm:p-10 rounded-2xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)] text-center animate-slideUp">
          <Typography
            as="h3"
            variant="h3"
            className="text-2xl sm:text-3xl font-bold text-[color:var(--color-heading)] mb-4"
          >
            ¿Lista para tu transformación?
          </Typography>

          <Typography
            as="p"
            variant="p"
            className="text-base text-[color:var(--color-body)] mb-8 max-w-xl mx-auto"
          >
            Agenda tu cita y descubre el poder del maquillaje profesional.
            Servicio a domicilio disponible en toda Lima.
          </Typography>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button as="a" href="/reserva" variant="primary" size="lg">
              Agendar Ahora
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() =>
                window.open(
                  "https://www.instagram.com/marcelacorderobeauty/",
                  "_blank"
                )
              }
            >
              Ver Portfolio
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
