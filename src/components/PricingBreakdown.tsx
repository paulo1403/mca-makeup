"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTransportCost } from "@/hooks/useTransportCost";
import { Calculator, MapPin, Truck, AlertCircle } from "lucide-react";

interface PricingBreakdownProps {
  selectedService: string;
  locationType: "STUDIO" | "HOME";
  district?: string;
  onPriceCalculated?: (
    totalPrice: number,
    servicePrice: number,
    transportCost: number,
  ) => void;
}

export default function PricingBreakdown({
  selectedService,
  locationType,
  district,
  onPriceCalculated,
}: PricingBreakdownProps) {
  const [servicePrice, setServicePrice] = useState<number>(0);
  const [serviceName, setServiceName] = useState<string>("");
  const {
    transportCost,
    loading,
    error,
    getTransportCost,
    clearTransportCost,
  } = useTransportCost();

  // Ref para evitar bucle infinito
  const lastCalculatedRef = useRef({
    totalPrice: 0,
    servicePrice: 0,
    transportCost: 0,
  });

  // Debounce para evitar cálculos excesivos
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Extraer precio del servicio seleccionado
  useEffect(() => {
    if (!selectedService) {
      setServicePrice(0);
      setServiceName("");
      return;
    }

    // Buscar precio en el texto del servicio (formato: "Nombre (S/ 200)")
    const priceMatch = selectedService.match(/\(S\/\s*(\d+(?:\.\d{2})?)\)/);
    if (priceMatch) {
      const price = parseFloat(priceMatch[1]);
      setServicePrice(price);
      setServiceName(selectedService.replace(/\s*\(S\/.*\)/, ""));
    } else {
      // Si no hay precio en el texto, podría ser "Otro"
      setServicePrice(0);
      setServiceName(selectedService);
    }
  }, [selectedService]);

  // Obtener costo de transporte cuando cambia el distrito
  useEffect(() => {
    if (locationType === "HOME" && district && district.trim()) {
      getTransportCost(district.trim());
    } else {
      clearTransportCost();
    }
  }, [district, locationType, getTransportCost, clearTransportCost]);

  // Debounced price calculation
  const debouncedPriceCalculation = useCallback(() => {
    const currentTransportCost =
      locationType === "HOME" && transportCost ? transportCost.cost : 0;
    const totalPrice = servicePrice + currentTransportCost;

    // Solo llamar onPriceCalculated si los valores cambiaron
    const lastCalculated = lastCalculatedRef.current;
    if (
      lastCalculated.totalPrice !== totalPrice ||
      lastCalculated.servicePrice !== servicePrice ||
      lastCalculated.transportCost !== currentTransportCost
    ) {
      lastCalculatedRef.current = {
        totalPrice,
        servicePrice,
        transportCost: currentTransportCost,
      };
      onPriceCalculated?.(totalPrice, servicePrice, currentTransportCost);
    }
  }, [servicePrice, transportCost, locationType, onPriceCalculated]);

  // Calcular precio total y notificar al componente padre con debounce
  useEffect(() => {
    // Limpiar timeout anterior
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Establecer nuevo timeout
    debounceTimeoutRef.current = setTimeout(() => {
      debouncedPriceCalculation();
    }, 100); // 100ms de debounce

    // Cleanup
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [debouncedPriceCalculation]);

  // No mostrar nada si no hay servicio seleccionado
  if (!selectedService || servicePrice === 0) {
    return null;
  }

  const currentTransportCost =
    locationType === "HOME" && transportCost ? transportCost.cost : 0;
  const totalPrice = servicePrice + currentTransportCost;

  return (
    <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#B06579]/10 rounded-lg p-3 sm:p-4 border border-[#D4AF37]/20">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-[#D4AF37]" />
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
          Detalle de Costos
        </h3>
      </div>

      <div className="space-y-3">
        {/* Precio del servicio */}
        <div className="flex justify-between items-start sm:items-center gap-2">
          <div className="flex-1 min-w-0">
            <span className="text-xs sm:text-sm text-gray-600 break-words">
              {serviceName}
            </span>
          </div>
          <span className="font-medium text-gray-900 text-sm sm:text-base flex-shrink-0">
            S/ {servicePrice.toFixed(2)}
          </span>
        </div>

        {/* Costo de transporte */}
        {locationType === "HOME" && (
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-[#B06579] flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-600 break-words">
                  Transporte {district && `(${district})`}
                </span>
              </div>
              <div className="text-right flex-shrink-0">
                {loading ? (
                  <span className="text-xs sm:text-sm text-gray-500">
                    Calculando...
                  </span>
                ) : error ? (
                  <span className="text-xs sm:text-sm text-red-600">Error</span>
                ) : transportCost?.hasTransportCost ? (
                  <span className="font-medium text-gray-900 text-sm sm:text-base">
                    S/ {transportCost.cost.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-xs sm:text-sm text-gray-500">
                    No disponible
                  </span>
                )}
              </div>
            </div>

            {/* Notas sobre el transporte */}
            {transportCost?.notes && (
              <div className="flex items-start gap-2 mt-2">
                <AlertCircle className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-blue-600 leading-relaxed">
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
                  <MapPin className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-amber-600 leading-relaxed">
                    Costo de transporte a coordinar
                  </span>
                </div>
              )}
          </div>
        )}

        {/* Ubicación del servicio */}
        <div className="text-xs text-gray-500 flex items-start gap-1 py-1">
          <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span className="leading-relaxed">
            {locationType === "STUDIO"
              ? "Servicio en local (Pueblo Libre)"
              : `Servicio a domicilio${district ? ` - ${district}` : ""}`}
          </span>
        </div>

        {/* Total */}
        <div className="border-t border-[#D4AF37]/30 pt-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900 text-sm sm:text-base">
              Total estimado:
            </span>
            <span className="font-bold text-base sm:text-lg text-[#D4AF37]">
              S/ {totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Nota importante */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-2">💡 Información importante:</p>
              <ul className="space-y-1.5 text-xs leading-relaxed">
                <li>
                  • Los precios pueden variar según requerimientos específicos
                </li>
                <li>• El costo final se confirmará durante la consulta</li>
                {locationType === "HOME" && (
                  <li>• El transporte incluye ida y vuelta</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
