'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, ChevronDown, CheckCircle, MessageCircle, Palette } from 'lucide-react';

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
    <section className='relative min-h-[100dvh] bg-primary-dark text-white overflow-hidden'>
      {/* Navigation */}
      <motion.nav
        className='relative z-50 flex justify-between items-center px-4 py-2 sm:px-6 sm:py-3 lg:px-12'
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.div
          className='text-xl sm:text-2xl font-playfair font-bold'
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          Marcela Cordero
        </motion.div>

        {/* Desktop Menu */}
        <div className='hidden md:flex space-x-6 lg:space-x-8'>
          <a
            href='#servicios'
            className='hover:text-primary-accent transition-colors text-sm lg:text-base'
          >
            Servicios
          </a>
          <a
            href='https://marcelacorderomakeup.my.canva.site/'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-primary-accent transition-colors text-sm lg:text-base'
          >
            Portafolio
          </a>
          <a
            href='#sobre-mi'
            className='hover:text-primary-accent transition-colors text-sm lg:text-base'
          >
            Sobre Mí
          </a>
          <a
            href='#contacto'
            className='hover:text-primary-accent transition-colors text-sm lg:text-base'
          >
            Contacto
          </a>
        </div>

        <button
          className='btn-primary hidden md:block text-sm lg:text-base px-3 lg:px-4 py-2'
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
          <Menu className='w-6 h-6' />
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
            href='https://marcelacorderomakeup.my.canva.site/'
            target='_blank'
            rel='noopener noreferrer'
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
        </div>
      </motion.div>

      {/* Hero Content */}
      <motion.div
        className='relative z-10 min-h-[100dvh] pb-4 pt-12 md:pt-0 md:pb-6 flex flex-col justify-between'
        variants={containerVariants}
        initial='hidden'
        animate='visible'
      >
        {/* Main Content */}
        <div className='flex-1 flex items-center'>
          <div className='container mx-auto px-4 sm:px-6 lg:px-12'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 items-center'>
              {/* Text Content */}
              <motion.div className='space-y-2 sm:space-y-3 lg:space-y-4 text-center lg:text-left' variants={itemVariants}>
                <motion.h1
                  className='text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-playfair font-light leading-tight'
                  variants={itemVariants}
                >
                  Belleza que
                  <motion.span
                    className='text-primary-accent block font-artistic text-4xl sm:text-5xl md:text-6xl lg:text-8xl mt-1'
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.05,
                      textShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    inspira
                  </motion.span>
                </motion.h1>

                <motion.p
                  className='text-base sm:text-lg md:text-xl lg:text-2xl font-light text-gray-200 leading-relaxed max-w-2xl mx-auto lg:mx-0'
                  variants={itemVariants}
                >
                  Especialista en sociales, novias y publicidad. Atención profesional 
                  a domicilio y en locación en Lima.
                </motion.p>

                {/* Trust Indicators for Peruvian Market */}
                <motion.div
                  className='flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 text-sm text-gray-300'
                  variants={itemVariants}
                >
                  <div className='flex items-center gap-2'>
                    <CheckCircle className='w-4 h-4 text-primary-accent' />
                    Room Studio Pueblo Libre
                  </div>
                  <div className='flex items-center gap-2'>
                    <CheckCircle className='w-4 h-4 text-primary-accent' />
                    Servicio a domicilio
                  </div>
                </motion.div>

                <motion.div
                  className='flex flex-row gap-3 pt-3 sm:pt-4 justify-center lg:justify-start'
                  variants={itemVariants}
                >
                  <motion.button
                    className='btn-primary text-sm sm:text-base px-5 sm:px-6 py-2 sm:py-3 flex-1 sm:flex-none'
                    onClick={() =>
                      document
                        .getElementById('contacto')
                        ?.scrollIntoView({ behavior: 'smooth' })
                    }
                    whileHover={{
                      scale: 1.02,
                      boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    Reservar Cita
                  </motion.button>
                  <motion.button
                    className='btn-secondary text-sm sm:text-base px-5 sm:px-6 py-2 sm:py-3 flex-1 sm:flex-none'
                    onClick={() =>
                      window.open('https://marcelacorderomakeup.my.canva.site/', '_blank')
                    }
                    whileHover={{
                      scale: 1.02,
                      boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    Ver Portafolio
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Image */}
              <motion.div
                className='relative order-first lg:order-last mt-2 lg:mt-0'
                variants={imageVariants}
              >
                <motion.div
                  className='relative h-56 sm:h-72 md:h-80 lg:h-[500px] rounded-lg overflow-hidden mx-auto max-w-sm sm:max-w-md lg:max-w-none'
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Placeholder for hero image */}
                  <div className='hero-gradient absolute inset-0 z-10'></div>
                  <div className='absolute inset-0 bg-gradient-to-br from-primary-accent/20 to-secondary-accent/30 flex items-center justify-center'>
                    <div className='text-center text-white'>
                      <Palette className='w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-2 mx-auto text-primary-accent' />
                      <span className='text-sm sm:text-base md:text-lg font-light'>
                        Imagen de Marcela
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Simplified Floating Element */}
                <motion.div
                  className='absolute -top-1 -right-1 sm:-top-3 sm:-right-3 bg-primary-accent text-primary-dark px-3 py-1 sm:px-4 sm:py-2 rounded-full font-medium shadow-lg z-20 text-xs sm:text-sm'
                  variants={floatingVariants}
                  whileHover={{
                    y: -2,
                    scale: 1.02,
                    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <span className='hidden sm:inline'>+200 Clientas</span>
                  <span className='sm:hidden'>+200</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Additional Content Section - Work highlights */}
        <motion.div 
          className='container mx-auto px-4 sm:px-6 lg:px-12 pb-16'
          variants={itemVariants}
        >
          {/* Work Highlights */}
          <motion.div
            className='grid grid-cols-3 gap-4 text-center'
            variants={itemVariants}
          >
            <div className='text-center'>
              <div className='text-lg sm:text-xl lg:text-2xl font-bold text-primary-accent'>5+</div>
              <div className='text-xs sm:text-sm text-gray-300'>Años experiencia</div>
            </div>
            <div className='text-center'>
              <div className='text-lg sm:text-xl lg:text-2xl font-bold text-primary-accent'>200+</div>
              <div className='text-xs sm:text-sm text-gray-300'>Clientas felices</div>
            </div>
            <div className='text-center'>
              <div className='text-lg sm:text-xl lg:text-2xl font-bold text-primary-accent'>24/7</div>
              <div className='text-xs sm:text-sm text-gray-300'>Disponibilidad</div>
            </div>
          </motion.div>

          {/* Mobile CTA Section */}
          <motion.div
            className='mt-8 lg:hidden text-center'
            variants={itemVariants}
          >
            <motion.a
              href='https://wa.me/51999999999?text=Hola%20Marcela%2C%20me%20interesa%20agendar%20una%20cita%20para%20maquillaje'
              className='inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition-colors duration-200'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <MessageCircle className='w-5 h-5' />
              WhatsApp
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Mobile-Optimized Scroll Indicator */}
      <motion.div
        className='absolute bottom-6 sm:bottom-8 md:bottom-8 left-1/2 transform -translate-x-1/2 z-10'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className='flex flex-col items-center gap-1'
        >
          <span className='text-xs text-gray-400 hidden sm:block'>Desliza para ver más</span>
          <ChevronDown className='w-5 h-5 sm:w-6 sm:h-6 text-primary-accent' />
        </motion.div>
      </motion.div>
    </section>
  );
}
