"use client";

import { ArrowRight } from "lucide-react";
import Button from "./ui/Button";
import Typography from "./ui/Typography";

const categories = [
  { title: "Novias", href: "/servicios" },
  { title: "Sociales", href: "/servicios" },
  { title: "Piel Madura", href: "/servicios" },
  { title: "Peinados", href: "/servicios" },
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
          <p className="mt-3 text-[color:var(--color-body)]">
            Explora cada experiencia y reserva la que mejor se adapte a tu momento.
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {categories.map((cat) => (
            <Button
              key={cat.title}
              as="a"
              href={cat.href}
              variant="outline"
              size="lg"
              className="w-full justify-between py-5 text-lg bg-(--color-surface)/40 hover:bg-[color:var(--color-primary)]"
            >
              <Typography as="span" variant="h3" className="font-normal">
                {cat.title}
              </Typography>
              <ArrowRight className="h-5 w-5" />
            </Button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            as="a"
            href="/servicios"
            variant="ghost"
            size="sm"
            className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--color-primary)]"
          >
            Ver catálogo completo
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
