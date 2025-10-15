"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import MobileMenu from "./MobileMenu";

const NavBar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        // Obtener la altura real del header
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : 80;
        
        // Margen más generoso en móviles para evitar superposición
        const extraMargin = isMobile ? 60 : 30;
        
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight - extraMargin;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }, 300); // Más tiempo para que termine la animación del menú
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[color:var(--color-background)]/80 backdrop-blur-lg border-b border-[color:var(--color-border)]">
      <nav className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 max-w-7xl mx-auto">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/#servicios"
              className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-primary)] transition-colors"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#servicios");
              }}
            >
              <Typography variant="p">Servicios</Typography>
            </Link>
            <Link 
              href="/#portafolio"
              className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-primary)] transition-colors"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#portafolio");
              }}
            >
              <Typography variant="p">Portafolio</Typography>
            </Link>
            <Link 
              href="/#testimonials"
              className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-primary)] transition-colors"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#testimonials");
              }}
            >
              <Typography variant="p">Testimonios</Typography>
            </Link>
            <Link 
              href="/#about"
              className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-primary)] transition-colors"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#about");
              }}
            >
              <Typography variant="p">Nosotros</Typography>
            </Link>
            <Link 
              href="/#contacto"
              className="text-[color:var(--color-text-muted)] hover:text-[color:var(--color-primary)] transition-colors"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#contacto");
              }}
            >
              <Typography variant="p">Contacto</Typography>
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button 
              variant="primary" 
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#contacto");
              }}
            >
              <Typography variant="p" className="text-white">
                Reservar Cita
              </Typography>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          {isMobile && (
            <div className="md:hidden flex items-center space-x-3">
              <ThemeToggle />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-[color:var(--color-surface)] transition-colors"
                aria-label="Abrir menú"
              >
                <Menu className="w-6 h-6 text-[color:var(--color-heading)]" />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Component */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        handleNavClick={handleNavClick}
      />
    </header>
  );
};

export default NavBar;
