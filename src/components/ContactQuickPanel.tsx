"use client"

import React, { useState } from 'react'
import { Phone, Mail, MapPin, Instagram, Copy } from 'lucide-react'

interface Props {
  variant?: 'sidebar' | 'footer'
}

export default function ContactQuickPanel({ variant = 'sidebar' }: Props) {
  const [copied, setCopied] = useState(false)
  const phoneNumber = '+51 989 164 990'
  const phoneHref = 'tel:+51989164990'
  const emailAddress = 'contacto@marcelacordero.com'
  const emailHref = `mailto:${emailAddress}`
  const studioAddress = 'Av. Bolívar 1073, Pueblo Libre, Lima'
  const mapsHref = `https://www.google.com/maps?q=${encodeURIComponent(studioAddress)}`

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }
  if (variant === 'footer') {
    return (
      <div className="fixed bottom-6 left-6 right-6 z-40 lg:hidden">
        <div className="bg-card border border-accent-primary rounded-lg p-4 shadow-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-h-[44px]">
            <Phone className="w-5 h-5 text-accent-primary" />
            <a href={phoneHref} className="text-sm font-medium text-main hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40 rounded">
              {phoneNumber}
            </a>
            <button
              type="button"
              onClick={copyPhone}
              className="inline-flex items-center gap-1 text-sm text-muted hover:text-accent-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-secondary/40 px-2 py-1 rounded"
              aria-label="Copiar número de teléfono"
              title="Copiar"
            >
              <Copy className="w-4 h-4 text-accent-secondary" />
              <span>Copiar</span>
            </button>
          </div>
          <div className="flex items-center gap-3 min-h-[44px]">
            <Mail className="w-5 h-5 text-accent-primary" />
            <a href={emailHref} className="text-sm text-main hover:text-accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40 rounded">
              {emailAddress}
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <aside className="bg-contact rounded-xl p-6 sticky top-24 shadow-md">
      <h4 className="font-serif text-lg text-accent-primary">¿Necesitas Ayuda? Contacto rápido</h4>
      <div className="mt-4 space-y-3 text-sm" aria-live="polite">
        {/* Teléfono (mini-tarjeta) */}
        <div className="group rounded-lg px-4 py-3 bg-[color:var(--color-surface-2)] border border-[color:var(--card-border)] hover:border-accent-primary hover:shadow-md transition-all">
          <div className="flex items-center justify-between gap-3">
            <a href={phoneHref} aria-label="Llamar por teléfono" className="flex items-center gap-3 text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/40 rounded">
              <Phone className="w-5 h-5 text-accent-primary" />
              <span className="font-medium">{phoneNumber}</span>
            </a>
            <button
              type="button"
              onClick={copyPhone}
              className="inline-flex items-center gap-1 text-muted hover:text-accent-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-secondary/40 px-2 py-1 rounded"
              aria-label="Copiar número de teléfono"
              title="Copiar número"
            >
              <Copy className="w-4 h-4 text-accent-secondary" />
              <span>Copiar</span>
            </button>
          </div>
          {copied && (
            <div className="mt-2 text-xs text-accent-secondary">Copiado</div>
          )}
        </div>

        {/* Correo (mini-tarjeta) */}
        <a href={emailHref} aria-label="Enviar correo" className="group rounded-lg px-4 py-3 bg-[color:var(--color-surface-2)] border border-[color:var(--card-border)] hover:border-accent-primary hover:shadow-md transition-all flex items-center gap-3">
          <Mail className="w-5 h-5 text-accent-primary" />
          <span className="text-main font-medium">{emailAddress}</span>
        </a>

        {/* Dirección (mini-tarjeta) */}
        <a href={mapsHref} target="_blank" rel="noopener noreferrer" aria-label="Abrir en Google Maps" className="group rounded-lg px-4 py-3 bg-[color:var(--color-surface-2)] border border-[color:var(--card-border)] hover:border-accent-primary hover:shadow-md transition-all flex items-center gap-3">
          <MapPin className="w-5 h-5 text-accent-primary" />
          <span className="text-main font-medium">{studioAddress}</span>
        </a>

        {/* Instagram (mini-tarjeta) */}
        <a href="https://instagram.com/marcelacorderobeauty" target="_blank" rel="noopener noreferrer" aria-label="Ir a Instagram" className="group rounded-lg px-4 py-3 bg-[color:var(--color-surface-2)] border border-[color:var(--card-border)] hover:border-accent-primary hover:shadow-md transition-all flex items-center gap-3">
          <Instagram className="w-5 h-5 text-accent-primary" />
          <span className="text-main font-medium group-hover:text-accent-primary">@marcelacorderobeauty</span>
        </a>
      </div>
    </aside>
  )
}