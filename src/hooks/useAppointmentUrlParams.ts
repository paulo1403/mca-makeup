import { useSearchParams } from "next/navigation";

export function useAppointmentUrlParams() {
  const searchParams = useSearchParams();
  return {
    highlightId: searchParams.get("highlightId"),
    showDetail: searchParams.get("showDetail"),
  };
}
