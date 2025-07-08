'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, MapPin, Clock } from 'lucide-react';

export default function ServicesSection() {
  const services = [
    {
      title: 'Maquillaje de Novia',
      description:
        'El día más importante de tu vida merece un look perfecto. Incluye prueba previa y retoque para la ceremonia.',
      price: 'Desde $150',
      features: [
        'Consulta personalizada',
        'Prueba de maquillaje',
        'Maquillaje del día',
        'Retoque incluido',
        'Productos de alta gama',
      ],
      popular: true,
    },
    {
      title: 'Maquillaje Social',
      description:
        'Para eventos especiales, fiestas, graduaciones y ocasiones que requieren un look elegante y sofisticado.',
      price: 'Desde $80',
      features: [
        'Maquillaje personalizado',
        'Duración 4-6 horas',
        'Productos profesionales',
        'Estilo según ocasión',
      ],
    },
    {
      title: 'Sesión Fotográfica',
      description:
        'Maquillaje especializado para fotografía profesional, editorial y sesiones de estudio.',
      price: 'Desde $100',
      features: [
        'Maquillaje HD',
        'Resistente a luces',
        'Retoque durante sesión',
        'Múltiples looks',
      ],
    },
    {
      title: 'Peinado Profesional',
      description:
        'Peinados elegantes que complementan perfectamente tu maquillaje para cualquier ocasión especial.',
      price: 'Desde $60',
      features: [
        'Peinado personalizado',
        'Productos profesionales',
        'Fijación duradera',
        'Accesorios incluidos',
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
    <section id='servicios' className='py-20 bg-white' ref={ref}>
      <div className='container mx-auto px-6 lg:px-12'>
        {/* Header */}
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className='text-4xl lg:text-5xl font-playfair text-primary-dark mb-4'>
            Mis Servicios
          </h2>
          <p className='text-xl text-neutral max-w-3xl mx-auto'>
            Cada servicio está diseñado para resaltar tu belleza natural y
            hacerte sentir segura y radiante en tu día especial.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 gap-8'
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
                y: -10,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              }}
              className={`relative p-8 rounded-xl shadow-lg ${
                service.popular
                  ? 'bg-gradient-to-br from-primary-accent/10 to-secondary-accent/10 border-2 border-primary-accent'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              {service.popular && (
                <div className='absolute -top-3 left-6 bg-primary-accent text-white px-4 py-1 rounded-full text-sm font-medium'>
                  Más Popular
                </div>
              )}

              <div className='mb-6'>
                <h3 className='text-2xl font-playfair text-primary-dark mb-2'>
                  {service.title}
                </h3>
                <p className='text-neutral mb-4'>{service.description}</p>
                <div className='text-3xl font-bold text-secondary-accent'>
                  {service.price}
                </div>
              </div>

              <ul className='space-y-3 mb-6'>
                {service.features.map((feature, idx) => (
                  <li key={idx} className='flex items-center text-neutral'>
                    <Check
                      className='w-5 h-5 text-primary-accent mr-3 flex-shrink-0'
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <motion.button
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  service.popular
                    ? 'btn-primary'
                    : 'bg-primary-dark text-white hover:bg-neutral'
                }`}
                onClick={() =>
                  document
                    .getElementById('contacto')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Solicitar Información
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className='mt-16 text-center'
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.div
            className='bg-primary-dark text-white p-8 rounded-xl'
            whileHover={{
              scale: 1.02,
              boxShadow: '0 25px 50px rgba(28, 28, 28, 0.3)',
            }}
            transition={{ duration: 0.3 }}
          >
            <h3 className='text-2xl font-playfair mb-4'>
              Servicios a Domicilio
            </h3>
            <p className='text-lg mb-6'>
              Me desplazo hasta tu ubicación para que disfrutes de la comodidad
              de tu hogar en tu día especial. Servicio disponible en toda la
              ciudad.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <div className='flex items-center'>
                <MapPin
                  className='w-6 h-6 text-primary-accent mr-2'
                />
                <span>Sin costo adicional</span>
              </div>
              <div className='flex items-center'>
                <Clock
                  className='w-6 h-6 text-primary-accent mr-2'
                />
                <span>Puntualidad garantizada</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
