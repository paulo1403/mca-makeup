import BookingFlowAccordion from "@/components/booking-accordion/BookingFlowAccordion";
import Typography from "@/components/ui/Typography";

export const metadata = {
  title: "Reservar Cita - Marcela Cordero Makeup",
  description:
    "Agenda tu cita de maquillaje profesional con Marcela Cordero. Completa el formulario y recibe confirmación inmediata.",
};

export default function BookingPage() {
  return (
    <section
      className="py-10 sm:py-20 relative min-h-screen pt-32"
      style={{ scrollMarginTop: "120px" }}
    >
      <div className="px-4 sm:px-6">
        <div className="mb-6 text-center">
          <Typography
            as="h1"
            variant="h1"
            className="text-2xl sm:text-3xl font-bold text-[color:var(--color-heading)]"
          >
            Reservar Cita
          </Typography>
          <Typography as="p" variant="p" className="text-[color:var(--color-body)] text-sm mt-1">
            Completa cada paso para agendar tu cita
          </Typography>
        </div>

        <div className="max-w-2xl mx-auto">
          <BookingFlowAccordion />
        </div>
      </div>
    </section>
  );
}
