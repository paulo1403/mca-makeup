"use client";

import Button from "./ui/Button";
import Typography from "./ui/Typography";

const services = [
  {
    title: "Novias",
    portfolioUrl: "https://marcelacorderobeauty.my.canva.site/n",
  },
  {
    title: "Sociales",
    portfolioUrl: "https://marcelacorderobeauty.my.canva.site",
  },
];

export default function ServicesSection() {
  return (
    <section
      id="servicios"
      className="relative py-16 sm:py-20 lg:py-24"
      style={{ scrollMarginTop: "120px" }}
    >
      <div className="container mx-auto px-5 sm:px-6 max-w-lg sm:max-w-xl relative z-10">
        <div className="text-center mb-10 sm:mb-12">
          <Typography as="h2" variant="h2" className="text-(--color-heading)">
            Nuestros Servicios
          </Typography>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {services.map((service) => (
            <Button
              key={service.title}
              as="a"
              variant="outline"
              size="lg"
              href={service.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full justify-center py-5 text-lg bg-(--color-surface)/40 hover:bg-[color:var(--color-primary)]"
            >
              <Typography as="span" variant="h3" className="font-normal">
                {service.title}
              </Typography>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
