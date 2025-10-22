"use client";

import clsx from "clsx";
import type React from "react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function IconButton({ children, className, ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      className={clsx("p-2 rounded-md inline-flex items-center justify-center", className)}
    >
      {children}
    </button>
  );
}
