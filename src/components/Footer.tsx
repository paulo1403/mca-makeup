'use client';

import { motion } from 'framer-motion';
import { Instagram, Phone, MapPin, ChevronUp } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className='bg-white border-t border-gray-100'>
      {/* Main Footer Content */}
      <div className='container mx-auto px-6 lg:px-12 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          
          {/* Brand Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='lg:col-span-2'
          >
            <h3 className='text-2xl font-playfair text-heading mb-2'>
              Marcela Cordero
            </h3>
            <p className='text-accent-primary font-medium mb-3'>
              Makeup Artist
            </p>
            <p className='text-main text-sm leading-relaxed max-w-md'>
              Especialista en maquillaje para novias, eventos sociales y fotografía profesional. 
              Creando looks únicos que realzan tu belleza natural.
            </p>
          </motion.div>

          {/* Contact Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className='text-lg font-playfair text-heading mb-4'>
              Contacto
            </h4>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Phone className='w-4 h-4 text-accent-primary' />
                <a 
                  href="tel:+51989164990"
                  className='text-main text-sm hover:text-accent-primary transition-colors'
                >
                  +51 989 164 990
                </a>
              </div>
              <div className='flex items-center gap-2'>
                <MapPin className='w-4 h-4 text-accent-primary' />
                <span className='text-main text-sm'>Pueblo Libre, Lima</span>
              </div>
              <div className='flex items-center gap-2'>
                <Instagram className='w-4 h-4 text-accent-primary' />
                <a 
                  href='https://www.instagram.com/marcelacorderobeauty/' 
                  className='text-main text-sm hover:text-accent-primary transition-colors'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  @marcelacorderobeauty
                </a>
              </div>
            </div>
          </motion.div>

          {/* Hours Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className='text-lg font-playfair text-heading mb-4'>
              Horarios
            </h4>
            <div className='space-y-1 text-sm'>
              <div className='text-main'>
                <span className='font-medium'>Lun - Vie:</span> 9:00 - 18:00
              </div>
              <div className='text-main'>
                <span className='font-medium'>Sábados:</span> 9:00 - 16:00
              </div>
              <div className='text-main'>
                <span className='font-medium'>Domingos:</span> Solo eventos
              </div>
            </div>

            {/* Social Icons */}
            <div className='flex gap-3 mt-4'>
              <a
                href='https://www.instagram.com/marcelacorderobeauty/'
                target='_blank'
                rel='noopener noreferrer'
                className='w-8 h-8 bg-gray-100 hover:bg-accent-primary text-accent-primary hover:text-white rounded-full flex items-center justify-center transition-all duration-300'
                aria-label='Instagram'
              >
                <Instagram className='w-4 h-4' />
              </a>
              <a
                href='https://wa.me/51989164990?text=Hola%20Marcela%2C%20me%20interesa%20conocer%20tus%20servicios'
                target='_blank'
                rel='noopener noreferrer'
                className='w-8 h-8 bg-gray-100 hover:bg-green-600 text-green-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-300'
                aria-label='WhatsApp'
              >
                <Phone className='w-4 h-4' />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-100 mt-8 pt-6'>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
            <div className='text-main text-xs'>
              © {currentYear} Marcela Cordero. Todos los derechos reservados.
            </div>

            <div className='flex gap-4 text-xs'>
              <a
                href='/politicas-privacidad'
                className='text-main hover:text-accent-primary transition-colors'
              >
                Políticas de Privacidad
              </a>
              <a
                href='/terminos-condiciones'
                className='text-main hover:text-accent-primary transition-colors'
              >
                Términos y Condiciones
              </a>
              <a
                href='/libro-reclamaciones'
                className='text-main hover:text-accent-primary transition-colors'
              >
                Libro de Reclamaciones
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className='fixed bottom-6 right-6 bg-accent-primary hover:bg-accent-secondary text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50'
        aria-label='Volver arriba'
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <ChevronUp className='w-5 h-5' />
      </motion.button>
    </footer>
  );
}
