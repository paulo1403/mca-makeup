"use client";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import { useGroupedServicesQuery } from "@/hooks/useServicesQuery";
import type { BookingData } from "@/lib/bookingSchema";
import { CATEGORY_LABELS, validateSelection } from "@/lib/serviceRules";
import { Search, X } from "lucide-react";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import ServiceCategoryGroup from "../../booking/ServiceCategoryGroup";
import ValidationToast from "../ValidationToast";

export default function Step2_ServiceSelection() {
  const { watch } = useFormContext<BookingData>();
  const { data: grouped = {}, isLoading } = useGroupedServicesQuery();
  const currentToastId = useRef<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const selectedArr = (watch("selectedServices") || []) as Array<{
    id: string;
    quantity: number;
  }>;
  const selectedServicesMap = selectedArr.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.id] = item.quantity;
      return acc;
    },
    {}
  );

  const allServices = Object.values(grouped).flat();
  const categories = Object.keys(grouped);

  const filteredGrouped = useMemo(() => {
    const normalize = (s: string) => s.trim().toLowerCase();
    let result = grouped;

    if (selectedCategory) {
      result = { [selectedCategory]: grouped[selectedCategory] };
    }

    if (!query.trim()) return result;
    const q = normalize(query);
    const out: Record<string, (typeof grouped)[string]> = {};
    for (const [cat, services] of Object.entries(result)) {
      const matched = services.filter((s) => {
        const name = normalize(s.name);
        const desc = normalize(s.description ?? "");
        return name.includes(q) || desc.includes(q);
      });
      if (matched.length > 0) out[cat] = matched;
    }
    return out;
  }, [grouped, query, selectedCategory]);

  useEffect(() => {
    const validationResult = validateSelection(
      selectedServicesMap || {},
      allServices
    );

    if (validationResult) {
      if (currentToastId.current) {
        toast.dismiss(currentToastId.current);
      }

      currentToastId.current = toast.custom(
        (t) => (
          <ValidationToast
            message={validationResult.message}
            suggestion={validationResult.suggestion}
            onDismiss={() => toast.dismiss(t.id)}
          />
        ),
        {
          duration: Number.POSITIVE_INFINITY,
          id: "validation-error",
          position: "top-right",
        }
      );
    } else {
      if (currentToastId.current) {
        toast.dismiss(currentToastId.current);
        currentToastId.current = null;
      }
      toast.dismiss("validation-error");
    }
  }, [selectedServicesMap, allServices]);

  const clearFilters = () => {
    setQuery("");
    setSelectedCategory(null);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--color-primary)]" />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <Typography
          as="h3"
          variant="h3"
          className="font-bold text-[color:var(--color-heading)] mb-2"
        >
          Selecciona tus servicios
        </Typography>
        <Typography
          as="p"
          variant="small"
          className="text-[color:var(--color-body)]"
        >
          Elige uno o más servicios
        </Typography>
      </div>

      {/* Búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--color-muted)]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar servicios..."
          className="w-full pl-10 pr-10 py-2 rounded-[12px] bg-[color:var(--color-surface)]/60 text-[color:var(--color-heading)] placeholder:text-[color:var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/30"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-[color:var(--color-muted)]" />
          </button>
        )}
      </div>

      {/* Filtros de categoría */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-[12px] text-sm font-medium transition-colors ${
            !selectedCategory
              ? "bg-[color:var(--color-primary)] text-white"
              : "bg-[color:var(--color-surface)]/60 text-[color:var(--color-body)] hover:bg-[color:var(--color-surface)]"
          }`}
        >
          Todas
        </button>
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1.5 rounded-[12px] text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-[color:var(--color-primary)] text-white"
                : "bg-[color:var(--color-surface)]/60 text-[color:var(--color-body)] hover:bg-[color:var(--color-surface)]"
            }`}
          >
            {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] ??
              category}
          </button>
        ))}
      </div>

      {/* Contador de servicios */}
      {selectedArr.length > 0 && (
        <div className="text-center p-2 bg-[color:var(--color-primary)]/10 rounded-[12px]">
          <Typography
            as="span"
            variant="small"
            className="text-[color:var(--color-primary)] font-medium"
          >
            {selectedArr.length}{" "}
            {selectedArr.length === 1 ? "servicio" : "servicios"}
          </Typography>
        </div>
      )}

      {/* Resultados */}
      {Object.entries(filteredGrouped).length === 0 ? (
        <div className="text-center py-8">
          <Typography
            as="p"
            variant="p"
            className="text-[color:var(--color-body)] mb-3"
          >
            No se encontraron servicios
          </Typography>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(filteredGrouped).map(([category, services]) => (
            <div key={category}>
              <ServiceCategoryGroup
                category={category}
                services={services}
                fieldName="selectedServices"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
