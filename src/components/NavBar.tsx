"use client";

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import Button from './ui/Button';
import Logo from './Logo';
import styles from './NavBar.module.css';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (open) {
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
      } else {
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
      }
    } catch {}
    return () => {
      try {
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
      } catch {}
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const items = [
    { href: '#servicios', label: 'Servicios' },
    { href: '#portafolio', label: 'Portafolio' },
    { href: '#sobre-mi', label: 'Sobre Mí' },
    { href: '#contacto', label: 'Contacto' },
  ];

  return (
    <nav className={styles.navRoot} aria-label="Barra de navegación">
      <div className={styles.navInner}>
        {/* Marca */}
        <div className={styles.brand}>
          <Logo size={40} />
          <span className={styles.brandName}>Marcela Cordero</span>
        </div>

        {/* Desktop */}
        <div className={styles.desktop}>
          <div className={styles.links}>
            {items.map((it) => (
              <a key={it.href} href={it.href} className={styles.link} aria-label={it.label}>
                <span>{it.label}</span>
                <span className={styles.linkUnderline} />
              </a>
            ))}
          </div>
          <div className={styles.actions}>
            <ThemeToggle />
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                const el = document.getElementById('contacto');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={styles.ctaButton}
            >
              Agendar Cita
            </Button>
          </div>
        </div>

        {/* Mobile */}
        <div className={styles.mobile}>
          <ThemeToggle />
          <button
            onClick={() => setOpen((s) => !s)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="mobile-menu-panel"
            className={styles.burger}
          >
            {open ? <X className="w-6 h-6 text-heading" /> : <Menu className="w-6 h-6 text-heading" />}
          </button>
        </div>
      </div>

      {/* Mobile menu (siempre montado para animación de cierre) */}
      <div className="md:hidden">
        <div
          className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`}
          onClick={() => setOpen(false)}
          aria-hidden={!open}
        />
        <aside
          id="mobile-menu-panel"
          role="dialog"
          aria-modal={open}
          aria-label="Menú de navegación"
          className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
        >
          <div className={styles.panelHeader}>
            <button onClick={() => setOpen(false)} className={styles.panelCloseBtn} aria-label="Cerrar menú">
              <X className="w-6 h-6 text-heading" />
            </button>
          </div>
          <nav className={styles.panelNav}>
            {items.map((it) => (
              <a key={it.href} href={it.href} className={styles.panelLink} onClick={() => setOpen(false)}>
                {it.label}
              </a>
            ))}
          </nav>
          <div className={styles.panelCtas}>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                const el = document.getElementById('contacto');
                el?.scrollIntoView({ behavior: 'smooth' });
                setOpen(false);
              }}
              className={styles.ctaButton}
            >
              Agendar Cita
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                const el = document.getElementById('portafolio');
                el?.scrollIntoView({ behavior: 'smooth' });
                setOpen(false);
              }}
              className={styles.ctaButton}
            >
              Ver Portafolio
            </Button>
          </div>
        </aside>
      </div>
    </nav>
  );
}
