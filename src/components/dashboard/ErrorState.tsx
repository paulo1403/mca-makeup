import { AlertTriangle, RefreshCw } from "lucide-react";

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
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 sm:p-8 max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">{title}</h3>
        <p className="text-red-600 text-sm mb-6 leading-relaxed">{message}</p>
        <button
          onClick={handleRetry}
          className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200 focus-ring touch-target"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reintentar</span>
        </button>
      </div>
    </div>
  );
}
