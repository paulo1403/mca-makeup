export const copyReviewLink = (reviewToken: string, buttonElement?: HTMLButtonElement) => {
  const reviewUrl = `${typeof window !== "undefined" ? window.location.origin : "https://marcelacorderomakeup.com"}/review/${reviewToken}`;

  navigator.clipboard
    .writeText(reviewUrl)
    .then(() => {
      if (buttonElement) {
        const originalText = buttonElement.textContent;
        buttonElement.textContent = "✅ Copiado!";
        setTimeout(() => {
          buttonElement.textContent = originalText;
        }, 2000);
      }
    })
    .catch((err) => {
      console.error("Error copying review link:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = reviewUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      if (buttonElement) {
        const originalText = buttonElement.textContent;
        buttonElement.textContent = "✅ Copiado!";
        setTimeout(() => {
          buttonElement.textContent = originalText;
        }, 2000);
      }
    });
};

export const getReviewUrl = (reviewToken: string): string => {
  return `${typeof window !== "undefined" ? window.location.origin : "https://marcelacorderomakeup.com"}/review/${reviewToken}`;
};

export const getReviewStatusColor = (status: "PENDING" | "APPROVED" | "REJECTED"): string => {
  switch (status) {
    case "PENDING":
      return "bg-[color:var(--status-pending-bg)] text-[color:var(--status-pending-text)] border border-[color:var(--status-pending-border)]";
    case "APPROVED":
      return "bg-[color:var(--status-confirmed-bg)] text-[color:var(--status-confirmed-text)] border border-[color:var(--status-confirmed-border)]";
    case "REJECTED":
      return "bg-[color:var(--status-cancelled-bg)] text-[color:var(--status-cancelled-text)] border border-[color:var(--status-cancelled-border)]";
    default:
      return "bg-[color:var(--color-surface-elevated)] text-[color:var(--color-muted)] border border-[color:var(--color-border)]";
  }
};

export const getReviewStatusText = (status: "PENDING" | "APPROVED" | "REJECTED"): string => {
  switch (status) {
    case "PENDING":
      return "Pendiente";
    case "APPROVED":
      return "Aprobada";
    case "REJECTED":
      return "Rechazada";
    default:
      return status;
  }
};
