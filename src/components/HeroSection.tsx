"use client";

import { Clock, Instagram, MapPin, Truck } from "lucide-react";
import Image from "next/image";
import React from "react";
import Button from "./ui/Button";
import Typography from "./ui/Typography";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative bg-[color:var(--color-background)] py-16 sm:py-24"
      style={{ scrollMarginTop: "120px" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="flex flex-col gap-8">
            {/* Title */}
            <div className="space-y-4">
              <Typography
                as="h1"
                variant="h1"
                className="text-[color:var(--color-heading)] text-4xl sm:text-5xl lg:text-6xl leading-tight"
              >
                <span className="block">Marcela Cordero</span>
                <span className="block text-[color:var(--color-primary)]">
                  Beauty Studio
                </span>
              </Typography>

              <Typography
                as="p"
                variant="p"
                className="text-[color:var(--color-body)] text-lg sm:text-xl max-w-lg leading-relaxed"
              >
                Maquilladora profesional especializada en novias y eventos
                sociales. Diseño maquillajes exclusivos que resaltan tu belleza
                natural.
              </Typography>
            </div>

            {/* Stats - Mobile friendly */}
            <div className="grid grid-cols-3 gap-4 py-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[color:var(--color-primary)]">
                  5.0
                </div>
                <Typography
                  as="p"
                  variant="small"
                  className="text-[color:var(--color-muted)] mt-1"
                >
                  Calificación
                </Typography>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[color:var(--color-primary)]">
                  370+
                </div>
                <Typography
                  as="p"
                  variant="small"
                  className="text-[color:var(--color-muted)] mt-1"
                >
                  Clientes
                </Typography>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-[color:var(--color-primary)]">
                  8+
                </div>
                <Typography
                  as="p"
                  variant="small"
                  className="text-[color:var(--color-muted)] mt-1"
                >
                  Años Exp.
                </Typography>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
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

                    const elementPosition =
                      element.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition =
                      elementPosition - headerHeight - extraMargin;

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                Agendar Cita
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  const el = document.getElementById("servicios");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Ver Servicios
              </Button>
            </div>

            {/* Info Cards - Simplified */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-[color:var(--color-surface)] border border-[color:var(--color-border)]">
                <MapPin className="w-5 h-5 text-[color:var(--color-primary)] flex-shrink-0" />
                <div>
                  <Typography
                    as="p"
                    variant="small"
                    className="text-[color:var(--color-muted)] font-medium"
                  >
                    Ubicación
                  </Typography>
                  <Typography
                    as="p"
                    variant="p"
                    className="text-[color:var(--color-body)] text-sm"
                  >
                    Pueblo Libre, Lima
                  </Typography>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-[color:var(--color-surface)] border border-[color:var(--color-border)]">
                <Truck className="w-5 h-5 text-[color:var(--color-primary)] flex-shrink-0" />
                <div>
                  <Typography
                    as="p"
                    variant="small"
                    className="text-[color:var(--color-muted)] font-medium"
                  >
                    Servicio
                  </Typography>
                  <Typography
                    as="p"
                    variant="p"
                    className="text-[color:var(--color-body)] text-sm"
                  >
                    A domicilio
                  </Typography>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-[color:var(--color-surface)] border border-[color:var(--color-border)]">
                <Clock className="w-5 h-5 text-[color:var(--color-primary)] flex-shrink-0" />
                <div>
                  <Typography
                    as="p"
                    variant="small"
                    className="text-[color:var(--color-muted)] font-medium"
                  >
                    Horarios
                  </Typography>
                  <Typography
                    as="p"
                    variant="p"
                    className="text-[color:var(--color-body)] text-sm"
                  >
                    Flexibles
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Image - Clean and minimal */}
          <div className="relative">
            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-lg border border-[color:var(--color-border)]">
              <Image
                src="/marcela-hero.jpg"
                alt="Marcela Cordero - Makeup Artist Profesional"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
                priority
              />

              {/* Subtle overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

              {/* Instagram link - Minimal */}
              <div className="absolute bottom-6 left-6">
                <a
                  href="https://www.instagram.com/marcelacorderobeauty/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram de Marcela Cordero"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[color:var(--color-surface)]/95 backdrop-blur-sm border border-[color:var(--color-border)] hover:bg-[color:var(--color-surface)] transition-colors"
                >
                  <Instagram className="w-5 h-5 text-[color:var(--color-primary)]" />
                  <span className="text-sm font-medium text-[color:var(--color-heading)]">
                    @marcelacorderobeauty
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
