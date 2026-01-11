import BookingFlow from "@/components/BookingFlow";
import AvailabilityCheckSection from "@/components/availability/AvailabilityCheckSection";
import PriceQuoteSection from "@/components/availability/PriceQuoteSection";
import Typography from "@/components/ui/Typography";
import TransportCostCalculator from "@/components/TransportCostCalculator";
import "@/styles/components/contact.css";
import "@/styles/components/transport-calculator.css";

export const metadata = {
  title: "Reservar Cita - Marcela Cordero Makeup",
  description:
    "Agenda tu cita de maquillaje profesional con Marcela Cordero. Completa el formulario y recibe confirmación inmediata.",
};

export default function BookingPage() {
  return (
    <section
      className="contact-section py-10 sm:py-20 relative min-h-screen pt-32"
      style={{ scrollMarginTop: "120px" }}
    >
      <div className="contact-container px-4 sm:px-6">
        <div className="contact-header mb-8 sm:mb-12 text-center">
          <Typography
            as="h1"
            variant="h1"
            className="contact-title text-3xl sm:text-4xl lg:text-5xl font-bold"
          >
            Reservar Cita
          </Typography>
        </div>

        {/* Guía rápida */}
        <div className="max-w-3xl mx-auto mb-6 p-3 sm:p-4 rounded-[12px] bg-[color:var(--color-primary)]/5 border border-[color:var(--color-primary)]/20">
          <div className="flex items-center justify-center gap-6 sm:gap-8">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[color:var(--color-primary)] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                1
              </div>
              <Typography
                as="span"
                variant="small"
                className="text-[color:var(--color-heading)] font-medium text-xs sm:text-sm"
              >
                Cotiza
              </Typography>
            </div>
            <div className="text-[color:var(--color-border)]">→</div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[color:var(--color-primary)] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                2
              </div>
              <Typography
                as="span"
                variant="small"
                className="text-[color:var(--color-heading)] font-medium text-xs sm:text-sm"
              >
                Verifica
              </Typography>
            </div>
            <div className="text-[color:var(--color-border)]">→</div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[color:var(--color-primary)] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                3
              </div>
              <Typography
                as="span"
                variant="small"
                className="text-[color:var(--color-heading)] font-medium text-xs sm:text-sm"
              >
                Reserva
              </Typography>
            </div>
          </div>
        </div>

        <div className="contact-layout gap-6 sm:gap-10">
          <div className="contact-info hidden lg:block">
            {/* Calculadora de Transporte */}
            <TransportCostCalculator />
          </div>

          <div className="contact-form-wrapper">
            <PriceQuoteSection />
            <div id="availability-section">
              <AvailabilityCheckSection />
            </div>
            <BookingFlow />
          </div>
        </div>
      </div>
    </section>
  );
}
