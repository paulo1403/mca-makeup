import type { PaginationData } from "@/hooks/useAppointments";

interface PaginationProps {
  pagination: PaginationData;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, currentPage, onPageChange }: PaginationProps) {
  if (pagination.pages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * pagination.limit + 1;
  const endItem = Math.min(currentPage * pagination.limit, pagination.total);

  // Generate page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    const delta = 2; // Pages to show around current page
    const range = [];
    const rangeWithEllipsis = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(pagination.pages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithEllipsis.push(1, "...");
    } else {
      rangeWithEllipsis.push(1);
    }

    rangeWithEllipsis.push(...range);

    if (currentPage + delta < pagination.pages - 1) {
      rangeWithEllipsis.push("...", pagination.pages);
    } else if (pagination.pages > 1) {
      rangeWithEllipsis.push(pagination.pages);
    }

    return rangeWithEllipsis;
  };

  const pageNumbers =
    pagination.pages <= 7
      ? Array.from({ length: pagination.pages }, (_, i) => i + 1)
      : getPageNumbers();

  return (
    <div className="space-y-4">
      {/* Info Text */}
      <div className="text-center text-sm text-[color:var(--color-muted)]">
        Mostrando <span className="font-medium">{startItem}</span> a{" "}
        <span className="font-medium">{endItem}</span> de{" "}
        <span className="font-medium">{pagination.total}</span> citas
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-[color:var(--color-muted)] bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg hover:bg-[color:var(--color-surface-elevated)] hover:text-[color:var(--color-on-surface)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="hidden sm:inline">Anterior</span>
        </button>

        {/* Page Numbers */}
        <div className="flex space-x-1">
          {pageNumbers.map((page, index) =>
            page === "..." ? (
              <span key={index} className="px-3 py-2 text-sm text-[color:var(--color-muted)]">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-[color:var(--color-primary)] text-[color:var(--color-cta-text)] shadow-sm border border-[color:var(--color-primary)]"
                    : "text-[color:var(--color-on-surface)] bg-[color:var(--color-surface)] border border-[color:var(--color-border)] hover:bg-[color:var(--color-surface-elevated)]"
                }`}
              >
                {page}
              </button>
            ),
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === pagination.pages}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-[color:var(--color-muted)] bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-lg hover:bg-[color:var(--color-surface-elevated)] hover:text-[color:var(--color-on-surface)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Mobile: Quick Jump */}
      <div className="sm:hidden flex items-center justify-center space-x-2">
        <span className="text-sm text-[color:var(--color-muted)]">Página</span>
        <select
          value={currentPage}
          onChange={(e) => onPageChange(Number.parseInt(e.target.value))}
          className="px-2 py-1 text-sm bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-transparent"
        >
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <option key={page} value={page}>
              {page}
            </option>
          ))}
        </select>
        <span className="text-sm text-[color:var(--color-muted)]">de {pagination.pages}</span>
      </div>
    </div>
  );
}
