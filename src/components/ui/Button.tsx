"use client";

import React from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "soft" | "glass" | "whatsapp" | "danger";
type Size = "xs" | "sm" | "md" | "lg";

type AsProp<T extends React.ElementType> = {
  as?: T;
};

type PropsToOmit<T extends React.ElementType, P> = P & Omit<React.ComponentPropsWithoutRef<T>, keyof P>;

type ButtonOwnProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: React.ReactNode;
};

export default function Button<T extends React.ElementType = 'button'>({
  as,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: PropsToOmit<T, ButtonOwnProps & AsProp<T>>) {
  const Component: React.ElementType = as || 'button';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;

  const combinedProps = { className: clsx('btn', variantClass, sizeClass, className), ...(props as object) };
  return React.createElement(Component, combinedProps, children);
}
