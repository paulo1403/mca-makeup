"use client";

import React, { useRef } from "react";
import Image from "next/image";
import {
  User,
  Heart,
  Calendar,
  MapPin,
  Instagram,
  Mail,
  Phone,
  Sparkles,
  CheckCircle,
  Award,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import Typography from "./ui/Typography";
import Button from "./ui/Button";
import "@/styles/components/about.css";

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
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      className="py-16 sm:py-20 about-section relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-[color:var(--color-primary)]/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-[color:var(--color-accent)]/10 rounded-full filter blur-3xl"></div>

      <div className="container mx-auto px-6 lg:px-12 max-w-6xl relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--color-surface)]/80 border border-[color:var(--color-accent)]/20 mb-6">
            <User className="w-4 h-4 text-[color:var(--color-primary)]" />
            <span className="text-sm font-semibold text-[color:var(--color-primary)]">
              Sobre Mí
            </span>
          </div>

          <Typography
            as="h2"
            variant="h2"
            className="text-3xl sm:text-4xl font-bold text-[color:var(--color-heading)] mb-4"
          >
            Marcela Cordero
          </Typography>

          <Typography
            as="p"
            variant="p"
            className="text-lg text-[color:var(--color-body)] max-w-2xl mx-auto"
          >
            Maquilladora profesional especializada en realzar tu belleza natural
          </Typography>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Columna izquierda: Foto y stats */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="order-2 lg:order-1"
          >
            <div className="relative mb-8">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[color:var(--color-surface)]/50 border border-[color:var(--color-border)]/20 shadow-xl">
                {/* Foto real de Marcela */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Image
                    src="https://marcelacorderomakeup.my.canva.site/_assets/media/6d0773b57fb0bc5f1db1ada4d9461476.jpg"
                    alt="Marcela Cordero"
                    fill
                    className="about-image"
                    style={{ objectPosition: "50% 40%" }}
                    priority
                  />
                </div>
              </div>

              {/* Badge de verificación */}
              <div className="absolute top-4 right-4 bg-[color:var(--color-primary)] text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Verificado
              </div>
            </div>

            {/* Stats optimizados para móvil */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-3 rounded-xl bg-[color:var(--color-surface)]/50 border border-[color:var(--color-border)]/20">
                <div className="text-xl sm:text-2xl font-bold text-[color:var(--color-primary)]">
                  8+
                </div>
                <div className="text-xs text-[color:var(--color-body)]">
                  Años
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-[color:var(--color-surface)]/50 border border-[color:var(--color-border)]/20">
                <div className="text-xl sm:text-2xl font-bold text-[color:var(--color-primary)]">
                  370+
                </div>
                <div className="text-xs text-[color:var(--color-body)]">
                  Clientas
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-[color:var(--color-surface)]/50 border border-[color:var(--color-border)]/20">
                <div className="text-xl sm:text-2xl font-bold text-[color:var(--color-primary)]">
                  5.0
                </div>
                <div className="text-xs text-[color:var(--color-body)]">
                  Rating
                </div>
              </div>
            </div>

            {/* Información de contacto simplificada */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  window.open("https://wa.me/51989164990", "_blank")
                }
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-[color:var(--color-border)]/20"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  window.open(
                    "https://www.instagram.com/marcelacorderobeauty/",
                    "_blank"
                  )
                }
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-[color:var(--color-border)]/20"
              >
                <Instagram className="w-4 h-4" />
                <span className="hidden sm:inline">Instagram</span>
              </Button>
            </div>
          </motion.div>

          {/* Columna derecha: Bio y especialidades */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="mb-8">
              <Typography
                as="h3"
                variant="h3"
                className="text-2xl font-bold text-[color:var(--color-heading)] mb-4"
              >
                Mi filosofía
              </Typography>

              <Typography
                as="p"
                variant="p"
                className="text-[color:var(--color-body)] mb-4 leading-relaxed"
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
                className="text-[color:var(--color-body)] leading-relaxed"
              >
                Con más de 8 años de experiencia y más de 370 clientas
                satisfechas, he perfeccionado mi arte para asegurar que te
                sientas increíblemente hermosa en tus momentos más importantes.
              </Typography>
            </div>

            {/* Especialidades */}
            <div className="mb-8">
              <Typography
                as="h3"
                variant="h3"
                className="text-xl font-bold text-[color:var(--color-heading)] mb-4"
              >
                Especialidades
              </Typography>

              <div className="flex flex-wrap gap-3">
                {specialties.map((specialty) => (
                  <div
                    key={specialty.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--color-surface)]/50 border border-[color:var(--color-border)]/20"
                  >
                    <div className="text-[color:var(--color-primary)]">
                      {specialty.icon}
                    </div>
                    <span className="text-sm font-medium text-[color:var(--color-heading)]">
                      {specialty.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificación destacada */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[color:var(--color-primary)]/10 to-[color:var(--color-accent)]/10 border border-[color:var(--color-primary)]/20 mb-8">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[color:var(--color-primary)]/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-[color:var(--color-primary)]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[color:var(--color-heading)] text-sm">
                    Certificación Internacional
                  </h4>
                  <p className="text-xs text-[color:var(--color-body)]">
                    Maquillaje Profesional Avanzado • HD Makeup School
                  </p>
                </div>
              </div>
            </div>

            {/* CTA principal */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() =>
                  window.open(
                    "https://wa.me/51989164990?text=Hola%20Marcela,%20me%20gustar%C3%ADa%20agendar%20una%20consulta",
                    "_blank"
                  )
                }
                className="px-6 py-3 rounded-full flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Agendar Consulta
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() =>
                  document
                    .getElementById("portfolio")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-6 py-3 rounded-full border border-[color:var(--color-border)]/20"
              >
                Ver Mi Trabajo
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Ubicación simplificada */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--color-surface)]/50 border border-[color:var(--color-border)]/20">
            <MapPin className="w-4 h-4 text-[color:var(--color-primary)]" />
            <span className="text-sm text-[color:var(--color-body)]">
              Pueblo Libre, Lima, Perú
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
