"use client";

import React from "react";
import clsx from "clsx";

type Variant = "display" | "h1" | "h2" | "h3" | "h4" | "p" | "small" | "caption";

interface TypographyProps<T extends React.ElementType = 'p'> {
  as?: T;
  variant?: Variant;
  className?: string;
  children?: React.ReactNode;
}

export default function Typography<T extends React.ElementType = 'p'>({ as, variant = 'p', className, children, ...props }: TypographyProps<T> & Omit<React.ComponentProps<T>, 'as' | 'children'>) {
  const Component = as || 'p';
  const variantClass = variant === 'display' ? 'display' : `text-${variant}`;
  return (
    // Type is safe because Component is an ElementType
    React.createElement(Component, { className: clsx(variantClass, className), ...props }, children)
  );
}
