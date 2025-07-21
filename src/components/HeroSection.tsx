'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';

export default function HeroSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <section className='relative min-h-screen bg-white'>
      {/* Navigation - Minimalista */}
      <motion.nav
        className='relative z-50 flex justify-between items-center px-6 py-6 lg:px-12'
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className='text-xl font-playfair text-heading'
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          Marcela Cordero
        </motion.div>

        {/* Desktop Navigation */}
        <div className='hidden md:flex space-x-8'>
          <a href='#servicios' className='text-main hover:text-accent-primary transition-colors duration-200'>
            Servicios
          </a>
          <a href='https://marcelacorderomakeup.my.canva.site/' target='_blank' rel='noopener noreferrer' className='text-main hover:text-accent-primary transition-colors duration-200'>
            Portafolio
          </a>
          <a href='#sobre-mi' className='text-main hover:text-accent-primary transition-colors duration-200'>
            Sobre Mí
          </a>
          <a href='#contacto' className='text-main hover:text-accent-primary transition-colors duration-200'>
            Contacto
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className='md:hidden text-heading'
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className='w-6 h-6' />
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        className='absolute top-20 left-0 right-0 bg-white shadow-lg z-40 md:hidden'
        initial={false}
        animate={isMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: isMenuOpen ? 'auto' : 'none' }}
      >
        <div className='flex flex-col space-y-4 px-6 py-6'>
          <a href='#servicios' className='text-main hover:text-accent-primary transition-colors py-2' onClick={() => setIsMenuOpen(false)}>
            Servicios
          </a>
          <a href='https://marcelacorderomakeup.my.canva.site/' target='_blank' rel='noopener noreferrer' className='text-main hover:text-accent-primary transition-colors py-2' onClick={() => setIsMenuOpen(false)}>
            Portafolio
          </a>
          <a href='#sobre-mi' className='text-main hover:text-accent-primary transition-colors py-2' onClick={() => setIsMenuOpen(false)}>
            Sobre Mí
          </a>
          <a href='#contacto' className='text-main hover:text-accent-primary transition-colors py-2' onClick={() => setIsMenuOpen(false)}>
            Contacto
          </a>
        </div>
      </motion.div>

      {/* Hero Content - Minimalista y elegante */}
      <div className='flex items-center justify-center min-h-[80vh] px-6 lg:px-12'>
        <div className='text-center max-w-4xl mx-auto'>
          <motion.h1
            className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair text-heading mb-6 leading-tight'
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Marcela Cordero
          </motion.h1>
          
          <motion.p
            className='text-lg sm:text-xl md:text-2xl text-main mb-8 font-light leading-relaxed'
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Makeup Artist especializada en novias y eventos especiales
          </motion.p>

          <motion.div
            className='flex flex-col sm:flex-row gap-4 justify-center items-center'
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              className='bg-accent-primary text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-accent-primary/90 hover:shadow-lg'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open('https://wa.me/51989164990?text=Hola%2C%20me%20interesa%20agendar%20una%20cita%20de%20maquillaje', '_blank')}
            >
              Agendar Cita
            </motion.button>
            
            <motion.button
              className='border border-accent-secondary text-accent-secondary px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-accent-secondary hover:text-white'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open('https://marcelacorderomakeup.my.canva.site/', '_blank')}
            >
              Ver Portafolio
            </motion.button>
          </motion.div>

          {/* Información adicional minimalista */}
          <motion.div
            className='mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-main'
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span>Pueblo Libre, Lima</span>
            <span className='hidden sm:block'>•</span>
            <span>Servicio a domicilio</span>
            <span className='hidden sm:block'>•</span>
            <span>Horarios flexibles</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}