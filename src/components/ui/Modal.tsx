"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import Typography from "@/components/ui/Typography";
import IconButton from "@/components/ui/IconButton";

export type ModalSize = "sm" | "md" | "lg" | "xl";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-3xl",
  xl: "max-w-4xl",
};

export default function Modal({
  open,
  onClose,
  children,
  size = "md",
  closeOnBackdrop = true,
  closeOnEsc = true,
  ariaLabelledBy,
  ariaDescribedBy,
}: ModalProps) {
  const ref = useClickOutside<HTMLDivElement>(() => {
    if (closeOnBackdrop) onClose();
  });

  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, closeOnEsc, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      aria-hidden={!open}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        className={`bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({
  title,
  icon,
  onClose,
}: {
  title?: string | React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[color:var(--color-border)]">
      <Typography as="h2" variant="h3" className="flex items-center text-[color:var(--color-heading)] font-bold">
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </Typography>
      {onClose && (
        <IconButton
          onClick={onClose}
          className="text-[color:var(--color-muted)] hover:text-[color:var(--color-body)] transition-colors focus-ring"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </IconButton>
      )}
    </div>
  );
}

export function ModalBody({ children }: { children: React.ReactNode }) {
  return <div className="p-4 sm:p-6">{children}</div>;
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 sm:p-6 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-elevated)] rounded-b-xl">
      {children}
    </div>
  );
}