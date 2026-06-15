import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  title = "Error al cargar datos",
  message = "No se pudieron cargar los datos del dashboard. Por favor, intenta recargar la página.",
  onRetry,
  className = "",
}: ErrorStateProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className={`text-center py-8 sm:py-12 ${className}`}>
      <div className="bg-[color:var(--color-danger)]/10 border border-[color:var(--color-danger)]/20 rounded-xl p-6 sm:p-8 max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-[color:var(--color-danger)]/20 rounded-full">
            <AlertTriangle className="w-8 h-8 text-[color:var(--color-danger)]" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-[color:var(--color-danger)] mb-2">{title}</h3>
        <p className="text-[color:var(--color-danger)] text-sm mb-6 leading-relaxed">{message}</p>
        <Button
          onClick={handleRetry}
          variant="danger"
          size="md"
          className="inline-flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reintentar</span>
        </Button>
      </div>
    </div>
  );
}
