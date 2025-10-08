"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Info, X } from 'lucide-react'

interface ValidationToastProps {
  message: string
  suggestion: string
  onDismiss: () => void
}

export default function ValidationToast({ message, suggestion, onDismiss }: ValidationToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-validation-toast border border-validation-toast rounded-xl p-4 shadow-validation-toast max-w-sm"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5 text-validation-toast-icon" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-validation-toast mb-1">
                {message}
              </h4>
              <p className="text-xs text-validation-toast opacity-90 leading-relaxed">
                {suggestion}
              </p>
            </div>
            
            {/* Close button */}
            <button
              onClick={onDismiss}
              className="flex-shrink-0 p-1 rounded-md hover:bg-black hover:bg-opacity-5 transition-colors"
            >
              <X className="w-4 h-4 text-validation-toast opacity-60" />
            </button>
          </div>
          
          {/* Info footer */}
          <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-validation-toast-border border-opacity-30">
            <Info className="w-3.5 h-3.5 text-validation-toast-accent" />
            <span className="text-xs text-validation-toast-accent font-medium">
              Puedes seguir seleccionando servicios
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}