"use client"
import React from 'react'
import { useFormContext, Controller, useWatch } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Building2, MapPin, FileText } from 'lucide-react'
import DistrictSelector from '@/components/DistrictSelector'
import type { BookingData } from '@/lib/bookingSchema'

export default function Step3_Location() {
  const { control, register } = useFormContext<BookingData>()
  const locationType = useWatch({ name: 'locationType', control })

  return (
    <div className="space-y-6">
      {/* Location Type Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.label
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative p-6 rounded-xl cursor-pointer border-2 transition-all duration-200 ${
            locationType === 'STUDIO'
              ? 'border-accent-primary bg-accent-primary/5 shadow-lg shadow-accent-primary/10'
              : 'border-gray-200 dark:border-gray-700 hover:border-accent-primary/30 bg-card hover:shadow-md'
          }`}
        >
          <input {...register('locationType')} type="radio" value="STUDIO" className="hidden" />
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${
              locationType === 'STUDIO' 
                ? 'bg-accent-primary text-white' 
                : 'bg-muted/20 text-muted'
            }`}>
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-heading">Room Studio</h3>
              <p className="text-sm text-muted mt-1">En nuestro estudio profesional</p>
            </div>
          </div>
          {locationType === 'STUDIO' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 w-6 h-6 bg-accent-primary rounded-full flex items-center justify-center"
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </motion.div>
          )}
        </motion.label>

        <motion.label
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative p-6 rounded-xl cursor-pointer border-2 transition-all duration-200 ${
            locationType === 'HOME'
              ? 'border-accent-primary bg-accent-primary/5 shadow-lg shadow-accent-primary/10'
              : 'border-gray-200 dark:border-gray-700 hover:border-accent-primary/30 bg-card hover:shadow-md'
          }`}
        >
          <input {...register('locationType')} type="radio" value="HOME" className="hidden" />
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${
              locationType === 'HOME' 
                ? 'bg-accent-primary text-white' 
                : 'bg-muted/20 text-muted'
            }`}>
              <Home className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-heading">Servicio a Domicilio</h3>
              <p className="text-sm text-muted mt-1">En la comodidad de tu hogar</p>
            </div>
          </div>
          {locationType === 'HOME' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 w-6 h-6 bg-accent-primary rounded-full flex items-center justify-center"
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </motion.div>
          )}
        </motion.label>
      </div>

      {/* Address Form */}
      <AnimatePresence>
        {locationType === 'HOME' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-visible"
          >
            <div className="space-y-4">
              <h4 className="font-serif text-lg font-medium text-heading">
                Información de dirección
              </h4>
              
              <Controller
                name="district"
                control={control}
                render={({ field }) => (
                  <DistrictSelector 
                    value={(field.value as string) || ''} 
                    onChange={(v: string) => field.onChange(v)} 
                  />
                )}
              />

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="w-5 h-5 text-muted" />
                </div>
                <input
                  {...register('address')}
                  placeholder="Dirección completa (Av./Jr./Ca. + número)"
                  className="w-full bg-card border border-transparent focus:border-accent-primary/30 rounded-lg pl-12 pr-4 py-3 placeholder:text-muted text-heading outline-none shadow-sm transition-all duration-200 focus:shadow-md"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FileText className="w-5 h-5 text-muted" />
                </div>
                <input
                  {...register('addressReference')}
                  placeholder="Referencia (cerca de..., frente a..., etc.)"
                  className="w-full bg-card border border-transparent focus:border-accent-primary/30 rounded-lg pl-12 pr-4 py-3 placeholder:text-muted text-heading outline-none shadow-sm transition-all duration-200 focus:shadow-md"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
