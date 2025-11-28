"use client";

import { motion } from "framer-motion";
import { Clock, Instagram, MapPin, Sparkles, Star, Truck } from "lucide-react";
import Image from "next/image";
import React from "react";
import Button from "./ui/Button";
import Typography from "./ui/Typography";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative bg-[color:var(--color-surface)] overflow-hidden"
      style={{ scrollMarginTop: "120px" }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-0 -left-20 w-72 h-72 bg-[color:var(--color-primary)] opacity-20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-[color:var(--color-accent)] opacity-15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Decorative Lines */}
        <svg
          className="absolute top-20 left-10 w-24 h-24 text-[color:var(--color-accent)] opacity-10"
          viewBox="0 0 100 100"
        >
          <motion.path
            d="M 10 50 Q 30 20, 50 50 T 90 50"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-80px)] pt-24 sm:pt-24 pb-12 lg:py-24">
          {/* Left: Content */}
          <div className="flex flex-col gap-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--color-primary)]/10 border border-[color:var(--color-primary)]/20 backdrop-blur-sm w-fit"
            >
              <Sparkles className="w-4 h-4 text-[color:var(--color-primary)]" />
              <span className="text-sm font-medium text-[color:var(--color-primary)]">
                Makeup Artist Profesional
              </span>
            </motion.div>

            {/* Title with gradient */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography
                as="h1"
                variant="h1"
                className="text-[color:var(--color-heading)] font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight"
              >
                <span className="block mb-2">Marcela Cordero</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-accent)]">
                  Beauty Studio
                </span>
              </Typography>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-4"
            >
              <Typography
                as="p"
                variant="p"
                className="text-[color:var(--color-body)] text-lg max-w-xl leading-relaxed"
              >
                Maquilladora profesional, diseñadora de maquillajes exclusivos para Novias y eventos
                sociales
              </Typography>
              <Typography
                as="p"
                variant="p"
                className="text-[color:var(--color-body)]/80 max-w-xl hidden sm:block"
              >
                Especialista en{" "}
                <span className="text-[color:var(--color-primary)] font-semibold">Soft Glam</span> y{" "}
                <span className="text-[color:var(--color-primary)] font-semibold">
                  Maquillaje Nupcial
                </span>
                , personalizado para resaltar tu belleza natural.
              </Typography>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="hidden sm:grid grid-cols-3 gap-4 py-4"
            >
              <div className="text-center">
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
                <Typography as="p" variant="small" className="text-[color:var(--color-body)] mt-1">
                  Calificación
                </Typography>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[color:var(--color-primary)]">
                  370+
                </div>
                <Typography as="p" variant="small" className="text-[color:var(--color-body)] mt-1">
                  Clientes
                </Typography>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[color:var(--color-primary)]">
                  8+
                </div>
                <Typography as="p" variant="small" className="text-[color:var(--color-body)] mt-1">
                  Años Exp.
                </Typography>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  const element = document.querySelector("#contacto");
                  if (element) {
                    const header = document.querySelector("header");
                    const headerHeight = header ? header.offsetHeight : 80;
                    const isMobile = window.innerWidth < 768;
                    const extraMargin = isMobile ? 60 : 30;

                    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = elementPosition - headerHeight - extraMargin;

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth",
                    });
                  }
                }}
                className="group"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Agendar Cita
              </Button>

              <Button
                variant="secondary"
                size="lg"
                className="hidden sm:inline-flex"
                onClick={() => {
                  const el = document.getElementById("servicios");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Ver Servicio
              </Button>
            </motion.div>

            {/* Info Cards */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[color:var(--color-surface-secondary)] border border-[color:var(--color-border)]/20 hover:border-[color:var(--color-primary)]/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-[color:var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[color:var(--color-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <Typography
                    as="p"
                    variant="small"
                    className="text-[color:var(--color-muted)] font-medium mb-1"
                  >
                    Ubicación
                  </Typography>
                  <Typography
                    as="p"
                    variant="p"
                    className="text-[color:var(--color-body)] text-sm leading-tight"
                  >
                    Av. Bolívar 1075, Pueblo Libre
                  </Typography>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-[color:var(--color-surface-secondary)] border border-[color:var(--color-border)]/20 hover:border-[color:var(--color-primary)]/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-[color:var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-[color:var(--color-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <Typography
                    as="p"
                    variant="small"
                    className="text-[color:var(--color-muted)] font-medium mb-1"
                  >
                    Servicio
                  </Typography>
                  <Typography
                    as="p"
                    variant="p"
                    className="text-[color:var(--color-body)] text-sm leading-tight"
                  >
                    A domicilio disponible
                  </Typography>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-[color:var(--color-surface-secondary)] border border-[color:var(--color-border)]/20 hover:border-[color:var(--color-primary)]/30 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-[color:var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[color:var(--color-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <Typography
                    as="p"
                    variant="small"
                    className="text-[color:var(--color-muted)] font-medium mb-1"
                  >
                    Horarios
                  </Typography>
                  <Typography
                    as="p"
                    variant="p"
                    className="text-[color:var(--color-body)] text-sm leading-tight"
                  >
                    Flexibles según tu evento
                  </Typography>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Image with enhanced effects */}
          <motion.div
            className="relative"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Decorative border */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[color:var(--color-primary)]/20 to-[color:var(--color-accent)]/20 rounded-3xl opacity-60 blur-xl" />

            {/* Main image container */}
            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-[color:var(--color-border)]/20">
              <Image
                src="/marcela-hero.jpg"
                alt="Marcela Cordero - Makeup Artist Profesional"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
                priority
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {/* Floating badge - CORREGIDO */}
              <motion.div
                className="absolute top-6 right-6"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--color-surface)]/90 backdrop-blur-sm border border-[color:var(--color-border)]/50">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-[color:var(--color-accent)] fill-current"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-[color:var(--color-heading)]">
                    5.0
                  </span>
                </div>
              </motion.div>

              {/* Social links - CORREGIDO */}
              <motion.div
                className="absolute bottom-6 left-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.instagram.com/marcelacorderobeauty/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram de Marcela Cordero"
                    className="p-3 rounded-xl bg-[color:var(--color-surface)]/90 backdrop-blur-sm border border-[color:var(--color-border)]/50 hover:bg-[color:var(--color-surface)] transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-[color:var(--color-primary)]" />
                  </a>

                  <div className="px-3 py-2 rounded-xl bg-[color:var(--color-surface)]/90 backdrop-blur-sm border border-[color:var(--color-border)]/50">
                    <p className="text-xs font-medium text-[color:var(--color-muted)]">Sígueme</p>
                    <p className="text-sm font-semibold text-[color:var(--color-heading)]">
                      @marcelacorderobeauty
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Decorative sparkles */}
              <motion.div
                className="absolute top-1/4 left-8"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-[color:var(--color-primary)]/20 rounded-full blur-md" />
                  <div className="relative p-2 rounded-full bg-[color:var(--color-primary)]/80 backdrop-blur-sm border border-white/30">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute top-1/3 right-12"
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-[color:var(--color-accent)]/20 rounded-full blur-md" />
                  <div className="relative p-2 rounded-full bg-[color:var(--color-accent)]/80 backdrop-blur-sm border border-white/30">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Sparkles adicionales */}
              <motion.div
                className="absolute bottom-1/4 right-8"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 2,
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-[color:var(--color-primary)]/15 rounded-full blur-sm" />
                  <div className="relative p-1.5 rounded-full bg-[color:var(--color-primary)]/70 backdrop-blur-sm border border-white/20">
                    <Sparkles className="w-4 h-4 text-white/90" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute top-1/2 left-12"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 3,
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-[color:var(--color-accent)]/15 rounded-full blur-sm" />
                  <div className="relative p-1.5 rounded-full bg-[color:var(--color-accent)]/70 backdrop-blur-sm border border-white/20">
                    <Sparkles className="w-4 h-4 text-white/90" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave separator */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[color:var(--color-surface)] to-transparent" />
    </section>
  );
}
