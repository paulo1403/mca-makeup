"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ImageIcon,
  ExternalLink,
  Sparkles,
  Heart,
  Users,
  Camera,
  MessageSquare,
} from "lucide-react";
import Typography from "./ui/Typography";
import Button from "./ui/Button";
import "@/styles/components/portfolio.css";

type PortfolioCategory = {
  title: string;
  description: string;
  count?: string;
  url?: string;
  icon?: React.ReactNode;
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
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cardVariants: any = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.5 },
    }),
  };

  return (
    <section
      id="portafolio"
      className="py-20 sm:py-28 section-bg-portfolio"
      ref={ref}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[color:var(--color-surface)]/80 border border-[color:var(--color-accent)]/10 mb-6">
            <ImageIcon className="w-4 h-4 text-[color:var(--color-primary)]" />
            <span className="text-sm font-semibold text-[color:var(--color-primary)]">
              Portafolio
            </span>
          </div>

          <Typography
            as="h2"
            variant="h2"
            className="section-title text-3xl sm:text-4xl font-bold text-[color:var(--color-heading)] mb-3"
          >
            Mi{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-accent)]">
              Arte
            </span>
          </Typography>

          <Typography
            as="p"
            variant="p"
            className="text-base text-[color:var(--color-body)] max-w-2xl mx-auto leading-relaxed mb-6"
          >
            Transformando miradas, realzando belleza natural
          </Typography>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
            <Button
              as="a"
              href="https://www.instagram.com/marcelacorderobeauty/"
              target="_blank"
              rel="noreferrer"
              variant="primary"
              size="md"
              className="inline-flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Ver Portafolio Completo
            </Button>

            <div className="flex items-center gap-2 text-sm text-[color:var(--color-body)] bg-[color:var(--color-surface)]/80 px-4 py-2 rounded-full border border-[color:var(--color-accent)]/10">
              <Sparkles className="w-4 h-4 text-[color:var(--color-accent)]" />
              <span>+370 clientes satisfechas</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {portfolioCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              className="group"
              custom={i}
              variants={cardVariants}
            >
              <div className="portfolio-card p-6 rounded-2xl h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-[color:var(--color-accent)]/10 text-[color:var(--color-primary)]">
                    {cat.icon}
                  </div>
                  <div className="portfolio-count text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-accent)]">
                    {cat.count}
                  </div>
                </div>

                <Typography
                  as="h3"
                  variant="h3"
                  className="portfolio-title text-xl font-bold text-[color:var(--color-heading)] mb-2"
                >
                  {cat.title}
                </Typography>

                <p className="portfolio-desc text-[color:var(--color-body)] mb-6 flex-grow">
                  {cat.description}
                </p>

                <div className="portfolio-meta mt-auto">
                  <Button
                    as="a"
                    href={cat.url}
                    target="_blank"
                    rel="noreferrer"
                    variant="secondary"
                    size="md"
                    className="w-full py-3 px-4 rounded-lg text-[color:var(--color-body)] font-medium"
                  >
                    Ver Galería
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center portfolio-quote max-w-3xl mx-auto rounded-2xl p-10 border border-[color:var(--color-accent)]/8"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-[color:var(--color-accent)] mb-4">
            <Heart className="w-8 h-8 mx-auto" />
          </div>

          <Typography
            as="blockquote"
            variant="p"
            className="text-xl sm:text-2xl font-light text-[color:var(--color-heading)] mb-4 italic"
          >
            &ldquo;Cada rostro es un lienzo único, cada cliente merece sentirse
            la más bella en su día especial&rdquo;
          </Typography>

          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-accent)]">
              MC
            </div>
            <div className="text-left">
              <p className="quote-author font-semibold text-[color:var(--color-heading)]">
                Marcela Cordero
              </p>
              <p className="text-sm text-[color:var(--color-body)]">
                Maquilladora Profesional
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[color:var(--color-accent)]/10">
            <p className="text-sm text-[color:var(--color-body)] mb-4">
              Conéctate con mi trabajo
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                as="a"
                href="https://www.instagram.com/marcelacorderobeauty/"
                target="_blank"
                rel="noreferrer"
                variant="soft"
                size="sm"
                className="px-5 py-2 rounded-full inline-flex items-center"
              >
                {" "}
                <Camera className="w-4 h-4 inline-block mr-2" /> Instagram
              </Button>
              <Button
                as="a"
                href="https://wa.me/51999999999"
                target="_blank"
                rel="noreferrer"
                variant="whatsapp"
                size="sm"
                className="px-5 py-2 rounded-full inline-flex items-center"
              >
                {" "}
                <MessageSquare className="w-4 h-4 inline-block mr-2" /> WhatsApp
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
