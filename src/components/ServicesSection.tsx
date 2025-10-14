"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Clock, Brush, Sparkles, Check, ArrowRight, Star } from "lucide-react";
import Button from "./ui/Button";
import Typography from "./ui/Typography";
import useServiceGroups from "@/hooks/useServiceGroups";

type ServiceGroup = {
  title: string;
  price: string;
  features: string[];
  portfolioUrl: string;
};

function ServiceCard({ service, index }: { service: ServiceGroup; index: number }) {
  const isPopular = index === 1;
  
  return (
    <motion.article
      className={`relative group ${isPopular ? 'service-card-featured' : 'service-card'}`}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-accent)] text-white text-xs font-semibold shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            Más Popular
          </div>
        </div>
      )}

      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[color:var(--color-primary)]/10 via-transparent to-[color:var(--color-accent)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative p-5 sm:p-6">
        {/* Header - Más compacto */}
        <header className="mb-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <motion.div 
              className="p-2.5 rounded-lg bg-gradient-to-br from-[color:var(--color-primary)]/10 to-[color:var(--color-accent)]/10 border border-[color:var(--color-accent)]/20 flex-shrink-0"
              whileHover={{ rotate: 360, scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <Brush className="w-4 h-4 text-[color:var(--color-primary)]" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <Typography as="h3" variant="h3" className="text-lg sm:text-xl font-bold text-[color:var(--color-heading)] mb-0.5 leading-tight">
                {service.title}
              </Typography>
              <Typography as="p" variant="small" className="text-xs text-[color:var(--color-muted)]">
                Servicio profesional
              </Typography>
            </div>
          </div>
        </header>

        {/* Features - Más compactas */}
        <div className="mb-4 space-y-2">
          {service.features.map((feature, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-2.5 group/item"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 + i * 0.04 }}
            >
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-4 h-4 rounded-full bg-[color:var(--color-accent)]/15 flex items-center justify-center group-hover/item:bg-[color:var(--color-accent)]/25 transition-colors">
                  <Check className="w-2.5 h-2.5 text-[color:var(--color-primary)]" strokeWidth={3} />
                </div>
              </div>
              <Typography as="p" variant="p" className="text-sm text-[color:var(--color-body)] leading-snug group-hover/item:text-[color:var(--color-heading)] transition-colors">
                {feature}
              </Typography>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[color:var(--color-accent)]/25 to-transparent mb-4" />

        {/* Footer - Más compacto */}
        <div className="flex items-end justify-between gap-3">
          <div>
            <Typography as="div" variant="small" className="text-[10px] text-[color:var(--color-muted)] mb-0.5 uppercase tracking-wider font-medium">
              Desde
            </Typography>
            <Typography as="div" variant="h4" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-accent)] bg-clip-text text-transparent">
              {service.price}
            </Typography>
          </div>

          <Button
            variant={isPopular ? "primary" : "secondary"}
            size="sm"
            onClick={() => window.open(service.portfolioUrl, "_blank")}
            className="group/btn whitespace-nowrap"
          >
            <span className="text-sm">Ver trabajos</span>
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
  const { data: services = [], isLoading } = useServiceGroups();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="servicios"
      className="relative py-16 sm:py-20 overflow-hidden"
      ref={ref}
    >
      {/* Background - más sutil */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-48 h-48 bg-[color:var(--color-primary)]/3 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-[color:var(--color-accent)]/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        {/* Header - Más compacto */}
        <motion.div
          className="text-center mb-10 sm:mb-12"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[color:var(--color-accent)]/10 border border-[color:var(--color-accent)]/20 mb-4"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[color:var(--color-primary)]" />
            <span className="text-xs font-medium text-[color:var(--color-primary)]">
              Servicios Profesionales
            </span>
          </motion.div>

          <Typography as="h2" variant="h2" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[color:var(--color-heading)] mb-3">
            Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-accent)]">Servicios</span>
          </Typography>
          
          <Typography as="p" variant="p" className="text-sm sm:text-base text-[color:var(--color-body)] max-w-xl mx-auto leading-relaxed">
            Maquillaje y servicios estéticos diseñados para cada ocasión, con atención personalizada.
          </Typography>
        </motion.div>

        {/* Cards Grid - Grid más compacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-12 sm:mb-14">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 rounded-xl bg-[color:var(--color-surface)] animate-pulse"
                />
              ))
            : services.map((service, index) => (
                <ServiceCard
                  key={service.title}
                  service={service}
                  index={index}
                />
              ))}
        </div>

        {/* Bottom CTA - Más compacto */}
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
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[color:var(--color-accent)]/10 text-xs font-medium text-[color:var(--color-primary)] mb-3">
                    <Sparkles className="w-3 h-3" />
                    Atención Personalizada
                  </div>
                  
                  <Typography as="h3" variant="h3" className="text-xl sm:text-2xl font-bold text-[color:var(--color-heading)] mb-2">
                    Te atendemos donde prefieras
                  </Typography>
                  
                  <Typography as="p" variant="p" className="text-sm text-[color:var(--color-body)] leading-relaxed mb-5">
                    Visítanos en Av. Bolívar 1073, Pueblo Libre, o agenda una cita a domicilio.
                  </Typography>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      const el = document.getElementById("contacto");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="group/cta"
                  >
                    <Sparkles className="w-4 h-4 group-hover/cta:rotate-12 transition-transform" />
                    Agendar Ahora
                    <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-0.5 transition-transform" />
                  </Button>
                </div>

                {/* Right info cards */}
                <div className="grid gap-3">
                  <motion.div
                    className="flex items-center gap-3 p-4 rounded-xl bg-[color:var(--color-background)] border border-[color:var(--color-accent)]/10"
                    whileHover={{ scale: 1.02, borderColor: "var(--color-accent)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-2 rounded-lg bg-[color:var(--color-accent)]/10 flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[color:var(--color-primary)]" />
                    </div>
                    <div>
                      <Typography as="h4" variant="h4" className="text-sm font-semibold text-[color:var(--color-heading)] mb-0.5">
                        Servicio a domicilio
                      </Typography>
                      <Typography as="p" variant="small" className="text-xs text-[color:var(--color-muted)]">
                        En toda Lima
                      </Typography>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-3 p-4 rounded-xl bg-[color:var(--color-background)] border border-[color:var(--color-accent)]/10"
                    whileHover={{ scale: 1.02, borderColor: "var(--color-accent)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-2 rounded-lg bg-[color:var(--color-accent)]/10 flex-shrink-0">
                      <Clock className="w-5 h-5 text-[color:var(--color-primary)]" />
                    </div>
                    <div>
                      <Typography as="h4" variant="h4" className="text-sm font-semibold text-[color:var(--color-heading)] mb-0.5">
                        Horarios flexibles
                      </Typography>
                      <Typography as="p" variant="small" className="text-xs text-[color:var(--color-muted)]">
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