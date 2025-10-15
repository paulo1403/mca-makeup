import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ServiceSelection } from "@/types";

export function useAvailableRanges(
  date: Date | null,
  serviceSelection: ServiceSelection,
  locationType: "STUDIO" | "HOME"
) {
  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";

  const expandedServiceIds: string[] = [];
  Object.keys(serviceSelection).forEach((serviceId) => {
    const quantity = serviceSelection[serviceId];
    if (quantity > 0) {
      for (let i = 0; i < quantity; i++) {
        expandedServiceIds.push(serviceId);
      }
    }
  });

  const serviceTypesString = expandedServiceIds.join(",");

  return useQuery({
    queryKey: [
      "availableRanges",
      formattedDate,
      serviceTypesString,
      locationType,
    ],
    queryFn: async () => {
      if (!formattedDate || !expandedServiceIds.length || !locationType)
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
    enabled: !!formattedDate && expandedServiceIds.length > 0 && !!locationType,
  });
}
