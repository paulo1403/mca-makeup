"use client";

import { Instagram } from "lucide-react";
import Image from "next/image";
import Button from "./ui/Button";
import Typography from "./ui/Typography";
import "@/styles/components/hero.css";

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      const header = document.querySelector("header");
      const headerHeight = header?.offsetHeight || 80;
      const offset = window.innerWidth < 768 ? 20 : 40;
      const position =
        element.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        offset;
      window.scrollTo({ top: position, behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 sm:pt-32 sm:pb-24 bg-(--color-background)"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8 lg:space-y-10">
            <div className="space-y-6 animate-fadeInUp">
              <div className="inline-block px-4 py-1.5 rounded-full bg-(--color-primary)/10 border border-(--color-primary)/20">
                <span className="text-sm font-medium text-(--color-primary)">
                  Maquillaje Profesional
                </span>
              </div>

              <Typography
                as="h1"
                variant="h1"
                className="text-(--color-heading) text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight font-bold"
              >
                Marcela Cordero
                <span className="block text-(--color-primary) mt-2">
                  Beauty Studio
                </span>
              </Typography>

              <Typography
                as="p"
                variant="p"
                className="text-(--color-body) text-lg sm:text-xl max-w-xl leading-relaxed"
              >
                Especialista en novias y eventos sociales. Diseño maquillajes
                exclusivos que resaltan tu belleza natural con técnicas
                profesionales.
              </Typography>
            </div>

            <div className="grid grid-cols-3 gap-6 py-8 border-y border-[color:var(--color-border)] animate-fadeInUp delay-200">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[color:var(--color-primary)] mb-2">
                  5.0
                </div>
                <Typography
                  as="p"
                  variant="small"
                  className="text-[color:var(--color-muted)]"
                >
                  Calificación
                </Typography>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[color:var(--color-primary)] mb-2">
                  370+
                </div>
                <Typography
                  as="p"
                  variant="small"
                  className="text-[color:var(--color-muted)]"
                >
                  Clientes
                </Typography>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[color:var(--color-primary)] mb-2">
                  8+
                </div>
                <Typography
                  as="p"
                  variant="small"
                  className="text-[color:var(--color-muted)]"
                >
                  Años Exp.
                </Typography>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp delay-300">
              <Button
                variant="primary"
                size="lg"
                onClick={() => scrollToSection("#contacto")}
              >
                Agendar Cita
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => scrollToSection("#servicios")}
              >
                Ver Servicios
              </Button>
            </div>

            <div className="flex items-center gap-4 pt-4 animate-fadeInUp delay-400">
              <a
                href="https://www.instagram.com/marcelacorderobeauty/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-[color:var(--color-body)] hover:text-[color:var(--color-primary)] transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-[color:var(--color-primary)]/10 flex items-center justify-center group-hover:bg-[color:var(--color-primary)]/20 transition-colors">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <Typography
                    as="p"
                    variant="small"
                    className="text-[color:var(--color-muted)]"
                  >
                    Sígueme en
                  </Typography>
                  <Typography as="p" variant="p" className="font-medium">
                    @marcelacorderobeauty
                  </Typography>
                </div>
              </a>
            </div>
          </div>

          <div className="relative lg:order-last animate-scaleIn delay-500">
            <div className="absolute -inset-1 bg-[color:var(--color-primary)]/5 rounded-3xl blur-2xl" />

            <div className="relative aspect-[3/4] max-h-[600px] rounded-2xl overflow-hidden border border-[color:var(--color-border)] shadow-2xl">
              <Image
                src="/marcela-hero.jpg"
                alt="Marcela Cordero - Makeup Artist Profesional"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            <div className="hidden lg:block absolute -bottom-6 -right-6 bg-[color:var(--color-surface)] rounded-2xl p-6 shadow-xl border border-[color:var(--color-border)] animate-fadeIn delay-600">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[color:var(--color-primary)]/10 flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <Typography
                    as="p"
                    variant="p"
                    className="font-semibold text-[color:var(--color-heading)]"
                  >
                    Soft Glam
                  </Typography>
                  <Typography
                    as="p"
                    variant="small"
                    className="text-[color:var(--color-muted)]"
                  >
                    Especialidad de la casa
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
