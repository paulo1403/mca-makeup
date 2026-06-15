"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import Typography from "@/components/ui/Typography";
import { useAvailableRanges } from "@/hooks/useAvailableRanges";
import type { BookingData } from "@/lib/bookingSchema";

export default function Section3_DateTime() {
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

  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  useEffect(() => {
    if (date) {
      setSelectedMonth(date);
    }
  }, [date]);

  return (
    <div className="space-y-4">
      <Card className="border border-[color:var(--color-border)] bg-[color:var(--color-card)] text-[color:var(--color-card-foreground)]">
        <CardContent className="p-3">
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
                month={selectedMonth}
                onMonthChange={setSelectedMonth}
                required
                className="mx-auto w-full max-w-[340px] rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-2"
                classNames={{
                  caption_label:
                    "text-sm font-semibold capitalize text-[color:var(--color-heading)]",
                  weekday: "text-[0.78rem] font-semibold text-[color:var(--calendar-label)] w-9",
                  day_button: "h-9 w-9 text-sm font-medium text-[color:var(--color-heading)]",
                  disabled:
                    "h-9 w-9 text-sm font-medium text-[color:var(--calendar-inactive)] opacity-50",
                  outside:
                    "h-9 w-9 text-sm font-medium text-[color:var(--calendar-inactive)] opacity-60",
                }}
              />
            )}
          />
        </CardContent>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Typography as="h5" variant="h5" className="font-medium text-sm">
            Horarios disponibles
          </Typography>
          {date && (
            <Typography
              as="span"
              variant="small"
              className="text-[color:var(--color-body)] text-xs"
            >
              {format(date, "dd/MM/yyyy")}
            </Typography>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {["sk-1", "sk-2", "sk-3"].map((key) => (
              <div
                key={key}
                className="h-9 bg-[color:var(--color-surface)] rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : rangesData?.availableRanges?.length ? (
          <div className="grid grid-cols-3 gap-2">
            {rangesData.availableRanges.map((r: string) => {
              const isSelected = timeSlot === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() =>
                    setValue("timeSlot", r, { shouldDirty: true, shouldValidate: true })
                  }
                  className={`flex items-center justify-center px-2 py-2 rounded-lg transition-colors text-xs font-medium ${
                    isSelected
                      ? "bg-[color:var(--color-primary)] text-white"
                      : "bg-[color:var(--color-surface)] border border-[color:var(--color-border)] hover:border-[color:var(--color-primary)]/50"
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        ) : date ? (
          <p className="text-sm text-[color:var(--color-body)] text-center py-4">
            No hay horarios disponibles para esta fecha.
          </p>
        ) : (
          <p className="text-sm text-[color:var(--color-body)] text-center py-4">
            Selecciona una fecha para ver horarios.
          </p>
        )}

        {date && timeSlot && (
          <div className="mt-3 p-2.5 bg-[color:var(--color-primary)]/10 rounded-lg flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[color:var(--color-primary)] flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
            <Typography
              as="p"
              variant="p"
              className="text-[color:var(--color-heading)] text-sm font-medium"
            >
              {format(date, "dd MMM", { locale: es })} &middot; {timeSlot}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}
