"use client";

import clsx from "clsx";
import React from "react";

type Variant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "small"
  | "caption";

interface TypographyProps<T extends React.ElementType = "p"> {
  as?: T;
  variant?: Variant;
  className?: string;
  children?: React.ReactNode;
}

export default function Typography<T extends React.ElementType = "p">({
  as,
  variant = "p",
  className,
  children,
  ...props
}: TypographyProps<T> & Omit<React.ComponentProps<T>, "as" | "children">) {
  const Component = as || "p";
  const variantClass = variant === "display" ? "display" : `text-${variant}`;
  // Ensure typography respects global text-transform (e.g. html/body uppercase)
  const incomingStyle = (props as any).style || {};
  const mergedStyle = { ...incomingStyle, textTransform: "inherit" };

  return React.createElement(
    Component,
    { className: clsx(variantClass, className), style: mergedStyle, ...props },
    children
  );
}
