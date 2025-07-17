'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { 
  ExternalLink, 
  Eye, 
  Heart, 
  Sparkles, 
  Palette,
  Camera,
  Star,
  Instagram,
  Crown,
  Gem,
  Flower
} from 'lucide-react';

export default function PortfolioSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const portfolioHighlights = [
    {
      title: 'Novias',
      description: 'Looks únicos para el día más especial de tu vida',
      icon: Crown,
      gradient: 'from-pink-500 to-rose-500',
      count: '120+ novias'
    },
    {
      title: 'Sociales',
      description: 'Elegancia para eventos y celebraciones importantes',
      icon: Sparkles,
      gradient: 'from-purple-500 to-indigo-500',
      count: '200+ eventos'
    },
    {
      title: 'Publicidad',
      description: 'Maquillaje profesional para producciones y marcas',
      icon: Camera,
      gradient: 'from-blue-500 to-cyan-500',
      count: '50+ proyectos'
    },
  ];

  return (
    <section 
      id='portafolio' 
      className='py-16 md:py-24 bg-gradient-to-b from-black via-primary-dark to-black relative overflow-hidden' 
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

      <div className='container mx-auto px-4 md:px-6 relative z-10'>
        {/* Header */}
        <motion.div
          className='text-center mb-12 md:mb-16'
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Palette className="w-6 h-6 text-primary-accent" />
            <span className="text-primary-accent text-sm font-medium tracking-wider uppercase">
              Portafolio
            </span>
            <Palette className="w-6 h-6 text-primary-accent" />
          </div>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-4'>
            Mi{' '}
            <span className="text-primary-accent font-allura text-4xl md:text-5xl lg:text-6xl block md:inline">
              Portafolio
            </span>
          </h2>
          <p className='text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8'>
            Descubre mi trabajo y encuentra la inspiración perfecta para tu próximo look.
            Cada cliente es única y merece sentirse especial.
          </p>
          
          {/* Main CTA */}
          <motion.a
            href='https://marcelacorderomakeup.my.canva.site/'
            target="_blank"
            rel="noopener noreferrer"
            className='inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-accent to-secondary-accent hover:from-secondary-accent hover:to-primary-accent text-white font-medium text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300'
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)'
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Eye className='w-6 h-6 mr-3' />
            Ver Portafolio Completo
            <ExternalLink className='w-5 h-5 ml-3' />
          </motion.a>
        </motion.div>

        {/* Portfolio Highlights */}
        <motion.div
          className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16'
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {portfolioHighlights.map((item, index) => (
            <motion.a
              key={index}
              href='https://marcelacorderomakeup.my.canva.site/'
              target="_blank"
              rel="noopener noreferrer"
              className='group'
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className='bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/10 hover:border-primary-accent/30 shadow-2xl transition-all duration-300 text-center h-full'>
                {/* Icon */}
                <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${item.gradient} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className='w-8 h-8 md:w-10 md:h-10 text-white' />
                </div>
                
                {/* Content */}
                <h3 className='text-xl md:text-2xl font-playfair font-bold text-white mb-3 group-hover:text-primary-accent transition-colors'>
                  {item.title}
                </h3>
                <p className='text-gray-300 text-sm md:text-base leading-relaxed mb-4'>
                  {item.description}
                </p>
                
                {/* Count */}
                <div className="flex items-center justify-center gap-2 text-primary-accent">
                  <Star className="w-4 h-4" fill="currentColor" />
                  <span className="text-sm font-medium">{item.count}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Featured Gallery Preview */}
        <motion.div
          className='bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl text-center mb-12 md:mb-16'
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-accent to-secondary-accent rounded-full flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <h3 className='text-2xl md:text-3xl font-playfair font-bold text-white'>
              Galería Destacada
            </h3>
          </div>
          
          <p className='text-gray-300 text-base md:text-lg mb-8 max-w-3xl mx-auto leading-relaxed'>
            Explora una cuidadosa selección de mis mejores trabajos. Desde novias radiantes hasta 
            looks de alta costura, cada imagen cuenta una historia de belleza y transformación.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Novias Felices', value: '120+', icon: Crown },
              { label: 'Eventos Sociales', value: '200+', icon: Sparkles },
              { label: 'Años Experiencia', value: '8+', icon: Gem },
              { label: 'Looks Únicos', value: '500+', icon: Flower }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center p-4 bg-white/5 rounded-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              >
                <stat.icon className="w-6 h-6 text-primary-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <motion.a
            href='https://marcelacorderomakeup.my.canva.site/'
            target="_blank"
            rel="noopener noreferrer"
            className='inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-primary-accent/50 rounded-xl font-medium transition-all duration-300'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Camera className='w-5 h-5 mr-2' />
            Explorar Galería
            <ExternalLink className='w-4 h-4 ml-2' />
          </motion.a>
        </motion.div>

        {/* Social Media Integration */}
        <motion.div
          className='bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl text-center'
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            <h3 className='text-2xl md:text-3xl font-playfair font-bold text-white'>
              Sígueme en Instagram
            </h3>
          </div>
          
          <p className='text-gray-300 text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed'>
            <span className="text-primary-accent font-medium">@marcelacorderomakeup</span> - Mantente al día con mis últimos trabajos, 
            tutoriales exclusivos y tips de belleza profesional.
          </p>
          
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <motion.a
              href='https://www.instagram.com/marcelacorderomakeup/'
              target="_blank"
              rel="noopener noreferrer"
              className='inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Instagram className="w-5 h-5 mr-2" />
              Ver en Instagram
            </motion.a>
            <motion.a
              href='https://marcelacorderomakeup.my.canva.site/'
              target="_blank"
              rel="noopener noreferrer"
              className='inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-primary-accent/50 rounded-xl font-medium transition-all duration-300'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="w-5 h-5 mr-2" />
              Portafolio Completo
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
