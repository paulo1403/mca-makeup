"use client";

import React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, MapPin, Phone, Mail, Sparkles, Star, Users } from "lucide-react";
import Logo from "./Logo";
import Typography from "./ui/Typography";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  handleNavClick: (href: string) => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
  handleNavClick,
}: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-50"
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          >
            <div
              className="absolute top-0 right-0 w-full sm:w-80 h-screen bg-[color:var(--color-surface)]/95 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header con Logo en móvil */}
              <div className="flex justify-center items-center p-4 pt-20 pb-6 border-b border-[color:var(--color-border)]/20 relative">
                <Logo />
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)]/50 hover:bg-[color:var(--color-surface-secondary)]"
                >
                  <X className="w-5 h-5 text-[color:var(--color-heading)]" />
                </button>
              </div>

              {/* Navegación móvil */}
              <nav className="py-4 px-4">
                <Link
                  href="/#hero"
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-[color:var(--color-surface)]/50 transition-colors mb-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("#hero");
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-[color:var(--color-accent)]/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[color:var(--color-accent)]" />
                  </div>
                  <Typography
                    as="span"
                    variant="p"
                    className="text-[color:var(--color-heading)]"
                  >
                    Inicio
                  </Typography>
                </Link>

                <Link
                  href="/#servicios"
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-[color:var(--color-surface)]/50 transition-colors mb-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("#servicios");
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-[color:var(--color-primary)]/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[color:var(--color-primary)]" />
                  </div>
                  <Typography
                    as="span"
                    variant="p"
                    className="text-[color:var(--color-heading)]"
                  >
                    Servicios
                  </Typography>
                </Link>

                <Link
                  href="/#portafolio"
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-[color:var(--color-surface)]/50 transition-colors mb-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("#portafolio");
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-[color:var(--color-accent)]/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[color:var(--color-accent)]" />
                  </div>
                  <Typography
                    as="span"
                    variant="p"
                    className="text-[color:var(--color-heading)]"
                  >
                    Portafolio
                  </Typography>
                </Link>

                <Link
                  href="/#testimonials"
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-[color:var(--color-surface)]/50 transition-colors mb-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("#testimonials");
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-[color:var(--color-accent)]/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-[color:var(--color-accent)]" />
                  </div>
                  <Typography
                    as="span"
                    variant="p"
                    className="text-[color:var(--color-heading)]"
                  >
                    Testimonios
                  </Typography>
                </Link>

                <Link
                  href="/#about"
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-[color:var(--color-surface)]/50 transition-colors mb-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("#about");
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-[color:var(--color-accent)]/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[color:var(--color-accent)]" />
                  </div>
                  <Typography
                    as="span"
                    variant="p"
                    className="text-[color:var(--color-heading)]"
                  >
                    Nosotros
                  </Typography>
                </Link>

                <Link
                  href="/#contacto"
                  className="flex items-center gap-3 p-4 rounded-lg hover:bg-[color:var(--color-surface)]/50 transition-colors mb-2"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick("#contacto");
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-[color:var(--color-primary)]/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[color:var(--color-primary)]" />
                  </div>
                  <Typography
                    as="span"
                    variant="p"
                    className="text-[color:var(--color-heading)]"
                  >
                    Contacto
                  </Typography>
                </Link>
              </nav>

              {/* Información de contacto (oculta en móvil) */}
              <div className="hidden p-4 border-t border-[color:var(--color-border)]/20 mt-auto">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[color:var(--color-surface)]/50 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[color:var(--color-primary)]" />
                    </div>
                    <div>
                      <Typography
                        as="p"
                        variant="small"
                        className="text-[color:var(--color-muted)]"
                      >
                        Av. Bolívar 1073
                      </Typography>
                      <Typography
                        as="p"
                        variant="small"
                        className="text-[color:var(--color-heading)]"
                      >
                        Pueblo Libre, Lima
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[color:var(--color-surface)]/50 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[color:var(--color-primary)]" />
                    </div>
                    <div>
                      <Typography
                        as="p"
                        variant="small"
                        className="text-[color:var(--color-heading)]"
                      >
                        marcelacordero.bookings@gmail.com
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
