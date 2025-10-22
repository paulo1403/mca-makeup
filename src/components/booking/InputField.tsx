"use client";
import Typography from "@/components/ui/Typography";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface InputFieldProps {
  type?: string;
  placeholder: string;
  icon: React.ReactNode;
  field: {
    value?: string;
    onChange: (value: unknown) => void;
    onBlur: () => void;
    name: string;
  };
  label: string;
  error?: string | null;
  formatValue?: (value: string) => string;
  helperText?: string;
  required?: boolean;
}

export default function InputField({
  type = "text",
  placeholder,
  icon,
  field,
  label,
  formatValue,
  error,
  helperText,
  required = false,
}: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!(field.value ?? ""));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatValue ? formatValue(e.target.value) : e.target.value;
    field.onChange(value);
    setHasValue(!!value);
  };

  const handleFocus = () => {
    setIsFocused(true);
    field.onBlur();
  };

  const handleBlur = () => {
    setIsFocused(false);
    field.onBlur();
  };

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-2">
        <Typography
          as="label"
          variant="small"
          className="font-medium text-[color:var(--color-heading)] flex items-center gap-1"
        >
          {label}
          {required && <span className="text-[color:var(--color-accent)]">*</span>}
        </Typography>
        {hasValue && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
          </motion.div>
        )}
      </div>

      <div className="relative">
        <div
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${
            error
              ? "text-red-500"
              : isFocused
                ? "text-[color:var(--color-primary)]"
                : "text-[color:var(--color-body)]"
          }`}
        >
          {icon}
        </div>
        <input
          value={field.value ?? ""}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          name={field.name}
          type={type}
          placeholder={placeholder}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={`${field.name}-helper`}
          style={{
            WebkitBoxShadow: "0 0 0 30px var(--color-surface) inset",
            WebkitTextFillColor: "var(--color-text-primary)",
          }}
          className={`w-full pl-12 pr-4 py-4 rounded-xl bg-[color:var(--color-surface)] text-[color:var(--color-text-primary)] placeholder:text-[color:var(--color-body)]/50 transition-all duration-200 focus:outline-none autofill-input ${
            error
              ? "border-2 border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              : isFocused
                ? "border-2 border-[color:var(--color-primary)] focus:ring-2 focus:ring-[color:var(--color-primary)]/20"
                : "border border-[color:var(--color-border)] hover:border-[color:var(--color-primary)]/50"
          }`}
        />

        {/* Indicador de estado animado */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <AlertCircle className="w-5 h-5 text-red-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {error ? (
          <motion.div
            id={`${field.name}-helper`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Typography
              as="p"
              variant="caption"
              className="mt-2 text-red-500 flex items-center gap-1"
              role="alert"
            >
              <AlertCircle className="w-3 h-3" />
              {error}
            </Typography>
          </motion.div>
        ) : helperText ? (
          <motion.div
            id={`${field.name}-helper`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Typography as="p" variant="caption" className="mt-2 text-[color:var(--color-body)]">
              {helperText}
            </Typography>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
