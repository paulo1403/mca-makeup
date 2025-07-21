'use client';

import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Isabella Martínez',
    role: 'Novia',
    event: 'Boda Civil',
    text: 'Marcela transformó completamente mi look para mi boda. Su atención al detalle y profesionalismo son excepcionales. El maquillaje duró todo el día perfecto.',
    rating: 5,
    initials: 'IM'
  },
  {
    id: 2,
    name: 'Sofía García',
    role: 'Cliente',
    event: 'Fiesta de Gala',
    text: 'Increíble trabajo! Marcela entendió exactamente lo que quería y el resultado superó mis expectativas. Definitivamente la recomiendo.',
    rating: 5,
    initials: 'SG'
  },
  {
    id: 3,
    name: 'Camila López',
    role: 'Novia',
    event: 'Boda de Ensueño',
    text: 'El mejor maquillaje que he tenido! Marcela es una artista increíble, muy profesional y el resultado fue espectacular.',
    rating: 5,
    initials: 'CL'
  },
  {
    id: 4,
    name: 'Valentina Reyes',
    role: 'Cliente',
    event: 'Evento Corporativo',
    text: 'Trabajo impecable! Marcela tiene un talento natural y una técnica perfecta. Me sentí hermosa y segura todo el evento.',
    rating: 5,
    initials: 'VR'
  },
  {
    id: 5,
    name: 'Andrea Silva',
    role: 'Novia',
    event: 'Matrimonio',
    text: 'Marcela hizo que me sintiera como una princesa en mi día especial. Su talento y dedicación son únicos.',
    rating: 5,
    initials: 'AS'
  },
  {
    id: 6,
    name: 'Lucía Torres',
    role: 'Cliente',
    event: 'Quinceañero',
    text: 'Mi experiencia con Marcela fue increíble. Logró el look perfecto que siempre soñé para mi fiesta.',
    rating: 5,
    initials: 'LT'
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

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
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
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
                <Star key={i} className="w-5 h-5 text-accent-primary mx-0.5" fill="currentColor" />
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
                  {testimonials[currentIndex].role} • {testimonials[currentIndex].event}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Indicadores */}
        <div className="flex justify-center mb-16">
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-accent-primary'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
