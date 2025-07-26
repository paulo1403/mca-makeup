import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

export function useAvailableRanges(date: Date | null) {
  const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
  return useQuery({
    queryKey: ['availableRanges', formattedDate],
    queryFn: async () => {
      if (!formattedDate) return { availableRanges: [] };
      const res = await fetch(`/api/book-appointment?date=${formattedDate}`);
      if (!res.ok) throw new Error('Error al obtener horarios');
      return res.json();
    },
    enabled: !!formattedDate,
  });
}
