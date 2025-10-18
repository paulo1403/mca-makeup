"use client";

import { motion } from "framer-motion";
import Typography from "@/components/ui/Typography";

interface DashboardSectionProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  id?: string;
}

export default function DashboardSection({ title, subtitle, action, children, id }: DashboardSectionProps) {
  return (
    <section id={id} className="relative mb-6 sm:mb-8">
      {(title || subtitle) && (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-3">
          <div>
            {title && (
              <Typography as="h3" variant="h3" className="text-lg sm:text-xl font-bold text-[color:var(--color-heading)]">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography as="p" variant="small" className="text-[color:var(--color-muted)] mt-0.5">
                {subtitle}
              </Typography>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-xl bg-[color:var(--color-surface)] border border-[color:var(--color-border)]/30 shadow-sm"
      >
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </motion.div>
    </section>
  );
}