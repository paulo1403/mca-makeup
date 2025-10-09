"use client"
import React, { useEffect } from 'react'
import { useFormContext, Controller, useWatch } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, MapPin, FileText, Check } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useTransportCost } from '@/hooks/useTransportCost'
import DistrictSelector from '@/components/DistrictSelector'
import type { BookingData } from '@/lib/bookingSchema'

export default function Step3_Location() {
  const { control, register, setValue } = useFormContext<BookingData>()
  const locationType = useWatch({ name: 'locationType', control })
  const { isDark } = useTheme()
  const district = useWatch({ name: 'district', control })
  const { transportCost, loading, error, getTransportCost } = useTransportCost()

  useEffect(() => {
    if (district) {
      getTransportCost(String(district))
    }
  }, [district, getTransportCost])

  return (
    <div className="space-y-8">
      {/* Encabezado minimalista */}
      <div className="space-y-2">
        <h2 className="font-serif text-xl sm:text-2xl text-heading">¿Dónde te atiendo?</h2>
        <p className="text-sm text-muted">Elige una opción y, si es a domicilio, completa tu dirección.</p>
      </div>

      {/* Selección de tipo de ubicación */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="radiogroup" aria-label="Selecciona el tipo de ubicación">
        <motion.label
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          tabIndex={0}
          role="radio"
          aria-checked={locationType === 'STUDIO'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setValue('locationType', 'STUDIO')
            }
          }}
          className={`relative p-6 rounded-xl cursor-pointer border-2 transition-colors duration-200 focus-within:ring-2 focus-within:ring-accent-primary/40 ${
            locationType === 'STUDIO'
              ? 'border-accent-primary bg-card'
              : `${isDark ? 'border-[#404040]' : 'border-[#D1D5DB]'} bg-card hover:border-accent-primary/30`
          }`}
        >
          <input {...register('locationType')} type="radio" value="STUDIO" className="hidden" />
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-muted/20">
              <MapPin className="w-6 h-6 text-main" />
            </div>
            <div>
              <h3 className={`font-serif text-lg font-medium ${locationType === 'STUDIO' ? 'text-accent-primary' : 'text-heading'}`}>Room Studio (Sede)</h3>
              <p className="text-sm text-muted mt-1">Sin costo adicional</p>
            </div>
          </div>
          {locationType === 'STUDIO' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 w-6 h-6 bg-accent-primary rounded-full flex items-center justify-center shadow-sm"
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </motion.label>

        <motion.label
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          tabIndex={0}
          role="radio"
          aria-checked={locationType === 'HOME'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setValue('locationType', 'HOME')
            }
          }}
          className={`relative p-6 rounded-xl cursor-pointer border-2 transition-colors duration-200 focus-within:ring-2 focus-within:ring-accent-primary/40 ${
            locationType === 'HOME'
              ? 'border-accent-primary bg-card'
              : `${isDark ? 'border-[#404040]' : 'border-[#D1D5DB]'} bg-card hover:border-accent-primary/30`
          }`}
        >
          <input {...register('locationType')} type="radio" value="HOME" className="hidden" />
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-muted/20">
              <Home className="w-6 h-6 text-accent-secondary" />
            </div>
            <div>
              <h3 className={`font-serif text-lg font-medium ${locationType === 'HOME' ? 'text-accent-primary' : 'text-heading'}`}>Servicio a Domicilio</h3>
              <p className="text-sm text-muted mt-1">Costo de transporte adicional según tu distrito</p>
            </div>
          </div>
          {locationType === 'HOME' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 w-6 h-6 bg-accent-primary rounded-full flex items-center justify-center shadow-sm"
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </motion.label>
      </div>

      {/* Bloque dinámico para Servicio a Domicilio */}
      <AnimatePresence>
        {locationType === 'HOME' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-visible"
          >
            <div className="space-y-7 border rounded-xl p-6 mt-4 bg-accent-primary/5 border-accent-primary">
              <h4 className="font-serif text-lg font-medium text-heading">
                Detalles del Servicio a Domicilio
              </h4>

              <Controller
                name="district"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-accent-primary mb-2">Tu Distrito</label>
                    <DistrictSelector 
                      value={(field.value as string) || ''} 
                      onChange={(v: string) => {
                        field.onChange(v)
                        getTransportCost(v)
                      }} 
                    />

                    {/* Indicador de costo de transporte */}
                    <div className="mt-3" aria-live="polite">
                      {loading && (
                        <p className="text-sm text-muted">Calculando costo de transporte...</p>
                      )}
                      {!loading && error && (
                        <p className="text-sm text-red-600">{error}</p>
                      )}
                      {!loading && !error && transportCost && (
                    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-transparent">
                          <span className="text-sm text-heading">Costo de transporte a</span>
                          <span className="text-sm font-medium text-heading">{transportCost.district}</span>
                          <span className="text-sm font-semibold text-accent-secondary">S/ {transportCost.cost.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              />

              <div>
                <label className="block text-sm font-medium text-accent-primary mb-2">Dirección Completa</label>
                <div className="relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-4 pointer-events-none">
                    <MapPin className="w-5 h-5 text-input-placeholder" />
                  </div>
                  <input
                    {...register('address')}
                    placeholder="Dirección completa (Av./Jr./Ca. + número)"
                    required
                    aria-required="true"
                    className="w-full bg-input border border-input rounded-lg pl-12 pr-4 py-4 placeholder:text-input-placeholder text-main outline-none transition-all duration-200 focus:border-input-focus"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-accent-primary mb-2">Referencia (Opcional)</label>
                <div className="relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-4 pointer-events-none">
                    <FileText className="w-5 h-5 text-input-placeholder" />
                  </div>
                  <input
                    {...register('addressReference')}
                    placeholder="Referencia (cerca de..., frente a..., etc.)"
                    className="w-full bg-input border border-input rounded-lg pl-12 pr-4 py-4 placeholder:text-input-placeholder text-main outline-none transition-all duration-200 focus:border-input-focus"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
