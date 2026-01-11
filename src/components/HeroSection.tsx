"use client";

import Image from "next/image";
import React from "react";
import Button from "./ui/Button";
import Typography from "./ui/Typography";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{ scrollMarginTop: "120px" }}
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/heroimage.jpg"
          alt="Marcela Cordero - Makeup Artist Profesional"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/30 sm:bg-black/35" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-8 place-items-center min-h-[calc(100vh-80px)] py-12 sm:py-16">
          {/* Left: Content */}
          <div className="flex flex-col gap-6 p-6 sm:p-8 rounded-xl bg-[color:var(--color-surface)]/80 sm:bg-[color:var(--color-surface)]/85 border border-[color:var(--color-border)]/20 shadow-sm w-full sm:max-w-xl md:max-w-2xl mx-auto text-center">
            

            <div className="flex flex-col gap-0">
              <Typography
                as="h1"
                variant="h1"
                className="text-[color:var(--color-heading)]"
              >
                Marcela Cordero
              </Typography>
              <Typography
                as="p"
                variant="p"
                className="text-[color:var(--color-muted)] font-medium leading-tight"
              >
                Beauty Studio
              </Typography>
            </div>

            <div className="space-y-4">
              <Typography
                as="p"
                variant="p"
                className="text-[color:var(--color-body)] text-base sm:text-lg max-w-xl leading-relaxed"
              >
                Maquilladora profesional especializada en Novias y eventos sociales.
              </Typography>
              
            </div>

            

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  const el = document.getElementById("contacto");
                  el?.scrollIntoView({ behavior: "smooth" });
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

            
          </div>

          
        </div>
      </div>
    </section>
  );
}
