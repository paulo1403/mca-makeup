import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export function useAvailableRanges(
  date: Date | null,
  serviceType: string,
  locationType: "STUDIO" | "HOME",
) {
  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";

  return useQuery({
    queryKey: ["availableRanges", formattedDate, serviceType, locationType],
    queryFn: async () => {
      if (!formattedDate || !serviceType || !locationType)
        return { availableRanges: [] };
      const params = new URLSearchParams({
        date: formattedDate,
        serviceType,
        locationType,
      });

      const res = await fetch(`/api/availability?${params.toString()}`);
      if (!res.ok) throw new Error("Error al obtener horarios");
      return res.json();
    },
    enabled: !!formattedDate && !!serviceType && !!locationType,
  });
}
