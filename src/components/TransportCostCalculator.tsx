"use client";

import { MapPin, Search } from "lucide-react";
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
    <div className="rounded-[12px] bg-[color:var(--color-surface)]/40 p-4 w-full max-w-full">
      <Typography
        as="h3"
        variant="h3"
        className="font-bold text-[color:var(--color-heading)] mb-2 text-center break-words"
      >
        Calculadora de Transporte
      </Typography>
      <Typography
        as="p"
        variant="small"
        className="text-[color:var(--color-body)] mb-4 text-center"
      >
        Consulta el costo a tu distrito
      </Typography>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--color-muted)]" />
        <input
          type="text"
          placeholder="Busca tu distrito..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedDistrict(null);
          }}
          className="w-full pl-10 pr-4 py-2 rounded-[12px] bg-[color:var(--color-surface)]/60 text-[color:var(--color-heading)] placeholder:text-[color:var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)]/30"
        />
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-4">
          <Typography
            as="p"
            variant="small"
            className="text-[color:var(--color-body)]"
          >
            Cargando distritos...
          </Typography>
        </div>
      ) : (
        <>
          {/* Selected District Display */}
          {selectedDistrict && (
            <div className="p-3 rounded-[12px] bg-[color:var(--color-primary)]/10 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-[color:var(--color-primary)]" />
                <Typography
                  as="h4"
                  variant="h4"
                  className="font-semibold text-[color:var(--color-heading)]"
                >
                  {selectedDistrict.district}
                </Typography>
              </div>
              <Typography
                as="p"
                variant="small"
                className="text-[color:var(--color-body)]"
              >
                Costo:{" "}
                <span className="font-bold text-[color:var(--color-primary)]">
                  {selectedDistrict.cost === 0
                    ? "Gratis"
                    : `S/ ${selectedDistrict.cost.toFixed(2)}`}
                </span>
              </Typography>
              {selectedDistrict.notes && (
                <Typography
                  as="p"
                  variant="small"
                  className="text-[color:var(--color-muted)] mt-1"
                >
                  {selectedDistrict.notes}
                </Typography>
              )}
            </div>
          )}

          {/* District List */}
          {searchTerm && !selectedDistrict && (
            <div className="space-y-2">
              {filteredDistricts.length > 0 ? (
                <>
                  {filteredDistricts.slice(0, 5).map((district) => (
                    <button
                      key={district.district}
                      type="button"
                      className="w-full flex items-center justify-between p-2 rounded-[12px] bg-[color:var(--color-surface)]/60 hover:bg-[color:var(--color-surface)] transition-colors text-left"
                      onClick={() => handleDistrictSelect(district)}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[color:var(--color-primary)]" />
                        <Typography
                          as="span"
                          variant="small"
                          className="text-[color:var(--color-heading)]"
                        >
                          {district.district}
                        </Typography>
                      </div>
                      <Typography
                        as="span"
                        variant="small"
                        className="font-medium text-[color:var(--color-primary)]"
                      >
                        {district.cost === 0
                          ? "Gratis"
                          : `S/ ${district.cost.toFixed(2)}`}
                      </Typography>
                    </button>
                  ))}
                  {filteredDistricts.length > 5 && (
                    <Typography
                      as="p"
                      variant="small"
                      className="text-[color:var(--color-muted)] text-center"
                    >
                      +{filteredDistricts.length - 5} más...
                    </Typography>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <Typography
                    as="p"
                    variant="small"
                    className="text-[color:var(--color-body)]"
                  >
                    No se encontraron distritos
                  </Typography>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
