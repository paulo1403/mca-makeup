"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Button from "./ui/Button";
import Typography from "./ui/Typography";
import { MapPin, Truck, Instagram, Clock, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-background overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-0 -left-20 w-72 h-72 bg-[color:var(--color-accent)] opacity-20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-0 w-96 h-96 bg-[color:var(--color-primary)] opacity-15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-80px)] py-16 lg:py-20">
          {/* Left: Content */}
          <div className="flex flex-col gap-8">
            {/* Badges and stats removed by request */}

            {/* Decorative sparkles */}
            <span className="hero-sparkle sparkle-1" aria-hidden></span>
            <span className="hero-sparkle sparkle-2" aria-hidden></span>
            <span className="hero-sparkle sparkle-3" aria-hidden></span>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--color-accent)]/10 border border-[color:var(--color-accent)]/20 backdrop-blur-sm w-fit">
              <Sparkles className="w-4 h-4 text-[color:var(--color-accent)]" />
              <span className="text-sm font-medium text-[color:var(--color-primary)]">
                Makeup Artist Profesional
              </span>
            </div>

            {/* Title with gradient */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ overflow: 'visible' }}
            >
              <Typography as="h1" variant="display" className="relative overflow-visible">
                <span className="block mb-2 text-[color:var(--color-heading)]">
                  Marcela Cordero
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-accent)]">
                  Beauty Studio
                </span>
              </Typography>
            </motion.div>

            {/* Description with better spacing */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <p className="text-lg text-[color:var(--color-body)] max-w-xl leading-relaxed">
                Realzando tu belleza para momentos inolvidables.
              </p>
              <p className="text-base text-[color:var(--color-muted)] max-w-xl">
                Especialista en{" "}
                <span className="text-[color:var(--color-primary)] font-semibold">
                  Soft Glam
                </span>{" "}
                y{" "}
                <span className="text-[color:var(--color-primary)] font-semibold">
                  Maquillaje Nupcial
                </span>
                , personalizado para resaltar tu belleza natural.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col xs:flex-row gap-4"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  const el = document.getElementById("contacto");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Agendar Cita
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  const el = document.getElementById("portfolio");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Ver Portfolio
              </Button>
            </motion.div>

            {/* Info Cards */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="info-cards grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4"
            >
              <div className="info-card flex items-start gap-3 p-3 rounded-lg bg-[color:var(--color-surface)] border border-[color:var(--color-accent)]/10 hover:border-[color:var(--color-accent)]/30 transition-colors">
                <div className="info-icon p-1 rounded-md bg-[color:var(--color-accent)]/10">
                  <MapPin className="w-4 h-4 text-[color:var(--color-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[color:var(--color-muted)] mb-1">
                    Ubicación
                  </p>
                  <p className="text-sm text-[color:var(--color-body)] leading-tight">
                    Av. Bolívar 1073
                    <br />
                    Pueblo Libre, Lima
                  </p>
                </div>
              </div>

              <div className="info-card flex items-start gap-3 p-3 rounded-lg bg-[color:var(--color-surface)] border border-[color:var(--color-accent)]/10 hover:border-[color:var(--color-accent)]/30 transition-colors">
                <div className="info-icon p-1 rounded-md bg-[color:var(--color-accent)]/10">
                  <Truck className="w-4 h-4 text-[color:var(--color-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[color:var(--color-muted)] mb-1">
                    Servicio
                  </p>
                  <p className="text-sm text-[color:var(--color-body)] leading-tight">
                    A domicilio
                    <br />
                    disponible
                  </p>
                </div>
              </div>

              <div className="info-card flex items-start gap-3 p-3 rounded-lg bg-[color:var(--color-surface)] border border-[color:var(--color-accent)]/10 hover:border-[color:var(--color-accent)]/30 transition-colors">
                <div className="info-icon p-1 rounded-md bg-[color:var(--color-accent)]/10">
                  <Clock className="w-4 h-4 text-[color:var(--color-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[color:var(--color-muted)] mb-1">
                    Horarios
                  </p>
                  <p className="text-sm text-[color:var(--color-body)] leading-tight">
                    Flexibles
                    <br />
                    según tu evento
                  </p>
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
            <div className="absolute -inset-4 bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-accent)] rounded-3xl opacity-20 blur-2xl" />

            {/* Main image container */}
            <div className="relative h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-[color:var(--color-accent)]/20">
              <Image
                src="/marcela-hero.jpg"
                alt="Marcela Cordero - Makeup Artist Profesional"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
                priority
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Floating badge */}
              <motion.div
                className="absolute top-6 right-6"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="rating-pill">
                  <p className="text-sm font-semibold text-[color:var(--color-primary)]">
                    ⭐ 5.0 Rating
                  </p>
                </div>
              </motion.div>

              {/* Social links */}
              <motion.div
                className="absolute bottom-6 left-6 flex items-center gap-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <a
                  href="https://www.instagram.com/marcelacorderobeauty/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram de Marcela Cordero"
                  className="p-3 rounded-xl social-pill group"
                >
                  <Instagram className="w-5 h-5 text-[color:var(--color-primary)] group-hover:text-[color:var(--color-accent)] transition-colors" />
                </a>

                <div className="px-4 py-2 rounded-xl social-info-pill">
                  <p className="text-xs font-medium text-[color:var(--color-muted)]">
                    Sígueme
                  </p>
                  <p className="text-sm font-semibold text-[color:var(--color-heading)]">
                    @marcelacorderobeauty
                  </p>
                </div>
              </motion.div>

              {/* Decorative sparkles */}
              <motion.div
                className="absolute top-1/4 left-8"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="w-6 h-6 text-white/80" />
              </motion.div>

              <motion.div
                className="absolute top-1/3 right-12"
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <Sparkles className="w-5 h-5 text-white/70" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave separator (optional) */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[color:var(--color-surface)] to-transparent" />
    </section>
  );
}
