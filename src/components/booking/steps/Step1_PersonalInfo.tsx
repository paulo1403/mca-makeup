"use client"
import React, { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { User, Phone, Mail, Lock } from 'lucide-react'
import type { BookingData } from '@/lib/bookingSchema'

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
  const [key, setKey] = useState(0)

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-theme'
        ) {
          setKey(prev => prev + 1)
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })

    return () => observer.disconnect()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatValue ? formatValue(e.target.value) : e.target.value
    field.onChange(value)
  }

  return (
    <div className="group">
      <label className="block text-sm font-medium text-heading mb-2 transition-colors">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted group-focus-within:text-accent-primary transition-colors duration-200">
          {icon}
        </div>
        <input
          key={key}
          value={field.value}
          onChange={handleChange}
          onBlur={field.onBlur}
          name={field.name}
          type={type}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : 'false'}
          className={`w-full pl-11 pr-4 py-4 bg-surface rounded-xl text-heading placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-all duration-200 hover:border-accent-primary/50 ${error ? 'border border-red-400' : 'border border-gray-200 dark:border-gray-700'}`}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>}
    </div>
  )
}

export default function Step1_PersonalInfo() {
  const { control } = useFormContext<BookingData>()
  
  return (
    <div className="space-y-8">
      {/* Header elegante */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full flex items-center justify-center shadow-lg">
            <User className="w-6 h-6 text-black dark:text-white" />
          </div>
        </div>
        <h3 className="text-xl font-serif text-heading">Información Personal</h3>
        <p className="text-sm text-muted max-w-md mx-auto">
          Comparte tus datos para que podamos crear la experiencia perfecta para ti
        </p>
      </div>

      {/* Formulario con espaciado mejorado */}
      <div className="space-y-6">
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
              placeholder="+51 989 164 990"
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
      </div>

      {/* Mensaje de confianza */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent-primary/10 rounded-full">
          <Lock className="w-4 h-4 text-accent-primary" />
          <span className="text-xs text-muted font-medium">Tu información está segura con nosotros</span>
        </div>
      </div>
    </div>
  )
}
