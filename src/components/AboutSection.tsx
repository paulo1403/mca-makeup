"use client";

import {
  Award,
  Calendar,
  CheckCircle,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import type React from "react";
import Button from "./ui/Button";
import Typography from "./ui/Typography";
import "@/styles/components/about-minimal.css";

type Specialty = {
  id: string;
  name: string;
  icon: React.ReactNode;
};

const specialties: Specialty[] = [
  {
    id: "1",
    name: "Novias",
    icon: <Heart className="w-5 h-5" />,
  },
  {
    id: "2",
    name: "Eventos Sociales",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    id: "3",
    name: "Piel Madura",
    icon: <Sparkles className="w-5 h-5" />,
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-12 sm:py-16 md:py-24 bg-[color:var(--color-background)]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16 about-header-animation">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[color:var(--color-primary)]/10 border border-[color:var(--color-primary)]/20 mb-4 sm:mb-6">
            <span className="text-sm font-medium text-[color:var(--color-primary)]">
              Sobre Mí
            </span>
          </div>

          <Typography
            as="h2"
            variant="h2"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[color:var(--color-heading)] mb-3 sm:mb-4 px-4"
          >
            Marcela Cordero
          </Typography>

          <Typography
            as="p"
            variant="p"
            className="text-sm sm:text-base md:text-lg text-[color:var(--color-body)] max-w-2xl mx-auto leading-relaxed px-4"
          >
            Maquilladora profesional especializada en realzar tu belleza natural
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-start">
          {/* Columna izquierda: Foto y stats */}
          <div className="about-image-animation">
            <div className="relative mb-6 sm:mb-8">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[color:var(--color-surface)] border border-[color:var(--color-border)]">
                <div className="relative w-full h-full">
                  <Image
                    src="/about-me.jpg"
                    alt="Marcela Cordero - Maquilladora Profesional"
                    fill
                    className="about-image object-cover object-center"
                    priority
                  />
                </div>
              </div>

              {/* Badge de verificación */}
              <div className="absolute top-4 right-4 bg-[color:var(--color-primary)] text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                <CheckCircle className="w-3.5 h-3.5" />
                Verificado
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="text-center p-4 sm:p-5 rounded-xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)]">
                <div className="text-2xl sm:text-3xl font-bold text-[color:var(--color-primary)] mb-1">
                  8+
                </div>
                <div className="text-xs sm:text-sm text-[color:var(--color-muted)] font-medium">
                  Años
                </div>
              </div>
              <div className="text-center p-4 sm:p-5 rounded-xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)]">
                <div className="text-2xl sm:text-3xl font-bold text-[color:var(--color-primary)] mb-1">
                  370+
                </div>
                <div className="text-xs sm:text-sm text-[color:var(--color-muted)] font-medium">
                  Clientas
                </div>
              </div>
              <div className="text-center p-4 sm:p-5 rounded-xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)]">
                <div className="text-2xl sm:text-3xl font-bold text-[color:var(--color-primary)] mb-1">
                  5.0
                </div>
                <div className="text-xs sm:text-sm text-[color:var(--color-muted)] font-medium">
                  Rating
                </div>
              </div>
            </div>

            {/* Botones de contacto */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                as="a"
                href="https://wa.me/51989164990"
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="lg"
                className="flex-1"
              >
                <Phone className="w-4 h-4" />
                WhatsApp
              </Button>
              <Button
                as="a"
                href="https://www.instagram.com/marcelacorderobeauty/"
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="lg"
                className="flex-1"
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </Button>
            </div>
          </div>

          {/* Columna derecha: Bio y especialidades */}
          <div className="about-content-animation space-y-6 sm:space-y-8">
            <div className="p-6 sm:p-7 md:p-8 bg-[color:var(--color-surface)] rounded-2xl border border-[color:var(--color-border)]">
              <Typography
                as="h3"
                variant="h3"
                className="text-xl sm:text-2xl font-bold text-[color:var(--color-heading)] mb-4 sm:mb-5"
              >
                Mi Filosofía
              </Typography>

              <Typography
                as="p"
                variant="p"
                className="text-sm sm:text-base text-[color:var(--color-body)] mb-4 leading-relaxed"
              >
                Creo que cada mujer tiene una belleza única que merece ser
                realzada. Mi especialidad es crear looks que resalten tus
                mejores rasgos sin ocultar tu esencia, utilizando técnicas de
                maquillaje de alta definición que garantizan un resultado
                impecable tanto en persona como en fotografía.
              </Typography>

              <Typography
                as="p"
                variant="p"
                className="text-sm sm:text-base text-[color:var(--color-body)] leading-relaxed"
              >
                Con más de{" "}
                <span className="font-semibold text-[color:var(--color-heading)]">
                  8 años de experiencia
                </span>{" "}
                y más de{" "}
                <span className="font-semibold text-[color:var(--color-heading)]">
                  370 clientas satisfechas
                </span>
                , he perfeccionado mi arte para asegurar que te sientas
                increíblemente hermosa en tus momentos más importantes.
              </Typography>
            </div>

            {/* Especialidades */}
            <div className="p-6 sm:p-7 md:p-8 bg-[color:var(--color-surface)] rounded-2xl border border-[color:var(--color-border)]">
              <Typography
                as="h3"
                variant="h3"
                className="text-lg sm:text-xl font-bold text-[color:var(--color-heading)] mb-4 sm:mb-5"
              >
                Especialidades
              </Typography>

              <div className="space-y-3">
                {specialties.map((specialty) => (
                  <div
                    key={specialty.id}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-[color:var(--color-primary)]/5 border border-[color:var(--color-primary)]/10"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[color:var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                      <div className="text-[color:var(--color-primary)]">
                        {specialty.icon}
                      </div>
                    </div>
                    <span className="text-sm sm:text-base font-semibold text-[color:var(--color-heading)]">
                      {specialty.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificación */}
            <div className="p-6 sm:p-7 md:p-8 bg-gradient-to-br from-[color:var(--color-primary)]/5 to-[color:var(--color-primary)]/10 rounded-2xl border border-[color:var(--color-primary)]/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[color:var(--color-primary)] flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1">
                  <Typography
                    as="h4"
                    variant="h4"
                    className="font-bold text-[color:var(--color-heading)] text-base sm:text-lg mb-2"
                  >
                    Certificación Internacional
                  </Typography>
                  <Typography
                    as="p"
                    variant="small"
                    className="text-[color:var(--color-muted)] text-xs sm:text-sm"
                  >
                    Maquillaje Profesional Avanzado • HD Makeup School
                  </Typography>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Button
              as="a"
              href="#contacto"
              variant="primary"
              size="lg"
              className="w-full"
              onClick={(e) => {
                e.preventDefault();
                const element = document.querySelector("#contacto");
                if (element) {
                  const header = document.querySelector("header");
                  const headerHeight = header ? header.offsetHeight : 80;
                  const elementPosition =
                    element.getBoundingClientRect().top + window.scrollY;
                  const offsetPosition = elementPosition - headerHeight - 30;

                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                  });
                }
              }}
            >
              <Mail className="w-4 h-4" />
              Agendar Consulta
            </Button>
          </div>
        </div>

        {/* Ubicación */}
        <div className="mt-10 sm:mt-12 md:mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)]">
            <MapPin className="w-4 h-4 text-[color:var(--color-primary)]" />
            <span className="text-sm font-medium text-[color:var(--color-body)]">
              Pueblo Libre, Lima, Perú
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
