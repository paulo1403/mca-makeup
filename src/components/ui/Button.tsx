"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-hover)]",
        primary: "bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-hover)]",
        secondary:
          "bg-[color:var(--color-surface-elevated)] text-[color:var(--color-on-surface)] border border-[color:var(--color-border)] hover:bg-[color:var(--color-surface)]",
        ghost: "bg-transparent text-[color:var(--color-muted)] hover:text-[color:var(--color-on-surface)] hover:bg-[color:var(--color-surface-elevated)]",
        outline:
          "bg-[color:var(--color-surface)] text-[color:var(--color-on-surface)] border border-[color:var(--color-border)] hover:bg-[color:var(--color-surface-elevated)]",
        destructive: "bg-danger text-on-danger hover:opacity-90",
        danger: "bg-danger text-on-danger hover:opacity-90",
        soft: "bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/15",
        whatsapp: "bg-[#25D366] text-white hover:bg-[#1DAE56]",
        link: "bg-transparent text-[color:var(--color-primary)] underline-offset-4 hover:underline p-0 h-auto",
        info: "bg-info text-on-info hover:opacity-90",
      },
      size: {
        default: "h-9 px-4 py-2 text-sm",
        xs: "h-7 px-2 py-1 text-xs",
        sm: "h-8 px-3 py-1.5 text-sm",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-11 px-5 py-2.5 text-base",
        xl: "h-12 px-6 py-3 text-base",
        icon: "h-9 w-9",
        "icon-xs": "h-6 w-6",
        "icon-sm": "h-7 w-7",
        "icon-lg": "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type PolymorphicProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className"> &
  VariantProps<typeof buttonVariants>;

function Button<T extends React.ElementType = "button">({
  as,
  className,
  variant,
  size,
  ...props
}: PolymorphicProps<T>) {
  const Comp = (as || "button") as React.ElementType;

  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
export default Button;
