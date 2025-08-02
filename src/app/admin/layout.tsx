"use client";

import { signOut, useSession, SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import NotificationCenter from "@/components/NotificationCenter";
import { LogOut, User, Menu, X, ChevronDown } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import "@/styles/admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Refs para cerrar menús al hacer click fuera
  const dropdownRef = useClickOutside<HTMLDivElement>(() =>
    setIsDropdownOpen(false),
  );
  const mobileMenuRef = useClickOutside<HTMLDivElement>(() =>
    setIsMobileMenuOpen(false),
  );

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      mobileLabel: "Panel",
      priority: "high",
    },
    {
      href: "/admin/calendar",
      label: "Calendario",
      mobileLabel: "Calendario",
      priority: "high",
    },
    {
      href: "/admin/appointments",
      label: "Citas",
      mobileLabel: "Citas",
      priority: "high",
    },
    {
      href: "/admin/services",
      label: "Servicios",
      mobileLabel: "Servicios",
      priority: "high",
    },
    {
      href: "/admin/availability",
      label: "Disponibilidad",
      mobileLabel: "Disponibilidad",
      priority: "medium",
    },
    {
      href: "/admin/error-reports",
      label: "Errores",
      mobileLabel: "Errores",
      priority: "low",
    },
    {
      href: "/admin/change-password",
      label: "Contraseña",
      mobileLabel: "Contraseña",
      priority: "low",
    },
    {
      href: "/",
      label: "Ver Sitio",
      mobileLabel: "Ver Sitio",
      priority: "medium",
    },
  ];

  const highPriorityItems = navItems.filter((item) => item.priority === "high");
  const otherItems = navItems.filter((item) => item.priority !== "high");

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Title */}
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 font-montserrat truncate">
              <span className="hidden sm:inline">Admin - </span>Marcela Cordero
            </h1>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {/* High Priority Items (always visible) */}
              {highPriorityItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item px-3 py-2 rounded-md text-sm font-medium font-montserrat transition-colors relative ${
                    pathname === item.href
                      ? "bg-[#D4AF37] text-white active"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Dropdown for other items */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium font-montserrat text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <span>Más</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 animate-scale-in">
                    <div className="py-1">
                      {otherItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsDropdownOpen(false)}
                          className={`block px-4 py-2 text-sm font-montserrat transition-colors ${
                            pathname === item.href
                              ? "bg-[#D4AF37] text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile & Tablet Navigation */}
            <nav className="lg:hidden flex items-center space-x-2">
              {/* High priority items for tablet */}
              <div className="hidden md:flex items-center space-x-1">
                {highPriorityItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-2 py-2 rounded-md text-xs font-medium font-montserrat transition-colors ${
                      pathname === item.href
                        ? "bg-[#D4AF37] text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {item.mobileLabel}
                  </Link>
                ))}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </nav>

            {/* Right side: Notifications + User */}
            <div className="flex items-center space-x-2">
              <NotificationCenter />

              <div className="flex items-center space-x-2 border-l border-gray-200 pl-2">
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span className="font-montserrat text-xs lg:text-sm max-w-32 truncate">
                    {session?.user?.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 px-2 py-1 rounded-md text-xs font-medium font-montserrat transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Panel */}
          {isMobileMenuOpen && (
            <div
              className="md:hidden border-t border-gray-200 bg-white animate-slide-in"
              ref={mobileMenuRef}
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium font-montserrat transition-colors ${
                      pathname === item.href
                        ? "bg-[#D4AF37] text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
