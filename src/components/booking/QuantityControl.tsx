"use client"
import React from 'react'
import { Minus, Plus } from 'lucide-react'

interface Props {
  value: number
  onChange: (v: number) => void
}

export default function QuantityControl({ value, onChange }: Props) {
  const setValue = (v: number) => onChange(v)

  return (
    <div className="inline-flex items-center gap-3">
      <button
        type="button"
        onClick={() => setValue(Math.max(0, value - 1))}
        aria-label="Disminuir"
        className="w-10 h-10 rounded-lg bg-transparent border-2 border-accent-secondary px-2 flex items-center justify-center text-accent-secondary hover:bg-accent-secondary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-secondary/30"
      >
        <Minus className="w-4 h-4" />
      </button>
      <div className="w-8 text-center font-medium text-heading">{value}</div>
      <button
        type="button"
        onClick={() => setValue(value + 1)}
        aria-label="Aumentar"
        className="w-10 h-10 rounded-lg bg-transparent border-2 border-accent-secondary px-2 flex items-center justify-center text-accent-secondary hover:bg-accent-secondary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-secondary/30"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}
