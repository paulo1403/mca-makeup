"use client";

import type { ReactNode } from "react";

interface AdminFormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

const inputBase =
  "w-full rounded-lg border px-3 py-2.5 text-sm bg-[color:var(--color-surface)] text-[color:var(--color-heading)] placeholder:text-[color:var(--color-muted)] border-[color:var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/40 focus:border-[color:var(--color-primary)]/50 transition-all";

export function AdminInput(props: React.ComponentProps<"input">) {
  return <input {...props} className={`${inputBase} ${props.className || ""}`} />;
}

export function AdminSelect(props: React.ComponentProps<"select">) {
  return <select {...props} className={`${inputBase} ${props.className || ""}`} />;
}

export function AdminTextarea(props: React.ComponentProps<"textarea">) {
  return <textarea {...props} className={`${inputBase} min-h-[88px] ${props.className || ""}`} />;
}

export default function AdminFormField({
  label,
  error,
  required,
  children,
  className = "",
}: AdminFormFieldProps) {
  return (
    <label className={`space-y-1 block ${className}`}>
      <span className="text-sm font-medium text-[color:var(--color-heading)]">
        {label}
        {required && <span className="text-[color:var(--color-danger)] ml-0.5">*</span>}
      </span>
      {children}
      {error && <p className="text-xs text-[color:var(--color-danger)] mt-1">{error}</p>}
    </label>
  );
}
