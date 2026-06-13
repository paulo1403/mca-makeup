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
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col gap-2 relative",
        month: "relative",
        month_caption: "flex justify-center items-center h-8",
        caption_label: "text-sm font-medium text-[color:var(--color-heading)]",
        nav: "absolute inset-x-0 top-0 h-8 flex items-center justify-between z-10",
        button_previous:
          "h-7 w-7 inline-flex items-center justify-center rounded-md text-[color:var(--color-heading)] hover:bg-[color:var(--color-primary)]/10 cursor-pointer transition-colors",
        button_next:
          "h-7 w-7 inline-flex items-center justify-center rounded-md text-[color:var(--color-heading)] hover:bg-[color:var(--color-primary)]/10 cursor-pointer transition-colors",
        month_grid: "w-full mt-2",
        weekdays: "grid grid-cols-7",
        weekday: "h-7 text-xs font-medium text-[color:var(--color-muted)] text-center",
        week: "grid grid-cols-7 mt-1",
        day: "h-8 w-full text-sm text-center",
        day_button:
          "h-8 w-full rounded-lg text-sm font-medium hover:bg-[color:var(--color-primary)]/10 text-[color:var(--color-heading)] cursor-pointer transition-colors",
        selected:
          "bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary)]",
        today: "ring-1 ring-[color:var(--color-primary)]",
        outside: "text-[color:var(--color-muted)] opacity-50",
        disabled: "opacity-30 cursor-not-allowed",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName, ...iconProps }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("h-4 w-4", chevronClassName)} {...iconProps} />
          ) : (
            <ChevronRight className={cn("h-4 w-4", chevronClassName)} {...iconProps} />
          ),
      }}
      {...props}
    />
  );
}

export { Calendar };
