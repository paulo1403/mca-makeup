'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Heart, Award, Camera, Palette, Calendar, Sparkles } from 'lucide-react';

export default function AboutSection() {
  const achievements = [
    {
      icon: Award,
      title: 'Alumna Destacada',
      description: 'Graduada de MUS by Christian Matta con reconocimiento especial',
    },
    {
      icon: Camera,
      title: 'Desde 2017',
      description: 'Experiencia en salón, producciones y servicio independiente',
    },
    {
      icon: Palette,
      title: 'Capacitación Continua',
      description: 'Masterclasses con maquilladores internacionales reconocidos',
    },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section 
      id='sobre-mi' 
      className='py-16 md:py-24 bg-gradient-to-b from-primary-dark via-secondary-dark to-primary-dark relative overflow-hidden' 
      ref={ref}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-accent/5 via-transparent to-transparent" />
      <div className="absolute top-20 left-10 text-primary-accent/10">
        <Sparkles className="w-12 h-12" />
      </div>
      <div className="absolute bottom-20 right-10 text-primary-accent/10">
        <Heart className="w-10 h-10" />
      </div>

      <div className='container mx-auto px-4 md:px-6 relative z-10 max-w-7xl'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center'>
          {/* Content Side - Now First */}
          <motion.div
            className='space-y-6 sm:space-y-8 order-1'
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            {/* Header with elegant styling */}
            <motion.div
              className='relative'
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className='flex items-center mb-4'>
                <div className='w-12 h-px bg-gradient-to-r from-primary-accent to-transparent mr-4'></div>
                <h2 className='text-3xl sm:text-4xl lg:text-5xl font-playfair text-white'>
                  Sobre Mí
                </h2>
              </div>
              <h3 className='text-2xl sm:text-3xl font-artistic text-primary-accent mb-6'>
                Marcela Cordero
              </h3>
            </motion.div>

            {/* Story Cards */}
            <motion.div
              className='space-y-4'
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6'>
                <div className='flex items-start space-x-4'>
                  <div className='bg-primary-accent/20 p-3 rounded-lg flex-shrink-0'>
                    <Heart className='w-6 h-6 text-primary-accent' />
                  </div>
                  <div>
                    <h4 className='text-lg font-playfair text-white mb-2'>Mi Pasión</h4>
                    <p className='text-neutral-light leading-relaxed'>
                      Conocí el mundo del maquillaje en el 2016 y empecé a hacer mis primeros 
                      trabajos en el 2017. He tenido la oportunidad de trabajar en salón, 
                      para producciones y como maquilladora independiente.
                    </p>
                  </div>
                </div>
              </div>

              <div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6'>
                <div className='flex items-start space-x-4'>
                  <div className='bg-primary-accent/20 p-3 rounded-lg flex-shrink-0'>
                    <Award className='w-6 h-6 text-primary-accent' />
                  </div>
                  <div>
                    <h4 className='text-lg font-playfair text-white mb-2'>Mi Formación</h4>
                    <p className='text-neutral-light leading-relaxed'>
                      Estudié la carrera de Maquillaje profesional en MUS by Christian Matta 
                      para seguir puliendo mi técnica y de la cual me gradué como alumna destacada. 
                      Además, me capacito de manera continua asistiendo a Masterclasses de 
                      diferentes maquilladores internacionales.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              className='flex justify-start'
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.a
                href='#reservar'
                className='inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-accent to-secondary-accent text-white font-montserrat font-medium text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group'
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 15px 35px rgba(99, 102, 241, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Calendar className='w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300' />
                Reservar Cita
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Image Side - Now Second */}
          <motion.div
            className='relative order-2 px-4 sm:px-0'
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div
              className='relative h-80 sm:h-96 lg:h-[500px] rounded-2xl overflow-hidden mx-auto max-w-md lg:max-w-none mb-8 sm:mb-0'
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              {/* Placeholder for about image */}
              <div className='absolute inset-0 bg-gradient-to-br from-primary-accent/20 to-secondary-accent/20 flex items-center justify-center'>
                <div className='text-center'>
                  <Camera className='w-16 h-16 text-white/60 mx-auto mb-4' />
                  <span className='text-white/80 text-lg font-playfair'>
                    Foto Profesional de Marcela
                  </span>
                </div>
              </div>
              <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent'></div>
            </motion.div>

            {/* Floating Quote - Redesigned */}
            <motion.div
              className='absolute -bottom-2 left-2 sm:-bottom-4 sm:-left-4 bg-white/10 backdrop-blur-md border border-white/20 text-white p-4 sm:p-6 rounded-xl shadow-lg max-w-[260px] sm:max-w-[280px] z-10'
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={
                isInView
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 20, scale: 0.8 }
              }
              transition={{ duration: 0.8, delay: 0.7 }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 15px 35px rgba(255, 255, 255, 0.1)',
              }}
              style={{
                // Ensure it doesn't overflow on mobile
                left: 'max(8px, -1rem)',
                bottom: 'max(8px, -1rem)'
              }}
            >
              <div className="text-center">
                <Sparkles className='w-6 h-6 text-primary-accent mx-auto mb-2' />
                <p className='font-playfair text-sm italic font-medium text-white leading-relaxed mb-2'>
                  &ldquo;La belleza comienza en el momento en que decides ser tú misma&rdquo;
                </p>
                <p className='font-montserrat text-xs text-neutral-light font-light'>
                  - Coco Chanel
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Achievements - Simplified and Elegant */}
        <motion.div
          className='mt-16 lg:mt-20'
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className='text-center mb-12'>
            <div className='flex items-center justify-center mb-4'>
              <div className='w-12 h-px bg-gradient-to-r from-transparent via-primary-accent to-transparent'></div>
              <Sparkles className='w-6 h-6 text-primary-accent mx-4' />
              <div className='w-12 h-px bg-gradient-to-r from-transparent via-primary-accent to-transparent'></div>
            </div>
            <h3 className='text-2xl sm:text-3xl font-playfair text-white'>
              Logros y Certificaciones
            </h3>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className='text-center p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 group'
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                whileHover={{
                  y: -5,
                  boxShadow: '0 15px 35px rgba(255,255,255,0.1)',
                }}
              >
                <motion.div
                  className='text-primary-accent mb-4 flex justify-center'
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <achievement.icon className="w-8 h-8" />
                </motion.div>
                <h4 className='text-lg font-playfair text-white mb-3 group-hover:text-primary-accent transition-colors duration-300'>
                  {achievement.title}
                </h4>
                <p className='text-neutral-light text-sm leading-relaxed'>
                  {achievement.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
