"use client";

import React, { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

interface Review {
  id: string;
  rating: number;
  reviewText: string;
  reviewerName: string;
  appointment: {
    serviceType: string;
    appointmentDate: string;
    services?: { name?: string; serviceName?: string }[];
  };
}

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  service: string;
  date: string;
  initials: string;
}

// Testimonios de respaldo en caso de que no haya reviews
const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Isabella Martínez",
    text: "Marcela transformó completamente mi look para mi boda. Su atención al detalle y profesionalismo son excepcionales. El maquillaje duró todo el día perfecto.",
    rating: 5,
    service: "Maquillaje de Novia",
    date: "2024",
    initials: "IM",
  },
  {
    id: "2",
    name: "Sofía García",
    text: "Increíble trabajo! Marcela entendió exactamente lo que quería y el resultado superó mis expectativas. Definitivamente la recomiendo.",
    rating: 5,
    service: "Maquillaje Social",
    date: "2024",
    initials: "SG",
  },
  {
    id: "3",
    name: "Camila López",
    text: "El mejor maquillaje que he tenido! Marcela es una artista increíble, muy profesional y el resultado fue espectacular.",
    rating: 5,
    service: "Maquillaje de Novia",
    date: "2024",
    initials: "CL",
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(fallbackTestimonials);
  const [loading, setLoading] = useState(true);

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getServiceName = (
    services: { name?: string; serviceName?: string }[] | undefined,
    serviceType: string,
  ): string => {
    if (services && Array.isArray(services) && services.length > 0) {
      return services
        .map((service) => service.name || service.serviceName)
        .join(", ");
    }
    return serviceType || "Servicio de maquillaje";
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        const data = await response.json();

        if (data.success && data.reviews && data.reviews.length > 0) {
          const formattedReviews: Testimonial[] = data.reviews.map(
            (review: Review) => ({
              id: review.id,
              name: review.reviewerName,
              text: review.reviewText || "Excelente servicio, muy recomendado!",
              rating: review.rating,
              service: getServiceName(
                review.appointment.services,
                review.appointment.serviceType,
              ),
              date: formatDate(review.appointment.appointmentDate),
              initials: getInitials(review.reviewerName),
            }),
          );

          setTestimonials(formattedReviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        // Mantener testimonios de respaldo en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }
    if (isRightSwipe) {
      setCurrentIndex(
        (prev) => (prev - 1 + testimonials.length) % testimonials.length,
      );
    }
  };

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header minimalista y compacto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-playfair text-heading">
            Lo que Dicen mis Clientas
          </h2>
        </motion.div>

        {/* Testimonial destacado */}
        {loading ? (
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-light-background p-8 md:p-12 rounded-xl text-center">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-6"></div>
                <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-6"></div>
                <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-8"></div>
                <div className="w-14 h-14 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto mb-16"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="bg-light-background p-8 md:p-12 rounded-xl text-center">
              {/* Quote icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-accent-primary rounded-full flex items-center justify-center">
                  <Quote className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-accent-primary mx-0.5"
                    fill="currentColor"
                  />
                ))}
              </div>

              {/* Testimonial text */}
              <blockquote className="text-xl md:text-2xl text-heading italic mb-8 leading-relaxed font-light">
                &ldquo;{testimonials[currentIndex].text}&rdquo;
              </blockquote>

              {/* Client info */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-accent-primary rounded-full flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-lg">
                    {testimonials[currentIndex].initials}
                  </span>
                </div>

                <div className="text-center">
                  <div className="font-playfair text-xl font-semibold text-heading">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-main">
                    {testimonials[currentIndex].service} •{" "}
                    {testimonials[currentIndex].date}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Indicadores */}
        <div className="flex justify-center mb-16">
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-accent-primary"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
