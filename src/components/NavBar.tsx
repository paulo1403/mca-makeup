"use client";

import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import { Menu, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect, useTransition } from "react";
import MobileMenu from "./MobileMenu";

const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isNavigating, setIsNavigating] = useState(false);

  const isReviewPath = pathname?.startsWith("/review") ?? false;

  useEffect(() => {
    if (isReviewPath) return;
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, [isReviewPath]);

  if (isReviewPath) {
    return null;
  }

  const handleReservaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsNavigating(true);

    startTransition(() => {
      router.push("/reserva");
      setTimeout(() => setIsNavigating(false), 500);
    });
  };

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        // Obtener la altura real del header
        const header = document.querySelector("header");
        const headerHeight = header ? header.offsetHeight : 80;

        // Margen más generoso en móviles para evitar superposición
        const extraMargin = isMobile ? 60 : 30;

        const elementPosition =
          element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight - extraMargin;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 300); // Más tiempo para que termine la animación del menú
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[color:var(--color-background)] border-b border-[color:var(--color-border)]">
      <nav className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 max-w-7xl mx-auto">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-[color:var(--color-muted)] hover:text-[color:var(--color-primary)] transition-colors"
            >
              <Typography variant="p">Home</Typography>
            </Link>
            <Link
              href="/#servicios"
              className="text-[color:var(--color-muted)] hover:text-[color:var(--color-primary)] transition-colors"
            >
              <Typography variant="p">Servicios</Typography>
            </Link>
            <Link
              href="/#calculadora-transporte"
              className="text-[color:var(--color-muted)] hover:text-[color:var(--color-primary)] transition-colors"
            >
              <Typography variant="p">Calculadora de transporte</Typography>
            </Link>
            <Link
              href="/reserva"
              className="text-[color:var(--color-muted)] hover:text-[color:var(--color-primary)] transition-colors"
            >
              <Typography variant="p">Reservar</Typography>
            </Link>
            <Link
              href="/#contacto"
              className="text-[color:var(--color-muted)] hover:text-[color:var(--color-primary)] transition-colors"
            >
              <Typography variant="p">Contacto</Typography>
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Link
              href="/reserva"
              className="inline-flex"
              onClick={handleReservaClick}
            >
              <Button variant="primary" size="sm" disabled={isNavigating}>
                {isNavigating ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Typography variant="p" className="text-white">
                    Reservar Cita
                  </Typography>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          {isMobile && (
            <div className="md:hidden flex items-center space-x-3">
              <ThemeToggle />
              <button
                type="button"
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
