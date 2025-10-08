"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFormContext } from 'react-hook-form'
import QuantityControl from './QuantityControl'
import { Info, Clock, Banknote } from 'lucide-react'
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

  const [showDescription, setShowDescription] = useState(false)
  const subtotal = service.price * qty
  const isSelected = qty > 0

  return (
    <motion.div
      layout
      className={`
        bg-service-card rounded-2xl border transition-all duration-300 overflow-hidden
        ${isSelected 
          ? 'border-service-card-selected shadow-service-card-selected' 
          : 'border-service-card hover:border-service-card-selected shadow-service-card hover:shadow-service-card-hover'
        }
      `}
    >
      {/* Main Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h4 className="text-service-title font-bold text-lg leading-tight mb-2 line-clamp-2">
              {service.name}
            </h4>
            
            {/* Service Info */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-service-duration">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{service.duration} min</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-service-price-highlight">
                <Banknote className="w-4 h-4" />
                <span className="font-bold">S/ {service.price}</span>
              </div>
            </div>
          </div>

          {/* Info Button */}
          {service.description && (
            <motion.button
              type="button"
              onClick={() => setShowDescription(!showDescription)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200
                ${showDescription 
                  ? 'bg-accent-primary text-white' 
                  : 'bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20'
                }
              `}
              title={showDescription ? 'Ocultar información' : 'Ver más información'}
            >
              <motion.div
                animate={{ rotate: showDescription ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Info className="w-4 h-4" />
              </motion.div>
            </motion.button>
          )}
        </div>

        {/* Quantity Control */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {isSelected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-service-price text-service-price rounded-full text-sm font-bold border border-service-price"
              >
                <span>Total: S/ {subtotal}</span>
              </motion.div>
            )}
          </div>
          
          <QuantityControl value={qty} onChange={onChange} />
        </div>
      </div>

      {/* Description */}
      <AnimatePresence>
        {service.description && showDescription && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <div className="bg-service-description border border-service-description rounded-xl p-4">
                <p className="text-service-subtitle text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="h-1 bg-gradient-to-r from-accent-primary to-accent-secondary origin-left"
        />
      )}
    </motion.div>
  )
}
