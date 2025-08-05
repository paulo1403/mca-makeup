import { useState, useCallback } from "react";

interface TransportCostData {
  hasTransportCost: boolean;
  cost: number;
  district: string;
  notes?: string;
}

interface UseTransportCostReturn {
  transportCost: TransportCostData | null;
  loading: boolean;
  error: string;
  getTransportCost: (district: string) => Promise<void>;
  clearTransportCost: () => void;
}

export function useTransportCost(): UseTransportCostReturn {
  const [transportCost, setTransportCost] = useState<TransportCostData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getTransportCost = useCallback(async (district: string) => {
    if (!district.trim()) {
      setTransportCost(null);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/transport-cost?district=${encodeURIComponent(district)}`);
      const data = await response.json();

      if (response.ok) {
        setTransportCost(data);
      } else {
        // Si no encuentra el distrito, establecer costo 0
        if (response.status === 404) {
          setTransportCost({
            hasTransportCost: false,
            cost: 0,
            district: district,
          });
        } else {
          throw new Error(data.error || "Error al obtener costo de transporte");
        }
      }
    } catch (error) {
      console.error("Error fetching transport cost:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
      setTransportCost(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearTransportCost = useCallback(() => {
    setTransportCost(null);
    setError("");
  }, []);

  return {
    transportCost,
    loading,
    error,
    getTransportCost,
    clearTransportCost,
  };
}
