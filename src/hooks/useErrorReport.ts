import { useMutation } from "@tanstack/react-query";

export interface ErrorReport {
  userEmail?: string;
  userName?: string;
  errorMessage: string;
  errorStack?: string;
  userAgent: string;
  url: string;
  timestamp: string;
  userDescription: string;
  errorType: "runtime" | "network" | "ui" | "booking" | "other";
  severity: "low" | "medium" | "high" | "critical";
}

interface ErrorReportRequest {
  userEmail?: string;
  userName?: string;
  userDescription: string;
  errorType: ErrorReport["errorType"];
  severity: ErrorReport["severity"];
  technicalDetails?: {
    errorMessage?: string;
    errorStack?: string;
    componentStack?: string;
    errorBoundary?: boolean;
  };
}

export const useErrorReport = () => {
  return useMutation({
    mutationFn: async (
      reportData: ErrorReportRequest,
    ): Promise<{ success: boolean; reportId: string }> => {
      const errorReport: ErrorReport = {
        ...reportData,
        errorMessage: reportData.technicalDetails?.errorMessage || "Error no especificado",
        errorStack: reportData.technicalDetails?.errorStack || "",
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch("/api/error-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(errorReport),
      });

      if (!response.ok) {
        throw new Error("Failed to submit error report");
      }

      return response.json();
    },
  });
};
