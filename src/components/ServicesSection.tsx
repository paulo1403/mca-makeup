"use client";

import { useEffect } from "react";
import useServiceGroups, { type ServiceGroup } from "@/hooks/useServiceGroups";
import Button from "./ui/Button";
import Typography from "./ui/Typography";
import { ArrowRight } from "lucide-react";

// UI type extends API type with optional UI-only props
type UIServiceGroup = ServiceGroup & { icon?: React.ReactNode; badge?: string };

// Simplified static service item - non-selectable, no price shown
function ServiceItem({ service }: { service: UIServiceGroup }) {
  return (
    <div className="w-full rounded-[12px] px-5 py-4 bg-[color:var(--color-surface)]/40 text-center">
      <Typography
        as="h3"
        variant="h3"
        className="font-normal text-[color:var(--color-heading)]"
      >
        {service.title}
      </Typography>
    </div>
  );
}

// ServiceDetails intentionally removed for simplified layout

// Keyframes for fade animation
const fadeInKeyframes = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default function ServicesSection() {
  const { data: serviceGroups = [], isLoading } = useServiceGroups();
  const visibleServices: UIServiceGroup[] = serviceGroups.map((s) => ({
    ...s,
  }));

  return (
    <>
      <style>{fadeInKeyframes}</style>
      <section
        id="servicios"
        className="relative py-16 sm:py-20 lg:py-24"
        style={{ scrollMarginTop: "120px" }}
      >
        <div className="container mx-auto px-5 sm:px-6 max-w-lg sm:max-w-xl relative z-10">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-12">
            <Typography
              as="h2"
              variant="h2"
              className="text-[color:var(--color-heading)]"
            >
              Nuestros Servicios
            </Typography>
          </div>

          {/* Services List - static simple layout */}
          {isLoading ? (
            <div className="space-y-3 sm:space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[64px] rounded-[12px] bg-[color:var(--color-surface)]/30 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {visibleServices.map((service) => (
                <ServiceItem key={service.title} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
