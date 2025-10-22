"use client";

import AdminSidebar from "@/components/AdminSidebar";
import NotificationCenter from "@/components/NotificationCenter";
import { LogOut, Menu, User } from "lucide-react";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import "@/styles/admin.css";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // En desktop, sidebar siempre abierta por defecto
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    // Marcar body como admin para ocultar NavBar global
    document.body.classList.add("admin-mode");
    return () => {
      document.body.classList.remove("admin-mode");
    };
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen bg-[color:var(--color-background)] flex overflow-hidden">
      {/* Sidebar Component */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header - Aligned with content area */}
        <header className="sticky top-0 z-40 bg-[color:var(--color-surface)]/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b border-[color:var(--color-border)] flex-shrink-0">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 md:py-3">
            {/* Left group: Mobile menu + brand/title */}
            <div className="flex items-center gap-2">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 rounded-md text-[color:var(--color-body)] hover:text-[color:var(--color-heading)] hover:bg-[color:var(--color-surface-elevated)] transition-colors focus-ring"
                type="button"
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5" />
              </button>
              {/* Mobile brand */}
              <div className="md:hidden flex items-center gap-2">
                <Logo />
              </div>
              {/* Desktop placeholder to align */}
              <div className="hidden md:block">
                {/* Modernized top title */}
                <div className="truncate">
                  <div className="text-[color:var(--color-heading)] font-montserrat">
                    <span className="inline-block">
                      <span className="text-sm md:text-base font-medium tracking-tight">
                        Panel Administrativo
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <ThemeToggle />
              {/* Notifications */}
              <NotificationCenter />

              {/* User Menu */}
              <div className="flex items-center gap-2 border-l border-[color:var(--color-border)] pl-3">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-8 h-8 bg-[color:var(--color-primary)] rounded-full flex items-center justify-center ring-1 ring-[color:var(--color-border)]">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  {/* Texto de usuario ocultado según solicitud; mantenemos solo el ícono */}
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 text-[color:var(--color-body)] hover:text-red-600 px-2 py-1 rounded-md text-xs font-medium font-montserrat transition-colors focus-ring"
                  type="button"
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - Scrollable */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          onKeyUp={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsSidebarOpen(false);
            }
          }}
          role="button"
          tabIndex={0}
        />
      )}
    </div>
  );
}
