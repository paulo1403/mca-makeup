'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';

export default function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState('todos');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const portfolioItems = [
    {
      id: 1,
      title: 'Maquillaje de Novia Clásico',
      category: 'novia',
      image: '/placeholder-bride-1.jpg',
      description: 'Look natural y elegante para ceremonia religiosa',
    },
    {
      id: 2,
      title: 'Sesión Editorial',
      category: 'editorial',
      image: '/placeholder-editorial-1.jpg',
      description: 'Maquillaje dramático para sesión de moda',
    },
    {
      id: 3,
      title: 'Maquillaje Social Elegante',
      category: 'social',
      image: '/placeholder-social-1.jpg',
      description: 'Look sofisticado para evento nocturno',
    },
    {
      id: 4,
      title: 'Novia Moderna',
      category: 'novia',
      image: '/placeholder-bride-2.jpg',
      description: 'Estilo contemporáneo con toques dorados',
    },
    {
      id: 5,
      title: 'Sesión de Estudio',
      category: 'editorial',
      image: '/placeholder-editorial-2.jpg',
      description: 'Maquillaje artístico para fotografía',
    },
    {
      id: 6,
      title: 'Graduación',
      category: 'social',
      image: '/placeholder-social-2.jpg',
      description: 'Look fresco y juvenil para celebración',
    },
  ];

  const filters = [
    { id: 'todos', label: 'Todos' },
    { id: 'novia', label: 'Novias' },
    { id: 'social', label: 'Social' },
    { id: 'editorial', label: 'Editorial' },
  ];

  const filteredItems =
    activeFilter === 'todos'
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeFilter);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <section id='portafolio' className='py-20 bg-gray-50' ref={ref}>
      <div className='container mx-auto px-6 lg:px-12'>
        {/* Header */}
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className='text-4xl lg:text-5xl font-playfair text-primary-dark mb-4'>
            Mi Portafolio
          </h2>
          <p className='text-xl text-neutral max-w-3xl mx-auto mb-8'>
            Cada trabajo es único y refleja la personalidad de mis clientas.
            Descubre algunos de mis trabajos más destacados.
          </p>

          {/* Filter Buttons */}
          <motion.div
            className='flex flex-wrap justify-center gap-4'
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {filters.map((filter) => (
              <motion.button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeFilter === filter.id
                    ? 'bg-primary-accent text-white shadow-lg'
                    : 'bg-white text-neutral hover:bg-primary-accent hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {filter.label}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
          variants={containerVariants}
          initial='hidden'
          animate={isInView ? 'visible' : 'hidden'}
        >
          <AnimatePresence mode='wait'>
            {filteredItems.map((item, index) => (
              <motion.div
                key={`${item.id}-${activeFilter}`}
                variants={itemVariants}
                initial='hidden'
                animate='visible'
                exit='hidden'
                transition={{ duration: 0.6, delay: index * 0.1 }}
                layout
                className='group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300'
                whileHover={{
                  y: -10,
                  boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                }}
              >
                {/* Image */}
                <div className='relative h-64 overflow-hidden'>
                  <div className='absolute inset-0 bg-gradient-to-t from-primary-dark/50 to-transparent z-10'></div>
                  {/* Placeholder for portfolio image */}
                  <div className='absolute inset-0 bg-neutral-300 flex items-center justify-center'>
                    <span className='text-neutral text-sm'>
                      Portfolio Image
                    </span>
                  </div>

                  {/* Overlay on hover */}
                  <motion.div
                    className='absolute inset-0 bg-primary-accent/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center'
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.button
                      className='bg-white text-primary-dark px-6 py-3 rounded-lg font-medium'
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Ver Detalles
                    </motion.button>
                  </motion.div>
                </div>

                {/* Content */}
                <div className='p-6'>
                  <h3 className='text-xl font-playfair text-primary-dark mb-2'>
                    {item.title}
                  </h3>
                  <p className='text-neutral'>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className='text-center mt-16'
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className='text-xl text-neutral mb-6'>
            ¿Te gusta lo que ves? Trabajemos juntas para crear tu look perfecto.
          </p>
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
          >
            Solicitar Cotización
          </motion.button>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center'
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {[
            { number: '200+', label: 'Clientas Felices' },
            { number: '150+', label: 'Bodas Realizadas' },
            { number: '5', label: 'Años de Experiencia' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className='bg-white p-6 rounded-xl shadow-md'
              whileHover={{
                y: -5,
                boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className='text-3xl font-bold text-primary-accent mb-2'
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                {stat.number}
              </motion.div>
              <div className='text-neutral'>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
