'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Clock, Check } from 'lucide-react';

export default function ServicesSection() {
  const services = [
    {
      title: 'Maquillaje de Novia',
      price: 'Desde S/ 480',
      features: [
        'Prueba previa incluida',
        'Maquillaje de larga duración',
        'Peinado profesional incluido'
      ],
      popular: true,
    },
    {
      title: 'Maquillaje Social',
      price: 'Desde S/ 200',
      features: [
        'Estilo natural o glam',
        'Duración 1h30 - 2h',
        'Pestañas postizas incluidas'
      ],
    },
    {
      title: 'Piel Madura',
      price: 'Desde S/ 230',
      features: [
        'Técnicas específicas',
        'Acabado natural luminoso',
        'Preparación especializada'
      ],
    },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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
    <section id='servicios' className='py-12 sm:py-16 bg-white' ref={ref}>
      <div className='container mx-auto px-4 sm:px-6 lg:px-12'>
        {/* Header */}
        <motion.div
          className='text-center mb-8 sm:mb-12'
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-playfair text-primary-dark mb-3 sm:mb-4'>
            Mis Servicios
          </h2>
          <p className='text-base sm:text-lg text-neutral max-w-2xl mx-auto mb-2'>
            Especialista en sociales, novias y publicidad. Servicios profesionales a domicilio y en locación.
          </p>
          <p className='text-sm text-neutral/70'>
            Toca cualquier servicio para agendar tu cita
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
          variants={containerVariants}
          initial='hidden'
          animate={isInView ? 'visible' : 'hidden'}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{
                y: -5,
                boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }}
              onClick={() =>
                document
                  .getElementById('contacto')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className={`relative p-5 sm:p-6 rounded-xl shadow-lg transition-all duration-300 ${
                service.popular
                  ? 'bg-gradient-to-br from-primary-accent/10 to-secondary-accent/10 border-2 border-primary-accent'
                  : 'bg-gray-50 border border-gray-200 hover:border-primary-accent/50'
              }`}
            >
              {service.popular && (
                <div className='absolute -top-2 left-4 bg-primary-accent text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium'>
                  Más Popular
                </div>
              )}

              <div>
                <h3 className='text-lg sm:text-xl font-playfair text-primary-dark mb-2 text-center'>
                  {service.title}
                </h3>
                
                <ul className='space-y-1 mb-3'>
                  {service.features.map((feature, idx) => (
                    <li key={idx} className='flex items-start text-xs sm:text-sm text-neutral'>
                      <Check className='w-3 h-3 sm:w-4 sm:h-4 text-primary-accent mr-2 mt-0.5 flex-shrink-0' />
                      <span className='leading-tight'>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className='text-xl sm:text-2xl font-bold text-secondary-accent text-center'>
                  {service.price}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className='mt-8 sm:mt-12 text-center'
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.div
            className='bg-primary-dark text-white p-6 sm:p-8 rounded-xl'
            whileHover={{
              scale: 1.02,
              boxShadow: '0 20px 40px rgba(28, 28, 28, 0.3)',
            }}
            transition={{ duration: 0.3 }}
          >
            <h3 className='text-xl sm:text-2xl font-playfair mb-3 sm:mb-4'>
              Atención a Domicilio y en Locación
            </h3>
            <p className='text-sm sm:text-lg mb-4 sm:mb-6'>
              Room Studio en Pueblo Libre o nos desplazamos hasta tu ubicación en Lima.
            </p>
            <div className='flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center text-sm sm:text-base'>
              <div className='flex items-center'>
                <MapPin className='w-5 h-5 sm:w-6 sm:h-6 text-primary-accent mr-2' />
                <span>Movilidad incluida</span>
              </div>
              <div className='flex items-center'>
                <Clock className='w-5 h-5 sm:w-6 sm:h-6 text-primary-accent mr-2' />
                <span>Horarios flexibles</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
