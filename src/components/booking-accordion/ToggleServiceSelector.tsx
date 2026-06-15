"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Clock, Info, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { CATEGORY_LABELS } from "@/lib/serviceRules";
import type { Service } from "../../hooks/useServicesQuery";

type Props = {
  category: string;
  services: Service[];
  fieldName: string;
};

function ToggleToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-[22px] rounded-full transition-colors flex-shrink-0 ${
        checked ? "bg-[color:var(--color-primary)]" : "bg-[color:var(--color-border)]"
      }`}
    >
      <span
        className={`absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow transition-transform ${
          checked ? "left-[20px]" : "left-[2px]"
        }`}
      />
    </button>
  );
}

function ThinServiceCard({
  service,
  isSelected,
  quantity,
  onToggle,
  onQuantityChange,
}: {
  service: Service;
  isSelected: boolean;
  quantity: number;
  onToggle: (id: string) => void;
  onQuantityChange: (id: string, qty: number) => void;
}) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="border-b border-[color:var(--color-border)]/50 last:border-b-0">
      <div className="flex items-center gap-2 py-2.5 px-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-[color:var(--color-heading)] truncate">
              {service.name}
            </span>
            {service.description && (
              <button
                type="button"
                onClick={() => setShowInfo(!showInfo)}
                className="w-4 h-4 rounded-full flex items-center justify-center text-[color:var(--color-muted)] hover:text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)]/10 flex-shrink-0"
              >
                <Info className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-[color:var(--color-body)] mt-0.5">
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {service.duration}min
            </span>
            <span className="text-[color:var(--color-primary)] font-semibold">
              S/{service.price}
            </span>
          </div>
        </div>

        <ToggleToggle
          checked={isSelected}
          onChange={(val) => (val ? onToggle(service.id) : onToggle(service.id))}
        />
      </div>

      <AnimatePresence initial={false}>
        {showInfo && service.description && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <p className="text-xs text-[color:var(--color-body)] leading-relaxed pb-2 px-1">
              {service.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {isSelected && quantity > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 pb-2.5 pl-1">
              <span className="text-xs text-[color:var(--color-body)]">Cantidad:</span>
              <button
                type="button"
                onClick={() => onQuantityChange(service.id, Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-7 h-7 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] flex items-center justify-center disabled:opacity-40 hover:bg-[color:var(--color-surface)]/80 transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-sm font-semibold text-[color:var(--color-heading)] w-5 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => onQuantityChange(service.id, quantity + 1)}
                className="w-7 h-7 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)] flex items-center justify-center hover:bg-[color:var(--color-surface)]/80 transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ToggleServiceCategoryGroup({ category, services, fieldName }: Props) {
  const { watch, setValue } = useFormContext();
  const label = CATEGORY_LABELS[category] ?? category;
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedServices = watch(fieldName) || [];
  const selectedCount = selectedServices.filter(
    (s: { id: string }) => s.id && services.some((svc) => svc.id === s.id),
  ).length;

  const handleToggle = (serviceId: string) => {
    const currentServices = [...selectedServices];
    const existingIndex = currentServices.findIndex((s: { id: string }) => s.id === serviceId);
    if (existingIndex >= 0) {
      currentServices.splice(existingIndex, 1);
    } else {
      currentServices.push({ id: serviceId, quantity: 1 });
    }
    setValue(fieldName, currentServices, { shouldValidate: true });
  };

  const handleQuantityChange = (serviceId: string, qty: number) => {
    const currentServices = [...selectedServices];
    const idx = currentServices.findIndex((s: { id: string }) => s.id === serviceId);
    if (idx >= 0) {
      if (qty <= 0) {
        currentServices.splice(idx, 1);
      } else {
        currentServices[idx].quantity = qty;
      }
    }
    setValue(fieldName, currentServices, { shouldValidate: true });
  };

  return (
    <div className="border border-[color:var(--color-border)] rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[color:var(--color-surface)] hover:bg-[color:var(--color-surface)]/80 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[color:var(--color-heading)]">{label}</span>
          <span className="text-xs text-[color:var(--color-body)]">({services.length})</span>
          {selectedCount > 0 && (
            <span className="px-1.5 py-0.5 bg-[color:var(--color-primary)] text-white text-xs rounded-full font-medium">
              {selectedCount}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-[color:var(--color-heading)]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[color:var(--color-heading)]" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-1">
              {services.map((service) => {
                const selected = selectedServices.find(
                  (s: { id: string; quantity: number }) => s.id === service.id,
                );
                return (
                  <ThinServiceCard
                    key={service.id}
                    service={service}
                    isSelected={!!selected}
                    quantity={selected?.quantity || 0}
                    onToggle={handleToggle}
                    onQuantityChange={handleQuantityChange}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
