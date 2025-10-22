import { useEffect, useState } from "react";

interface District {
  name: string;
  cost: number;
  notes?: string;
}

interface UseDistrictsReturn {
  districts: District[];
  loading: boolean;
  error: string;
  refreshDistricts: () => Promise<void>;
}

export function useDistricts(): UseDistrictsReturn {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDistricts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/transport-cost", {
        method: "POST", // Este endpoint devuelve todos los distritos
      });

      if (response.ok) {
        const data = await response.json();
        setDistricts(data.districts || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Error al cargar distritos");
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
      setDistricts([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshDistricts = async () => {
    await fetchDistricts();
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  return {
    districts,
    loading,
    error,
    refreshDistricts,
  };
}
