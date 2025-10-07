'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
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
    <section className="space-y-4">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left group hover:bg-accent-primary/5 rounded-lg p-2 -m-2 transition-colors"
        aria-expanded={isExpanded}
      >
        <h3 className="text-accent-primary font-semibold uppercase tracking-widest text-sm group-hover:text-accent-primary/80">
          {label}
        </h3>
        <motion.div
          animate={{ rotate: isExpanded ? 0 : -90 }}
          transition={{ duration: 0.2 }}
          className="text-accent-primary/70 group-hover:text-accent-primary"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-3">
              {services.map((s, i) => (
                <ServiceCard key={s.id} service={s} index={i} fieldName={fieldName} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
