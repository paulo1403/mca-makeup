"use client";
import Typography from "@/components/ui/Typography";
import { useAvailableRanges } from "@/hooks/useAvailableRanges";
import type { BookingData } from "@/lib/bookingSchema";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Check, ChevronLeft, ChevronRight, Clock, Sparkles } from "lucide-react";
import type React from "react";
import DatePicker from "react-datepicker";
import { Controller, useFormContext } from "react-hook-form";

const CustomWeekdayHeader: React.FC = () => {
  const days = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
  return (
    <div className="custom-weekday-header" aria-hidden>
      {days.map((d) => (
        <span key={d} className="custom-weekday-cell">
          {d}
        </span>
      ))}
    </div>
  );
};

const translations = {
  title: "Selecciona fecha y hora",
  subtitle: "Elige un día en el calendario y luego el horario disponible",
  selectTimeSlot: "Selecciona el rango de hora",
  available: "Hay horarios disponibles",
  notAvailable: "El día seleccionado está completo",
  chooseAnotherDate: "Elige otra fecha",
  noTimeSlots: "No hay horarios disponibles",
  loading: "Cargando horarios...",
  selected: "Seleccionaste",
  previousMonth: "Mes anterior",
  nextMonth: "Mes siguiente",
  importantInfo: "Importante",
  infoMessage: "Confirma tu cita con al menos 24h de anticipación",
};

const useTranslations = () => {
  return {
    t: (key: string, fallback?: string) => {
      const value = translations[key as keyof typeof translations];
      return value || fallback || key;
    },
  };
};

