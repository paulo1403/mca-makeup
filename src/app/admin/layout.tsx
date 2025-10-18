"use client";

import { signOut, useSession, SessionProvider } from "next-auth/react";
import { useState, useEffect } from "react";
import NotificationCenter from "@/components/NotificationCenter";
import AdminSidebar from "@/components/AdminSidebar";
import { LogOut, User, Menu } from "lucide-react";
import "@/styles/admin.css";
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
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    // Marcar body como admin para ocultar NavBar global
    document.body.classList.add('admin-mode');
    return () => {
      document.body.classList.remove('admin-mode');
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
        <header className="bg-[color:var(--color-surface)] shadow-sm border-b border-[color:var(--color-border)] flex-shrink-0">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 rounded-md text-[color:var(--color-body)] hover:text-[color:var(--color-heading)] hover:bg-[color:var(--color-surface-elevated)] transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Title */}
            <div className="md:hidden">
              <h1 className="text-lg font-semibold text-[color:var(--color-heading)] font-montserrat">
                Marcela Cordero
              </h1>
            </div>

            {/* Desktop Spacer */}
            <div className="hidden md:block"></div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Theme toggle */}
              <ThemeToggle />
              {/* Notifications */}
              <NotificationCenter />

              {/* User Menu */}
              <div className="flex items-center space-x-2 border-l border-[color:var(--color-border)] pl-3">
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-[color:var(--color-heading)] font-montserrat">
                      {session?.user?.name || 'Admin'}
                    </p>
                    <p className="text-xs text-[color:var(--color-body)]">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-[color:var(--color-body)] hover:text-red-600 px-2 py-1 rounded-md text-xs font-medium font-montserrat transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - Scrollable */}
        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
          <div className="p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
