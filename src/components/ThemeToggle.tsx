"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <button
      type="button"
      suppressHydrationWarning
      aria-label={
        mounted ? (theme === "dark" ? "Activar modo claro" : "Activar modo oscuro") : "Cambiar tema"
      }
      aria-pressed={mounted ? theme === "dark" : false}
      onClick={toggleTheme}
      className="p-2 rounded-full transition-colors duration-200 flex items-center justify-center theme-toggle"
      disabled={!mounted}
    >
      {!mounted ? (
        <div className="w-5 h-5" />
      ) : theme === "dark" ? (
        <Sun className="w-5 h-5 text-[color:var(--color-heading)]" />
      ) : (
        <Moon className="w-5 h-5 text-[color:var(--color-heading)]" />
      )}
    </button>
  );
}
