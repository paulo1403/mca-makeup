"use client";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import { CATEGORY_LABELS } from "@/lib/serviceRules";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Clock, Minus, Package, Plus, Star, X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import type { Service } from "../../hooks/useServicesQuery";

type Props = {
  category: string;
  services: Service[];
  fieldName: string;
};

// Tarjeta de servicio optimizada para mobile
const ServiceCard = ({
  service,
  isSelected,
  quantity,
  onToggle,
  onQuantityChange,
}: {
  service: Service;
  isSelected: boolean;
  quantity: number;
  onToggle: (serviceId: string) => void;
  onQuantityChange: (serviceId: string, quantity: number) => void;
}) => {
  const [showFull, setShowFull] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkClamped = () => {
      const el = descRef.current;
      if (!el) return;
      const clamped = !showFull && el.scrollHeight > el.clientHeight + 1;
      setIsClamped(clamped);
    };
    checkClamped();
    window.addEventListener("resize", checkClamped);
    return () => window.removeEventListener("resize", checkClamped);
  }, [service.description, showFull]);

  const needsToggle = isClamped || showFull || (service.description?.length ?? 0) > 60;

  return (
    <div
      className={`border rounded-xl p-4 transition-all ${
        isSelected
          ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)]/5"
          : "border-[color:var(--color-border)] bg-[color:var(--color-surface)]"
      }`}
    >
      {/* Header móvil */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 pr-3">
          <div className="flex items-center gap-2 mb-1">
            <Typography
              as="h5"
              variant="h5"
              className="text-[color:var(--color-heading)] font-semibold"
            >
              {service.name}
            </Typography>
            {isSelected && (
              <span className="px-2 py-0.5 bg-[color:var(--color-primary)] text-white text-xs rounded-full">
                Seleccionado
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Descripción con Ver más / Ver menos */}
      <p
        ref={descRef}
        className={`text-[color:var(--color-body)] text-sm mb-2 ${showFull ? "" : "line-clamp-2"}`}
      >
        {service.description}
      </p>
      {needsToggle && (
        <button
          type="button"
          aria-expanded={showFull}
          onClick={() => setShowFull(!showFull)}
          className="text-[color:var(--color-primary)] text-xs font-semibold hover:underline mb-3"
        >
          {showFull ? "Ver menos" : "Ver más"}
        </button>
      )}

      {/* Detalles en una sola línea para mobile */}
      <div className="flex items-center gap-3 text-xs text-[color:var(--color-body)] mb-4 pb-3 border-b border-[color:var(--color-border)]/20">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {service.duration}min
        </span>
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3" />
          {service.rating || "5.0"}
        </span>
        <span className="font-semibold text-[color:var(--color-primary)]">S/{service.price}</span>
      </div>

      {/* Controles optimizados para mobile */}
      <div className="flex items-center justify-between">
        {isSelected ? (
          <div className="flex items-center gap-2 w-full">
            <button
              onClick={() => onQuantityChange(service.id, Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] flex items-center justify-center active:scale-95 transition-transform"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4 text-[color:var(--color-heading)]" />
            </button>

            <div className="flex-1 text-center">
              <span className="font-semibold text-[color:var(--color-heading)]">{quantity}</span>
              <span className="text-xs text-[color:var(--color-body)] block">
                {quantity === 1 ? "servicio" : "servicios"}
              </span>
            </div>

            <button
              onClick={() => onQuantityChange(service.id, quantity + 1)}
              className="w-8 h-8 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] flex items-center justify-center active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4 text-[color:var(--color-heading)]" />
            </button>

            <button
              onClick={() => onToggle(service.id)}
              className="ml-2 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg active:scale-95 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onToggle(service.id)}
            className="w-full py-2.5 text-sm font-medium active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4 mr-1" />
            Agregar servicio
          </Button>
        )}
      </div>
    </div>
  );
};

export default function ServiceCategoryGroup({ category, services, fieldName }: Props) {
  const { watch, setValue } = useFormContext();
  const label = CATEGORY_LABELS[category] ?? category;
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedServices = watch(fieldName) || [];
  const selectedServicesMap = selectedServices.reduce(
    (acc: Record<string, number>, item: { id: string; quantity: number }) => {
      acc[item.id] = item.quantity;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Función corregida para agregar/eliminar servicios
  const handleToggle = (serviceId: string) => {
    const currentServices = [...selectedServices];
    const existingIndex = currentServices.findIndex((s) => s.id === serviceId);

    if (existingIndex >= 0) {
      // Eliminar el servicio
      currentServices.splice(existingIndex, 1);
    } else {
      // Agregar el servicio
      currentServices.push({ id: serviceId, quantity: 1 });
    }

    setValue(fieldName, currentServices, { shouldValidate: true });
  };

  const handleQuantityChange = (serviceId: string, quantity: number) => {
    const currentServices = [...selectedServices];
    const serviceIndex = currentServices.findIndex((s) => s.id === serviceId);

    if (serviceIndex >= 0) {
      if (quantity <= 0) {
        // Si la cantidad es 0 o menos, eliminar el servicio
        currentServices.splice(serviceIndex, 1);
      } else {
        // Actualizar cantidad
        currentServices[serviceIndex].quantity = quantity;
      }
    }

    setValue(fieldName, currentServices, { shouldValidate: true });
  };

  return (
    <section className="space-y-4">
      {/* Header optimizado para mobile */}
      <div className="p-4 border border-[color:var(--color-border)] rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[color:var(--color-surface)] rounded-lg flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-[color:var(--color-primary)]" />
            </div>
            <div className="min-w-0">
              <Typography
                as="h4"
                variant="h4"
                className="text-[color:var(--color-heading)] font-semibold"
              >
                {label}
              </Typography>
              <p className="text-sm text-[color:var(--color-body)]">
                {services.length} servicio{services.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Botón con flecha y colores corregidos */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-10 h-10 rounded-lg bg-[color:var(--color-surface)] border border-[color:var(--color-border)] flex items-center justify-center hover:bg-[color:var(--color-surface-secondary)] active:scale-95 transition-all flex-shrink-0"
          >
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-5 h-5 text-[color:var(--color-heading)]" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Lista de servicios optimizada para mobile */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 overflow-hidden"
          >
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <ServiceCard
                  service={service}
                  isSelected={!!selectedServicesMap[service.id]}
                  quantity={selectedServicesMap[service.id] || 0}
                  onToggle={handleToggle}
                  onQuantityChange={handleQuantityChange}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
