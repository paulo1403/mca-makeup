"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Lock } from "lucide-react";

type AccordionSectionProps = {
  title: string;
  icon: React.ReactNode;
  summary: string | null;
  isOpen: boolean;
  isCompleted: boolean;
  isDisabled: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

export default function AccordionSection({
  title,
  icon,
  summary,
  isOpen,
  isCompleted,
  isDisabled,
  onToggle,
  children,
}: AccordionSectionProps) {
  const canClick = isCompleted || isOpen;

  return (
    <div
      className={`border border-[color:var(--color-border)] rounded-xl overflow-hidden transition-opacity ${
        isDisabled ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <button
        type="button"
        onClick={canClick ? onToggle : undefined}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
          isOpen
            ? "bg-[color:var(--color-primary)]/5"
            : "bg-[color:var(--color-surface)] hover:bg-[color:var(--color-surface)]/80"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
            isCompleted
              ? "bg-[color:var(--color-primary)] text-white"
              : isOpen
                ? "bg-[color:var(--color-primary)]/20 text-[color:var(--color-primary)]"
                : "bg-[color:var(--color-surface)] text-[color:var(--color-body)]"
          }`}
        >
          {isCompleted ? <Check className="w-4 h-4" /> : icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium ${
                isOpen
                  ? "text-[color:var(--color-primary)]"
                  : isCompleted
                    ? "text-[color:var(--color-heading)]"
                    : "text-[color:var(--color-body)]"
              }`}
            >
              {title}
            </span>
            {isDisabled && <Lock className="w-3 h-3 text-[color:var(--color-muted)]" />}
          </div>
          {isCompleted && summary && !isOpen && (
            <p className="text-xs text-[color:var(--color-body)] truncate mt-0.5">{summary}</p>
          )}
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4 text-[color:var(--color-body)]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pt-2 border-t border-[color:var(--color-border)]/30">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
