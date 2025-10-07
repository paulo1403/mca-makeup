'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

export default function PortfolioSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const portfolioCategories = [
    {
      title: 'Novias',
      description: 'Maquillaje elegante y duradero para el día más especial',
      count: '120+',
      url: 'https://marcelacorderomakeup.my.canva.site/#page-0'
    },
    {
      title: 'Eventos Sociales',
      description: 'Looks sofisticados para celebraciones importantes',
      count: '200+',
      url: 'https://marcelacorderomakeup.my.canva.site/#page-0'
    },
    {
      title: 'Piel Madura',
      description: 'Maquillaje especializado que realza la belleza natural',
      count: '50+',
      url: 'https://marcelacorderomakeup.my.canva.site/#page-2'
    },
  ];

  return (
    <section id='portafolio' className='py-16 sm:py-20 section-bg-portfolio' ref={ref}>
      <div className='container mx-auto px-6 lg:px-12 max-w-6xl'>
        {/* Header minimalista */}
        <motion.div
          className='text-center mb-12 sm:mb-16'
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-3xl sm:text-4xl section-title text-heading mb-2'>
            Portafolio
          </h2>
          <p className='text-lg text-main max-w-2xl mx-auto leading-relaxed mb-4'>
            Mi Arte, Tus Momentos Inolvidables
          </p>
          <p className='text-base text-main max-w-2xl mx-auto leading-relaxed mb-6'>
            Descubre el poder de la transformación en cada mirada y sonrisa.
          </p>
          
          {/* Botón principal minimalista */}
          <motion.a
            href='https://www.instagram.com/marcelacorderobeauty/'
            target="_blank"
            rel="noopener noreferrer"
            className='inline-flex items-center px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg cta-portfolio'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Ver Portafolio Completo
            <ExternalLink className='w-5 h-5 ml-2' />
          </motion.a>
        </motion.div>

        {/* Categorías del portafolio */}
        <motion.div
          className='grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 mb-12 sm:mb-16'
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {portfolioCategories.map((category, index) => (
            <motion.div
              key={index}
              className='text-center'
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <div className='portfolio-card transition-all duration-300'>
                <div className={`portfolio-count text-accent-primary mb-3`}>{category.count}</div>
                <h3 className='portfolio-title text-heading mb-2'>{category.title}</h3>
                <p className='portfolio-desc text-sm leading-relaxed mb-4'>{category.description}</p>
                <div className='portfolio-meta'>
                  <a
                    href={category.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='btn-ghost-accent text-sm'
                  >
                    Ver Más
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Sección de testimonio visual */}
          <motion.div
            className='text-center portfolio-quote max-w-3xl mx-auto'
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
            <blockquote className='mb-4 leading-relaxed'>
              &ldquo;Cada cliente es única y merece sentirse especial en su día más importante&rdquo;
            </blockquote>
            <p className='quote-author mb-4'>— Marcela Cordero</p>
            <div className='mt-4 flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <motion.a
                href='https://www.instagram.com/marcelacorderobeauty/'
                target="_blank"
                rel="noopener noreferrer"
                className='btn-ghost-accent text-sm'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Explorar Galería
              </motion.a>
              <span className='social-proof text-xs'>Más de 370 clientes satisfechas</span>
            </div>
        </motion.div>
      </div>
    </section>
  );
}