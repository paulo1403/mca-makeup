import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ServiceSelection } from "@/types";

export function useAvailableRanges(
  date: Date | null,
  serviceSelection: ServiceSelection,
  locationType: "STUDIO" | "HOME",
) {
  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
  
  // Convertir ServiceSelection a array de service IDs que tienen cantidad > 0
  const selectedServiceIds = Object.keys(serviceSelection).filter(
    serviceId => serviceSelection[serviceId] > 0
  );
  
  const serviceTypesString = selectedServiceIds.join(",");

  return useQuery({
    queryKey: [
      "availableRanges",
      formattedDate,
      serviceTypesString,
      locationType,
    ],
    queryFn: async () => {
      if (!formattedDate || !selectedServiceIds.length || !locationType)
        return { availableRanges: [] };
      const params = new URLSearchParams({
        date: formattedDate,
        serviceTypes: serviceTypesString,
        locationType,
      });

      const res = await fetch(`/api/availability?${params.toString()}`);
      if (!res.ok) throw new Error("Error al obtener horarios");
      return res.json();
    },
    enabled: !!formattedDate && selectedServiceIds.length > 0 && !!locationType,
  });
}
