"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, Send, CheckCircle, AlertCircle } from "lucide-react";

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
  };
}

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
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

  const fetchReviewData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reviews/${token}`);
      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Error al cargar los datos de la reseña");
        return;
      }

      setReviewData(data.review);

      // Pre-fill form with existing data
      setFormData({
        rating: data.review.rating || 0,
        reviewText: data.review.reviewText || "",
        reviewerName:
          data.review.reviewerName || data.review.appointment.clientName || "",
        reviewerEmail: data.review.reviewerEmail || "",
      });

      // If already completed, show success message
      if (data.review.isCompleted) {
        setSuccess(true);
      }
    } catch {
      setError("Error de conexión. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReviewData();
  }, [fetchReviewData]);

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
          (service: { name?: string; serviceName?: string }) =>
            service.name || service.serviceName,
        )
        .filter(Boolean)
        .join(", ");
    }
    return serviceType || "Servicio de maquillaje";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C1C1C] to-[#5A5A5A] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--color-primary)] mx-auto mb-4"></div>
          <p>Cargando información de la reseña...</p>
        </div>
      </div>
    );
  }

  if (error && !reviewData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C1C1C] to-[#5A5A5A] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4 text-center">
          <AlertCircle className="h-16 w-16 text-[color:var(--status-cancelled-text)] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[color:var(--color-heading)] mb-4">Error</h1>
          <p className="text-[color:var(--color-muted)] mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-[color:var(--color-primary)] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (success || reviewData?.isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C1C1C] to-[#5A5A5A] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4 text-center">
          <CheckCircle className="h-16 w-16 text-[color:var(--status-confirmed-text)] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[color:var(--color-heading)] mb-4">
            ¡Gracias por tu reseña!
          </h1>
          <p className="text-[color:var(--color-muted)] mb-6">
            Tu reseña ha sido enviada exitosamente. Será revisada antes de ser
            publicada.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-[color:var(--color-primary)] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1C1C] to-[#5A5A5A] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-[color:var(--color-surface)] rounded-lg border border-[color:var(--color-border)]/30 overflow-hidden">
          {/* Header */}
          <div className="bg-[color:var(--color-primary)] text-white p-6 text-center">
            <h1 className="text-3xl font-bold mb-2">Reseña de Servicio</h1>
            <p className="text-lg opacity-90">
              Marcela Cordero - Makeup Artist
            </p>
          </div>

          {/* Appointment Info */}
          {reviewData && (
            <div className="p-6 bg-[color:var(--color-surface)] border-b border-[color:var(--color-border)]/30">
              <h2 className="text-lg font-semibold text-[color:var(--color-heading)] mb-4">
                Información de tu cita
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[color:var(--color-muted)]">Fecha</p>
                  <p className="font-medium text-[color:var(--color-heading)]">
                    {formatDate(reviewData.appointment.appointmentDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[color:var(--color-muted)]">Servicios</p>
                  <p className="font-medium text-[color:var(--color-heading)]">
                    {getServiceNames(
                      reviewData.appointment.services,
                      reviewData.appointment.serviceType,
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Review Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-[color:var(--color-heading)] mb-2">
                  Calificación general *
                </label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary)] rounded p-1"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoveredRating || formData.rating)
                            ? "text-[color:var(--color-primary)] fill-current"
                            : "text-[color:var(--color-border)]/40"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-[color:var(--color-muted)]">
                    (
                    {formData.rating > 0
                      ? `${formData.rating} estrella${formData.rating !== 1 ? "s" : ""}`
                      : "Sin calificar"}
                    )
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label
                  htmlFor="reviewText"
                  className="block text-sm font-medium text-[color:var(--color-heading)] mb-2"
                >
                  Tu experiencia (opcional)
                </label>
                <textarea
                  id="reviewText"
                  rows={4}
                  value={formData.reviewText}
                  onChange={(e) =>
                    setFormData({ ...formData, reviewText: e.target.value })
                  }
                  placeholder="Cuéntanos sobre tu experiencia con nuestro servicio..."
                  className="w-full px-3 py-2 border border-[color:var(--color-border)]/30 rounded-lg focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)] resize-none"
                />
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="reviewerName"
                  className="block text-sm font-medium text-[color:var(--color-heading)] mb-2"
                >
                  Tu nombre *
                </label>
                <input
                  type="text"
                  id="reviewerName"
                  value={formData.reviewerName}
                  onChange={(e) =>
                    setFormData({ ...formData, reviewerName: e.target.value })
                  }
                  placeholder="Ingresa tu nombre"
                  className="w-full px-3 py-2 border border-[color:var(--color-border)]/30 rounded-lg focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)]"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="reviewerEmail"
                  className="block text-sm font-medium text-[color:var(--color-heading)] mb-2"
                >
                  Tu email *
                </label>
                <input
                  type="email"
                  id="reviewerEmail"
                  value={formData.reviewerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, reviewerEmail: e.target.value })
                  }
                  placeholder="tu@email.com"
                  className="w-full px-3 py-2 border border-[color:var(--color-border)]/30 rounded-lg focus:ring-2 focus:ring-[color:var(--color-primary)] focus:border-[color:var(--color-primary)]"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-[color:var(--color-surface)] border border-[color:var(--status-cancelled-text)]/30 rounded-lg p-4">
                  <p className="text-[color:var(--status-cancelled-text)] text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[color:var(--color-primary)] text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 focus:ring-2 focus:ring-[color:var(--color-primary)] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando reseña...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar reseña
                  </>
                )}
              </button>
            </form>

            {/* Privacy Note */}
            <div className="mt-6 p-4 bg-[color:var(--color-surface)] border border-[color:var(--color-border)]/30 rounded-lg">
              <p className="text-xs text-[color:var(--color-muted)]">
                <strong>Nota de privacidad:</strong> Tu reseña será revisada
                antes de ser publicada. Nos reservamos el derecho de no publicar
                reseñas que contengan contenido inapropiado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
