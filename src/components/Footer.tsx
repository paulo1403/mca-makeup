"use client";

import { ArrowUp, Instagram, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import Button from "./ui/Button";
import Typography from "./ui/Typography";
import "@/styles/components/footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigationLinks = {
    services: [
      { href: "/#services", label: "Maquillaje de Novia" },
      { href: "/#services", label: "Eventos Sociales" },
      { href: "/#services", label: "Maquillaje de Gala" },
      { href: "/#services", label: "Piel Madura" },
    ],
    company: [
      { href: "/#about", label: "Sobre mí" },
      { href: "/#portfolio", label: "Portafolio" },
      { href: "/#testimonials", label: "Testimonios" },
    ],
    legal: [
      { href: "/politicas-privacidad", label: "Políticas de Privacidad" },
      { href: "/terminos-condiciones", label: "Términos y Condiciones" },
      { href: "/libro-reclamaciones", label: "Libro de Reclamaciones" },
    ],
  };

  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo" aria-label="Inicio">
              <Typography
                as="h3"
                variant="h3"
                className="text-2xl md:text-3xl font-serif"
              >
                Marcela Cordero
              </Typography>
            </Link>

            <Typography
              as="p"
              variant="p"
              className="footer-description text-sm"
            >
              Maquillaje profesional para novias, eventos y fotografía —
              sofisticación natural y servicio personalizado.
            </Typography>

            <div className="footer-social">
              <a
                href="https://www.instagram.com/marcelacorderobeauty/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="footer-social-link"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <a
                href="https://wa.me/51989164990"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="footer-social-link"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="footer-nav">
            <div className="space-y-8 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-8">
              <div>
                <Typography
                  as="h4"
                  variant="h4"
                  className="footer-nav-title text-sm"
                >
                  Servicios
                </Typography>
                <ul className="footer-nav-list">
                  {navigationLinks.services.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="footer-nav-link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Typography
                  as="h4"
                  variant="h4"
                  className="footer-nav-title text-sm"
                >
                  Empresa
                </Typography>
                <ul className="footer-nav-list">
                  {navigationLinks.company.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="footer-nav-link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact & CTA Column */}
          <div className="footer-contact">
            <Typography
              as="h4"
              variant="h4"
              className="footer-nav-title text-sm mb-4"
            >
              Contacto
            </Typography>

            <div className="space-y-3">
              <div className="footer-contact-item">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Av. Bolívar 1073, Pueblo Libre, Lima</span>
              </div>

              <div className="footer-contact-item">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a
                  href="mailto:marcelacordero.bookings@gmail.com"
                  className="footer-contact-link"
                >
                  marcelacordero.bookings@gmail.com
                </a>
              </div>

              <div className="footer-contact-item">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                <a href="tel:+51989164990" className="footer-contact-link">
                  +51 989 164 990
                </a>
              </div>
            </div>

            <div className="footer-cta">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  const element = document.querySelector("#contacto");
                  if (element) {
                    const header = document.querySelector("header");
                    const headerHeight = header ? header.offsetHeight : 80;
                    const isMobile = window.innerWidth < 768;
                    const extraMargin = isMobile ? 60 : 30;

                    const elementPosition =
                      element.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition =
                      elementPosition - headerHeight - extraMargin;

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth",
                    });
                  }
                }}
                className="w-full text-center"
                aria-label="Reservar Ahora - Ir al Formulario"
              >
                Reservar Ahora
              </Button>
            </div>

            {/* Legal Links */}
            <div className="mt-6">
              <Typography
                as="h5"
                variant="h4"
                className="footer-nav-title text-sm mb-3"
              >
                Legal
              </Typography>
              <ul className="footer-nav-list">
                {navigationLinks.legal.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href} className="footer-nav-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <Typography as="p" variant="p" className="footer-copyright">
            © {currentYear} Marcela Cordero. Todos los derechos reservados.
          </Typography>
          <Typography as="p" variant="p" className="footer-made-with">
            Desarrollado por{" "}
            <a
              href="https://paulo-llanos.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--color-primary)] hover:underline font-medium"
            >
              Paulo Llanos
            </a>{" "}
            con ❤️ en Lima
          </Typography>
        </div>
      </div>

      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className="back-to-top hover:scale-105 active:scale-95 transition-transform"
        aria-label="Volver arriba"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
}
