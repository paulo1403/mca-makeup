import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export function useAvailableRanges(
  date: Date | null,
  serviceTypes: string[],
  locationType: "STUDIO" | "HOME",
) {
  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
  const serviceTypesString = serviceTypes.join(",");

  return useQuery({
    queryKey: [
      "availableRanges",
      formattedDate,
      serviceTypesString,
      locationType,
    ],
    queryFn: async () => {
      if (!formattedDate || !serviceTypes.length || !locationType)
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
    enabled: !!formattedDate && serviceTypes.length > 0 && !!locationType,
  });
}
