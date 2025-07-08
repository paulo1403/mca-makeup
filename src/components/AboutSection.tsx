'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export default function AboutSection() {
  const achievements = [
    {
      icon: '🏆',
      title: 'Certificación Internacional',
      description:
        'Certificada en técnicas de maquillaje profesional por la Academia Internacional de Belleza',
    },
    {
      icon: '✨',
      title: 'Especialización en Novias',
      description:
        'Más de 150 novias han confiado en mí para el día más importante de sus vidas',
    },
    {
      icon: '📸',
      title: 'Maquillaje Editorial',
      description:
        'Colaboraciones con fotógrafos profesionales y revistas de moda',
    },
    {
      icon: '🎨',
      title: 'Técnicas Avanzadas',
      description:
        'Dominio de técnicas de contouring, highlighting y maquillaje HD',
    },
  ];

  const skills = [
    { name: 'Maquillaje de Novia', level: 98 },
    { name: 'Maquillaje Social', level: 95 },
    { name: 'Maquillaje Editorial', level: 90 },
    { name: 'Peinados', level: 85 },
    { name: 'Asesoría de Imagen', level: 88 },
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id='sobre-mi' className='py-20 bg-white' ref={ref}>
      <div className='container mx-auto px-6 lg:px-12'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          {/* Image Side */}
          <motion.div
            className='relative'
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className='relative h-96 lg:h-[500px] rounded-2xl overflow-hidden'
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              {/* Placeholder for about image */}
              <div className='absolute inset-0 bg-neutral-300 flex items-center justify-center'>
                <span className='text-neutral text-lg'>
                  About Image Placeholder
                </span>
              </div>
              <div className='absolute inset-0 bg-gradient-to-t from-primary-dark/30 to-transparent'></div>
            </motion.div>

            {/* Floating Quote */}
            <motion.div
              className='absolute -bottom-4 -right-4 bg-primary-accent text-white p-6 rounded-xl shadow-lg max-w-xs'
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={
                isInView
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 20, scale: 0.8 }
              }
              transition={{ duration: 0.8, delay: 0.5 }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 15px 35px rgba(212, 175, 55, 0.4)',
              }}
            >
              <p className='font-artistic text-lg italic'>
                &ldquo;La belleza comienza en el momento en que decides ser tú
                misma&rdquo;
              </p>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            className='space-y-8'
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className='text-4xl lg:text-5xl font-playfair text-primary-dark mb-4'>
                Sobre Mí
              </h2>
              <h3 className='text-2xl font-artistic text-primary-accent mb-6'>
                Marcela Cordero
              </h3>
            </motion.div>

            <motion.div
              className='space-y-6 text-lg text-neutral leading-relaxed'
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <p>
                Hola, soy Marcela, una maquilladora profesional apasionada por
                resaltar la belleza natural de cada mujer. Con más de 5 años de
                experiencia en la industria, he tenido el privilegio de ser
                parte de los momentos más especiales de mis clientas.
              </p>

              <p>
                Mi filosofía se basa en crear looks que no solo sean hermosos,
                sino que también reflejen la personalidad única de cada persona.
                Creo firmemente que el maquillaje debe empoderar y hacer sentir
                segura a quien lo lleva.
              </p>

              <p>
                Desde bodas íntimas hasta grandes celebraciones, sesiones
                fotográficas editoriales y eventos corporativos, cada proyecto
                es una nueva oportunidad para crear arte y hacer realidad los
                sueños de mis clientas.
              </p>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <h4 className='text-xl font-playfair text-primary-dark mb-4'>
                Especialidades
              </h4>
              <div className='space-y-3'>
                {skills.map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={
                      isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                    }
                    transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  >
                    <div className='flex justify-between items-center mb-1'>
                      <span className='text-neutral font-medium'>
                        {skill.name}
                      </span>
                      <span className='text-primary-accent font-bold'>
                        {skill.level}%
                      </span>
                    </div>
                    <div className='w-full bg-gray-200 rounded-full h-2'>
                      <motion.div
                        className='bg-gradient-to-r from-primary-accent to-secondary-accent h-2 rounded-full'
                        initial={{ width: 0 }}
                        animate={
                          isInView ? { width: `${skill.level}%` } : { width: 0 }
                        }
                        transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
                      ></motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          className='mt-20'
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <h3 className='text-3xl font-playfair text-primary-dark text-center mb-12'>
            Logros y Certificaciones
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className='text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow'
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                whileHover={{
                  y: -5,
                  boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                }}
              >
                <motion.div
                  className='text-4xl mb-4'
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {achievement.icon}
                </motion.div>
                <h4 className='text-lg font-playfair text-primary-dark mb-3'>
                  {achievement.title}
                </h4>
                <p className='text-neutral text-sm'>
                  {achievement.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Personal Touch */}
        <motion.div
          className='mt-20 personal-touch-section force-white-text rounded-2xl p-8 lg:p-12 shadow-2xl'
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
            <div>
              <h3 className='text-3xl font-playfair mb-4'>
                Mi Compromiso Contigo
              </h3>
              <p className='text-lg leading-relaxed mb-6'>
                Cada cliente es única, y mi trabajo es descubrir y resaltar su
                belleza natural. No solo aplico maquillaje, creo experiencias
                que perdurarán en tu memoria para siempre.
              </p>
              <ul className='space-y-2'>
                {[
                  'Productos de alta calidad y duración',
                  'Atención personalizada y profesional',
                  'Puntualidad y responsabilidad garantizada',
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className='flex items-center'
                    initial={{ opacity: 0, x: -20 }}
                    animate={
                      isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                    }
                    transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
                  >
                    <svg
                      className='w-5 h-5 check-icon mr-3 flex-shrink-0'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className='text-center'>
              <motion.div
                className='inline-block p-8 bg-white/10 rounded-full mb-4'
                whileHover={{
                  scale: 1.1,
                  boxShadow: '0 0 30px rgba(212, 175, 55, 0.3)',
                }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  className='w-16 h-16'
                  fill='none'
                  stroke='#D4AF37'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                  />
                </svg>
              </motion.div>
              <p className='text-2xl font-playfair'>Tu belleza, mi pasión</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
