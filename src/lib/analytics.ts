import { track } from "@vercel/analytics";

/**
 * Eventos personalizados para Vercel Analytics
 * Estos te ayudarán a entender mejor cómo los usuarios interactúan con tu sitio
 */

export const analytics = {
  // Eventos de booking/reservas
  bookingStarted: (serviceType: string) => {
    track("booking_started", { service_type: serviceType });
  },

  bookingCompleted: (serviceType: string, location: string, price?: number) => {
    track("booking_completed", {
      service_type: serviceType,
      location_type: location,
      ...(price && { price: price }),
    });
  },

  serviceSelected: (serviceName: string, quantity: number) => {
    track("service_selected", {
      service_name: serviceName,
      quantity: quantity,
    });
  },

  // Eventos de navegación
  portfolioViewed: () => {
    track("portfolio_viewed");
  },

  contactFormViewed: () => {
    track("contact_form_viewed");
  },

  // Eventos de engagement
  phoneClicked: () => {
    track("phone_clicked");
  },

  whatsappClicked: () => {
    track("whatsapp_clicked");
  },

  reviewSubmitted: (rating: number) => {
    track("review_submitted", { rating });
  },

  // Eventos de admin (para Marcela)
  adminLogin: () => {
    track("admin_login");
  },

  appointmentManaged: (action: "confirmed" | "cancelled" | "completed") => {
    track("appointment_managed", { action });
  },
};

// Helper para trackear errores
export const trackError = (error: string, context?: string) => {
  track("error_occurred", {
    error_message: error,
    context: context || "unknown",
  });
};

// Helper para trackear tiempo en página (útil para engagement)
export const trackPageView = (pageName: string) => {
  track("page_view", { page: pageName });
};
