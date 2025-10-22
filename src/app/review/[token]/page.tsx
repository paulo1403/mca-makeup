"use client";

import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/ui/Button";
import Typography from "@/components/ui/Typography";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, Send, Star } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ReviewData {
  id: string;
  appointmentId: string;
  reviewToken: string;
  rating: number | null;
  reviewText: string | null;
  reviewerName: string;
  reviewerEmail: string;
  isCompleted: boolean;
  appointment: {
    clientName: string;
    serviceType: string;
    appointmentDate: string;
    services: Array<{ name?: string; serviceName?: string }> | null;
    clientEmail?: string;
  };
}

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    rating: 0,
    reviewText: "",
    reviewerName: "",
    reviewerEmail: "",
  });

  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      setError("Por favor, seleccione una calificación");
      return;
    }

    if (!formData.reviewerName.trim()) {
      setError("Por favor, ingrese su nombre");
      return;
    }

    if (!formData.reviewerEmail.trim()) {
      setError("Por favor, ingrese su email");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewToken: token,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Error al enviar la reseña");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Error de conexión. Por favor, intente nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getServiceNames = (
    services: Array<{ name?: string; serviceName?: string }> | null,
    serviceType: string,
  ) => {
    if (services && Array.isArray(services) && services.length > 0) {
      return services
        .map(
          (service: { name?: string; serviceName?: string }) => service.name || service.serviceName,
        )
        .filter(Boolean)
        .join(", ");
    }
    return serviceType || "Servicio de maquillaje";
  };

  const {
    data: reviewResponse,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["review", token],
    queryFn: async () => {
      const response = await fetch(`/api/reviews/${token}`);
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Error al cargar los datos de la reseña");
      }
      return data;
    },
  });

  const reviewData = reviewResponse?.review ?? null;

  useEffect(() => {
    if (reviewData) {
      setFormData({
        rating: reviewData.rating || 0,
        reviewText: reviewData.reviewText || "",
        reviewerName: reviewData.reviewerName || reviewData.appointment?.clientName || "",
        reviewerEmail: reviewData.reviewerEmail || reviewData.appointment?.clientEmail || "",
      });
      if (reviewData.isCompleted) {
        setSuccess(true);
      }
    }
  }, [reviewData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[color:var(--color-background)] flex items-center justify-center">
        <div className="text-center text-[color:var(--color-main)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--color-primary)] mx-auto mb-4" />
          <Typography variant="p">Cargando información de la reseña...</Typography>
        </div>
      </div>
    );
  }

  if (queryError && !reviewData) {
    return (
      <div className="min-h-screen bg-[color:var(--color-background)] flex items-center justify-center">
        <div className="bg-[color:var(--color-surface)] rounded-lg shadow-xl p-8 max-w-md mx-4 text-center">
          <AlertCircle className="h-16 w-16 text-[color:var(--status-cancelled-text)] mx-auto mb-4" />
          <Typography variant="h2" className="mb-4">
            Error
          </Typography>
          <Typography variant="p" className="text-[color:var(--color-muted)] mb-6">
            {String(queryError.message)}
          </Typography>
          <Button variant="primary" size="md" onClick={() => router.push("/")}>
            <Typography variant="p" className="text-white">
              Volver al inicio
            </Typography>
          </Button>
        </div>
      </div>
    );
  }

  if (success || reviewData?.isCompleted) {
    return (
      <div className="min-h-screen bg-[color:var(--color-background)] flex items-center justify-center">
        <div className="bg-[color:var(--color-surface)] rounded-lg shadow-xl p-8 max-w-md mx-4 text-center">
          <CheckCircle className="h-16 w-16 text-[color:var(--status-confirmed-text)] mx-auto mb-4" />
          <Typography variant="h2" className="mb-4">
            ¡Gracias por tu reseña!
          </Typography>
          <Typography variant="p" className="text-[color:var(--color-muted)] mb-6">
            Tu reseña ha sido enviada exitosamente. Será revisada antes de ser publicada.
          </Typography>
          <Button variant="primary" size="md" onClick={() => router.push("/")}>
            <Typography variant="p" className="text-white">
              Volver al inicio
            </Typography>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen section-bg-hero py-16 px-4 sm:px-6 lg:px-8">
      <div className="section-overlay-top" />
      <div className="section-overlay-bottom" />
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="bg-[color:var(--color-surface)]/90 backdrop-blur-sm rounded-2xl border border-[color:var(--color-border)]/40 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[color:var(--color-primary)] to-[color:var(--color-accent)] text-white p-6 text-center relative">
            <div className="absolute right-4 top-4">
              <ThemeToggle />
            </div>
            <Typography variant="h1" className="mb-2 text-white">
              Reseña de Servicio
            </Typography>
            <Typography variant="p" className="opacity-90 text-white">
              Marcela Cordero - Makeup Artist
            </Typography>
          </div>

          {/* Appointment Info */}
          {reviewData && (
            <div className="p-6 bg-[color:var(--color-surface)] border-b border-[color:var(--color-border)]/30">
              <Typography variant="h4" className="mb-4">
                Información de tu cita
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Typography variant="small" className="text-[color:var(--color-muted)]">
                    Fecha
                  </Typography>
                  <Typography variant="p" className="font-medium text-[color:var(--color-heading)]">
                    {formatDate(reviewData.appointment.appointmentDate)}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-[color:var(--color-muted)]">
                    Servicios
                  </Typography>
                  <Typography variant="p" className="font-medium text-[color:var(--color-heading)]">
                    {getServiceNames(
                      reviewData.appointment.services,
                      reviewData.appointment.serviceType,
                    )}
                  </Typography>
                </div>
              </div>
            </div>
          )}

          {/* Review Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <Typography
                  as="label"
                  variant="small"
                  className="font-medium text-[color:var(--color-heading)] mb-2"
                >
                  Calificación general *
                </Typography>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)] rounded p-1"
                      aria-label={`${star} estrellas`}
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= (hoveredRating || formData.rating)
                            ? "text-[color:var(--color-primary)] fill-current"
                            : "text-[color:var(--color-muted)] hover:text-[color:var(--color-primary)]"
                        }`}
                      />
                    </button>
                  ))}
                  <Typography variant="small" className="ml-2 text-[color:var(--color-muted)]">
                    (
                    {formData.rating > 0
                      ? `${formData.rating} estrella${formData.rating !== 1 ? "s" : ""}`
                      : "Sin calificar"}
                    )
                  </Typography>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <Typography
                  as="label"
                  htmlFor="reviewText"
                  variant="small"
                  className="font-medium text-[color:var(--color-heading)] mb-2"
                >
                  Tu experiencia (opcional)
                </Typography>
                <textarea
                  id="reviewText"
                  rows={4}
                  value={formData.reviewText}
                  onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                  placeholder="Cuéntanos sobre tu experiencia con nuestro servicio..."
                  className="w-full px-3 py-2 border border-[color:var(--color-border)]/30 rounded-lg focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)] resize-none"
                />
              </div>

              {/* Name */}
              <div>
                <Typography
                  as="label"
                  htmlFor="reviewerName"
                  variant="small"
                  className="font-medium text-[color:var(--color-heading)] mb-2"
                >
                  Tu nombre *
                </Typography>
                <input
                  type="text"
                  id="reviewerName"
                  value={formData.reviewerName}
                  onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
                  placeholder="Ingresa tu nombre"
                  className="w-full px-3 py-2 border border-[color:var(--color-border)]/30 rounded-lg focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)]"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <Typography
                  as="label"
                  htmlFor="reviewerEmail"
                  variant="small"
                  className="font-medium text-[color:var(--color-heading)] mb-2"
                >
                  Tu email *
                </Typography>
                <input
                  type="email"
                  id="reviewerEmail"
                  value={formData.reviewerEmail}
                  onChange={(e) => setFormData({ ...formData, reviewerEmail: e.target.value })}
                  placeholder="tu@email.com"
                  className="w-full px-3 py-2 border border-[color:var(--color-border)]/30 rounded-lg focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)]"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-[color:var(--color-surface)] border border-[color:var(--status-cancelled-text)]/30 rounded-lg p-4">
                  <Typography variant="small" className="text-[color:var(--status-cancelled-text)]">
                    {error}
                  </Typography>
                </div>
              )}

              {/* Submit Button */}
              <div className="w-full">
                <Button
                  as="button"
                  type="submit"
                  disabled={submitting}
                  variant="primary"
                  size="md"
                  className="w-full flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[color:var(--color-cta-text)] mr-2" />
                      <Typography variant="p" className="text-white">
                        Enviando reseña...
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      <Typography variant="p" className="text-white">
                        Enviar reseña
                      </Typography>
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Privacy Note */}
            <div className="mt-6 p-4 bg-[color:var(--color-surface)]/80 backdrop-blur-sm border border-[color:var(--color-border)]/30 rounded-lg">
              <Typography variant="caption" className="text-[color:var(--color-muted)]">
                <strong>Nota de privacidad:</strong> Tu reseña será revisada antes de ser publicada.
                Nos reservamos el derecho de no publicar reseñas que contengan contenido
                inapropiado.
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
