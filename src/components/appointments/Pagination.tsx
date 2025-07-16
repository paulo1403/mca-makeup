import { PaginationData } from '@/hooks/useAppointments';

interface PaginationProps {
  pagination: PaginationData;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, currentPage, onPageChange }: PaginationProps) {
  if (pagination.pages <= 1) {
    return null;
  }

  return (
    <div className="mt-6 flex justify-center">
      <div className="flex space-x-2">
        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded ${
              currentPage === page
                ? "bg-[#D4AF37] text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
