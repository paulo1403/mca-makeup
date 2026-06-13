import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export function useAvailableSlots(date: Date | null) {
  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";

  return useQuery({
    queryKey: ["available-slots", formattedDate],
    queryFn: async () => {
      if (!formattedDate) return { availableRanges: [] };
      const params = new URLSearchParams({ date: formattedDate });
      const res = await fetch(`/api/availability/slots?${params.toString()}`);
      if (!res.ok) throw new Error("Error al obtener horarios");
      return res.json();
    },
    enabled: !!formattedDate,
  });
}
