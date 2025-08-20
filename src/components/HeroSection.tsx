"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <section className="relative min-h-screen bg-white overflow-hidden" style={{
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      {/* Elementos decorativos solo para desktop */}
      <div className="hidden lg:block absolute top-20 right-10 xl:right-20 w-32 h-32 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 rounded-full blur-3xl"></div>
      <div className="hidden lg:block absolute bottom-20 left-10 xl:left-20 w-24 h-24 bg-gradient-to-tr from-accent-secondary/10 to-accent-primary/10 rounded-full blur-2xl"></div>
      
      {/* Navigation - Minimalista */}
      <motion.nav
        className="relative z-50 flex justify-between items-center px-4 sm:px-6 py-4 sm:py-6 lg:px-12"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-lg sm:text-xl font-playfair text-heading"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          Marcela Cordero
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 lg:space-x-8">
          <a
            href="#servicios"
            className="relative text-main hover:text-accent-primary transition-all duration-300 py-2 px-1 group"
          >
            Servicios
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-primary transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a
            href="#portafolio"
            className="relative text-main hover:text-accent-primary transition-all duration-300 py-2 px-1 group"
          >
            Portafolio
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-primary transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a
            href="#sobre-mi"
            className="relative text-main hover:text-accent-primary transition-all duration-300 py-2 px-1 group"
          >
            Sobre Mí
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-primary transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a
            href="#contacto"
            className="relative text-main hover:text-accent-primary transition-all duration-300 py-2 px-1 group"
          >
            Contacto
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-primary transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-heading p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        className={`fixed inset-0 bg-white z-40 md:hidden ${
          isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        initial={false}
        animate={isMenuOpen ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Overlay para cerrar al hacer click fuera */}
        <div 
          className="absolute inset-0"
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Contenido del menú */}
        <motion.div
          className="relative bg-white h-full flex flex-col justify-center items-center"
          initial={false}
          animate={isMenuOpen ? { y: 0 } : { y: -20 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex flex-col space-y-8 text-center">
            <a
              href="#servicios"
              className="text-2xl text-main hover:text-accent-primary transition-colors py-3 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Servicios
            </a>
            <a
              href="#portafolio"
              className="text-2xl text-main hover:text-accent-primary transition-colors py-3 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Portafolio
            </a>
            <a
              href="#sobre-mi"
              className="text-2xl text-main hover:text-accent-primary transition-colors py-3 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre Mí
            </a>
            <a
              href="#contacto"
              className="text-2xl text-main hover:text-accent-primary transition-colors py-3 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Hero Content - Layout mejorado para desktop */}
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-100px)] lg:min-h-[85vh] px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="w-full max-w-7xl mx-auto">
          {/* Layout responsivo: centrado en mobile, dos columnas en desktop */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
            
            {/* Contenido de texto */}
            <div className="text-center lg:text-left lg:flex-1">
              <motion.h1
                className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-playfair text-heading mb-4 sm:mb-6 leading-tight"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Marcela Cordero
              </motion.h1>

              <motion.p
                className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl text-main mb-6 sm:mb-8 lg:mb-6 font-light leading-relaxed px-2 lg:px-0 max-w-3xl lg:max-w-none mx-auto lg:mx-0"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Makeup Artist especializada en maquillaje nupcial y eventos sociales
              </motion.p>

              <motion.div
                className="flex flex-col xs:flex-row gap-3 sm:gap-4 lg:gap-4 justify-center lg:justify-start items-center px-4 lg:px-0"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.button
                  className="w-full xs:w-auto bg-accent-primary text-white px-6 sm:px-8 py-3 sm:py-3 rounded-lg font-medium transition-all duration-300 hover:bg-accent-primary/90 hover:shadow-lg min-h-[48px] text-base sm:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const contactoSection = document.getElementById("contacto");
                    contactoSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Agendar Cita
                </motion.button>

                <motion.button
                  className="w-full xs:w-auto border-2 border-accent-secondary text-accent-secondary px-6 sm:px-8 py-3 sm:py-3 rounded-lg font-medium transition-all duration-300 hover:bg-accent-secondary hover:text-white hover:shadow-lg min-h-[48px] text-base sm:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const serviciosSection = document.getElementById("servicios");
                    serviciosSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Servicios
                </motion.button>
              </motion.div>

              {/* Información adicional */}
              <motion.div
                className="mt-6 sm:mt-8 lg:mt-8 flex flex-col xs:flex-row gap-3 xs:gap-6 justify-center lg:justify-start items-center text-xs xs:text-sm text-main px-4 lg:px-0"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <span className="text-center">Av. Bolívar 1073, Pueblo Libre, Lima</span>
                <span className="hidden xs:block text-accent-primary">•</span>
                <span>Servicio a domicilio</span>
                <span className="hidden xs:block text-accent-primary">•</span>
                <span>Horarios flexibles</span>
              </motion.div>
            </div>

            {/* Imagen Hero - Solo en desktop */}
            <motion.div
              className="hidden lg:block lg:flex-1 relative"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative aspect-[4/5] max-w-md xl:max-w-lg mx-auto">
                {/* Imagen profesional de Marcela */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/marcela-hero.jpg"
                    alt="Marcela Cordero - Makeup Artist profesional"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 0px, (max-width: 1280px) 384px, 448px"
                  />
                  {/* Overlay sutil para mejorar el contraste */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>
                
                {/* Decoración */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent-primary/20 rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-accent-secondary/20 rounded-full"></div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
