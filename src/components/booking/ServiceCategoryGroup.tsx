'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Package } from 'lucide-react'
import ServiceCard from './ServiceCard'
import type { Service } from '../../hooks/useServicesQuery'
import { CATEGORY_LABELS } from '@/lib/serviceRules'

type Props = {
  category: string
  services: Service[]
  fieldName: string
}

export default function ServiceCategoryGroup({ category, services, fieldName }: Props) {
  const label = CATEGORY_LABELS[category] ?? category
  const [isExpanded, setIsExpanded] = useState(true)
  
  return (
    <section className="space-y-3">
      {/* Category Header */}
      <div className="bg-category border border-category rounded-xl p-4">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left group"
          aria-expanded={isExpanded}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-primary/10 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-category" />
            </div>
            <div>
              <h3 className="text-category font-bold text-lg">
                {label}
              </h3>
              <p className="text-category-count text-sm font-medium">
                {services.length} {services.length === 1 ? 'servicio' : 'servicios'}
              </p>
            </div>
          </div>
          
          <motion.div
            animate={{ rotate: isExpanded ? 0 : -90 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="text-category group-hover:text-accent-primary transition-colors"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </button>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                >
                  <ServiceCard service={service} index={index} fieldName={fieldName} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
