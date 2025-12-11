"use client";

import { ExternalLink, Heart, Sparkles, Users } from "lucide-react";
import type React from "react";
import Button from "./ui/Button";
import Typography from "./ui/Typography";
import "@/styles/components/portfolio.css";

type PortfolioCategory = {
  title: string;
  description: string;
  count: string;
  url: string;
  icon: React.ReactNode;
};

const portfolioCategories: PortfolioCategory[] = [
  {
    title: "Novias",
    description: "Maquillaje elegante y duradero para el día más especial",
    count: "120+",
    url: "https://marcelacorderomakeup.my.canva.site/#page-0",
    icon: <Heart className="w-5 h-5" />,
  },
  {
    title: "Eventos Sociales",
    description: "Looks sofisticados para celebraciones importantes",
    count: "200+",
    url: "https://marcelacorderomakeup.my.canva.site/#page-0",
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    title: "Piel Madura",
    description: "Maquillaje que realza la belleza natural en pieles maduras",
    count: "50+",
    url: "https://marcelacorderomakeup.my.canva.site/#page-2",
    icon: <Users className="w-5 h-5" />,
  },
];

export default function PortfolioSection() {
  return (
    <section
      id="portafolio"
      className="py-16 sm:py-24 bg-[color:var(--color-background)]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 portfolio-header">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[color:var(--color-primary)]/10 border border-[color:var(--color-primary)]/20 mb-6">
            <span className="text-sm font-medium text-[color:var(--color-primary)]">
              Portafolio
            </span>
          </div>

          <Typography
            as="h2"
            variant="h2"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[color:var(--color-heading)] mb-4"
          >
            Mi Arte
          </Typography>

          <Typography
            as="p"
            variant="p"
            className="text-base sm:text-lg text-[color:var(--color-body)] max-w-2xl mx-auto leading-relaxed mb-8"
          >
            Cada maquillaje cuenta una historia, cada rostro refleja mi pasión
            por realzar la belleza natural.
          </Typography>

          <Button
            as="a"
            href="https://www.instagram.com/marcelacorderobeauty/"
            target="_blank"
            rel="noreferrer"
            variant="primary"
            size="lg"
          >
            <ExternalLink className="w-4 h-4" />
            Ver Portafolio Completo
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {portfolioCategories.map((category) => (
            <article key={category.title} className="portfolio-card group">
              <div className="h-full p-6 sm:p-8 bg-[color:var(--color-surface)] rounded-2xl border border-[color:var(--color-border)] hover:border-[color:var(--color-primary)]/30 transition-colors">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-[color:var(--color-primary)]/10 flex items-center justify-center text-[color:var(--color-primary)]">
                    {category.icon}
                  </div>
                  <div className="text-3xl font-bold text-[color:var(--color-primary)]">
                    {category.count}
                  </div>
                </div>

                <Typography
                  as="h3"
                  variant="h3"
                  className="text-xl sm:text-2xl font-bold text-[color:var(--color-heading)] mb-3"
                >
                  {category.title}
                </Typography>

                <Typography
                  as="p"
                  variant="p"
                  className="text-[color:var(--color-body)] mb-6 leading-relaxed"
                >
                  {category.description}
                </Typography>

                <Button
                  as="a"
                  href={category.url}
                  target="_blank"
                  rel="noreferrer"
                  variant="secondary"
                  size="md"
                  className="w-full"
                >
                  Ver Galería
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="max-w-3xl mx-auto p-8 sm:p-12 rounded-2xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)] text-center portfolio-quote">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[color:var(--color-primary)]/10 flex items-center justify-center">
            <Heart className="w-8 h-8 text-[color:var(--color-primary)]" />
          </div>

          <Typography
            as="blockquote"
            variant="p"
            className="text-xl sm:text-2xl font-light text-[color:var(--color-heading)] mb-6 italic leading-relaxed"
          >
            &ldquo;Cada rostro es un lienzo único, cada cliente merece sentirse
            la más bella en su día especial&rdquo;
          </Typography>

          <div className="flex items-center justify-center gap-4 pt-6 border-t border-[color:var(--color-border)]">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold bg-[color:var(--color-primary)]">
              MC
            </div>
            <div className="text-left">
              <Typography
                as="p"
                variant="p"
                className="font-semibold text-[color:var(--color-heading)]"
              >
                Marcela Cordero
              </Typography>
              <Typography
                as="p"
                variant="small"
                className="text-[color:var(--color-muted)]"
              >
                Maquilladora Profesional
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
