"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  MapPin,
  Clock,
  Brush,
  Sparkles,
  Check,
  ArrowRight,
  Star
} from "lucide-react";
import Button from "./ui/Button";
import Typography from "./ui/Typography";
import useServiceGroups, { ServiceGroup } from "@/hooks/useServiceGroups";

// UI type extends API type with optional UI-only props
type UIServiceGroup = ServiceGroup & { icon?: React.ReactNode; badge?: string };

function ServiceCard({ service, index }: { service: UIServiceGroup; index: number }) {
  const isPopular = index === 0;

  return (
    <motion.article
      className={`relative group ${isPopular ? "service-card-featured" : "service-card"
        }`}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-accent)] text-white text-xs font-semibold shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            Popular
          </div>
        </div>
      )}

      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[color:var(--color-primary)]/10 via-transparent to-[color:var(--color-accent)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative p-5 sm:p-6 bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)]/20 group-hover:border-[color:var(--color-primary)]/50 transition-all duration-300">
        {/* Header */}
        <header className="mb-3 sm:mb-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <motion.div
              className="p-3 rounded-xl bg-gradient-to-br from-[color:var(--color-primary)]/10 to-[color:var(--color-accent)]/10 border border-[color:var(--color-accent)]/20 flex-shrink-0"
              whileHover={{ rotate: 360, scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              {service.icon || (
                <Brush className="w-5 h-5 text-[color:var(--color-primary)]" />
              )}
            </motion.div>
            <div className="flex-1 min-w-0">
              <Typography
                as="h3"
                variant="h3"
                className="text-lg sm:text-xl font-bold text-[color:var(--color-heading)] mb-1 leading-tight"
              >
                {service.title}
              </Typography>
              {service.badge && (
                <span className="inline-block px-2 py-1 text-xs font-medium text-[color:var(--color-accent)] bg-[color:var(--color-accent)]/10 rounded-full">
                  {service.badge}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Features */}
        <div className="hidden sm:block mb-4 space-y-2">
          {service.features.map((feature, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-2.5 group/item"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 + i * 0.04 }}
            >
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-5 h-5 rounded-full bg-[color:var(--color-accent)]/15 flex items-center justify-center group-hover/item:bg-[color:var(--color-accent)]/25 transition-colors">
                  <Check
                    className="w-2.5 h-2.5 text-[color:var(--color-primary)]"
                    strokeWidth={3}
                  />
                </div>
              </div>
              <Typography
                as="p"
                variant="p"
                className="text-sm text-[color:var(--color-body)] leading-snug group-hover/item:text-[color:var(--color-heading)] transition-colors"
              >
                {feature}
              </Typography>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[color:var(--color-accent)]/25 to-transparent mb-4" />

        {/* Footer */}
        <div className="flex items-end justify-between gap-3">
          <div>
            <Typography
              as="div"
              variant="small"
              className="text-[10px] text-[color:var(--color-muted)] mb-0.5 uppercase tracking-wider font-medium"
            >
              Desde
            </Typography>
            <Typography
              as="div"
              variant="h4"
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-accent)] bg-clip-text text-transparent"
            >
              {service.price}
            </Typography>
          </div>

          <Button
            variant={isPopular ? "primary" : "secondary"}
            size="sm"
            onClick={() => window.open(service.portfolioUrl, "_blank")}
            className="group/btn whitespace-nowrap"
          >
            <span className="text-sm">Ver</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>

      <motion.div
        className="absolute top-3 right-3 text-[color:var(--color-accent)]/20"
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 45, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Sparkles className="w-3.5 h-3.5" />
      </motion.div>
    </motion.article>
  );
}

export default function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const { data: serviceGroups = [], isLoading } = useServiceGroups();
  const visibleServices: UIServiceGroup[] = serviceGroups.map((s) => ({ ...s }));

  return (
    <section
      id="servicios"
      className="relative py-12 sm:py-20 overflow-hidden"
      style={{ scrollMarginTop: '120px' }}
      ref={ref}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <div className="absolute top-20 left-10 w-48 h-48 bg-[color:var(--color-primary)]/3 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-[color:var(--color-accent)]/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--color-accent)]/10 border border-[color:var(--color-accent)]/20 mb-4"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={
              isInView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }
            }
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[color:var(--color-primary)]" />
            <span className="text-sm font-medium text-[color:var(--color-primary)]">
              Servicios Profesionales
            </span>
          </motion.div>

          <Typography
            as="h2"
            variant="h2"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[color:var(--color-heading)] mb-3"
          >
            Nuestros{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-accent)]">
              Servicios
            </span>
          </Typography>

          <Typography
            as="p"
            variant="p"
            className="text-sm sm:text-base text-[color:var(--color-body)] max-w-xl mx-auto leading-relaxed"
          >
            Maquillaje profesional diseñado para cada ocasión, con atención
            personalizada y productos de alta calidad.
          </Typography>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden sm:grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
        >
          <div className="text-center p-4 rounded-xl bg-[color:var(--color-surface)]/50 border border-[color:var(--color-border)]/20">
            <div className="text-2xl sm:text-3xl font-bold text-[color:var(--color-primary)]">
              5.0
            </div>
            <div className="flex items-center justify-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-[color:var(--color-accent)] fill-current"
                />
              ))}
            </div>
            <Typography
              as="p"
              variant="small"
              className="text-[color:var(--color-body)] mt-1"
            >
              Calificación
            </Typography>
          </div>
          <div className="text-center p-4 rounded-xl bg-[color:var(--color-surface)]/50 border border-[color:var(--color-border)]/20">
            <div className="text-2xl sm:text-3xl font-bold text-[color:var(--color-primary)]">
              370+
            </div>
            <Typography
              as="p"
              variant="small"
              className="text-[color:var(--color-body)] mt-1"
            >
              Clientes
            </Typography>
          </div>
          <div className="text-center p-4 rounded-xl bg-[color:var(--color-surface)]/50 border border-[color:var(--color-border)]/20">
            <div className="text-2xl sm:text-3xl font-bold text-[color:var(--color-primary)]">
              8+
            </div>
            <Typography
              as="p"
              variant="small"
              className="text-[color:var(--color-body)] mt-1"
            >
              Años Exp.
            </Typography>
          </div>
          <div className="text-center p-4 rounded-xl bg-[color:var(--color-surface)]/50 border border-[color:var(--color-border)]/20">
            <div className="text-2xl sm:text-3xl font-bold text-[color:var(--color-primary)]">
              100%
            </div>
            <Typography
              as="p"
              variant="small"
              className="text-[color:var(--color-body)] mt-1"
            >
              Satisfacción
            </Typography>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {isLoading
            ? Array.from({ length: visibleServices.length || 2 }).map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-xl bg-[color:var(--color-surface)] animate-pulse"
              />
            ))
            : visibleServices.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-primary)]/8 via-[color:var(--color-accent)]/4 to-transparent rounded-2xl blur-xl" />

            <div className="relative p-6 sm:p-8 rounded-2xl bg-[color:var(--color-surface)] border border-[color:var(--color-accent)]/20 backdrop-blur-sm">
              <div className="grid md:grid-cols-[1.2fr,1fr] gap-6 items-center">
                {/* Left content */}
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[color:var(--color-accent)]/10 text-xs font-medium text-[color:var(--color-primary)] mb-3">
                    <MapPin className="w-4 h-4 text-[color:var(--color-primary)]" />
                    <span>Te atendemos donde prefieras</span>
                  </div>

                  <Typography
                    as="h3"
                    variant="h3"
                    className="text-xl sm:text-2xl font-bold text-[color:var(--color-heading)] mb-2"
                  >
                    Te atendemos donde prefieras
                  </Typography>

                  <Typography
                    as="p"
                    variant="p"
                    className="text-sm text-[color:var(--color-body)] leading-relaxed mb-5"
                  >
                    Vísitanos en nuestro Room Studio en Pueblo Libre o agenda una
                    cita a domicilio.
                  </Typography>

                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      const element = document.querySelector("#contacto");
                      if (element) {
                        const header = document.querySelector('header');
                        const headerHeight = header ? header.offsetHeight : 80;
                        const isMobile = window.innerWidth < 768;
                        const extraMargin = isMobile ? 60 : 30;

                        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                        const offsetPosition = elementPosition - headerHeight - extraMargin;

                        window.scrollTo({
                          top: offsetPosition,
                          behavior: "smooth"
                        });
                      }
                    }}
                    className="group/cta"
                  >
                    <Sparkles className="w-4 h-4 group-hover/cta:rotate-12 transition-transform" />
                    Agendar Ahora
                    <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-0.5 transition-transform" />
                  </Button>
                </div>

                {/* Right info cards */}
                <div className="hidden md:grid grid-cols-1 gap-3">
                  <motion.div
                    className="flex items-center gap-3 p-4 rounded-xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)]/20 hover:border-[color:var(--color-primary)]/30 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="p-2 rounded-lg bg-[color:var(--color-primary)]/10 flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[color:var(--color-primary)]" />
                    </div>
                    <div>
                      <Typography
                        as="h4"
                        variant="h4"
                        className="text-sm font-semibold text-[color:var(--color-heading)] mb-1"
                      >
                        Servicio a domicilio
                      </Typography>
                      <Typography
                        as="p"
                        variant="small"
                        className="text-xs text-[color:var(--color-muted)]"
                      >
                        En toda Lima
                      </Typography>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-3 p-4 rounded-xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)]/20 hover:border-[color:var(--color-primary)]/30 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="p-2 rounded-lg bg-[color:var(--color-primary)]/10 flex-shrink-0">
                      <Clock className="w-5 h-5 text-[color:var(--color-primary)]" />
                    </div>
                    <div>
                      <Typography
                        as="h4"
                        variant="h4"
                        className="text-sm font-semibold text-[color:var(--color-heading)] mb-1"
                      >
                        Horarios flexibles
                      </Typography>
                      <Typography
                        as="p"
                        variant="small"
                        className="text-xs text-[color:var(--color-muted)]"
                      >
                        Según tu evento
                      </Typography>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
