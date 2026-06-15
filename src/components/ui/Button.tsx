"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)] active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:outline-2 aria-invalid:outline-offset-2 aria-invalid:outline-destructive/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "relative overflow-hidden bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-primary-hover)] text-[color:var(--color-cta-text)] shadow-[0_4px_14px_-4px_color-mix(in_srgb,var(--color-primary)_40%,transparent)] hover:shadow-[0_8px_20px_-6px_color-mix(in_srgb,var(--color-primary)_50%,transparent)] hover:-translate-y-0.5 active:translate-y-0 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-full",
        default:
          "relative overflow-hidden bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-primary-hover)] text-[color:var(--color-cta-text)] shadow-[0_4px_14px_-4px_color-mix(in_srgb,var(--color-primary)_40%,transparent)] hover:shadow-[0_8px_20px_-6px_color-mix(in_srgb,var(--color-primary)_50%,transparent)] hover:-translate-y-0.5 active:translate-y-0 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-full",
        soft: "bg-[color:var(--color-accent-soft)] text-[color:var(--color-primary)] hover:bg-[color:var(--color-accent)]/30",
        outline:
          "border-2 border-[color:var(--color-primary)] bg-transparent text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)] hover:text-[color:var(--color-cta-text)] aria-expanded:bg-[color:var(--color-primary)] aria-expanded:text-[color:var(--color-cta-text)]",
        secondary:
          "border-2 border-[color:var(--color-primary)] bg-transparent text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)] hover:text-[color:var(--color-cta-text)] aria-expanded:bg-[color:var(--color-primary)] aria-expanded:text-[color:var(--color-cta-text)]",
        ghost:
          "bg-transparent text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/10 aria-expanded:bg-[color:var(--color-primary)]/10",
        whatsapp:
          "relative overflow-hidden bg-gradient-to-br from-[#25d366] to-[#20ba5a] text-white shadow-[0_4px_14px_-4px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_20px_-6px_rgba(37,211,102,0.5)] hover:-translate-y-0.5 active:translate-y-0 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-transform before:duration-500 hover:before:translate-x-full",
        danger:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:outline-destructive/40",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:outline-destructive/40",
        link: "text-[color:var(--color-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-1.5 px-4 py-2 rounded-lg has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        md: "h-10 gap-1.5 px-5 py-2.5 rounded-xl has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 rounded-lg px-2.5 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-lg px-3.5 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 gap-2 px-6 py-3 rounded-xl text-base in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4 [&_svg:not([class*='size-'])]:size-5",
        xl: "h-14 gap-2 px-8 py-4 rounded-2xl text-lg in-data-[slot=button-group]:rounded-xl has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5 [&_svg:not([class*='size-'])]:size-5",
        "2xl":
          "h-16 gap-3 px-10 py-5 rounded-2xl text-xl in-data-[slot=button-group]:rounded-xl has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6 [&_svg:not([class*='size-'])]:size-6",
        icon: "size-9 rounded-lg",
        "icon-xs": "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-lg [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-10 rounded-xl [&_svg:not([class*='size-'])]:size-5",
        "icon-xl": "size-12 rounded-xl [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    as?: "button" | "a";
    href?: string;
    target?: string;
    rel?: string;
  };

function Button({
  className,
  variant = "default",
  size = "default",
  as = "button",
  href,
  target,
  rel,
  render,
  ...props
}: ButtonProps) {
  if (as === "a") {
    return (
      <ButtonPrimitive
        data-slot="button"
        nativeButton={false}
        className={cn(buttonVariants({ variant, size, className }))}
        render={render ?? <a href={href} target={target} rel={rel} />}
        {...props}
      />
    );
  }

  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      render={render}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export default Button;
