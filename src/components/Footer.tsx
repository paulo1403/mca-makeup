'use client';

import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const services = [
    'Maquillaje de Novia',
    'Maquillaje Social',
    'Piel Madura',
    'Peinados Profesionales',
  ];

  const quickLinks = [
    { name: 'Inicio', href: '#' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Portafolio', href: 'https://marcelacorderomakeup.my.canva.site/', external: true },
    { name: 'Sobre Mí', href: '#sobre-mi' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    <footer className='section-bg-footer text-white'>
      {/* Overlay difuminado superior */}
      <div className="section-overlay-top" />
      
      {/* Main Footer Content */}
      <div className='container mx-auto px-6 lg:px-12 py-16 relative z-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Brand Section */}
          <div className='lg:col-span-2'>
            <h3 className='text-3xl font-playfair mb-4'>Marcela Cordero</h3>
            <p className='text-gray-300 mb-6 leading-relaxed'>
              Desde 2017 creando looks únicos que resaltan tu belleza natural. 
              Graduada de MUS by Christian Matta como alumna destacada. 
              Especialista en sociales, novias y publicidad.
            </p>

            {/* Social Media */}
            <div className='flex space-x-4'>
              <a
                href='https://instagram.com/marcelacorderomakeup'
                target='_blank'
                rel='noopener noreferrer'
                className='bg-primary-accent hover:bg-opacity-80 p-3 rounded-full transition-colors'
                aria-label='Instagram'
              >
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
                </svg>
              </a>

              <a
                href='#'
                className='bg-primary-accent hover:bg-opacity-80 p-3 rounded-full transition-colors'
                aria-label='Facebook'
              >
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                </svg>
              </a>

              <a
                href='#'
                className='bg-primary-accent hover:bg-opacity-80 p-3 rounded-full transition-colors'
                aria-label='WhatsApp'
              >
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.085' />
                </svg>
              </a>

              <a
                href='#'
                className='bg-primary-accent hover:bg-opacity-80 p-3 rounded-full transition-colors'
                aria-label='Pinterest'
              >
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.751-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z' />
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className='text-xl font-playfair mb-4'>Servicios</h4>
            <ul className='space-y-2'>
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href='#servicios'
                    className='text-gray-300 hover:text-primary-accent transition-colors'
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-xl font-playfair mb-4'>Enlaces Rápidos</h4>
            <ul className='space-y-2'>
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className='text-gray-300 hover:text-primary-accent transition-colors'
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info Bar */}
        {/* Divisor elegante en lugar de border-t */}
        <div className="section-divider-glow mt-12 mb-8" />
        <div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left'>
            <div className='flex items-center justify-center md:justify-start'>
              <Mail
                className='w-5 h-5 text-primary-accent mr-3'
              />
              <span className='text-gray-300'>@marcelacorderomakeup</span>
            </div>

            <div className='flex items-center justify-center md:justify-start'>
              <Phone
                className='w-5 h-5 text-primary-accent mr-3'
              />
              <span className='text-gray-300'>+51 989 164 990</span>
            </div>

            <div className='flex items-center justify-center md:justify-start'>
              <MapPin
                className='w-5 h-5 text-primary-accent mr-3'
              />
              <span className='text-gray-300'>
                Room Studio - Pueblo Libre
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      {/* Divisor principal elegante */}
      <div className="section-divider-multi" />
      <div>
        <div className='container mx-auto px-6 lg:px-12 py-6'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='text-gray-300 text-sm mb-4 md:mb-0'>
              © {currentYear} Marcela Cordero Makeup Artist. Todos los derechos
              reservados.
            </div>

            <div className='flex space-x-6 text-sm'>
              <a
                href='/politicas-privacidad'
                className='text-gray-300 hover:text-primary-accent transition-colors'
              >
                Política de Privacidad
              </a>
              <a
                href='/terminos-condiciones'
                className='text-gray-300 hover:text-primary-accent transition-colors'
              >
                Términos y Condiciones
              </a>
              <a
                href='/libro-reclamaciones'
                className='text-gray-300 hover:text-primary-accent transition-colors'
              >
                Libro de Reclamaciones
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className='fixed bottom-8 right-8 bg-primary-accent hover:bg-opacity-80 text-white p-3 rounded-full shadow-lg transition-colors z-50'
        aria-label='Volver arriba'
      >
        <svg
          className='w-6 h-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M5 10l7-7m0 0l7 7m-7-7v18'
          />
        </svg>
      </button>
    </footer>
  );
}
