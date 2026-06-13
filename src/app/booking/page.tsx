import AvailabilityCheckSection from "@/components/availability/AvailabilityCheckSection";
import PriceQuoteSection from "@/components/availability/PriceQuoteSection";
import BookingFlow from "@/components/BookingFlow";
import Typography from "@/components/ui/Typography";
import "@/styles/components/contact.css";

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

        <div className="max-w-3xl mx-auto space-y-6">
          <PriceQuoteSection />
          <div id="availability-section">
            <AvailabilityCheckSection />
          </div>
          <BookingFlow />
        </div>
      </div>
    </section>
  );
}
