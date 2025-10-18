"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Settings,
  Star,
  AlertTriangle,
  Truck,
  Eye,
  Home,
  X
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/calendar",
    label: "Calendario",
    icon: Calendar,
  },
  {
    href: "/admin/appointments",
    label: "Citas",
    icon: Clock,
  },
  {
    href: "/admin/services",
    label: "Servicios",
    icon: Settings,
  },
  {
    href: "/admin/transport-costs",
    label: "Transporte",
    icon: Truck,
  },
  {
    href: "/admin/reviews",
    label: "Reseñas",
    icon: Star,
  },
  {
    href: "/admin/availability",
    label: "Disponibilidad",
    icon: Home,
  },
  {
    href: "/admin/error-reports",
    label: "Errores",
    icon: AlertTriangle,
  },
  {
    href: "/",
    label: "Ver Sitio",
    icon: Eye,
  },
];

export default function AdminSidebar({ isOpen, onClose, isMobile }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-[color:var(--color-surface)] shadow-lg border-r border-[color:var(--color-border)] transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 admin-sidebar`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-[color:var(--color-border)] flex-shrink-0">
            <div>
              <h2 className="text-lg font-semibold text-[color:var(--color-heading)] font-montserrat">
                Admin Panel
              </h2>
              <p className="text-xs text-[color:var(--color-body)] font-montserrat">
                Marcela Cordero
              </p>
            </div>
            <button
              onClick={onClose}
              className="md:hidden p-1 rounded-md text-[color:var(--color-muted)] hover:text-[color:var(--color-heading)] hover:bg-[color:var(--color-surface-elevated)] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="admin-sidebar-nav px-4 py-6 space-y-2 scrollbar-thin">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => isMobile && onClose()}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium font-montserrat transition-all duration-200 group ${
                    isActive
                      ? "bg-[#D4AF37] text-white shadow-sm"
                      : "text-[color:var(--color-body)] hover:text-[color:var(--color-heading)] hover:bg-[color:var(--color-surface-elevated)]"
                  }`}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 transition-colors ${
                    isActive ? "text-white" : "text-[color:var(--color-muted)] group-hover:text-[color:var(--color-heading)]"
                  }`} />
                  <span className="truncate">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 flex-shrink-0">
            <div className="text-xs text-gray-400 text-center font-montserrat">
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
        />
      )}
    </>
  );
}
