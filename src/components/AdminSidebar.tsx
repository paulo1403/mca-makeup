"use client";

import Logo from "@/components/Logo";
import {
  AlertTriangle,
  Calendar,
  ChevronLeft,
  Clock,
  Eye,
  Home,
  LayoutDashboard,
  Settings,
  Star,
  Truck,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  // Optional initial collapsed state (overrides localStorage if provided)
  initialCollapsed?: boolean;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/calendar", label: "Calendario", icon: Calendar },
  { href: "/admin/appointments", label: "Citas", icon: Clock },
  { href: "/admin/services", label: "Servicios", icon: Settings },
  { href: "/admin/transport-costs", label: "Transporte", icon: Truck },
  { href: "/admin/reviews", label: "Reseñas", icon: Star },
  { href: "/admin/availability", label: "Disponibilidad", icon: Home },
  { href: "/admin/error-reports", label: "Errores", icon: AlertTriangle },
  { href: "/", label: "Ver Sitio", icon: Eye },
];

export default function AdminSidebar({ isOpen, onClose, isMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  // Initialize collapsed synchronously from cookie or localStorage to avoid layout shifts
  const getInitialCollapsed = (): boolean => {
    try {
      if (typeof window === "undefined") return false;
      // Prefer cookie (so it can be read server-side if needed)
      const match = document.cookie.match(/(?:^|; )adminSidebarCollapsed=([^;]+)/);
      if (match?.[1]) return match[1] === "true";
      const stored = localStorage.getItem("adminSidebarCollapsed");
      if (stored !== null) return stored === "true";
    } catch {
      // ignore
    }
    return false;
  };

  const [collapsed, setCollapsed] = useState<boolean>(getInitialCollapsed);

  // Evitar modo colapsado en mobile (mobile tiene sidebar expandido)
  useEffect(() => {
    if (isMobile) {
      setCollapsed(false);
    }
  }, [isMobile]);

  // Persist collapsed state to both localStorage and cookie when it changes
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("adminSidebarCollapsed", String(collapsed));
        // Set cookie for 1 year so server or other pages can read it if needed
        const maxAge = 60 * 60 * 24 * 365; // 1 year in seconds
        document.cookie = `adminSidebarCollapsed=${collapsed}; path=/; max-age=${maxAge};`;
      }
    } catch {
      // ignore storage errors
    }
  }, [collapsed]);

  const sidebarWidthClass = collapsed ? "md:w-20" : "md:w-64";
  const itemPaddingClass = collapsed ? "px-2 py-2" : "px-3 py-3";

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 ${sidebarWidthClass} bg-[color:var(--color-surface)] shadow-lg border-r border-[color:var(--color-border)] transform transition-all duration-300 ease-in-out md:relative md:translate-x-0 admin-sidebar`}
        aria-label="Barra lateral de administración"
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-[color:var(--color-border)] flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {collapsed ? (
                <div className="w-9 h-9 bg-[color:var(--color-primary)]/15 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[color:var(--color-primary)] font-semibold text-sm">
                    MC
                  </span>
                </div>
              ) : (
                <Logo />
              )}
              {!collapsed && (
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-[color:var(--color-heading)] font-montserrat truncate">
                    Panel Admin
                  </h2>
                  <p className="text-xs text-[color:var(--color-muted)] font-montserrat truncate">
                    Marcela Cordero
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Collapse toggle (desktop) */}
              <button
                onClick={() => setCollapsed((c) => !c)}
                className="hidden md:inline-flex p-1.5 rounded-md text-[color:var(--color-muted)] hover:text-[color:var(--color-heading)] hover:bg-[color:var(--color-surface-elevated)] transition-colors focus-ring"
                aria-label={collapsed ? "Expandir barra" : "Colapsar barra"}
                aria-pressed={collapsed}
              >
                <ChevronLeft
                  className={`h-5 w-5 transition-transform duration-300 ${collapsed ? "rotate-180" : "rotate-0"}`}
                />
              </button>
              {/* Close button (mobile) */}
              <button
                onClick={onClose}
                className="md:hidden p-1 rounded-md text-[color:var(--color-muted)] hover:text-[color:var(--color-heading)] hover:bg-[color:var(--color-surface-elevated)] transition-colors focus-ring"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="admin-sidebar-nav px-3 py-6 space-y-1 scrollbar-thin">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              const baseClasses = `flex items-center ${collapsed ? "justify-center" : "space-x-3"} ${itemPaddingClass} rounded-lg text-sm font-medium font-montserrat transition-all duration-200 group nav-item focus-ring relative border`;
              const activeClasses =
                "bg-[color:var(--color-primary)] text-white shadow-sm border-[color:var(--color-primary-light)]/40";
              const inactiveClasses =
                "text-[color:var(--color-body)] hover:text-[color:var(--color-heading)] hover:bg-[color:var(--color-surface-elevated)] border-transparent hover:border-[color:var(--color-border)]/50";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => isMobile && onClose()}
                  className={`${baseClasses} ${isActive ? `active ${activeClasses}` : inactiveClasses}`}
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-[color:var(--color-muted)] group-hover:text-[color:var(--color-heading)]"
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {isActive && !collapsed && (
                    <div className="ml-auto w-1.5 h-1.5 bg-[var(--color-accent-soft)] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="mt-auto border-t border-[color:var(--color-border)] p-4 flex-shrink-0">
            <div className="text-xs text-[color:var(--color-muted)] text-center font-montserrat">
              v1.0.0
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
          role="button"
          aria-label="Cerrar overlay"
        />
      )}
    </>
  );
}
