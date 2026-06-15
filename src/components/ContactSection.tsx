"use client";

import { Calendar } from "lucide-react";
import Button from "./ui/Button";
import Typography from "./ui/Typography";

export default function ContactSection() {
  return (
    <section id="contacto" className="py-16 sm:py-20 lg:py-24" style={{ scrollMarginTop: "120px" }}>
      <div className="container mx-auto px-5 sm:px-6 max-w-lg sm:max-w-xl">
        <div className="text-center mb-8">
          <Typography as="h2" variant="h2" className="text-[color:var(--color-heading)] mb-4">
            Reservar Cita
          </Typography>

          <Typography as="p" variant="p" className="text-[color:var(--color-body)] mb-8">
            Agenda tu cita de maquillaje profesional en pocos pasos
          </Typography>

          <Button as="a" href="/booking" variant="primary" size="lg">
            <Calendar className="w-5 h-5" />
            Ir a Reservas
          </Button>
        </div>
      </div>
    </section>
  );
}
