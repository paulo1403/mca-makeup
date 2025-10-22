interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({
  message = "Cargando...",
  size = "md",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className="flex flex-col justify-center items-center h-64">
      <div
        className={`animate-spin rounded-full border-b-2 border-[#D4AF37] ${sizeClasses[size]}`}
      />
      {message && <p className="mt-4 text-gray-600 text-sm">{message}</p>}
    </div>
  );
}
