"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useFormContext } from 'react-hook-form'
import QuantityControl from './QuantityControl'
import { Info } from 'lucide-react'
import type { Service } from '../../hooks/useServicesQuery'

type Props = {
  service: Service
  index?: number
  fieldName?: string
}

export default function ServiceCard({ service }: Props) {
  const { watch, setValue } = useFormContext()
  const selected = (watch('selectedServices') || []) as Array<{ id: string; quantity: number }>
  const item = selected.find(s => s.id === service.id)
  const qty = item ? item.quantity : 0

  const onChange = (v: number) => {
    const others = selected.filter(s => s.id !== service.id)
    const updated = v > 0 ? [...others, { id: service.id, quantity: v }] : others
    setValue('selectedServices', updated)
  }

  const [open, setOpen] = useState(false)

  const subtotal = service.price * qty

  return (
    <div className="bg-card py-4 rounded-xl border border-transparent hover:border-accent-primary/20 transition-colors shadow-sm overflow-hidden">
      {/* Layout principal: todo en una fila con controles fijos */}
      <div className="flex items-start gap-6">
        {/* Contenido principal: título + info */}
        <div className="flex-1 min-w-0">
          <div className="font-serif text-xl text-heading font-medium leading-snug mb-3 max-w-full break-words pr-4 whitespace-normal">
            {service.name}
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-base text-muted font-medium">
              {service.duration} min • S/ {service.price}
            </span>
            
            {service.description && (
              <div className="relative group">
                <motion.button
                  type="button"
                  onClick={() => setOpen(o => !o)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-7 h-7 rounded-full text-accent-primary bg-transparent hover:bg-accent-primary/10 flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/30"
                  title={open ? 'Ocultar información' : 'Ver más información'}
                  aria-expanded={open}
                >
                  <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.18 }}>
                    <Info className="w-4 h-4" />
                  </motion.div>
                </motion.button>

                {/* Tooltip mejorado */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                  {open ? 'Ocultar información' : 'Ver más información'}
                </div>
              </div>
            )}

            {qty > 0 && (
              <div className="px-4 py-2 bg-accent-primary/15 text-accent-primary text-base rounded-full font-semibold border border-accent-primary/20">
                S/ {subtotal}
              </div>
            )}
          </div>
        </div>

        {/* Controles fijos a la derecha */}
        <div className="flex-shrink-0 self-start mt-1 w-36">
          <QuantityControl value={qty} onChange={onChange} />
        </div>
      </div>

      {/* Descripción expandible */}
      {service.description && open && (
        <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-base text-muted leading-relaxed">
            {service.description}
          </div>
        </div>
      )}
    </div>
  )
}
