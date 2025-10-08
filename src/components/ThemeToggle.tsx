"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <button
        type="button"
        className="p-2 rounded-full transition-colors duration-200 flex items-center justify-center theme-toggle"
        disabled
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
      aria-pressed={theme === 'dark'}
      onClick={toggleTheme}
      className="p-2 rounded-full transition-colors duration-200 flex items-center justify-center theme-toggle"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-heading" />
      ) : (
        <Moon className="w-5 h-5 text-heading" />
      )}
    </button>
  );
}
