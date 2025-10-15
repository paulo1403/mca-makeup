"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Star,
  Quote,
  Calendar,
  Heart,
  ArrowLeft,
  ArrowRight,
  Grid,
  Sliders,
} from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Typography from "./ui/Typography";
import Button from "./ui/Button";
import "@/styles/components/testimonials.css";

type ReviewShape = {
  id: string;
  rating: number;
  reviewText?: string;
  reviewerName: string;
  appointment?: {
    serviceType?: string;
    appointmentDate?: string;
    services?: { name?: string; serviceName?: string }[];
  };
};

type Testimonial = {
  id: string;
  name: string;
  text: string;
  rating: number;
  service: string;
  date: string;
  initials: string;
  featured?: boolean;
};

const fallbackTestimonials: Testimonial[] = [
  {
    id: "novia-1",
    name: "Isabella Martínez",
    text: "Marcela transformó completamente mi look para mi boda. Su atención al detalle y profesionalismo me hicieron lucir radiante.",
    rating: 5,
    service: "Maquillaje de Novia",
    date: "Jun 2025",
    initials: "IM",
    featured: true,
  },
  {
    id: "novia-2",
    name: "Camila López",
    text: "El maquillaje duró todo el día y las fotos quedaron espectaculares. ¡Recomendada al 100% para novias exigentes!",
    rating: 5,
    service: "Maquillaje de Novia",
    date: "May 2025",
    initials: "CL",
    featured: true,
  },
  {
    id: "social-1",
    name: "Sofía García",
    text: "Increíble trabajo para mi evento social: natural, elegante y perfecto para la cámara.",
    rating: 5,
    service: "Maquillaje Social",
    date: "Jul 2025",
    initials: "SG",
    featured: true,
  },
  {
    id: "social-2",
    name: "Lucía Fernández",
    text: "Marcela supo adaptar el look a mi estilo y tipo de piel. Mucha confianza y profesionalismo.",
    rating: 5,
    service: "Maquillaje Social",
    date: "Apr 2025",
    initials: "LF",
  },
  {
    id: "gala-1",
    name: "Valentina Rojas",
    text: "Mi maquillaje para la gala fue sofisticado y duradero. Recibí muchos cumplidos durante la noche.",
    rating: 5,
    service: "Maquillaje de Gala",
    date: "Sep 2025",
    initials: "VR",
  },
  {
    id: "gala-2",
    name: "Alejandra Cruz",
    text: "Profesionalismo total: maquillaje impecable, atención personalizada y un resultado que superó mis expectativas.",
    rating: 5,
    service: "Maquillaje de Gala",
    date: "Aug 2025",
    initials: "AC",
  },
  {
    id: "madura-1",
    name: "Daniela Castro",
    text: "Como mujer de 50 años encontré un look natural y favorecedor. Marcela entendió mis necesidades y cuidó cada detalle.",
    rating: 5,
    service: "Maquillaje para Piel Madura",
    date: "Feb 2025",
    initials: "DC",
  },
  {
    id: "madura-2",
    name: "Patricia Gómez",
    text: "Resultados elegantes y modernos, con productos que respetaron mi piel. Muy recomendable para pieles maduras.",
    rating: 5,
    service: "Maquillaje para Piel Madura",
    date: "Jan 2025",
    initials: "PG",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatService(
  services?: { name?: string; serviceName?: string }[],
  serviceType?: string
) {
  if (!services || services.length === 0)
    return serviceType || "Servicio de maquillaje";
  return services.map((s) => s.name || s.serviceName).join(", ");
}

const serviceCategories = [
  { id: "all", name: "Todos", icon: Grid },
  { id: "novia", name: "Novias", icon: Heart },
  { id: "social", name: "Eventos Sociales", icon: Calendar },
  { id: "gala", name: "Gala", icon: Star },
  { id: "madura", name: "Piel Madura", icon: Star },
];

export default function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>(fallbackTestimonials);
  const [filteredItems, setFilteredItems] =
    useState<Testimonial[]>(fallbackTestimonials);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"carousel" | "grid">("carousel");
  const [selectedService, setSelectedService] = useState("all");
  const timerRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        if (!mounted) return;
        if (
          data?.success &&
          Array.isArray(data.reviews) &&
          data.reviews.length > 0
        ) {
          const list = data.reviews.map((r: ReviewShape) => ({
            id: r.id,
            name: r.reviewerName,
            text: r.reviewText || "Excelente servicio, muy recomendado!",
            rating: r.rating || 5,
            service: formatService(
              r.appointment?.services,
              r.appointment?.serviceType
            ),
            date: r.appointment?.appointmentDate
              ? new Date(r.appointment!.appointmentDate!)
                  .getFullYear()
                  .toString()
              : "2024",
            initials: getInitials(r.reviewerName),
          }));
          setItems(list);
          setFilteredItems(list);
        }
      } catch {
        // fallback
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (viewMode === "carousel") {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(
        () => setIndex((i) => (i + 1) % filteredItems.length),
        6000
      );
      return () => {
        if (timerRef.current) window.clearInterval(timerRef.current);
      };
    }
  }, [filteredItems.length, viewMode]);

  useEffect(() => {
    if (selectedService === "all") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) =>
        item.service.toLowerCase().includes(selectedService.toLowerCase())
      );
      setFilteredItems(filtered);
    }
    setIndex(0);
  }, [selectedService, items]);

  const featuredTestimonials = filteredItems.filter((item) => item.featured);
  // If user selected a specific service, prioritize featured items for the carousel.
  // If 'all' is selected, show all filtered items so "Todos" truly shows everything.
  const displayItems =
    viewMode === "carousel" &&
    selectedService !== "all" &&
    featuredTestimonials.length > 0
      ? featuredTestimonials
      : filteredItems;

  return (
    <section
      id="testimonials"
      className="py-16 sm:py-24 testimonials-section relative overflow-hidden"
      style={{ scrollMarginTop: '120px' }}
      ref={sectionRef}
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[color:var(--color-primary)]/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-[color:var(--color-accent)]/10 rounded-full filter blur-3xl"></div>

      <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--color-surface)]/80 border border-[color:var(--color-accent)]/20 mb-6">
            <Quote className="w-4 h-4 text-[color:var(--color-primary)]" />
            <span className="text-sm font-semibold text-[color:var(--color-primary)]">
              Testimonios
            </span>
          </div>

          <Typography
            as="h2"
            variant="h2"
            className="text-4xl sm:text-5xl font-bold text-[color:var(--color-heading)] mb-4"
          >
            Experiencias que Inspiran
          </Typography>

          <Typography
            as="p"
            variant="p"
            className="text-lg text-[color:var(--color-body)] max-w-2xl mx-auto"
          >
            Descubre por qué más de 370 clientas confían en mi arte para sus
            momentos más especiales
          </Typography>
        </motion.div>

        {/* Estadísticas rápidas */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="text-center p-4 rounded-xl bg-[color:var(--color-surface)]/50 border border-[color:var(--color-border)]/20">
            <div className="text-2xl sm:text-3xl font-bold text-[color:var(--color-primary)] mb-1">
              5.0
            </div>
            <div className="text-xs sm:text-sm text-[color:var(--color-body)]">
              Calificación
            </div>
          </div>
          <div className="text-center p-4 rounded-xl bg-[color:var(--color-surface)]/50 border border-[color:var(--color-border)]/20">
            <div className="text-2xl sm:text-3xl font-bold text-[color:var(--color-primary)] mb-1">
              370+
            </div>
            <div className="text-xs sm:text-sm text-[color:var(--color-body)]">
              Reseñas
            </div>
          </div>
          <div className="text-center p-4 rounded-xl bg-[color:var(--color-surface)]/50 border border-[color:var(--color-border)]/20">
            <div className="text-2xl sm:text-3xl font-bold text-[color:var(--color-primary)] mb-1">
              98%
            </div>
            <div className="text-xs sm:text-sm text-[color:var(--color-body)]">
              Satisfacción
            </div>
          </div>
          <div className="text-center p-4 rounded-xl bg-[color:var(--color-surface)]/50 border border-[color:var(--color-border)]/20">
            <div className="text-2xl sm:text-3xl font-bold text-[color:var(--color-primary)] mb-1">
              8+
            </div>
            <div className="text-xs sm:text-sm text-[color:var(--color-body)]">
              Años Exp.
            </div>
          </div>
        </motion.div>

        {/* Controles de vista y filtro */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex gap-2 p-1 bg-[color:var(--color-surface)]/50 rounded-lg border border-[color:var(--color-border)]/20">
            <button
              onClick={() => setViewMode("carousel")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === "carousel"
                  ? "bg-[color:var(--color-primary)] text-white"
                  : "text-[color:var(--color-body)] hover:text-[color:var(--color-heading)]"
              }`}
            >
              <Sliders className="w-4 h-4 inline mr-2" />
              Carrusel
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-[color:var(--color-primary)] text-white"
                  : "text-[color:var(--color-body)] hover:text-[color:var(--color-heading)]"
              }`}
            >
              <Grid className="w-4 h-4 inline mr-2" />
              Cuadrícula
            </button>
          </div>

          <div className="flex gap-2 flex-wrap justify-center">
            {serviceCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedService(category.id)}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-1 ${
                    selectedService === category.id
                      ? "bg-[color:var(--color-primary)] text-white"
                      : "bg-[color:var(--color-surface)]/50 text-[color:var(--color-body)] border border-[color:var(--color-border)]/20 hover:text-[color:var(--color-heading)]"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Vista Carrusel */}
        {viewMode === "carousel" && (
          <motion.div
            className="testimonials-container"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="testimonial-card"
                  >
                    <div className="animate-pulse">
                      <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-6"></div>
                      <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-6"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                        <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  displayItems.length > 0 && (
                    <motion.div
                      key={displayItems[index].id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.45 }}
                      className="testimonial-card max-w-4xl mx-auto"
                    >
                      <div className="relative">
                        <div className="absolute -top-4 -left-4 text-6xl text-[color:var(--color-primary)]/20">
                          <Quote />
                        </div>

                        <div className="flex justify-center mb-6">
                          <div className="testimonial-avatar-enhanced">
                            <span>{displayItems[index].initials}</span>
                          </div>
                        </div>

                        <div className="testimonial-stars mb-4">
                          {[...Array(displayItems[index].rating)].map(
                            (_, i) => (
                              <Star
                                key={i}
                                className="w-5 h-5 mx-0.5 text-[color:var(--color-accent)] fill-current"
                              />
                            )
                          )}
                        </div>

                        <div className="testimonial-quote mb-6 px-4">
                          <Typography
                            as="blockquote"
                            variant="p"
                            className="text-xl sm:text-2xl font-light text-[color:var(--color-heading)] leading-relaxed"
                          >
                            &ldquo;{displayItems[index].text}&rdquo;
                          </Typography>
                        </div>

                        <div className="flex flex-col items-center">
                          <Typography
                            as="div"
                            variant="h4"
                            className="text-xl font-semibold text-[color:var(--color-heading)] mb-1"
                          >
                            {displayItems[index].name}
                          </Typography>
                          <div className="testimonial-meta text-sm text-[color:var(--color-body)] flex items-center gap-2">
                            <span className="px-2 py-1 bg-[color:var(--color-surface)]/50 rounded-full text-xs">
                              {displayItems[index].service}
                            </span>
                            <span>•</span>
                            <span>{displayItems[index].date}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </AnimatePresence>

              {/* Controles de navegación */}
              {displayItems.length > 1 && (
                <div className="flex justify-between items-center mt-8">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setIndex(
                        (i) =>
                          (i - 1 + displayItems.length) % displayItems.length
                      )
                    }
                    className="rounded-full p-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>

                  <div className="flex gap-2">
                    {displayItems.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === index
                            ? "bg-[color:var(--color-primary)] w-8"
                            : "bg-[color:var(--color-border)]"
                        }`}
                      />
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setIndex((i) => (i + 1) % displayItems.length)
                    }
                    className="rounded-full p-2"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Vista Cuadrícula */}
        {viewMode === "grid" && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <AnimatePresence>
              {filteredItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="testimonial-card-grid p-6 rounded-xl bg-[color:var(--color-surface)]/50 border border-[color:var(--color-border)]/20 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="testimonial-avatar-small">
                      <span>{item.initials}</span>
                    </div>
                    <div className="flex">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-[color:var(--color-accent)] fill-current"
                        />
                      ))}
                    </div>
                  </div>

                  <blockquote className="text-[color:var(--color-heading)] mb-4 text-sm leading-relaxed">
                    &ldquo;{item.text}&rdquo;
                  </blockquote>

                  <div className="border-t border-[color:var(--color-border)]/20 pt-4">
                    <div className="font-semibold text-[color:var(--color-heading)] mb-1">
                      {item.name}
                    </div>
                    <div className="text-xs text-[color:var(--color-body)]">
                      {item.service} • {item.date}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Llamada a la acción */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() =>
              window.open(
                "https://www.instagram.com/marcelacorderobeauty/",
                "_blank"
              )
            }
            className="px-8 py-3 rounded-full"
          >
            Ver más reseñas en Instagram
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
