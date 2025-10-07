"use client";

import React from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export default function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2";
  const press = "btn-press";
  const variants: Record<Variant, string> = {
    primary: "btn-gradient-primary shadow-lg",
    secondary: "btn-gradient-secondary",
    ghost: "bg-transparent text-[color:var(--color-body)] hover:bg-[color:var(--color-surface-2)]",
  };
  const sizes: Record<Size, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button className={clsx(base, press, variants[variant], sizes[size], className)} {...props} />
  );
}
