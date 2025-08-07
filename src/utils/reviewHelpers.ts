export const copyReviewLink = (reviewToken: string, buttonElement?: HTMLButtonElement) => {
  const reviewUrl = `${typeof window !== "undefined" ? window.location.origin : "https://marcelacorderomakeup.com"}/review/${reviewToken}`;

  navigator.clipboard.writeText(reviewUrl).then(() => {
    if (buttonElement) {
      const originalText = buttonElement.textContent;
      buttonElement.textContent = "✅ Copiado!";
      setTimeout(() => {
        buttonElement.textContent = originalText;
      }, 2000);
    }
  }).catch((err) => {
    console.error('Error copying review link:', err);
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = reviewUrl;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
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
      return "bg-yellow-100 text-yellow-800";
    case "APPROVED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
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
