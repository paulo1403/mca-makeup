"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import ValidationToast from "@/components/booking/ValidationToast";
import ToggleServiceCategoryGroup from "@/components/booking-accordion/ToggleServiceSelector";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import { useGroupedServicesQuery } from "@/hooks/useServicesQuery";
import type { BookingData } from "@/lib/bookingSchema";
import { CATEGORY_LABELS, validateSelection } from "@/lib/serviceRules";

export default function Section2_Services() {
  const { watch } = useFormContext<BookingData>();
  const { data: grouped = {}, isLoading } = useGroupedServicesQuery();
  const currentToastId = useRef<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const selectedArr = (watch("selectedServices") || []) as Array<{
    id: string;
    quantity: number;
  }>;
  const selectedServicesMap = selectedArr.reduce<Record<string, number>>((acc, item) => {
    acc[item.id] = item.quantity;
    return acc;
  }, {});

  const allServices = Object.values(grouped).flat();
  const categories = Object.keys(grouped);

  const filteredGrouped = useMemo(() => {
    if (!query.trim() && !selectedCategory) return grouped;
    let result: Record<string, (typeof grouped)[string]> = {};
    const base = selectedCategory ? { [selectedCategory]: grouped[selectedCategory] } : grouped;
    if (!query.trim()) return base;
    const q = query.trim().toLowerCase();
    for (const [cat, services] of Object.entries(base)) {
      const matched = services.filter(
        (s) => s.name.toLowerCase().includes(q) || (s.description ?? "").toLowerCase().includes(q),
      );
      if (matched.length > 0) result[cat] = matched;
    }
    return result;
  }, [grouped, query, selectedCategory]);

  useEffect(() => {
    const validationResult = validateSelection(selectedServicesMap || {}, allServices);
    if (validationResult) {
      if (currentToastId.current) toast.dismiss(currentToastId.current);
      currentToastId.current = toast.custom(
        (t) => (
          <ValidationToast
            message={validationResult.message}
            suggestion={validationResult.suggestion}
            onDismiss={() => toast.dismiss(t.id)}
          />
        ),
        { duration: Number.POSITIVE_INFINITY, id: "validation-error", position: "top-right" },
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
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[color:var(--color-primary)]" />
      </div>
    );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--color-muted)]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar servicios..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[color:var(--color-surface)]/60 text-[color:var(--color-heading)] text-sm placeholder:text-[color:var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/30"
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

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
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
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === category
                ? "bg-[color:var(--color-primary)] text-white"
                : "bg-[color:var(--color-surface)]/60 text-[color:var(--color-body)] hover:bg-[color:var(--color-surface)]"
            }`}
          >
            {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] ?? category}
          </button>
        ))}
      </div>

      {selectedArr.length > 0 && (
        <p className="text-xs text-center text-[color:var(--color-primary)] font-medium bg-[color:var(--color-primary)]/10 rounded-lg py-1.5">
          {selectedArr.length} {selectedArr.length === 1 ? "servicio" : "servicios"} seleccionado
          {selectedArr.length === 1 ? "" : "s"}
        </p>
      )}

      {Object.entries(filteredGrouped).length === 0 ? (
        <div className="text-center py-6">
          <Typography as="p" variant="p" className="text-[color:var(--color-body)] text-sm mb-2">
            No se encontraron servicios
          </Typography>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {Object.entries(filteredGrouped).map(([category, services]) => (
            <ToggleServiceCategoryGroup
              key={category}
              category={category}
              services={services}
              fieldName="selectedServices"
            />
          ))}
        </div>
      )}
    </div>
  );
}
