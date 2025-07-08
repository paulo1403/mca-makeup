'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'María González',
      role: 'Novia',
      image: '/placeholder-client-1.jpg',
      text: 'Marcela hizo que me sintiera como una princesa en mi boda. Su profesionalismo y talento son increíbles. El maquillaje duró perfecto todo el día y todas las fotos quedaron hermosas.',
      rating: 5,
      event: 'Boda - Julio 2024',
    },
    {
      name: 'Ana Rodríguez',
      role: 'Modelo',
      image: '/placeholder-client-2.jpg',
      text: 'Trabajo frecuentemente con Marcela para mis sesiones fotográficas. Siempre logra looks increíbles que resaltan perfecto en cámara. Es una verdadera artista.',
      rating: 5,
      event: 'Sesión Editorial - Marzo 2024',
    },
    {
      name: 'Carmen López',
      role: 'Madrina',
      image: '/placeholder-client-3.jpg',
      text: 'Como madrina de boda, quería verme elegante pero no opacar a la novia. Marcela logró el equilibrio perfecto. Me sentí hermosa y apropiada para la ocasión.',
      rating: 5,
      event: 'Boda - Septiembre 2024',
    },
    {
      name: 'Sofía Martín',
      role: 'Quinceañera',
      image: '/placeholder-client-4.jpg',
      text: 'Mi quinceañera fue perfecta gracias a Marcela. Entendió exactamente lo que quería y me hizo sentir como una reina. ¡Todas mis amigas quedaron impresionadas!',
      rating: 5,
      event: 'Quinceañera - Febrero 2024',
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial(
      currentTestimonial === testimonials.length - 1
        ? 0
        : currentTestimonial + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      currentTestimonial === 0
        ? testimonials.length - 1
        : currentTestimonial - 1
    );
  };

  return (
    <section className='py-20 bg-primary-dark text-white'>
      <div className='container mx-auto px-6 lg:px-12'>
        {/* Header */}
        <div className='text-center mb-16'>
          <h2 className='text-4xl lg:text-5xl font-playfair mb-4'>
            Lo que Dicen Mis Clientas
          </h2>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
            La satisfacción de mis clientas es mi mayor recompensa. Lee algunas
            de sus experiencias trabajando conmigo.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className='relative max-w-4xl mx-auto'>
          <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-8 lg:p-12'>
            <div className='flex flex-col lg:flex-row items-center gap-8'>
              {/* Client Photo */}
              <div className='flex-shrink-0'>
                <div className='w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-primary-accent'>
                  {/* Placeholder for client photo */}
                  <div className='w-full h-full bg-neutral-400 flex items-center justify-center'>
                    <span className='text-neutral text-xs'>Foto</span>
                  </div>
                </div>
              </div>

              {/* Testimonial Content */}
              <div className='flex-1 text-center lg:text-left'>
                {/* Stars */}
                <div className='flex justify-center lg:justify-start mb-4'>
                  {[...Array(testimonials[currentTestimonial].rating)].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className='w-6 h-6 text-primary-accent'
                        fill='currentColor'
                      />
                    )
                  )}
                </div>

                {/* Quote */}
                <blockquote className='text-lg lg:text-xl italic mb-6 leading-relaxed'>
                  &ldquo;{testimonials[currentTestimonial].text}&rdquo;
                </blockquote>

                {/* Client Info */}
                <div>
                  <div className='font-playfair text-xl font-semibold text-primary-accent'>
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className='text-gray-300'>
                    {testimonials[currentTestimonial].role} •{' '}
                    {testimonials[currentTestimonial].event}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-primary-accent hover:bg-opacity-80 text-white p-2 rounded-full transition-colors'
          >
            <ChevronLeft className='w-6 h-6' />
          </button>

          <button
            onClick={nextTestimonial}
            className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary-accent hover:bg-opacity-80 text-white p-2 rounded-full transition-colors'
          >
            <ChevronRight className='w-6 h-6' />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className='flex justify-center mt-8 space-x-2'>
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentTestimonial
                  ? 'bg-primary-accent'
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Additional Testimonials Grid */}
        <div className='mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div key={index} className='bg-white/5 p-6 rounded-xl'>
              <div className='flex mb-3'>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className='w-4 h-4 text-primary-accent'
                    fill='currentColor'
                  />
                ))}
              </div>
              <p className='text-sm mb-4 italic'>
                &ldquo;{testimonial.text.substring(0, 100)}...&rdquo;
              </p>
              <div className='text-primary-accent font-medium text-sm'>
                {testimonial.name}
              </div>
              <div className='text-gray-400 text-xs'>{testimonial.event}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
