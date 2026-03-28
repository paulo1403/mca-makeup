"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { PaginationData } from "@/hooks/useAppointments";

interface AppointmentsPaginationProps {
  pagination: PaginationData;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function AppointmentsPagination({
  pagination,
  currentPage,
  onPageChange,
}: AppointmentsPaginationProps) {
  if (pagination.pages <= 1) return null;

  const startItem = (currentPage - 1) * pagination.limit + 1;
  const endItem = Math.min(currentPage * pagination.limit, pagination.total);

  const getPageNumbers = (): (number | "...")[] => {
    if (pagination.pages <= 7) {
      return Array.from({ length: pagination.pages }, (_, i) => i + 1);
    }
    const delta = 2;
    const middle: number[] = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(pagination.pages - 1, currentPage + delta);
      i++
    ) {
      middle.push(i);
    }
    const result: (number | "...")[] = [];
    if (currentPage - delta > 2) {
      result.push(1, "...");
    } else {
      result.push(1);
    }
    result.push(...middle);
    if (currentPage + delta < pagination.pages - 1) {
      result.push("...", pagination.pages);
    } else {
      result.push(pagination.pages);
    }
    return result;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="space-y-3 py-2">
      <p className="text-center text-sm text-[color:var(--color-muted)]">
        Mostrando{" "}
        <span className="font-medium text-[color:var(--color-on-surface)]">{startItem}</span> a{" "}
        <span className="font-medium text-[color:var(--color-on-surface)]">{endItem}</span> de{" "}
        <span className="font-medium text-[color:var(--color-on-surface)]">{pagination.total}</span>{" "}
        citas
      </p>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              text="Anterior"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
              aria-disabled={currentPage === 1}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {pageNumbers.map((page, idx) =>
            page === "..." ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === page}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(page as number);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              text="Siguiente"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < pagination.pages) onPageChange(currentPage + 1);
              }}
              aria-disabled={currentPage === pagination.pages}
              className={currentPage === pagination.pages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
