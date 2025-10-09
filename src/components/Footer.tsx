"use client";

import { motion } from "framer-motion";
import { Instagram, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#1F1F1F] dark:bg-[#0A0A0A] text-[#F3F4F6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 order-1 lg:order-1"
          >
            <Link href="/" className="inline-block" aria-label="Inicio">
              <h3 className="text-2xl md:text-3xl font-serif">
                Marcela Cordero
              </h3>
            </Link>
            <p className="text-sm max-w-md leading-relaxed text-[#F3F4F6]">
              Maquillaje profesional para novias, eventos y fotografía —
              sofisticación natural y servicio personalizado.
            </p>

            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://www.instagram.com/marcelacorderobeauty/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors text-[#FF007F] hover:text-[#FFC72C]"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors text-[#FF007F] hover:text-[#FFC72C]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M12 2v8.25A4.75 4.75 0 1114.75 15H18a6 6 0 10-6-13z" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Navigation Column */}
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-6 order-3 lg:order-2"
            aria-label="Navegación del sitio"
          >
            <div>
              <h5 className="text-sm font-semibold text-[#FFC72C]">
                Servicios
              </h5>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link
                    href="/services/makeup-bridal"
                    className="text-sm hover:text-[#FF007F] transition-colors"
                  >
                    Novias
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/event"
                    className="text-sm hover:text-[#FF007F] transition-colors"
                  >
                    Eventos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services/editorial"
                    className="text-sm hover:text-[#FF007F] transition-colors"
                  >
                    Fotografía
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-[#FFC72C]">Empresa</h5>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-sm hover:text-[#FF007F] transition-colors"
                  >
                    Sobre mí
                  </Link>
                </li>
                <li>
                  <Link
                    href="/portfolio"
                    className="text-sm hover:text-[#FF007F] transition-colors"
                  >
                    Portafolio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/testimonials"
                    className="text-sm hover:text-[#FF007F] transition-colors"
                  >
                    Testimonios
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-[#FFC72C]">Ayuda</h5>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link
                    href="/politicas-privacidad"
                    className="text-sm hover:text-[#FF007F] transition-colors"
                  >
                    Políticas de Privacidad
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terminos-condiciones"
                    className="text-sm hover:text-[#FF007F] transition-colors"
                  >
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link
                    href="/libro-reclamaciones"
                    className="text-sm hover:text-[#FF007F] transition-colors"
                  >
                    Libro de Reclamaciones
                  </Link>
                </li>
              </ul>
            </div>
          </motion.nav>

          {/* Contact & CTA Column */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 order-2 lg:order-3"
          >
            <h4 className="text-lg font-semibold">Contacto</h4>
            <div className="text-sm space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Av. Bolívar 1073, Pueblo Libre, Lima</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M2 4v16h20V4H2zm18 2v.01L12 11 4 6.01V6h16zM4 18V8.99l8 4.99 8-4.99V18H4z" />
                </svg>
                <a
                  href="mailto:contacto@marcelacordero.com"
                  className="hover:text-[#FF007F] transition-colors"
                >
                  contacto@marcelacordero.com
                </a>
              </div>
            </div>

            <div className="mt-4">
              <Link
                href="/#booking"
                className="inline-block w-full text-center bg-[#FFC72C] text-black font-medium py-3 px-4 rounded-md shadow-md hover:opacity-95 transition-all"
                aria-label="Reservar Ahora"
              >
                Reservar Ahora
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="text-sm text-[#A3A3A3]">
              © {currentYear} Marcela Cordero. Todos los derechos reservados.
            </div>
            <div className="text-sm text-[#A3A3A3]">Hecho con ❤️ en Lima</div>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        aria-label="Volver arriba"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{ background: "#FF007F", color: "#fff" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </motion.button>
    </footer>
  );
}
