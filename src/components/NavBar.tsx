"use client";

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import Button from './ui/Button';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (open) document.body.classList.add('menu-open');
      else document.body.classList.remove('menu-open');
    } catch {}
    return () => { try { document.body.classList.remove('menu-open'); } catch {} };
  }, [open]);

  const items = [
    { href: '#servicios', label: 'Servicios' },
    { href: '#portafolio', label: 'Portafolio' },
    { href: '#sobre-mi', label: 'Sobre Mí' },
    { href: '#contacto', label: 'Contacto' },
  ];

  return (
  <nav className="w-full z-50 md:sticky md:top-0 bg-[color:var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between py-3 md:py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg sm:text-xl font-playfair text-heading hover:opacity-90">Marcela Cordero</Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-6">
            {items.map((it) => (
              <a key={it.href} href={it.href} className="relative text-main hover:text-accent-primary transition-colors px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent-primary/30 rounded" aria-label={it.label}>
                <span className="block">{it.label}</span>
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-accent-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="primary" size="md" onClick={() => { const el = document.getElementById('contacto'); el?.scrollIntoView({behavior:'smooth'}); }} className="min-h-[48px]">Agendar Cita</Button>
          </div>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setOpen((s) => !s)} aria-label="Toggle menu" className="p-3 rounded-md bg-surface hover:bg-surface-2 shadow-sm border" style={{ borderColor: 'var(--color-surface-2)' }}>
            {open ? <X className="w-6 h-6 text-heading" /> : <Menu className="w-6 h-6 text-heading" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-[color:var(--color-background)]" onClick={() => setOpen(false)} />

          <div className="absolute inset-0 mx-auto h-full w-full overflow-auto p-6 transition-transform menu-panel-full" style={{ transformOrigin: 'right center' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="text-lg font-playfair text-heading">Marcela Cordero</div>
              <button onClick={() => setOpen(false)} className="menu-close-btn" aria-label="Cerrar menú">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col">
              {items.map((it) => (
                <a key={it.href} href={it.href} className="menu-link" onClick={() => setOpen(false)}>{it.label}</a>
              ))}
            </nav>

            <div className="menu-ctas">
              <Button variant="primary" size="md" onClick={() => { const el = document.getElementById('contacto'); el?.scrollIntoView({behavior:'smooth'}); setOpen(false); }} className="min-h-[48px]">Agendar Cita</Button>
              <Button variant="secondary" size="md" onClick={() => { const el = document.getElementById('portafolio'); el?.scrollIntoView({behavior:'smooth'}); setOpen(false); }} className="min-h-[48px]">Ver Portafolio</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
