"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useGroupedServicesQuery } from "@/hooks/useServicesQuery";
import ServiceCategoryGroup from "../../booking/ServiceCategoryGroup";
import ValidationToast from "../ValidationToast";
import type { BookingData } from "@/lib/bookingSchema";
import { validateSelection } from "@/lib/serviceRules";
import toast from "react-hot-toast";
import {
  Search,
  Sparkles,
  Clock,
  Users,
  Filter,
  X,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

// Diccionario de traducciones
const translations = {
  // Títulos y descripciones
  title: "Selecciona tus servicios",
  subtitle: "Elige uno o más servicios y ajusta las cantidades según necesites",

  // Búsqueda
  searchPlaceholder: "Buscar servicios...",
  clearSearch: "Limpiar búsqueda",

  // Filtros
  categories: "Categorías",
  allCategories: "Todas",
  clearFilters: "Limpiar filtros",
  clearAll: "Limpiar todo",
  activeFilters: "Filtros activos:",

  // Contador de servicios
  service: "servicio",
  services: "servicios",
  selected: "seleccionado",
  selectedPlural: "seleccionados",

  // Sin resultados
  noResults: "No se encontraron servicios",
  noResultsMessage:
    "Intenta con otros términos de búsqueda o cambia los filtros",

  // Ayuda
  needHelp: "¿Necesitas ayuda?",
  helpMessage:
    "Nuestros especialistas pueden recomendarte los servicios perfectos según tus necesidades.",

  // Estados de carga
  loading: "Cargando servicios...",

  // Accesibilidad
  searchLabel: "Buscar servicios por nombre o descripción",
  filterLabel: "Filtrar por categoría",
  clearFilterLabel: "Limpiar filtros activos",
  selectedServicesLabel: "Servicios seleccionados",
  noServicesLabel: "No hay servicios disponibles",

  // Validación
  validation: {
    required: "Debes seleccionar al menos un servicio",
    maxServices: "Has alcanzado el número máximo de servicios permitidos",
    minDuration: "La duración mínima es de 30 minutos",
    maxDuration: "La duración máxima es de 8 horas",
    invalidCombination:
      "La combinación de servicios seleccionados no es válida",
  },
};

// Hook para obtener traducciones
const useTranslations = () => {
  return {
    t: (key: string, fallback?: string) => {
      const keys = key.split(".");
      let value: any = translations;

      for (const k of keys) {
        value = value?.[k];
      }

      return value || fallback || key;
    },

    // Funciones helper para pluralización
    pluralize: (count: number, singular: string, plural: string) => {
      return count === 1 ? singular : plural;
    },

    // Formatear texto con contador
    formatCount: (count: number, singular: string, plural: string) => {
      return `${count} ${count === 1 ? singular : plural}`;
    },
  };
};

export default function Step2_ServiceSelection() {
  const { watch } = useFormContext<BookingData>();
  const { data: grouped = {}, isLoading } = useGroupedServicesQuery();
  const currentToastId = useRef<string | null>(null);
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { t, pluralize, formatCount } = useTranslations();

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

  // grouped is a map category -> Service[]; collect all services into an array for validation
  const allServices = Object.values(grouped).flat();
  const categories = Object.keys(grouped);

  // Filter services by search query (name or description) and category
  const normalized = (s: string) => s.trim().toLowerCase();
  const filteredGrouped = useMemo(() => {
    let result = grouped;

    // Filter by category first
    if (selectedCategory) {
      result = { [selectedCategory]: grouped[selectedCategory] };
    }

    // Then filter by search query
    if (!query.trim()) return result;
    const q = normalized(query);
    const out: Record<string, (typeof grouped)[string]> = {};
    Object.entries(result).forEach(([cat, services]) => {
      const matched = services.filter((s) => {
        const name = normalized(s.name);
        const desc = normalized(s.description ?? "");
        return name.includes(q) || desc.includes(q);
      });
      if (matched.length > 0) out[cat] = matched;
    });
    return out;
  }, [grouped, query, selectedCategory]);

  // Mostrar toast cuando hay error de validación
  useEffect(() => {
    const validationResult = validateSelection(
      selectedServicesMap || {},
      allServices
    );

    if (validationResult) {
      // Dismiss previous toast if exists
      if (currentToastId.current) {
        toast.dismiss(currentToastId.current);
      }

      // Show new custom toast
      currentToastId.current = toast.custom(
        (t) => (
          <ValidationToast
            message={validationResult.message}
            suggestion={validationResult.suggestion}
            onDismiss={() => toast.dismiss(t.id)}
          />
        ),
        {
          duration: Infinity, // No auto-hide
          id: "validation-error", // Unique ID to prevent duplicates
          position: "top-right",
        }
      );
    } else {
      // Hide toast when validation passes
      if (currentToastId.current) {
        toast.dismiss(currentToastId.current);
        currentToastId.current = null;
      }
      toast.dismiss("validation-error"); // Dismiss by ID as fallback
    }
  }, [selectedServicesMap, allServices]);

  const clearFilters = () => {
    setQuery("");
    setSelectedCategory(null);
  };

  const hasActiveFilters = query.trim() || selectedCategory;

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--color-primary)]"></div>
        <span className="ml-3 text-[color:var(--color-body)]">
          {t("loading")}
        </span>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Encabezado simplificado */}
      <motion.div
        className="text-center space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center">
          <div className="w-14 h-14 bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-accent)] rounded-full flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
        </div>

        <div className="space-y-1">
          <Typography
            as="h2"
            variant="h2"
            className="text-[color:var(--color-heading)] font-serif"
          >
            {t("title")}
          </Typography>
          <Typography
            as="p"
            variant="p"
            className="text-[color:var(--color-body)] max-w-md mx-auto text-sm"
          >
            {t("subtitle")}
          </Typography>
        </div>
      </motion.div>

      {/* Búsqueda y filtros optimizados para mobile */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Barra de búsqueda mejorada para mobile */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-[color:var(--color-body)]/50" />
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchLabel")}
            className="w-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] focus:border-[color:var(--color-primary)] rounded-xl pl-12 pr-12 py-3.5 placeholder:text-[color:var(--color-body)]/50 text-[color:var(--color-text-primary)] outline-none transition-all duration-200 text-base"
          />

          {/* Botón de limpiar búsqueda */}
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onClick={() => setQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                aria-label={t("clearSearch")}
              >
                <X className="w-5 h-5 text-[color:var(--color-body)]/50 hover:text-[color:var(--color-heading)]" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Filtros de categoría optimizados */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] hover:bg-[color:var(--color-surface-secondary)] transition-colors"
            aria-label={t("filterLabel")}
            aria-expanded={showFilters}
          >
            <Filter className="w-4 h-4 text-[color:var(--color-heading)]" />
            <span className="text-sm font-medium text-[color:var(--color-heading)]">
              {t("categories")}
            </span>
            <motion.div
              animate={{ rotate: showFilters ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-[color:var(--color-heading)]" />
            </motion.div>
          </button>

          {/* Contador de servicios seleccionados */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 bg-[color:var(--color-primary)]/10 rounded-lg"
            aria-label={t("selectedServicesLabel")}
          >
            <Users className="w-4 h-4 text-[color:var(--color-primary)]" />
            <span className="text-sm font-medium text-[color:var(--color-primary)]">
              {formatCount(selectedArr.length, t("service"), t("services"))}
            </span>
          </div>
        </div>

        {/* Categorías como filtros */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 p-3 bg-[color:var(--color-surface)] rounded-lg border border-[color:var(--color-border)]">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    !selectedCategory
                      ? "bg-[color:var(--color-primary)] text-white"
                      : "bg-[color:var(--color-surface-secondary)] text-[color:var(--color-body)] hover:text-[color:var(--color-heading)]"
                  }`}
                >
                  {t("allCategories")}
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? "bg-[color:var(--color-primary)] text-white"
                        : "bg-[color:var(--color-surface-secondary)] text-[color:var(--color-body)] hover:text-[color:var(--color-heading)]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Indicador de filtros activos */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between p-2 bg-[color:var(--color-surface)] rounded-lg border border-[color:var(--color-border)]"
            >
              <div className="flex items-center gap-2 text-sm text-[color:var(--color-body)]">
                <span>{t("activeFilters")}</span>
                {query && (
                  <span className="px-2 py-0.5 bg-[color:var(--color-surface-secondary)] rounded text-xs">
                    "{query}"
                  </span>
                )}
                {selectedCategory && (
                  <span className="px-2 py-0.5 bg-[color:var(--color-surface-secondary)] rounded text-xs">
                    {selectedCategory}
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="text-xs text-[color:var(--color-primary)] hover:underline"
                aria-label={t("clearFilterLabel")}
              >
                {t("clearAll")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Resultados de búsqueda */}
      <AnimatePresence mode="wait">
        {Object.entries(filteredGrouped).length === 0 ? (
          <motion.div
            key="no-results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
            role="status"
            aria-live="polite"
          >
            <div className="w-16 h-16 bg-[color:var(--color-surface)]/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[color:var(--color-body)]/50" />
            </div>
            <Typography
              as="p"
              variant="p"
              className="text-[color:var(--color-heading)] text-lg font-medium mb-2"
            >
              {t("noResults")}
            </Typography>
            <Typography
              as="p"
              variant="p"
              className="text-[color:var(--color-body)]/70 text-sm mb-4"
            >
              {t("noResultsMessage")}
            </Typography>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="px-4 py-2"
            >
              {t("clearFilters")}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {Object.entries(filteredGrouped).map(([category, services]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <ServiceCategoryGroup
                  category={category}
                  services={services}
                  fieldName="selectedServices"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Información adicional simplificada */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="p-4 bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)]"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[color:var(--color-primary)]/20 flex items-center justify-center">
            <Clock className="w-4 h-4 text-[color:var(--color-primary)]" />
          </div>
          <div>
            <Typography
              as="h4"
              variant="h4"
              className="text-[color:var(--color-heading)] mb-1 text-sm"
            >
              {t("needHelp")}
            </Typography>
            <Typography
              as="p"
              variant="p"
              className="text-[color:var(--color-body)] text-xs"
            >
              {t("helpMessage")}
            </Typography>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
