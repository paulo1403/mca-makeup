"use client";

import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Función para obtener el tema actual
    const getCurrentTheme = (): Theme => {
      if (typeof window === 'undefined') return 'light';
      
      // Verificar localStorage primero
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
      
      // Verificar atributo data-theme
      const dataTheme = document.documentElement.getAttribute('data-theme');
      if (dataTheme === 'dark' || dataTheme === 'light') {
        return dataTheme;
      }
      
      // Verificar preferencias del sistema
      if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      
      return 'light';
    };

    // Establecer el tema inicial
    const initialTheme = getCurrentTheme();
    setTheme(initialTheme);
    setMounted(true);

    // Asegurar que el DOM tenga el tema correcto
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', initialTheme);
    }

    // Observador para cambios en data-theme (para sincronización entre pestañas)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme');
          if (newTheme === 'dark' || newTheme === 'light') {
            setTheme(newTheme);
          }
        }
      });
    });

    if (typeof window !== 'undefined') {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
    }

    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        try {
          localStorage.setItem('theme', newTheme);
          document.documentElement.setAttribute('data-theme', newTheme);
        } catch (error) {
          console.error('Error al establecer el tema:', error);
        }
      }
    };

    mediaQuery?.addEventListener('change', handleSystemThemeChange);

    return () => {
      observer.disconnect();
      mediaQuery?.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    if (!mounted) return;
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setThemeValue(newTheme);
  };

  const setThemeValue = (newTheme: Theme) => {
    if (!mounted) return;
    
    setTheme(newTheme);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      } catch (error) {
        console.error('Error al establecer el tema:', error);
      }
    }
  };

  return {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    toggleTheme,
    setTheme: setThemeValue,
    mounted
  };
}