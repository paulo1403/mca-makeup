"use client";

import { motion } from "framer-motion";
import { Instagram, Phone, MapPin, ChevronUp } from "lucide-react";
import { analytics } from "@/lib/analytics";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <h3 className="text-2xl brand-heading text-heading mb-2">Marcela Cordero</h3>
            <p className="text-accent-primary font-medium mb-3">Makeup Artist</p>
            <p className="text-main text-sm leading-relaxed max-w-md">
              Especialista en maquillaje para novias, eventos sociales y
              fotografía profesional. Creando looks únicos que realzan tu
              belleza natural.
            </p>
          </motion.div>

          {/* Contact Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg section-title text-heading mb-4">Contacto</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent-primary" />
                <a
                  href="tel:+51989164990"
                  className="text-main text-sm hover:text-accent-primary transition-colors"
                  onClick={() => analytics.phoneClicked()}
                >
                  +51 989 164 990
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent-primary" />
                <span className="text-main text-sm">Av. Bolívar 1073, Pueblo Libre, Lima</span>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-accent-primary" />
                <a
                  href="https://www.instagram.com/marcelacorderobeauty/"
                  className="text-main text-sm hover:text-accent-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @marcelacorderobeauty
                </a>
              </div>

              {/* Social Icons */}
              <div className="flex gap-3 mt-4">
                <a
                  href="https://www.instagram.com/marcelacorderobeauty/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 hover:bg-accent-primary text-accent-primary hover:text-white rounded-full flex items-center justify-center transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/51989164990?text=Hola%20Marcela%2C%20me%20interesa%20conocer%20tus%20servicios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 z-50 whatsapp-bubble"
                  aria-label="WhatsApp"
                  onClick={() => analytics.whatsappClicked()}
                  style={{ background: 'var(--color-accent-primary)', color: 'white' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden>
                    <path d="M20.52 3.48A11.9 11.9 0 0012.01.02C6.02.02 1 5.04 1 11.04c0 1.94.51 3.83 1.48 5.5L.01 23l6.7-1.76A11.88 11.88 0 0012.02 23c6 0 11-4.98 11-11 0-1.98-.54-3.84-1.5-5.52zM12.02 20.1c-1.6 0-3.17-.42-4.52-1.22l-.32-.19-3.98 1.05 1.05-3.87-.2-.32A8.45 8.45 0 013.57 11C3.57 6.26 7.27 2.56 12.02 2.56c2.11 0 4.09.66 5.72 1.9a8.02 8.02 0 012.33 5.6c0 4.74-3.7 8.44-8.05 8.44z" />
                    <path d="M17.56 14.14c-.28-.14-1.64-.81-1.9-.9-.26-.09-.45-.14-.64.14-.19.28-.74.9-.9 1.09-.16.19-.32.21-.6.07-.28-.14-1.18-.43-2.24-1.38-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.64-1.55-.88-2.12-.23-.56-.47-.48-.64-.49-.17-.01-.37-.01-.57-.01s-.49.07-.74.35c-.24.28-.92.89-.92 2.17 0 1.28.94 2.52 1.07 2.7.12.17 1.84 2.88 4.45 3.92 2.61 1.04 2.61.69 3.08.65.47-.05 1.53-.62 1.75-1.22.22-.59.22-1.09.16-1.22-.06-.13-.22-.19-.5-.33z" />
                  </svg>
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
            <h4 className="text-lg section-title text-heading mb-4">
              Horarios
            </h4>
            <div className="space-y-1 text-sm">
              <div className="text-main">
                <span className="font-medium">Lun - Vie:</span> 9:00 - 18:00
              </div>
              <div className="text-main">
                <span className="font-medium">Sábados:</span> 9:00 - 16:00
              </div>
              <div className="text-main">
                <span className="font-medium">Domingos:</span> Solo eventos
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3 mt-4">
              <a
                href="https://www.instagram.com/marcelacorderobeauty/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-100 hover:bg-accent-primary text-accent-primary hover:text-white rounded-full flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/51989164990?text=Hola%20Marcela%2C%20me%20interesa%20conocer%20tus%20servicios"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-100 hover:bg-green-600 text-green-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-300"
                aria-label="WhatsApp"
                onClick={() => analytics.whatsappClicked()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
                  <path d="M20.52 3.48A11.9 11.9 0 0012.01.02C6.02.02 1 5.04 1 11.04c0 1.94.51 3.83 1.48 5.5L.01 23l6.7-1.76A11.88 11.88 0 0012.02 23c6 0 11-4.98 11-11 0-1.98-.54-3.84-1.5-5.52zM12.02 20.1c-1.6 0-3.17-.42-4.52-1.22l-.32-.19-3.98 1.05 1.05-3.87-.2-.32A8.45 8.45 0 013.57 11C3.57 6.26 7.27 2.56 12.02 2.56c2.11 0 4.09.66 5.72 1.9a8.02 8.02 0 012.33 5.6c0 4.74-3.7 8.44-8.05 8.44z" />
                  <path d="M17.56 14.14c-.28-.14-1.64-.81-1.9-.9-.26-.09-.45-.14-.64.14-.19.28-.74.9-.9 1.09-.16.19-.32.21-.6.07-.28-.14-1.18-.43-2.24-1.38-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.64-1.55-.88-2.12-.23-.56-.47-.48-.64-.49-.17-.01-.37-.01-.57-.01s-.49.07-.74.35c-.24.28-.92.89-.92 2.17 0 1.28.94 2.52 1.07 2.7.12.17 1.84 2.88 4.45 3.92 2.61 1.04 2.61.69 3.08.65.47-.05 1.53-.62 1.75-1.22.22-.59.22-1.09.16-1.22-.06-.13-.22-.19-.5-.33z" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-main text-xs">
              © {currentYear} Marcela Cordero. Todos los derechos reservados.
            </div>

            <div className="flex gap-4 text-xs">
              <a
                href="/politicas-privacidad"
                className="text-main hover:text-accent-primary transition-colors"
              >
                Políticas de Privacidad
              </a>
              <a
                href="/terminos-condiciones"
                className="text-main hover:text-accent-primary transition-colors"
              >
                Términos y Condiciones
              </a>
              <a
                href="/libro-reclamaciones"
                className="text-main hover:text-accent-primary transition-colors"
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
        className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 back-to-top"
        aria-label="Volver arriba"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{ background: 'linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-primary-2))', color: '#fff' }}
      >
        <ChevronUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
}
