"use client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Check, Clock } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import Typography from "@/components/ui/Typography";
import { useAvailableRanges } from "@/hooks/useAvailableRanges";
import type { BookingData } from "@/lib/bookingSchema";

export default function Step4_DateTime() {
  const { control, watch, setValue } = useFormContext<BookingData>();
  const date = watch("date");
  const timeSlot = watch("timeSlot");
  const selectedServices = watch("selectedServices") || [];
  const locationType = watch("locationType");

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
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="text-center">
        <Typography
          as="h3"
          variant="h3"
          className="font-bold text-[color:var(--color-heading)] mb-2"
        >
          Selecciona fecha y hora
        </Typography>
        <Typography as="p" variant="small" className="text-[color:var(--color-body)]">
          Elige un día y horario disponible
        </Typography>
      </div>

      <div className="space-y-6">
        {/* Calendario */}
        <Card className="border border-[color:var(--color-border)] bg-[color:var(--color-card)] text-[color:var(--color-card-foreground)]">
          <CardContent className="p-4">
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <Calendar
                mode="single"
                locale={es}
                selected={field.value ?? undefined}
                onSelect={(d) => {
                  if (d) field.onChange(d);
                }}
                required
                className="mx-auto w-full max-w-[360px] rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-3"
                classNames={{
                  caption_label:
                    "text-sm font-semibold capitalize text-[color:var(--color-heading)]",
                  head_cell:
                    "text-[0.78rem] font-semibold text-[color:var(--calendar-label)] w-9",
                  day: "h-9 w-9 text-sm font-medium text-[color:var(--color-heading)]",
                  day_disabled:
                    "h-9 w-9 text-sm font-medium text-[color:var(--calendar-inactive)] opacity-50",
                  day_outside:
                    "h-9 w-9 text-sm font-medium text-[color:var(--calendar-inactive)] opacity-60",
                }}
              />
            )}
          />
          </CardContent>
        </Card>

        {/* Horarios disponibles */}
        <Card className="border border-[color:var(--color-border)] bg-[color:var(--color-card)] text-[color:var(--color-card-foreground)]">
          <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Typography as="h5" variant="h5" className="font-medium">
              Horarios disponibles
            </Typography>
            {date && (
              <Typography as="span" variant="small" className="text-[color:var(--color-body)]">
                {format(date, "dd/MM/yyyy")}
              </Typography>
            )}
          </div>

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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {rangesData.availableRanges.map((r: string) => {
                const isSelected = timeSlot === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() =>
                      setValue("timeSlot", r, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-[12px] transition-colors ${
                      isSelected
                        ? "bg-[color:var(--color-primary)] text-white border-2 border-[color:var(--color-primary)]"
                        : "bg-[color:var(--color-surface)] border border-[color:var(--color-border)] hover:border-[color:var(--color-primary)]/50"
                    }`}
                  >
                    <Clock
                      className={`w-4 h-4 ${
                        isSelected ? "text-white" : "text-[color:var(--color-primary)]"
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
                  </button>
                );
              })}
            </div>
          ) : date ? (
            <div className="text-center py-4">
              <Typography as="p" variant="p" className="text-[color:var(--color-body)]">
                No hay horarios disponibles
              </Typography>
              <Typography as="p" variant="small" className="text-[color:var(--color-body)] mt-1">
                Elige otra fecha
              </Typography>
            </div>
          ) : (
            <div className="text-center py-4">
              <Typography as="p" variant="p" className="text-[color:var(--color-body)]">
                Selecciona una fecha para ver los horarios disponibles
              </Typography>
            </div>
          )}

          {/* Resumen de selección */}
          {date && timeSlot && (
            <div className="mt-4 p-3 bg-[color:var(--color-primary)]/10 rounded-[12px]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[color:var(--color-primary)] flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <Typography
                  as="p"
                  variant="p"
                  className="text-[color:var(--color-heading)] font-medium"
                >
                  {format(date, "dd MMM", { locale: es })} • {timeSlot}
                </Typography>
              </div>
            </div>
          )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
