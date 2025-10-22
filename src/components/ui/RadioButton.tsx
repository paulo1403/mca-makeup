"use client";

import clsx from "clsx";
import type React from "react";

interface RadioButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function RadioButton({ label, className, ...props }: RadioButtonProps) {
  return (
    <label className={clsx("inline-flex items-center gap-3 cursor-pointer", className)}>
      <input type="radio" {...props} className="w-4 h-4 text-accent-primary" />
      {label && <span className="text-main text-sm">{label}</span>}
    </label>
  );
}
