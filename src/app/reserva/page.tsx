"use client";

import React from "react";
import Typography from "@/components/ui/Typography";
import AvailabilityCheckSection from "@/components/availability/AvailabilityCheckSection";
import BookingFlow from "@/components/BookingFlow";

export default function ReservaPage() {
  return (
    <section className="pt-24 sm:pt-28 pb-10 overflow-hidden" style={{ scrollMarginTop: "120px" }}>
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-6">
          <Typography as="h1" variant="h1" className="text-[color:var(--color-heading)] font-serif text-2xl sm:text-3xl">
            Reserva tu Cita
          </Typography>
          <Typography as="p" variant="p" className="text-[color:var(--color-body)] max-w-xl mx-auto text-sm sm:text-base mt-2">
            Selecciona servicios, verifica disponibilidad y completa tu reserva.
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr,0.85fr] gap-6 lg:gap-8">
          <div>
            <AvailabilityCheckSection />
          </div>
          <div className="p-4 sm:p-6 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-sm lg:sticky lg:top-24 lg:h-fit">
            <BookingFlow />
          </div>
        </div>
      </div>
    </section>
  );
}
