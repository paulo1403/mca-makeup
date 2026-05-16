"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import Typography from "./ui/Typography";

export default function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>(fallbackTestimonials);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        if (!mounted) return;
        if (data?.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
          const list = data.reviews.slice(0, 6).map((r: ReviewShape) => ({
            id: r.id,
            name: r.reviewerName,
            text: r.reviewText || "Excelente servicio, muy recomendado!",
            rating: r.rating || 5,
            service: formatService(r.appointment?.services, r.appointment?.serviceType),
            initials: getInitials(r.reviewerName),
          }));
          setItems(list);
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

  const sliderItems = items.length > 1 ? [...items, ...items] : items;

  return (
    <section
      id="testimonials"
      className="testimonials-section py-16 sm:py-20 lg:py-24 bg-[color:var(--color-surface)]/20"
      style={{ scrollMarginTop: "120px" }}
    >
      <div className="container mx-auto px-5 sm:px-6 max-w-6xl">
        <div className="text-center mb-10 sm:mb-12">
          <Typography as="h2" variant="h2" className="text-[color:var(--color-heading)]">
            Testimonios
          </Typography>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-[14px] bg-[color:var(--color-surface)]/30 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="testimonial-marquee" aria-label="Carrusel de testimonios">
            <div
              className={`testimonial-track ${items.length <= 1 ? "testimonial-track-static" : ""}`}
            >
              {sliderItems.map((testimonial, index) => (
                <TestimonialCard
                  key={`${testimonial.id}-${index}`}
                  testimonial={testimonial}
                  compact={items.length > 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

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
  initials: string;
};

const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Isabella Martínez",
    text: "Marcela transformó completamente mi look para mi boda. Su atención al detalle y profesionalismo me hicieron lucir radiante.",
    rating: 5,
    service: "Maquillaje de Novia",
    initials: "IM",
  },
  {
    id: "2",
    name: "Camila López",
    text: "El maquillaje duró todo el día y las fotos quedaron espectaculares. ¡Recomendada al 100%!",
    rating: 5,
    service: "Maquillaje de Novia",
    initials: "CL",
  },
  {
    id: "3",
    name: "Sofía García",
    text: "Increíble trabajo para mi evento social: natural, elegante y perfecto para la cámara.",
    rating: 5,
    service: "Eventos Sociales",
    initials: "SG",
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

function formatService(services?: { name?: string; serviceName?: string }[], serviceType?: string) {
  if (!services || services.length === 0) return serviceType || "Servicio";
  return services.map((s) => s.name || s.serviceName).join(", ");
}

function TestimonialCard({
  testimonial,
  compact,
}: {
  testimonial: Testimonial;
  compact: boolean;
}) {
  return (
    <article
      className={`testimonial-slide rounded-[14px] bg-[color:var(--color-surface)]/50 px-5 py-4 sm:px-6 sm:py-5 ${compact ? "w-[290px] sm:w-[340px]" : "w-full max-w-xl mx-auto"
        }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-[color:var(--color-primary)]/20 flex items-center justify-center">
          <Typography
            as="span"
            variant="small"
            className="font-semibold text-[color:var(--color-primary)]"
          >
            {testimonial.initials}
          </Typography>
        </div>
        <div className="flex-1">
          <Typography
            as="h4"
            variant="h4"
            className="font-semibold text-[color:var(--color-heading)]"
          >
            {testimonial.name}
          </Typography>
          <div className="flex gap-1 mt-1">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 text-[color:var(--color-accent)] fill-current" />
            ))}
          </div>
        </div>
      </div>
      <Typography
        as="p"
        variant="small"
        className="testimonial-text text-[color:var(--color-body)] leading-relaxed"
      >
        {testimonial.text}
      </Typography>
      <Typography as="p" variant="small" className="mt-2 text-[color:var(--color-muted)]">
        {testimonial.service}
      </Typography>
    </article>
  );
}
