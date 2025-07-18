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
    <section id='servicios' className='py-8 sm:py-12 section-bg-services relative overflow-hidden' ref={ref}>
      <div className='container mx-auto px-4 sm:px-6 lg:px-12 relative z-10'>
        {/* Header */}
        <motion.div
          className='text-center mb-6 sm:mb-8'
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-playfair text-heading mb-2 sm:mb-3'>
            Mis Servicios
          </h2>
          <p className='text-base sm:text-lg text-main max-w-2xl mx-auto mb-1'>
            Especialista en sociales, novias y publicidad. Servicios profesionales a domicilio y en locación.
          </p>
          <p className='text-sm text-main'>
            Toca cualquier servicio para agendar tu cita
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'
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
                window.open('https://marcelacorderomakeup.my.canva.site/', '_blank')
              }
              className={`relative p-4 sm:p-5 rounded-xl shadow-lg transition-all duration-300 ${
                service.popular
                  ? 'bg-gradient-to-br from-accent-secondary/15 to-accent-primary/10 border-2 border-accent-secondary'
                  : 'bg-white/90 border border-gray-200 hover:border-accent-primary/50 hover:bg-white shadow-md'
              }`}
            >
              {service.popular && (
                <div className='absolute -top-2 left-4 bg-accent-secondary text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium'>
                  Más Popular
                </div>
              )}

              <div>
                <h3 className='text-lg sm:text-xl font-playfair text-accent-secondary mb-2 text-center'>
                  {service.title}
                </h3>
                
                <ul className='space-y-1 mb-3'>
                  {service.features.map((feature, idx) => (
                    <li key={idx} className='flex items-start text-xs sm:text-sm text-main'>
                      <Check className='w-3 h-3 sm:w-4 sm:h-4 text-accent-secondary mr-2 mt-0.5 flex-shrink-0' />
                      <span className='leading-tight'>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className='text-xl sm:text-2xl font-bold text-accent-primary text-center'>
                  {service.price}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className='mt-6 sm:mt-8 text-center'
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.div
            className='bg-white/95 border border-gray-200 p-4 sm:p-6 rounded-xl shadow-lg'
            whileHover={{
              scale: 1.02,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            }}
            transition={{ duration: 0.3 }}
          >
            <h3 className='text-xl sm:text-2xl font-playfair mb-2 sm:mb-3 text-heading'>
              Atención a Domicilio y en Locación
            </h3>
            <p className='text-sm sm:text-lg mb-3 sm:mb-4 text-main'>
              Room Studio en Pueblo Libre o nos desplazamos hasta tu ubicación en Lima.
            </p>
            <div className='flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center text-sm sm:text-base text-main'>
              <div className='flex items-center'>
                <MapPin className='w-5 h-5 sm:w-6 sm:h-6 text-accent-primary mr-2' />
                <span>Movilidad incluida</span>
              </div>
              <div className='flex items-center'>
                <Clock className='w-5 h-5 sm:w-6 sm:h-6 text-accent-primary mr-2' />
                <span>Horarios flexibles</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
