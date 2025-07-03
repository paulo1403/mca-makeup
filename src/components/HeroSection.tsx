'use client';

import { useState } from 'react';

export default function HeroSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <section className='relative min-h-screen bg-primary-dark text-white overflow-hidden'>
      {/* Navigation */}
      <nav className='relative z-50 flex justify-between items-center px-6 py-4 lg:px-12'>
        <div className='text-2xl font-playfair font-bold'>Marcela Cordero</div>

        {/* Desktop Menu */}
        <div className='hidden md:flex space-x-8'>
          <a
            href='#servicios'
            className='hover:text-primary-accent transition-colors'
          >
            Servicios
          </a>
          <a
            href='#portafolio'
            className='hover:text-primary-accent transition-colors'
          >
            Portafolio
          </a>
          <a
            href='#sobre-mi'
            className='hover:text-primary-accent transition-colors'
          >
            Sobre Mí
          </a>
          <a
            href='#contacto'
            className='hover:text-primary-accent transition-colors'
          >
            Contacto
          </a>
        </div>

        <button
          className='btn-primary hidden md:block'
          onClick={() =>
            document
              .getElementById('contacto')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          Agendar Cita
        </button>

        {/* Mobile Menu Button */}
        <button
          className='md:hidden text-white'
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 6h16M4 12h16M4 18h16'
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`absolute top-16 left-0 right-0 bg-primary-dark z-40 md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className='flex flex-col space-y-4 px-6 py-6 bg-primary-dark/95 backdrop-blur-sm border-t border-primary-accent/20'>
          <a
            href='#servicios'
            className='hover:text-primary-accent transition-colors duration-200 py-2'
            onClick={() => setIsMenuOpen(false)}
          >
            Servicios
          </a>
          <a
            href='#portafolio'
            className='hover:text-primary-accent transition-colors duration-200 py-2'
            onClick={() => setIsMenuOpen(false)}
          >
            Portafolio
          </a>
          <a
            href='#sobre-mi'
            className='hover:text-primary-accent transition-colors duration-200 py-2'
            onClick={() => setIsMenuOpen(false)}
          >
            Sobre Mí
          </a>
          <a
            href='#contacto'
            className='hover:text-primary-accent transition-colors duration-200 py-2'
            onClick={() => setIsMenuOpen(false)}
          >
            Contacto
          </a>
          <button
            className='btn-primary w-full mt-4'
            onClick={() => {
              setIsMenuOpen(false);
              document
                .getElementById('contacto')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Agendar Cita
          </button>
        </div>
      </div>

      {/* Hero Content */}
      <div className='relative z-10 flex items-center min-h-screen'>
        <div className='container mx-auto px-6 lg:px-12'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            {/* Text Content */}
            <div className='space-y-6'>
              <h1 className='text-5xl lg:text-7xl font-playfair font-light leading-tight'>
                Belleza que
                <span className='text-primary-accent block font-artistic text-6xl lg:text-8xl'>
                  inspira
                </span>
              </h1>

              <p className='text-xl lg:text-2xl font-light text-gray-200 leading-relaxed'>
                Transformo tu belleza natural en arte. Especialista en
                maquillaje para bodas, eventos especiales y sesiones
                fotográficas profesionales.
              </p>

              <div className='flex flex-col sm:flex-row gap-4 pt-6'>
                <button
                  className='btn-primary text-lg px-8 py-4'
                  onClick={() =>
                    document
                      .getElementById('contacto')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  Reservar Cita
                </button>
                <button
                  className='btn-secondary text-lg px-8 py-4'
                  onClick={() =>
                    document
                      .getElementById('portafolio')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  Ver Portafolio
                </button>
              </div>
            </div>

            {/* Image */}
            <div className='relative lg:order-first'>
              <div className='relative h-96 lg:h-[600px] rounded-lg overflow-hidden'>
                {/* Placeholder for hero image */}
                <div className='hero-gradient absolute inset-0 z-10'></div>
                <div className='absolute inset-0 bg-neutral-600 flex items-center justify-center'>
                  <span className='text-white text-lg'>
                    Hero Image Placeholder
                  </span>
                </div>
              </div>

              {/* Floating Elements */}
              <div className='absolute -top-4 -right-4 bg-primary-accent text-primary-dark px-6 py-3 rounded-full font-medium shadow-lg'>
                +200 Clientes Satisfechas
              </div>

              <div className='absolute -bottom-4 -left-4 bg-white text-primary-dark px-6 py-3 rounded-full font-medium shadow-lg'>
                5 Años de Experiencia
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10'>
        <div className='animate-bounce'>
          <svg
            className='w-6 h-6 text-primary-accent'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 14l-7 7m0 0l-7-7m7 7V3'
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
