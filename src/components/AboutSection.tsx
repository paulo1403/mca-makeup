"use client";

import { Award, Instagram, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Typography from "./ui/Typography";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-16 sm:py-20 lg:py-24"
      style={{ scrollMarginTop: "120px" }}
    >
      <div className="container mx-auto px-5 sm:px-6 max-w-lg sm:max-w-xl">
        <div className="text-center mb-10">
          <Typography
            as="h2"
            variant="h2"
            className="text-[color:var(--color-heading)] mb-8"
          >
            Sobre Mí
          </Typography>

          {/* Foto */}
          <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden bg-[color:var(--color-surface)]/40">
            <div className="relative w-full h-full">
              <Image
                src="/mca-about-me.jpg"
                alt="Marcela Cordero"
                fill
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                priority
              />
            </div>
          </div>

          <Typography
            as="h3"
            variant="h3"
            className="font-bold text-[color:var(--color-heading)] mb-2"
          >
            Marcela Cordero
          </Typography>

          <Typography
            as="p"
            variant="small"
            className="text-[color:var(--color-body)]"
          >
            Maquilladora profesional
          </Typography>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center p-3 rounded-[12px] bg-[color:var(--color-surface)]/40">
            <Typography
              as="div"
              variant="h3"
              className="font-bold text-[color:var(--color-primary)]"
            >
              8+
            </Typography>
            <Typography
              as="div"
              variant="small"
              className="text-[color:var(--color-body)]"
            >
              Años
            </Typography>
          </div>
          <div className="text-center p-3 rounded-[12px] bg-[color:var(--color-surface)]/40">
            <Typography
              as="div"
              variant="h3"
              className="font-bold text-[color:var(--color-primary)]"
            >
              370+
            </Typography>
            <Typography
              as="div"
              variant="small"
              className="text-[color:var(--color-body)]"
            >
              Clientas
            </Typography>
          </div>
          <div className="text-center p-3 rounded-[12px] bg-[color:var(--color-surface)]/40">
            <Typography
              as="div"
              variant="h3"
              className="font-bold text-[color:var(--color-primary)]"
            >
              5.0
            </Typography>
            <Typography
              as="div"
              variant="small"
              className="text-[color:var(--color-body)]"
            >
              Rating
            </Typography>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <Typography
            as="p"
            variant="p"
            className="text-[color:var(--color-body)] leading-relaxed text-center"
          >
            Especializada en realzar tu belleza natural. Más de 8 años creando
            looks que resaltan tus mejores rasgos.
          </Typography>
        </div>

        {/* Certificación */}
        <div className="mb-6 p-3 rounded-[12px] bg-[color:var(--color-surface)]/40">
          <div className="flex items-center gap-3 justify-center">
            <Award className="w-5 h-5 text-[color:var(--color-primary)]" />
            <Typography
              as="span"
              variant="small"
              className="text-[color:var(--color-body)]"
            >
              EGRESADA • MUS Makeup Studio
            </Typography>
          </div>
        </div>

        {/* Contacto */}
        <div className="space-y-3 mb-6">
          <a
            href="https://wa.me/51989164990"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-[12px] bg-[color:var(--color-surface)]/40 hover:bg-[color:var(--color-surface)]/60 transition-colors"
          >
            <Phone className="w-4 h-4 text-[color:var(--color-primary)]" />
            <Typography
              as="span"
              variant="small"
              className="font-medium text-[color:var(--color-heading)]"
            >
              WhatsApp
            </Typography>
          </a>
          <a
            href="https://www.instagram.com/marcelacorderobeauty/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-[12px] bg-[color:var(--color-surface)]/40 hover:bg-[color:var(--color-surface)]/60 transition-colors"
          >
            <Instagram className="w-4 h-4 text-[color:var(--color-primary)]" />
            <Typography
              as="span"
              variant="small"
              className="font-medium text-[color:var(--color-heading)]"
            >
              Instagram
            </Typography>
          </a>
        </div>

        {/* Ubicación */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[12px] bg-[color:var(--color-surface)]/40">
            <MapPin className="w-4 h-4 text-[color:var(--color-primary)]" />
            <Typography
              as="span"
              variant="small"
              className="text-[color:var(--color-body)]"
            >
              Pueblo Libre, Lima
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
}
