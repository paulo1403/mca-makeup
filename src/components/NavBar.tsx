"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "./Logo";
import Button from "./ui/Button";
import Typography from "./ui/Typography";

export default function NavBar() {
  return (
    <header className="navbar" role="banner">
      <div className="navbar-container">
        {/* Marca/Logo */}
        <Link href="/" className="navbar-brand" aria-label="Inicio">
          <Logo />
        </Link>

        {/* Toggle móvil (checkbox + label) */}
        <input
          id="nav-toggle"
          type="checkbox"
          className="nav-toggle"
          aria-hidden
        />
        <label
          htmlFor="nav-toggle"
          className="nav-burger"
          aria-label="Abrir menú"
          role="button"
        >
          <span className="burger-lines" aria-hidden></span>
        </label>

        {/* Menú de navegación */}
        <nav className="nav-menu" aria-label="Navegación principal">
          <Link href="/#servicios" className="nav-link">
            <Typography as="span" variant="p">
              Servicios
            </Typography>
          </Link>
          <Link href="/#portfolio" className="nav-link">
            <Typography as="span" variant="p">
              Portfolio
            </Typography>
          </Link>
          <Link href="/#testimonios" className="nav-link">
            <Typography as="span" variant="p">
              Reseñas
            </Typography>
          </Link>
          <Link href="/#contacto" className="nav-link">
            <Typography as="span" variant="p">
              Contacto
            </Typography>
          </Link>
        </nav>

        {/* Acciones (desktop) */}
        <div className="navbar-actions">
          <ThemeToggle />
          <Link href="/#contacto">
            <Button variant="primary" size="md" aria-label="Ir a contacto">
              Reservar
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
