"use client";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import React from "react";

interface Props {
  value: number;
  onChange: (v: number) => void;
}

export default function QuantityControl({ value, onChange }: Props) {
  const setValue = (v: number) => onChange(v);
  const isSelected = value > 0;

  return (
    <div className="flex items-center gap-2">
      {/* Decrease Button */}
      <motion.button
        type="button"
        onClick={() => setValue(Math.max(0, value - 1))}
        disabled={value === 0}
        whileHover={{ scale: value > 0 ? 1.05 : 1 }}
        whileTap={{ scale: value > 0 ? 0.95 : 1 }}
        className={`
          w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
          ${
            value > 0
              ? "bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 border border-accent-primary/20"
              : "bg-quantity-button-disabled text-quantity-button-disabled border border-quantity-button-disabled cursor-not-allowed"
          }
        `}
        aria-label="Disminuir cantidad"
      >
        <Minus className="w-4 h-4" />
      </motion.button>

      {/* Quantity Display */}
      <div className="w-12 h-9 flex items-center justify-center">
        <motion.span
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`
            font-bold text-lg
            ${isSelected ? "text-accent-primary" : "text-quantity"}
          `}
        >
          {value}
        </motion.span>
      </div>

      {/* Increase Button */}
      <motion.button
        type="button"
        onClick={() => setValue(value + 1)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-9 h-9 rounded-xl bg-quantity-plus hover:bg-quantity-plus-hover text-quantity-plus flex items-center justify-center transition-all duration-200 shadow-quantity-plus hover:shadow-quantity-plus-hover"
        aria-label="Aumentar cantidad"
      >
        <Plus className="w-4 h-4 font-bold" />
      </motion.button>
    </div>
  );
}
