"use client"
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { motion } from 'framer-motion'
import { User, Phone, Mail, Lock } from 'lucide-react'
import type { BookingData } from '@/lib/bookingSchema'
import Typography from '@/components/ui/Typography'
import '@/styles/components/step1.css'

function formatPhone(value: string) {
  const v = value.replace(/[^\d+]/g, '')
  if (v.startsWith('+51')) {
    const digits = v.substring(3)
    if (digits.length <= 3) return `+51 ${digits}`
    if (digits.length <= 6) return `+51 ${digits.substring(0,3)} ${digits.substring(3)}`
    return `+51 ${digits.substring(0,3)} ${digits.substring(3,6)} ${digits.substring(6,9)}`
  }
  if (v.startsWith('9') && !v.startsWith('+')) {
    if (v.length <= 3) return v
    if (v.length <= 6) return `${v.substring(0,3)} ${v.substring(3)}`
    return `${v.substring(0,3)} ${v.substring(3,6)} ${v.substring(6,9)}`
  }
  return value
}

interface InputFieldProps {
  type?: string
  placeholder: string
  icon: React.ReactNode
  field: {
    value: string
    onChange: (value: string) => void
    onBlur: () => void
    name: string
  }
  label: string
  error?: string | null
  formatValue?: (value: string) => string
}

const InputField = ({ type = "text", placeholder, icon, field, label, formatValue, error }: InputFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatValue ? formatValue(e.target.value) : e.target.value
    field.onChange(value)
  }

  return (
    <div className="group">
      <Typography as="label" variant="small" className="block font-medium text-accent-primary mb-2 transition-colors">
        {label}
      </Typography>
      <div className="relative">
        <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
          error 
            ? 'text-red-500' 
            : 'text-muted group-focus-within:text-accent-primary'
        }`}>
          {icon}
        </div>
        <input
          value={field.value}
          onChange={handleChange}
          onBlur={field.onBlur}
          name={field.name}
          type={type}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : 'false'}
          style={{
            WebkitBoxShadow: '0 0 0 30px var(--color-surface-secondary) inset',
            WebkitTextFillColor: 'var(--color-text-primary)',
          }}
          className={`w-full pl-11 pr-4 py-4 rounded-xl bg-input text-input placeholder:text-muted transition-all duration-200 focus:outline-none autofill-input ${
            error 
              ? 'border-2 border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
              : 'border border-input hover:border-accent-primary/50 focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20'
          }`}
        />
      </div>
      {error && (
        <Typography as="p" variant="caption" className="mt-2 !text-red-500" role="alert">
          {error}
        </Typography>
      )}
    </div>
  )
}

export default function Step1_PersonalInfo() {
  const { control } = useFormContext<BookingData>()
  
  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header elegante */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full flex items-center justify-center shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>
        <Typography as="h3" variant="h3" className="text-accent-primary font-serif">
          Información Personal
        </Typography>
        <Typography as="p" variant="small" className="text-muted max-w-md mx-auto">
          Comparte tus datos para que podamos crear la experiencia perfecta para ti
        </Typography>
      </div>

      {/* Formulario con espaciado mejorado */}
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <InputField
              placeholder="Ingresa tu nombre completo"
              icon={<User className="w-5 h-5" />}
              field={field}
              label="Nombre completo"
              error={fieldState.error?.message ?? null}
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState }) => (
            <InputField
              type="tel"
              placeholder="+51 989 164 990 o 989 164 990"
              icon={<Phone className="w-5 h-5" />}
              field={field}
              label="Número de teléfono"
              formatValue={formatPhone}
              error={fieldState.error?.message ?? null}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <InputField
              type="email"
              placeholder="tu@email.com"
              icon={<Mail className="w-5 h-5" />}
              field={field}
              label="Correo electrónico"
              error={fieldState.error?.message ?? null}
            />
          )}
        />
      </motion.div>

      {/* Mensaje de confianza */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent-primary/10 rounded-full">
          <Lock className="w-4 h-4 text-accent-primary" />
          <Typography as="span" variant="caption" className="text-muted font-medium">
            Tu información está segura con nosotros
          </Typography>
        </div>
      </motion.div>
    </motion.div>
  )
}
