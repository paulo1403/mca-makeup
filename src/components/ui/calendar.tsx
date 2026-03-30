"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        button_previous:
          "absolute left-1 inline-flex h-8 w-8 items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-card)] text-[color:var(--color-heading)] hover:bg-[color:var(--color-surface)] transition-colors",
        button_next:
          "absolute right-1 inline-flex h-8 w-8 items-center justify-center rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-card)] text-[color:var(--color-heading)] hover:bg-[color:var(--color-surface)] transition-colors",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday:
          "w-9 text-[0.8rem] font-semibold text-[color:var(--calendar-label)] text-center rounded-md",
        week: "mt-2 flex w-full",
        day: "h-9 w-9 rounded-md p-0 text-sm font-medium text-[color:var(--color-heading)] hover:bg-[color:var(--color-primary)]/10 transition-colors",
        day_button:
          "h-9 w-9 rounded-md p-0 text-sm font-medium text-[color:var(--color-heading)] aria-selected:text-white",
        selected:
          "bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary)] focus:bg-[color:var(--color-primary)]",
        today: "ring-1 ring-[color:var(--color-primary)]/40",
        outside: "text-[color:var(--calendar-inactive)] opacity-60",
        disabled: "text-[color:var(--calendar-inactive)] opacity-45",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className, ...iconProps }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("h-4 w-4", className)} {...iconProps} />
          ) : (
            <ChevronRight className={cn("h-4 w-4", className)} {...iconProps} />
          ),
      }}
      {...props}
    />
  );
}

export { Calendar };
