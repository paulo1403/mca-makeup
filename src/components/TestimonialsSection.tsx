'use client';

import React, { useState, useEffect } from 'react';
import { Star, Quote, Heart, Sparkles, Palette } from 'lucide-react';
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
    <section
      id="testimonials"
      className="py-16 md:py-24 section-bg-testimonials relative overflow-hidden"
    >
      {/* Overlays difuminados */}
      <div className="section-overlay-top" />
      <div className="section-overlay-bottom" />
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-accent/5 via-transparent to-transparent" />
      <div className="absolute top-20 left-10 text-primary-accent/10">
        <Sparkles className="w-12 h-12" />
      </div>
      <div className="absolute bottom-20 right-10 text-primary-accent/10">
        <Heart className="w-10 h-10" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Palette className="w-6 h-6 text-primary-accent" />
            <span className="text-primary-accent text-sm font-medium tracking-wider uppercase">
              Testimonios
            </span>
            <Palette className="w-6 h-6 text-primary-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-4">
            Lo que Dicen mis{' '}
            <span className="text-primary-accent font-allura text-4xl md:text-5xl lg:text-6xl block md:inline">
              Clientas
            </span>
          </h2>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Testimonios reales de novias y clientas que confiaron en mi trabajo
            para sus momentos más especiales
          </p>
        </motion.div>

        {/* Featured Testimonial */}
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mb-12 md:mb-16"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-6 md:p-8 lg:p-10 border border-white/10 shadow-2xl">
            {/* Quote Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary-accent to-secondary-accent rounded-full flex items-center justify-center">
                <Quote className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
            </div>

            {/* Stars */}
            <div className="flex justify-center mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                >
                  <Star className="w-5 h-5 md:w-6 md:h-6 text-primary-accent mx-0.5" fill="currentColor" />
                </motion.div>
              ))}
            </div>

            {/* Testimonial Text */}
            <blockquote className="text-center text-base md:text-lg lg:text-xl text-white/90 italic mb-8 leading-relaxed max-w-3xl mx-auto">
              &ldquo;{testimonials[currentIndex].text}&rdquo;
            </blockquote>

            {/* Client Info */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary-accent to-secondary-accent rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm md:text-base">
                  {testimonials[currentIndex].initials}
                </span>
              </div>
              
              {/* Client Details */}
              <div className="text-center md:text-left">
                <div className="font-playfair text-lg md:text-xl font-semibold text-primary-accent">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-gray-300 text-sm md:text-base">
                  {testimonials[currentIndex].role} • {testimonials[currentIndex].event}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dots Indicator */}
        <div className="flex justify-center mb-12 md:mb-16">
          <div className="flex gap-2 p-2 bg-white/5 rounded-full backdrop-blur-md">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary-accent scale-110'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Additional Testimonials Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {testimonials.slice(0, 6).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-gradient-to-br from-white/8 to-white/4 backdrop-blur-md p-5 md:p-6 rounded-2xl border border-white/10 hover:border-primary-accent/30 transition-all duration-300"
            >
              {/* Mini Stars */}
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 md:w-4 md:h-4 text-primary-accent mr-1" fill="currentColor" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-white/80 text-xs md:text-sm mb-4 italic leading-relaxed">
                &ldquo;{testimonial.text.length > 120 
                  ? `${testimonial.text.substring(0, 120)}...` 
                  : testimonial.text}&rdquo;
              </p>

              {/* Client Info */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary-accent to-secondary-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs md:text-sm">
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <div className="text-primary-accent font-medium text-xs md:text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {testimonial.event}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
