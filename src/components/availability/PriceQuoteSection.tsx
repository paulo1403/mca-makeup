"use client";

import Typography from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import CompactServiceSelector from "@/components/availability/CompactServiceSelector";
import { useServicesList } from "@/hooks/useServices";
import { useDistricts } from "@/hooks/useDistricts";
import type { ServiceSelection, LocationType } from "@/types";
import {
  MapPin,
  DollarSign,
  ArrowRight,
  Calculator,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function PriceQuoteSection() {
  const [locationType, setLocationType] = useState<LocationType>("HOME");
  const [serviceSelection, setServiceSelection] = useState<ServiceSelection>(
    {}
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [districtSearch, setDistrictSearch] = useState<string>("");
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: allServices = [] } = useServicesList();
  const { districts: transportCosts = [], loading: districtsLoading } =
    useDistricts();

  const hasSelectedService = useMemo(() => {
    return Object.values(serviceSelection).some((q) => q > 0);
  }, [serviceSelection]);

  // Calcular el precio base de los servicios
  const servicesPrice = useMemo(() => {
    let total = 0;
    Object.entries(serviceSelection).forEach(([serviceId, quantity]) => {
      if (quantity > 0) {
        const service = allServices.find(
          (s: { id: string; price: number }) => s.id === serviceId
        );
        if (service) {
          total += service.price * quantity;
        }
      }
    });
    return total;
  }, [serviceSelection, allServices]);

  // Calcular costo de transporte
  const transportCost = useMemo(() => {
    if (locationType === "STUDIO") return 0;
    if (!selectedDistrict) return 0;
    const district = transportCosts.find(
      (d: { name: string; cost: number }) => d.name === selectedDistrict
    );
    return district?.cost || 0;
  }, [locationType, selectedDistrict, transportCosts]);

  // Total general
  const totalPrice = servicesPrice + transportCost;

  const filteredDistricts = useMemo(() => {
    const districts = transportCosts.map(
      (d: { district?: string; name?: string; cost?: number }) =>
        d.district ?? d.name ?? ""
    );
    if (!districtSearch.trim()) return districts;
    return districts.filter((d: string) =>
      d.toLowerCase().includes(districtSearch.toLowerCase())
    );
  }, [transportCosts, districtSearch]);

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district);
    setDistrictSearch(district);
    setShowDistrictDropdown(false);
  };

  const handleContinueToBooking = () => {
    // Disparar evento para pre-llenar la sección de disponibilidad
    const servicesPairs: string[] = [];
    Object.keys(serviceSelection).forEach((id) => {
      const qty = serviceSelection[id];
      if (qty > 0) servicesPairs.push(`${id}:${qty}`);
    });

    window.dispatchEvent(
      new CustomEvent("quote:continue", {
        detail: {
          locationType,
          services: servicesPairs.join(","),
          district: selectedDistrict || undefined,
        },
      })
    );

    // Scroll a la sección de disponibilidad
    setTimeout(() => {
      const el = document.querySelector("#availability-section");
      if (el) {
        (el as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  return (
    <div className="mb-8 rounded-[16px] bg-[color:var(--color-surface)]/40 border border-[color:var(--color-border)]/30 w-full max-w-full overflow-visible transition-all duration-200 hover:border-[color:var(--color-primary)]/30">
      {/* Header colapsable */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center justify-between hover:bg-[color:var(--color-surface)]/20 transition-all duration-200 rounded-[16px] group"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-[color:var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[color:var(--color-primary)]/20 transition-colors">
              <Calculator className="w-6 h-6 text-[color:var(--color-primary)]" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[color:var(--color-primary)] text-white flex items-center justify-center text-xs font-bold shadow-md">
              1
            </div>
          </div>
          <div className="text-left flex-1">
            <Typography
              as="h3"
              variant="h3"
              className="font-bold text-[color:var(--color-heading)] break-words mb-1"
            >
              Cotiza tu Servicio
            </Typography>
            <Typography
              as="p"
              variant="small"
              className="text-[color:var(--color-body)] opacity-80"
            >
              Calcula el precio de tu maquillaje y peinado
            </Typography>
          </div>
        </div>
        <div className="flex-shrink-0 ml-3">
          {isExpanded ? (
            <ChevronUp className="w-6 h-6 text-[color:var(--color-primary)] group-hover:scale-110 transition-transform" />
          ) : (
            <ChevronDown className="w-6 h-6 text-[color:var(--color-primary)] group-hover:scale-110 transition-transform" />
          )}
        </div>
      </button>

      {/* Contenido colapsable */}
      {isExpanded && (
        <div className="px-5 pb-5 space-y-4">
          {/* Ubicación */}
          <div>
            <Typography
              as="h4"
              variant="h4"
              className="font-semibold text-[color:var(--color-heading)] mb-2 text-center"
            >
              Ubicación
            </Typography>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={locationType === "HOME" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setLocationType("HOME")}
                className="flex-1 rounded-[12px]"
              >
                <MapPin className="w-4 h-4 mr-1" /> A domicilio
              </Button>
              <Button
                type="button"
                variant={locationType === "STUDIO" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setLocationType("STUDIO")}
                className="flex-1 rounded-[12px]"
              >
                <MapPin className="w-4 h-4 mr-1" /> Estudio
              </Button>
            </div>
          </div>

          {/* Distrito (solo si es a domicilio) */}
          {locationType === "HOME" && (
            <div>
              <Typography
                as="h4"
                variant="h4"
                className="font-semibold text-[color:var(--color-heading)] mb-2 text-center"
              >
                Distrito
              </Typography>
              <div
                className="relative"
                onBlur={() =>
                  setTimeout(() => setShowDistrictDropdown(false), 150)
                }
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--color-muted)] pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder="Busca tu distrito..."
                  value={districtSearch}
                  onChange={(e) => {
                    setDistrictSearch(e.target.value);
                    setShowDistrictDropdown(true);
                    if (!e.target.value.trim()) {
                      setSelectedDistrict("");
                    }
                  }}
                  onFocus={() => setShowDistrictDropdown(true)}
                  className="w-full pl-10 pr-4 py-2 rounded-[12px] bg-[color:var(--color-surface)]/60 text-[color:var(--color-heading)] placeholder:text-[color:var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/30 border border-[color:var(--color-border)]"
                  aria-expanded={showDistrictDropdown}
                  aria-haspopup="listbox"
                />
                {showDistrictDropdown && filteredDistricts.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 max-h-48 overflow-y-auto rounded-[12px] bg-[color:var(--color-surface)] border border-[color:var(--color-border)] shadow-lg">
                    {filteredDistricts.map((district: string) => (
                      <button
                        key={district}
                        type="button"
                        onClick={() => handleDistrictSelect(district)}
                        className="w-full px-4 py-2 text-left text-[color:var(--color-heading)] hover:bg-[color:var(--color-primary)]/10 transition-colors text-sm"
                      >
                        {district}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Servicio */}
          <div>
            <Typography
              as="h4"
              variant="h4"
              className="font-semibold text-[color:var(--color-heading)] mb-2 text-center"
            >
              Servicios
            </Typography>
            <CompactServiceSelector
              value={serviceSelection}
              onChangeAction={setServiceSelection}
              showPrice={true}
            />
            {!hasSelectedService && (
              <Typography
                as="p"
                variant="small"
                className="text-[color:var(--color-muted)] mt-2 text-center"
              >
                Selecciona al menos un servicio
              </Typography>
            )}
          </div>
        </div>
      )}

      {/* Desglose de precio */}
      {hasSelectedService && (
        <div className="mt-6 p-4 rounded-[12px] bg-[color:var(--color-primary)]/10 space-y-3">
          <Typography
            as="h4"
            variant="h4"
            className="font-semibold text-[color:var(--color-heading)] mb-3 flex items-center justify-center gap-2"
          >
            <DollarSign className="w-5 h-5" />
            Desglose de Precio
          </Typography>

          <div className="space-y-2 text-sm">
            {/* Servicios */}
            <div className="flex justify-between items-center">
              <Typography
                as="span"
                variant="small"
                className="text-[color:var(--color-body)]"
              >
                Servicios
              </Typography>
              <Typography
                as="span"
                variant="small"
                className="text-[color:var(--color-heading)] font-medium"
              >
                S/ {servicesPrice.toFixed(2)}
              </Typography>
            </div>

            {/* Transporte */}
            {locationType === "HOME" && (
              <div className="flex justify-between items-center">
                <Typography
                  as="span"
                  variant="small"
                  className="text-[color:var(--color-body)]"
                >
                  Transporte {selectedDistrict && `(${selectedDistrict})`}
                </Typography>
                <Typography
                  as="span"
                  variant="small"
                  className="text-[color:var(--color-heading)] font-medium"
                >
                  {selectedDistrict
                    ? `S/ ${transportCost.toFixed(2)}`
                    : "S/ 0.00"}
                </Typography>
              </div>
            )}

            {/* Total */}
            <div className="pt-3 border-t border-[color:var(--color-border)]/30 flex justify-between items-center">
              <Typography
                as="span"
                variant="p"
                className="text-[color:var(--color-heading)] font-semibold"
              >
                Total
              </Typography>
              <Typography
                as="span"
                variant="h3"
                className="text-[color:var(--color-primary)] font-bold"
              >
                S/ {totalPrice.toFixed(2)}
              </Typography>
            </div>
          </div>

          {/* Nota sobre turno noche */}
          <div className="pt-2 border-t border-[color:var(--color-border)]/20">
            <Typography
              as="p"
              variant="small"
              className="text-[color:var(--color-muted)] text-center"
            >
              * Si tu cita es después de las 8 PM, se aplica un cargo adicional
              de S/ 20.00
            </Typography>
          </div>

          {/* Botón para continuar */}
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="w-full rounded-[12px] mt-3"
            onClick={handleContinueToBooking}
          >
            Continuar con la reserva
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
