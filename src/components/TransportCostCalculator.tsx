"use client";

import { MapPin, Search, TrendingUp, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import Typography from "./ui/Typography";

interface TransportCost {
  district: string;
  cost: number;
  notes?: string;
}

export default function TransportCostCalculator() {
  const [transportCosts, setTransportCosts] = useState<TransportCost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] =
    useState<TransportCost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransportCosts = async () => {
      try {
        const response = await fetch("/api/transport-costs");
        const data = await response.json();
        setTransportCosts(data);
      } catch (error) {
        console.error("Error fetching transport costs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransportCosts();
  }, []);

  const filteredDistricts = transportCosts.filter((tc) =>
    tc.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDistrictSelect = (district: TransportCost) => {
    setSelectedDistrict(district);
    setSearchTerm(district.district);
  };

  return (
    <div 
      id="calculadora-transporte"
      className="p-6 sm:p-8 bg-[color:var(--color-surface)] rounded-2xl border border-[color:var(--color-border)]"
    >
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-[color:var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
            <Truck className="w-5 h-5 text-[color:var(--color-primary)]" />
          </div>
          <Typography
            as="h3"
            variant="h3"
            className="text-xl sm:text-2xl font-bold text-[color:var(--color-heading)]"
          >
            Calculadora de Transporte
          </Typography>
        </div>
        <Typography
          as="p"
          variant="p"
          className="text-sm text-[color:var(--color-muted)]"
        >
          Consulta el costo de transporte a tu distrito antes de agendar tu cita
        </Typography>
      </div>

      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[color:var(--color-muted)]" />
          <input
            type="text"
            placeholder="Busca tu distrito..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedDistrict(null);
            }}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-background)] text-[color:var(--color-body)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/20 focus:border-[color:var(--color-primary)] transition-colors"
          />
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-[color:var(--color-primary)]/20 border-t-[color:var(--color-primary)] rounded-full animate-spin mb-3" />
            <Typography
              as="p"
              variant="small"
              className="text-[color:var(--color-muted)]"
            >
              Cargando distritos...
            </Typography>
          </div>
        ) : (
          <>
            {/* Selected District Display */}
            {selectedDistrict && (
              <div className="p-4 rounded-xl bg-[color:var(--color-primary)]/5 border border-[color:var(--color-primary)]/20">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-[color:var(--color-primary)]" />
                  <Typography
                    as="h4"
                    variant="h4"
                    className="font-semibold text-[color:var(--color-heading)]"
                  >
                    {selectedDistrict.district}
                  </Typography>
                </div>
                <div className="flex items-center justify-between">
                  <Typography
                    as="span"
                    variant="small"
                    className="text-[color:var(--color-muted)]"
                  >
                    Costo de transporte:
                  </Typography>
                  <Typography
                    as="span"
                    variant="p"
                    className="font-bold text-[color:var(--color-primary)]"
                  >
                    {selectedDistrict.cost === 0
                      ? "Gratis"
                      : `S/ ${selectedDistrict.cost.toFixed(2)}`}
                  </Typography>
                </div>
                {selectedDistrict.notes && (
                  <div className="flex items-start gap-2 mt-3 pt-3 border-t border-[color:var(--color-border)]">
                    <TrendingUp className="w-4 h-4 text-[color:var(--color-primary)] mt-0.5 flex-shrink-0" />
                    <Typography
                      as="span"
                      variant="small"
                      className="text-[color:var(--color-muted)]"
                    >
                      {selectedDistrict.notes}
                    </Typography>
                  </div>
                )}
              </div>
            )}

            {/* District List */}
            {searchTerm && !selectedDistrict && (
              <div className="space-y-2">
                {filteredDistricts.length > 0 ? (
                  <>
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      {filteredDistricts.slice(0, 8).map((district) => (
                        <button
                          key={district.district}
                          type="button"
                          onClick={() => handleDistrictSelect(district)}
                          className="w-full flex items-center justify-between p-3 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-background)] hover:border-[color:var(--color-primary)]/30 hover:bg-[color:var(--color-primary)]/5 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-[color:var(--color-primary)] flex-shrink-0" />
                            <Typography
                              as="span"
                              variant="p"
                              className="text-[color:var(--color-body)]"
                            >
                              {district.district}
                            </Typography>
                          </div>
                          <Typography
                            as="span"
                            variant="small"
                            className="font-semibold text-[color:var(--color-primary)]"
                          >
                            {district.cost === 0
                              ? "Gratis"
                              : `S/ ${district.cost.toFixed(2)}`}
                          </Typography>
                        </button>
                      ))}
                    </div>
                    {filteredDistricts.length > 8 && (
                      <Typography
                        as="p"
                        variant="small"
                        className="text-center text-[color:var(--color-muted)] pt-2"
                      >
                        +{filteredDistricts.length - 8} distritos más...
                      </Typography>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <MapPin className="w-12 h-12 text-[color:var(--color-muted)] opacity-30 mb-3" />
                    <Typography
                      as="p"
                      variant="p"
                      className="text-[color:var(--color-muted)]"
                    >
                      No se encontraron distritos
                    </Typography>
                  </div>
                )}
              </div>
            )}

            {/* Info Card */}
            {!searchTerm && (
              <div className="space-y-3 pt-2">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[color:var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[color:var(--color-primary)]" />
                  </div>
                  <div>
                    <Typography
                      as="h5"
                      variant="h5"
                      className="font-semibold text-[color:var(--color-heading)] mb-1"
                    >
                      Servicio a Domicilio
                    </Typography>
                    <Typography
                      as="p"
                      variant="small"
                      className="text-[color:var(--color-muted)]"
                    >
                      Llevo mi servicio profesional a la comodidad de tu hogar
                    </Typography>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[color:var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-[color:var(--color-primary)]" />
                  </div>
                  <div>
                    <Typography
                      as="h5"
                      variant="h5"
                      className="font-semibold text-[color:var(--color-heading)] mb-1"
                    >
                      Costos Transparentes
                    </Typography>
                    <Typography
                      as="p"
                      variant="small"
                      className="text-[color:var(--color-muted)]"
                    >
                      Conoce el costo exacto antes de agendar tu cita
                    </Typography>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
