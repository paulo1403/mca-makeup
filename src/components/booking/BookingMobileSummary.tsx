"use client";

import React, { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { BookingData } from "@/lib/bookingSchema";
import useServicesQuery from "@/hooks/useServicesQuery";
import { useTransportCost } from "@/hooks/useTransportCost";
import { calculateNightShiftCost } from "@/utils/nightShift";
import { ChevronDown, ChevronUp } from "lucide-react";
import PricingBreakdown from "../PricingBreakdown";
import Typography from "../ui/Typography";

export default function BookingMobileSummary() {
  const { watch } = useFormContext<BookingData>();
  const { data: services = [] } = useServicesQuery();
  const selected = watch("selectedServices") || [];
  const locationType: "HOME" | "STUDIO" = watch("locationType") || "STUDIO";
  const district: string = watch("district") || "";
  const timeRange: string = watch("timeSlot") || "";
  const { transportCost, getTransportCost } = useTransportCost();
  const [open, setOpen] = useState(false);

  const subtotal = useMemo(() => {
    const ids = (selected || []).map((s) => s.id);
    const items = services
      .filter((s) => ids.includes(s.id))
      .map((s) => ({
        price: s.price,
        quantity: selected.find((x: { id: string; quantity: number }) => x.id === s.id)?.quantity || 1,
      }));
    return items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0);
  }, [selected, services]);

  const nightShiftCost = timeRange ? calculateNightShiftCost(timeRange) : 0;
  const transport = locationType === "HOME" ? transportCost?.cost || 0 : 0;
  const total = subtotal + transport + nightShiftCost;

  React.useEffect(() => {
    if (locationType === "HOME" && district) getTransportCost(district);
  }, [locationType, district, getTransportCost]);

  if (!selected || selected.length === 0 || subtotal === 0) return null;

  return (
    <div className="mt-4">
      <button
        type="button"
        className="w-full flex items-center justify-between rounded-lg border border-[color:var(--color-border)]/30 bg-[color:var(--color-surface)] px-4 py-3"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="booking-mobile-summary"
      >
        <div className="text-left">
          <Typography as="p" variant="p" className="text-[color:var(--color-muted)] text-xs">
            Tu total
          </Typography>
          <Typography as="p" variant="p" className="text-[color:var(--color-heading)] font-semibold text-base">
            S/ {Number(total || 0).toFixed(2)}
          </Typography>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-[color:var(--color-heading)]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[color:var(--color-heading)]" />
        )}
      </button>
      {open && (
        <div id="booking-mobile-summary" className="mt-3">
          <PricingBreakdown
            selectedServices={Object.fromEntries(selected.map((s: { id: string; quantity: number }) => [s.id, s.quantity]))}
            locationType={locationType}
            district={district}
            timeRange={timeRange}
          />
        </div>
      )}
    </div>
  );
}

