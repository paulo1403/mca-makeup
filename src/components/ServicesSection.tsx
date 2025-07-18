'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Clock } from 'lucide-react';

export default function ServicesSection() {
  const services = [
    {
      title: 'Maquillaje de Novia',
      price: 'Desde S/ 480',
      features: [
        'Prueba previa incluida',
        'Maquillaje de larga duración',
        'Peinado profesional'
      ],
    },
    {
      title: 'Eventos Especiales',
      price: 'Desde S/ 200',
      features: [
        'Maquillaje natural o glamoroso',
        'Duración 1h30 - 2h',
        'Pestañas incluidas'
      ],
    },
    {
      title: 'Piel Madura',
      price: 'Desde S/ 230',
      features: [
        'Técnicas especializadas',
        'Acabado natural luminoso',
        'Cuidado personalizado'
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
    <section id='servicios' className='py-16 sm:py-20 section-bg-services' ref={ref}>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl'>
        {/* Header - Más minimalista */}
        <motion.div
          className='text-center mb-12 sm:mb-16'
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-3xl sm:text-4xl font-playfair text-heading mb-4'>
            Servicios
          </h2>
          <p className='text-lg text-main max-w-2xl mx-auto leading-relaxed'>
            Especialista en maquillaje para novias y eventos especiales
          </p>
        </motion.div>

        {/* Services Grid - Diseño más limpio y minimalista */}
        <motion.div
          className='grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12'
          variants={containerVariants}
          initial='hidden'
          animate={isInView ? 'visible' : 'hidden'}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className='text-center group cursor-pointer'
              onClick={() =>
                window.open('https://marcelacorderomakeup.my.canva.site/', '_blank')
              }
            >
              <div className='bg-white border border-gray-100 p-8 rounded-lg transition-all duration-300 hover:shadow-md hover:border-accent-primary/20'>
                <h3 className='text-xl font-playfair text-heading mb-4'>
                  {service.title}
                </h3>
                
                <div className='space-y-2 mb-6'>
                  {service.features.map((feature, idx) => (
                    <p key={idx} className='text-sm text-main leading-relaxed'>
                      {feature}
                    </p>
                  ))}
                </div>
                
                <div className='text-2xl font-light text-accent-primary'>
                  {service.price}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Information - Más minimalista */}
        <motion.div
          className='mt-16 sm:mt-20 text-center'
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className='bg-white border border-gray-100 p-8 rounded-lg max-w-2xl mx-auto'>
            <h3 className='text-xl font-playfair mb-4 text-heading'>
              Atención Personalizada
            </h3>
            <p className='text-main mb-6 leading-relaxed'>
              Servicios profesionales en nuestro estudio en Pueblo Libre o en la ubicación de tu preferencia
            </p>
            <div className='flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-main'>
              <div className='flex items-center'>
                <MapPin className='w-5 h-5 text-accent-primary mr-2' />
                <span>Movilidad incluida</span>
              </div>
              <div className='flex items-center'>
                <Clock className='w-5 h-5 text-accent-primary mr-2' />
                <span>Horarios flexibles</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
