"use client";

import Typography from "@/components/ui/Typography";
import { useTransportCost } from "@/hooks/useTransportCost";
import type { Service, ServiceSelection } from "@/types";
import { calculateNightShiftCost, getNightShiftExplanation } from "@/utils/nightShift";
import { AlertCircle, Calculator, MapPin, Moon, Truck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface PricingBreakdownProps {
  selectedServices: ServiceSelection;
  locationType: "STUDIO" | "HOME";
  district?: string;
  timeRange?: string;
  onPriceCalculated?: (
    totalPrice: number,
    servicePrice: number,
    transportCost: number,
    nightShiftCost?: number,
  ) => void;
}

interface ServiceWithQuantity {
  id: string;
  name: string;
  price: number;
  duration: number;
  quantity: number;
  totalPrice: number;
  totalDuration: number;
}

export default function PricingBreakdown({
  selectedServices,
  locationType,
  district,
  timeRange,
  onPriceCalculated,
}: PricingBreakdownProps) {
  const [servicesWithQuantity, setServicesWithQuantity] = useState<ServiceWithQuantity[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [totalServicePrice, setTotalServicePrice] = useState<number>(0);
  const { transportCost, loading, error, getTransportCost, clearTransportCost } =
    useTransportCost();

  const lastCalculatedRef = useRef({
    totalPrice: 0,
    servicePrice: 0,
    transportCost: 0,
    nightShiftCost: 0,
  });

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch("/api/services");
        if (response.ok) {
          const data = await response.json();
          setAllServices(data.services || []);
        }
      } catch (error) {
        console.error("Error loading services:", error);
      }
    };
    loadServices();
  }, []);

  useEffect(() => {
    if (!selectedServices || Object.keys(selectedServices).length === 0) {
      setServicesWithQuantity([]);
      setTotalServicePrice(0);
      return;
    }

    const servicesList: ServiceWithQuantity[] = [];
    let total = 0;

    Object.entries(selectedServices).forEach(([serviceId, quantity]) => {
      if (quantity > 0) {
        const service = allServices.find((s) => s.id === serviceId);
        if (service) {
          const totalPrice = service.price * quantity;
          const totalDuration = service.duration * quantity;

          servicesList.push({
            id: service.id,
            name: service.name,
            price: service.price,
            duration: service.duration,
            quantity,
            totalPrice,
            totalDuration,
          });

          total += totalPrice;
        }
      }
    });

    setServicesWithQuantity(servicesList);
    setTotalServicePrice(total);
  }, [selectedServices, allServices]);

  useEffect(() => {
    if (locationType === "HOME" && district && district.trim()) {
      getTransportCost(district.trim());
    } else {
      clearTransportCost();
    }
  }, [district, locationType, getTransportCost, clearTransportCost]);

  const debouncedPriceCalculation = useCallback(() => {
    const currentTransportCost = locationType === "HOME" && transportCost ? transportCost.cost : 0;
    const currentNightShiftCost = timeRange ? calculateNightShiftCost(timeRange) : 0;
    const totalPrice = totalServicePrice + currentTransportCost + currentNightShiftCost;

    const lastCalculated = lastCalculatedRef.current;
    if (
      lastCalculated.totalPrice !== totalPrice ||
      lastCalculated.servicePrice !== totalServicePrice ||
      lastCalculated.transportCost !== currentTransportCost ||
      lastCalculated.nightShiftCost !== currentNightShiftCost
    ) {
      lastCalculatedRef.current = {
        totalPrice,
        servicePrice: totalServicePrice,
        transportCost: currentTransportCost,
        nightShiftCost: currentNightShiftCost,
      };
      onPriceCalculated?.(
        totalPrice,
        totalServicePrice,
        currentTransportCost,
        currentNightShiftCost,
      );
    }
  }, [totalServicePrice, transportCost, locationType, timeRange, onPriceCalculated]);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      debouncedPriceCalculation();
    }, 100);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [debouncedPriceCalculation]);

  if (!selectedServices || selectedServices.length === 0 || totalServicePrice === 0) {
    return null;
  }

  const currentTransportCost = locationType === "HOME" && transportCost ? transportCost.cost : 0;
  const currentNightShiftCost = timeRange ? calculateNightShiftCost(timeRange) : 0;

  const totalPrice = totalServicePrice + currentTransportCost + currentNightShiftCost;

  return (
    <div className="rounded-lg p-3 sm:p-4 border border-[color:var(--color-border)]/30 bg-[color:var(--color-surface)] shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-[color:var(--color-primary)]" />
        <Typography
          as="h3"
          variant="h3"
          className="font-semibold text-[color:var(--color-heading)] text-sm sm:text-base"
        >
          Detalle de costos
        </Typography>
      </div>

      <div className="space-y-3">
        {/* Servicios seleccionados */}
        <div className="space-y-2">
          {servicesWithQuantity.map((service, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <div className="flex items-center gap-2">
                <span className="text-[color:var(--color-heading)] text-sm font-medium">
                  {service.name}
                </span>
                {service.quantity > 1 && (
                  <span className="bg-[color:var(--color-primary)]/12 text-[color:var(--color-primary)] text-xs px-2 py-1 rounded-full font-medium">
                    {service.quantity}x
                  </span>
                )}
              </div>
              <span className="font-medium text-[color:var(--color-heading)] text-sm">
                S/ {service.totalPrice.toFixed(2)}
              </span>
            </div>
          ))}

          {/* Subtotal de servicios si hay más de uno */}
          {servicesWithQuantity.length > 1 && (
            <div className="border-t border-[color:var(--color-border)]/20 pt-2">
              <div className="flex justify-between items-center gap-2">
                <span className="text-sm font-medium text-[color:var(--color-muted)]">
                  Subtotal servicios:
                </span>
                <span className="font-semibold text-[color:var(--color-heading)] text-sm sm:text-base">
                  S/ {totalServicePrice.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Costo de transporte */}
        {locationType === "HOME" && (
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-[color:var(--color-accent)] flex-shrink-0" />
                <span className="text-xs sm:text-sm text-[color:var(--color-heading)] break-words">
                  Transporte {district && `(${district})`}
                </span>
              </div>
              <div className="text-right flex-shrink-0">
                {loading ? (
                  <span className="text-xs sm:text-sm text-[color:var(--color-muted)]">
                    Calculando...
                  </span>
                ) : error ? (
                  <span className="text-xs sm:text-sm text-[color:var(--color-accent)]">Error</span>
                ) : transportCost?.hasTransportCost ? (
                  <span className="font-medium text-[color:var(--color-heading)] text-sm sm:text-base">
                    S/ {transportCost.cost.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-xs sm:text-sm text-[color:var(--color-muted)]">
                    No disponible
                  </span>
                )}
              </div>
            </div>

            {/* Notas sobre el transporte */}
            {transportCost?.notes && (
              <div className="flex items-start gap-2 mt-2">
                <AlertCircle className="h-3 w-3 text-[color:var(--color-accent)] mt-0.5 flex-shrink-0" />
                <span className="text-xs text-[color:var(--color-muted)] leading-relaxed">
                  {transportCost.notes}
                </span>
              </div>
            )}

            {/* Mensaje si no hay costo de transporte configurado */}
            {locationType === "HOME" &&
              district &&
              !loading &&
              !transportCost?.hasTransportCost && (
                <div className="flex items-start gap-2 mt-2">
                  <MapPin className="h-3 w-3 text-[color:var(--color-primary)] mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-[color:var(--color-muted)] leading-relaxed">
                    Costo de transporte a coordinar
                  </span>
                </div>
              )}
          </div>
        )}

        {/* Costo por atención fuera del horario laboral */}
        {currentNightShiftCost > 0 && (
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Moon className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-black break-words">
                  Por atención fuera del horario laboral
                </span>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="font-medium text-black text-sm sm:text-base">
                  S/ {currentNightShiftCost.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Explicación del costo nocturno */}
            <div className="flex items-start gap-2 mt-2">
              <AlertCircle className="h-3 w-3 text-[color:var(--color-accent)] mt-0.5 flex-shrink-0" />
              <span className="text-xs text-[color:var(--color-muted)] leading-relaxed">
                {getNightShiftExplanation()}
              </span>
            </div>
          </div>
        )}

        {/* Ubicación del servicio */}
        <div className="text-xs text-[color:var(--color-muted)] flex items-start gap-1 py-1">
          <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span className="leading-relaxed">
            {locationType === "STUDIO"
              ? "Servicio en local (Av. Bolívar 1075, Pueblo Libre)"
              : `Servicio a domicilio${district ? ` - ${district}` : ""}`}
          </span>
        </div>

        {/* Total */}
        <div className="border-t border-[color:var(--color-border)]/20 pt-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-black text-sm sm:text-base">Total:</span>
            <span className="font-bold text-base sm:text-lg text-[color:var(--color-primary)]">
              S/ {totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Nota importante */}
        <div className="bg-[color:var(--color-surface-elevated)] border border-[color:var(--color-border)]/30 rounded-md p-3 mt-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-[color:var(--color-accent)] mt-0.5 flex-shrink-0" />
            <div className="text-xs text-[color:var(--color-muted)]">
              <p className="font-medium mb-2">💡 Información importante:</p>
              <ul className="space-y-1.5 text-xs leading-relaxed">
                <li>• Los precios pueden variar según requerimientos específicos</li>
                <li>• El costo final se confirmará durante la consulta</li>
                {locationType === "HOME" && <li>• El transporte incluye ida y vuelta</li>}
                {currentNightShiftCost > 0 && (
                  <li>• Costo extra de S/ 50.00 por horario nocturno (7:30 PM - 6:00 AM)</li>
                )}
                {servicesWithQuantity.length > 1 && (
                  <li>• Los servicios múltiples se realizan en la misma sesión</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
