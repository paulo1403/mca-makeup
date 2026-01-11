"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";
import Typography from "./ui/Typography";

export default function ContactSection() {
  return (
    <section
      id="contacto"
      className="py-16 sm:py-20 lg:py-24"
      style={{ scrollMarginTop: "120px" }}
    >
      <div className="container mx-auto px-5 sm:px-6 max-w-lg sm:max-w-xl">
        <div className="text-center mb-8">
          <Typography
            as="h2"
            variant="h2"
            className="text-[color:var(--color-heading)] mb-4"
          >
            Reservar Cita
          </Typography>

          <Typography
            as="p"
            variant="p"
            className="text-[color:var(--color-body)] mb-8"
          >
            Agenda tu cita de maquillaje profesional en pocos pasos
          </Typography>

          <Link
            href="/booking"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[12px] bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary)]/90 transition-colors"
          >
            <Calendar className="w-5 h-5" />
            <Typography as="span" variant="p" className="font-medium">
              Ir a Reservas
            </Typography>
          </Link>
        </div>
      </div>
    </section>
  );
}
