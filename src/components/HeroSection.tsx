"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import NavBar from './NavBar';
import Button from './ui/Button';
import { MapPin, Truck, Clock } from 'lucide-react';

export default function HeroSection() {
  

  return (
    <section className="relative min-h-screen bg-background overflow-hidden" style={{
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)'
    }}>
      {/* Elementos decorativos solo para desktop */}
      <div className="hidden lg:block absolute top-20 right-10 xl:right-20 w-32 h-32 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 rounded-full blur-3xl"></div>
      <div className="hidden lg:block absolute bottom-20 left-10 xl:left-20 w-24 h-24 bg-gradient-to-tr from-accent-secondary/10 to-accent-primary/10 rounded-full blur-2xl"></div>
      
      <NavBar />

      {/* Hero Content - Layout mejorado para desktop */}
      <div className="hero-content">
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] md:min-h-[calc(100vh-100px)] lg:min-h-[85vh] px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="w-full max-w-7xl mx-auto">
          {/* Layout responsivo: centrado en mobile, dos columnas en desktop */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
            
            {/* Contenido de texto */}
            <div className="text-center lg:text-left lg:flex-1">
              <motion.h1
                className="brand-heading hero-title text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl text-heading mb-4 sm:mb-6 leading-tight"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Marcela Cordero
              </motion.h1>

              <motion.p
                className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl text-[color:var(--color-body)] mb-6 sm:mb-8 lg:mb-6 font-light leading-relaxed px-2 lg:px-0 max-w-3xl lg:max-w-none mx-auto lg:mx-0"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Realzando tu belleza para momentos inolvidables. Especialista en Soft Glam y Maquillaje Nupcial.
              </motion.p>

              <motion.div
                className="flex flex-col xs:flex-row gap-3 sm:gap-4 lg:gap-4 justify-center lg:justify-start items-center px-4 lg:px-0"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button
                  variant="primary"
                  className="w-full xs:w-auto min-h-[48px] text-base sm:text-base px-6 sm:px-8 py-3 sm:py-3"
                  onClick={() => {
                    const contactoSection = document.getElementById("contacto");
                    contactoSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Agendar Cita
                </Button>

                <Button
                  variant="secondary"
                  className="w-full xs:w-auto min-h-[48px] text-base sm:text-base px-6 sm:px-8 py-3 sm:py-3"
                  onClick={() => {
                    const portafolioSection = document.getElementById("portafolio");
                    portafolioSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Ver Portafolio
                </Button>
              </motion.div>

              {/* Información adicional */}
              <motion.div
                className="mt-6 sm:mt-8 lg:mt-8 flex flex-col xs:flex-row gap-3 xs:gap-6 justify-center lg:justify-start items-center text-xs xs:text-sm text-[color:var(--color-body)] px-4 lg:px-0"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <span className="flex items-center gap-2 text-[color:var(--color-body)]"><MapPin className="w-4 h-4 text-[color:var(--color-accent-primary)]" />Av. Bolívar 1073, Pueblo Libre, Lima</span>
                <span className="hidden xs:block text-accent-primary">•</span>
                <span className="flex items-center gap-2 text-[color:var(--color-body)]"><Truck className="w-4 h-4 text-[color:var(--color-accent-primary)]" />Servicio a domicilio</span>
                <span className="hidden xs:block text-accent-primary">•</span>
                <span className="flex items-center gap-2 text-[color:var(--color-body)]"><Clock className="w-4 h-4 text-[color:var(--color-accent-primary)]" />Horarios flexibles</span>
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
                  <div className="absolute inset-0 hero-overlay"></div>
                </div>
                
                {/* Decoración */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent-primary/20 rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-accent-secondary/20 rounded-full"></div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
