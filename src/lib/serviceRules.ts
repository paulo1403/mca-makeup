export const CATEGORY_LABELS: Record<string, string> = {
  BRIDAL: "Novias",
  SOCIAL: "Social/Eventos",
  MATURE_SKIN: "Piel Madura",
  HAIRSTYLE: "Peinados",
  OTHER: "Otros",
};

export const CATEGORY_COLORS: Record<string, string> = {
  BRIDAL:
    "bg-[color:var(--color-primary)]/10 border-[color:var(--color-primary)]/30 text-[color:var(--color-primary)]",
  SOCIAL:
    "bg-[color:var(--color-accent)]/20 border-[color:var(--color-accent)]/40 text-[color:var(--color-body)]",
  MATURE_SKIN:
    "bg-[color:var(--color-accent-soft)] border-[color:var(--color-border)] text-[color:var(--color-heading)]",
  HAIRSTYLE:
    "bg-[color:var(--color-muted)]/10 border-[color:var(--color-muted)]/30 text-[color:var(--color-muted)]",
  OTHER:
    "bg-[color:var(--color-surface-elevated)] border-[color:var(--color-border)] text-[color:var(--color-body)]",
};

// selectedMap: Record<serviceId, quantity>
export function validateSelection(
  selectedMap: Record<string, number>,
  services: unknown[],
): { message: string; suggestion: string } | null {
  const serviceIds = Object.keys(selectedMap).filter((id) => (selectedMap[id] || 0) > 0);
  if (serviceIds.length === 0) return null;

  const arr = services as Array<Record<string, unknown>>;
  const selectedServiceObjects = arr.filter((svc) => serviceIds.includes(String(svc.id)));
  const categories = selectedServiceObjects.map((svc) => String(svc.category));
  const uniqueCategories = Array.from(new Set(categories));

  if (uniqueCategories.length === 1 && uniqueCategories[0] === "HAIRSTYLE") {
    return {
      message: "Solo peinado seleccionado",
      suggestion:
        "Agrega un servicio de maquillaje para completar tu reserva. Los peinados deben ir acompañados de maquillaje.",
    };
  }

  const hasNovia = categories.includes("BRIDAL");
  const hasSocial = categories.includes("SOCIAL") || categories.includes("MATURE_SKIN");

  if (hasNovia && hasSocial) {
    return {
      message: "Combinación no permitida",
      suggestion:
        "Los servicios de novia no se pueden combinar con servicios sociales o de piel madura. Elige solo una categoría.",
    };
  }

  if (uniqueCategories.length > 2) {
    return {
      message: "Demasiados tipos de servicios",
      suggestion:
        "Solo puedes combinar máximo 2 tipos de servicios. Reduce tu selección para continuar.",
    };
  }

  if (uniqueCategories.length === 2) {
    const hasHairstyle = categories.includes("HAIRSTYLE");
    const hasMakeup =
      categories.includes("SOCIAL") ||
      categories.includes("MATURE_SKIN") ||
      categories.includes("BRIDAL");

    if (!(hasHairstyle && hasMakeup)) {
      return {
        message: "Combinación incorrecta",
        suggestion:
          "Solo puedes combinar servicios de maquillaje con peinados. Ajusta tu selección.",
      };
    }
  }

  return null;
}

const serviceRules = { CATEGORY_LABELS, CATEGORY_COLORS, validateSelection };

export default serviceRules;