export default function Step4_DateTime() {
  const { control, watch, setValue } = useFormContext<BookingData>();
  const date = watch("date");
  const timeSlot = watch("timeSlot");
  const selectedServices = watch("selectedServices") || [];
  const locationType = watch("locationType");
  const { t } = useTranslations();

  const serviceSelection = selectedServices.reduce<Record<string, number>>((acc, cur) => {
    acc[cur.id] = cur.quantity;
    return acc;
  }, {});

  const { data: rangesData, isLoading } = useAvailableRanges(
    date || null,
    serviceSelection,
    (locationType as "STUDIO" | "HOME") || "STUDIO",
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-6 overflow-hidden">
      {/* Encabezado */}
      <motion.div
        className="text-center space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-[color:var(--color-primary)] to-[color:var(--color-accent)] rounded-full flex items-center justify-center">
            <Calendar aria-hidden="true" focusable="false" className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="space-y-1">
          <Typography
            as="h2"
            variant="h2"
            className="text-[color:var(--color-heading)] font-serif text-lg"
          >
            {t("title")}
          </Typography>
          <Typography as="p" variant="p" className="text-[color:var(--color-body)] text-sm">
            {t("subtitle")}
          </Typography>
        </div>
      </motion.div>

      {/* Layout vertical optimizado para mobile */}
      <div className="space-y-6">
        {/* Calendario */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="p-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]"
        >
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={(d) => field.onChange(d)}
                inline
                locale={es}
                formatWeekDay={(nameOfDay) => {
                  const key = nameOfDay.toLowerCase();
                  if (key.startsWith("lun")) return "lun";
                  if (key.startsWith("mar")) return "mar";
                  if (key.startsWith("miér")) return "mié";
                  if (key.startsWith("mie")) return "mié";
                  if (key.startsWith("jue")) return "jue";
                  if (key.startsWith("vie")) return "vie";
                  if (key.startsWith("sáb")) return "sáb";
                  if (key.startsWith("sab")) return "sáb";
                  if (key.startsWith("dom")) return "dom";
                  return nameOfDay.slice(0, 3).toLowerCase();
                }}
                calendarClassName="w-full no-daynames"
                renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <button
                        type="button"
                        onClick={decreaseMonth}
                        className="p-2 rounded-lg bg-[color:var(--color-surface)] border border-[color:var(--color-border)] hover:bg-[color:var(--color-surface-secondary)] transition-colors"
                        aria-label={t("previousMonth")}
                      >
                        <ChevronLeft
                          aria-hidden="true"
                          focusable="false"
                          className="w-4 h-4 text-[color:var(--color-heading)]"
                        />
                      </button>
                      <Typography
                        as="span"
                        variant="small"
                        className="font-medium text-[color:var(--color-heading)]"
                      >
                        {format(date, "MMMM yyyy", { locale: es })}
                      </Typography>
                      <button
                        type="button"
                        onClick={increaseMonth}
                        className="p-2 rounded-lg bg-[color:var(--color-surface)] border border-[color:var(--color-border)] hover:bg-[color:var(--color-surface-secondary)] transition-colors"
                        aria-label={t("nextMonth")}
                      >
                        <ChevronRight
                          aria-hidden="true"
                          focusable="false"
                          className="w-4 h-4 text-[color:var(--color-heading)]"
                        />
                      </button>
                    </div>
                    <CustomWeekdayHeader />
                  </div>
                )}
              />
            )}
          />
        </motion.div>

        {/* Horarios disponibles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="p-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]"
        >
          <div className="flex items-center justify-between mb-4">
            <Typography as="h3" variant="h3">
              {t("selectTimeSlot")}
            </Typography>
            {date && (
              <Typography as="span" variant="small" className="text-[color:var(--color-body)]">
                {format(date, "dd/MM/yyyy")}
              </Typography>
            )}
          </div>

          {/* Feedback de disponibilidad */}
          <AnimatePresence>
            {date && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4"
                aria-live="polite"
              >
                {rangesData?.availableRanges?.length ? (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                    <Typography as="span" variant="small">
                      {t("available")}
                    </Typography>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <Typography as="span" variant="small">
                      {t("notAvailable")}
                    </Typography>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lista de horarios */}
          {isLoading ? (
            <div className="space-y-2">
              {["sk-1", "sk-2", "sk-3"].map((key) => (
                <div
                  key={key}
                  className="h-10 bg-[color:var(--color-surface)] rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : rangesData?.availableRanges?.length ? (
            <div aria-label="Selecciona un horario" className="grid grid-cols-2 gap-2">
              {rangesData.availableRanges.map((r: string, index: number) => {
                const isSelected = timeSlot === r;
                return (
                  <motion.button
                    key={r}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() =>
                      setValue("timeSlot", r, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 w-full ${
                      isSelected
                        ? "bg-[color:var(--color-primary)] text-white border-2 border-[color:var(--color-primary)]"
                        : "bg-[color:var(--color-surface)] border border-[color:var(--color-border)] hover:border-[color:var(--color-primary)]/50"
                    }`}
                  >
                    <Clock
                      aria-hidden="true"
                      focusable="false"
                      className={`w-4 h-4 ${
                        isSelected ? "text-white" : "text-[color:var(--color-accent)]"
                      }`}
                    />
                    <Typography
                      as="span"
                      variant="small"
                      className={`font-medium ${
                        isSelected ? "text-white" : "text-[color:var(--color-heading)]"
                      }`}
                    >
                      {r}
                    </Typography>
                  </motion.button>
                );
              })}
            </div>
          ) : date ? (
            <div className="text-center py-4">
              <Typography as="p" variant="p" className="text-[color:var(--color-body)] text-sm">
                {t("noTimeSlots")}
              </Typography>
              <Typography
                as="p"
                variant="p"
                className="text-[color:var(--color-body)]/70 text-xs mt-1"
              >
                {t("chooseAnotherDate")}
              </Typography>
            </div>
          ) : (
            <div className="text-center py-4">
              <Typography as="p" variant="p" className="text-[color:var(--color-body)] text-sm">
                Selecciona una fecha para ver los horarios disponibles
              </Typography>
            </div>
          )}

          {/* Resumen de selección */}
          <AnimatePresence>
            {date && timeSlot && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-3 bg-[color:var(--color-primary)]/10 rounded-lg border border-[color:var(--color-primary)]/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[color:var(--color-primary)] flex items-center justify-center">
                      <Check aria-hidden="true" focusable="false" className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <Typography
                        as="span"
                        variant="small"
                        className="text-[color:var(--color-body)] text-xs"
                      >
                        {t("selected")}
                      </Typography>
                      <Typography
                        as="p"
                        variant="p"
                        className="text-[color:var(--color-heading)] font-medium text-sm"
                      >
                        {format(date, "dd MMM", { locale: es })} • {timeSlot}
                      </Typography>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Información importante */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="p-3 bg-[color:var(--color-surface)] rounded-xl border border-[color:var(--color-border)]"
      >
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[color:var(--color-primary)]/20 flex items-center justify-center mt-0.5">
            <Sparkles
              aria-hidden="true"
              focusable="false"
              className="w-2.5 h-2.5 text-[color:var(--color-primary)]"
            />
          </div>
          <div className="flex-1">
            <Typography
              as="h4"
              variant="h4"
              className="text-[color:var(--color-heading)] mb-1 text-xs font-medium"
            >
              {t("importantInfo")}
            </Typography>
            <Typography
              as="p"
              variant="p"
              className="text-[color:var(--color-body)] text-xs leading-relaxed"
            >
              {t("infoMessage")}
            </Typography>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
