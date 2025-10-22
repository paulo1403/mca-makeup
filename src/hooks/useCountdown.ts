"use client";

import { calculateTimeLeft } from "@/lib/auth-utils";
import { useEffect, useState } from "react";

export const useCountdown = (blockedUntil?: string) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!blockedUntil) {
      setTimeLeft(0);
      return;
    }

    // Calcular tiempo inicial
    const initialTime = calculateTimeLeft(blockedUntil);
    setTimeLeft(initialTime);

    // Si ya expiró, no iniciar interval
    if (initialTime <= 0) {
      return;
    }

    // Interval para actualizar countdown
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(blockedUntil);
      setTimeLeft(newTimeLeft);

      // Limpiar interval cuando llegue a 0
      if (newTimeLeft <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [blockedUntil]);

  const isExpired = timeLeft <= 0;

  return {
    timeLeft,
    isExpired,
  };
};
