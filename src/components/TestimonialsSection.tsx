"use client";

import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import Button from "./ui/Button";
import Typography from "./ui/Typography";
import "@/styles/components/testimonials-minimal.css";

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
  { id: "all", name: "Todos" },
  { id: "novia", name: "Novias" },
  { id: "social", name: "Eventos Sociales" },
  { id: "gala", name: "Gala" },
  { id: "madura", name: "Piel Madura" },
];

export default function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>(fallbackTestimonials);
  const [filteredItems, setFilteredItems] =
    useState<Testimonial[]>(fallbackTestimonials);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState("all");
  const timerRef = useRef<number | null>(null);

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
              ? new Date(r.appointment?.appointmentDate!)
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
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(
      () => setIndex((i) => (i + 1) % filteredItems.length),
      6000
    );
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [filteredItems.length]);

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

  return (
    <section
      id="testimonials"
      className="py-16 sm:py-24 bg-[color:var(--color-background)]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16 testimonials-header">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[color:var(--color-primary)]/10 border border-[color:var(--color-primary)]/20 mb-6">
            <span className="text-sm font-medium text-[color:var(--color-primary)]">
              Testimonios
            </span>
          </div>

          <Typography
            as="h2"
            variant="h2"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[color:var(--color-heading)] mb-4"
          >
            Experiencias que Inspiran
          </Typography>

          <Typography
            as="p"
            variant="p"
            className="text-base sm:text-lg text-[color:var(--color-body)] max-w-2xl mx-auto leading-relaxed"
          >
            Más de 370 clientas confían en mi arte para sus momentos más
            especiales
          </Typography>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12 testimonials-filters">
          {serviceCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedService(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedService === category.id
                  ? "bg-[color:var(--color-primary)] text-white"
                  : "bg-[color:var(--color-surface)] text-[color:var(--color-body)] border border-[color:var(--color-border)] hover:border-[color:var(--color-primary)]/30"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="relative max-w-4xl mx-auto mb-12">
          {loading ? (
            <div className="p-8 sm:p-12 bg-[color:var(--color-surface)] rounded-2xl border border-[color:var(--color-border)] animate-pulse">
              <div className="w-16 h-16 bg-[color:var(--color-border)] rounded-full mx-auto mb-6" />
              <div className="h-4 bg-[color:var(--color-border)] rounded w-32 mx-auto mb-6" />
              <div className="space-y-3">
                <div className="h-4 bg-[color:var(--color-border)] rounded w-3/4 mx-auto" />
                <div className="h-4 bg-[color:var(--color-border)] rounded w-2/3 mx-auto" />
              </div>
            </div>
          ) : (
            filteredItems.length > 0 && (
              <div className="testimonial-item">
                <div className="p-8 sm:p-12 bg-[color:var(--color-surface)] rounded-2xl border border-[color:var(--color-border)]">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-[color:var(--color-primary)] flex items-center justify-center text-white font-bold text-xl">
                      {filteredItems[index].initials}
                    </div>
                  </div>

                  <div className="flex justify-center mb-4">
                    {[...Array(filteredItems[index].rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-[color:var(--color-primary)] fill-current"
                      />
                    ))}
                  </div>

                  <Typography
                    as="blockquote"
                    variant="p"
                    className="text-lg sm:text-xl text-[color:var(--color-heading)] text-center mb-6 leading-relaxed italic"
                  >
                    &ldquo;{filteredItems[index].text}&rdquo;
                  </Typography>

                  <div className="text-center">
                    <Typography
                      as="p"
                      variant="p"
                      className="font-semibold text-[color:var(--color-heading)] mb-1"
                    >
                      {filteredItems[index].name}
                    </Typography>
                    <Typography
                      as="p"
                      variant="small"
                      className="text-[color:var(--color-muted)]"
                    >
                      {filteredItems[index].service} •{" "}
                      {filteredItems[index].date}
                    </Typography>
                  </div>
                </div>

                {filteredItems.length > 1 && (
                  <div className="flex justify-between items-center mt-8">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        setIndex(
                          (i) =>
                            (i - 1 + filteredItems.length) %
                            filteredItems.length
                        )
                      }
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>

                    <div className="flex gap-2">
                      {filteredItems.slice(0, 5).map((_, i) => (
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
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        setIndex((i) => (i + 1) % filteredItems.length)
                      }
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            )
          )}
        </div>

        <div className="text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() =>
              window.open(
                "https://www.instagram.com/marcelacorderobeauty/",
                "_blank"
              )
            }
          >
            Ver más reseñas en Instagram
          </Button>
        </div>
      </div>
    </section>
  );
}
