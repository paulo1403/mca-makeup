'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { ExternalLink, Eye, Heart } from 'lucide-react';

export default function PortfolioSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const portfolioHighlights = [
    {
      title: 'Novias',
      description: 'Looks únicos para el día más especial',
      category: 'bodas',
    },
    {
      title: 'Sociales',
      description: 'Elegancia para eventos y celebraciones',
      category: 'eventos',
    },
    {
      title: 'Publicidad',
      description: 'Maquillaje profesional para producciones',
      category: 'commercial',
    },
  ];

  return (
    <section id='portafolio' className='py-16 sm:py-20 bg-gray-50' ref={ref}>
      <div className='container mx-auto px-4 sm:px-6 lg:px-12'>
        {/* Header */}
        <motion.div
          className='text-center mb-12 sm:mb-16'
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-playfair text-primary-dark mb-4 sm:mb-6'>
            Mi Portafolio
          </h2>
          <p className='text-base sm:text-lg text-neutral max-w-2xl mx-auto mb-6'>
            Descubre mi trabajo y encuentra la inspiración para tu próximo look.
          </p>
          
          {/* Call to Action */}
          <motion.button
            onClick={() => window.open('https://marcelacorderomakeup.my.canva.site/', '_blank')}
            className='inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-primary-accent text-white font-medium text-base sm:text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300'
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 15px 35px rgba(212, 175, 55, 0.4)'
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Eye className='w-5 h-5 mr-2' />
            Ver Portafolio Completo
            <ExternalLink className='w-4 h-4 ml-2' />
          </motion.button>
        </motion.div>

        {/* Portfolio Highlights */}
        <motion.div
          className='grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12'
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {portfolioHighlights.map((item, index) => (
            <motion.div
              key={index}
              className='bg-white p-6 sm:p-8 rounded-xl shadow-lg text-center'
              whileHover={{
                y: -5,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
            >
              <div className='w-16 h-16 bg-primary-accent/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Heart className='w-8 h-8 text-primary-accent' />
              </div>
              <h3 className='text-xl sm:text-2xl font-playfair text-primary-dark mb-2'>
                {item.title}
              </h3>
              <p className='text-neutral text-sm sm:text-base'>
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Instagram Integration */}
        <motion.div
          className='bg-primary-dark text-white p-8 sm:p-12 rounded-2xl text-center'
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          whileHover={{
            scale: 1.02,
            boxShadow: '0 25px 50px rgba(28, 28, 28, 0.3)',
          }}
        >
          <h3 className='text-2xl sm:text-3xl font-playfair mb-4'>
            Sígueme en Instagram
          </h3>
          <p className='text-base sm:text-lg text-gray-300 mb-6 max-w-2xl mx-auto'>
            @marcelacorderomakeup - Mantente al día con mis últimos trabajos y tutoriales
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <motion.button
              onClick={() => window.open('https://instagram.com/marcelacorderomakeup', '_blank')}
              className='btn-primary px-6 py-3 text-base'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver en Instagram
            </motion.button>
            <motion.button
              onClick={() => window.open('https://marcelacorderomakeup.my.canva.site/', '_blank')}
              className='bg-white text-primary-dark px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Portafolio Completo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
