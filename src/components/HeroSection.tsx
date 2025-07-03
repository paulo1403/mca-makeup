'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
    },
  };

  const floatingVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <section className='relative min-h-screen bg-primary-dark text-white overflow-hidden'>
      {/* Navigation */}
      <motion.nav
        className='relative z-50 flex justify-between items-center px-6 py-4 lg:px-12'
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.div
          className='text-2xl font-playfair font-bold'
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          Marcela Cordero
        </motion.div>

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
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        className={`absolute top-16 left-0 right-0 bg-primary-dark z-40 md:hidden`}
        initial={false}
        animate={isMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ pointerEvents: isMenuOpen ? 'auto' : 'none' }}
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
      </motion.div>

      {/* Hero Content */}
      <motion.div
        className='relative z-10 flex items-center min-h-screen'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        <div className='container mx-auto px-6 lg:px-12'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            {/* Text Content */}
            <motion.div className='space-y-6' variants={itemVariants}>
              <motion.h1
                className='text-5xl lg:text-7xl font-playfair font-light leading-tight'
                variants={itemVariants}
              >
                Belleza que
                <motion.span
                  className='text-primary-accent block font-artistic text-6xl lg:text-8xl'
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    textShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  inspira
                </motion.span>
              </motion.h1>

              <motion.p
                className='text-xl lg:text-2xl font-light text-gray-200 leading-relaxed'
                variants={itemVariants}
              >
                Transformo tu belleza natural en arte. Especialista en
                maquillaje para bodas, eventos especiales y sesiones
                fotográficas profesionales.
              </motion.p>

              <motion.div
                className='flex flex-col sm:flex-row gap-4 pt-6'
                variants={itemVariants}
              >
                <motion.button
                  className='btn-primary text-lg px-8 py-4'
                  onClick={() =>
                    document
                      .getElementById('contacto')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 10px 30px rgba(176, 101, 121, 0.4)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Reservar Cita
                </motion.button>
                <motion.button
                  className='btn-secondary text-lg px-8 py-4'
                  onClick={() =>
                    document
                      .getElementById('portafolio')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Ver Portafolio
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Image */}
            <motion.div
              className='relative lg:order-first'
              variants={imageVariants}
            >
              <motion.div
                className='relative h-96 lg:h-[600px] rounded-lg overflow-hidden'
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                {/* Placeholder for hero image */}
                <div className='hero-gradient absolute inset-0 z-10'></div>
                <div className='absolute inset-0 bg-neutral-600 flex items-center justify-center'>
                  <span className='text-white text-lg'>
                    Hero Image Placeholder
                  </span>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                className='absolute -top-4 -right-4 bg-primary-accent text-primary-dark px-6 py-3 rounded-full font-medium shadow-lg'
                variants={floatingVariants}
                whileHover={{
                  y: -5,
                  scale: 1.05,
                  boxShadow: '0 15px 35px rgba(212, 175, 55, 0.4)',
                }}
                transition={{ duration: 0.3 }}
              >
                +200 Clientes Satisfechas
              </motion.div>

              <motion.div
                className='absolute -bottom-4 -left-4 bg-white text-primary-dark px-6 py-3 rounded-full font-medium shadow-lg'
                variants={floatingVariants}
                whileHover={{
                  y: -5,
                  scale: 1.05,
                  boxShadow: '0 15px 35px rgba(255, 255, 255, 0.3)',
                }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                5 Años de Experiencia
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
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
        </motion.div>
      </motion.div>
    </section>
  );
}
