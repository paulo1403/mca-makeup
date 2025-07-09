'use client';

import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotificationCenter from '@/components/NotificationCenter';
import { LogOut, User } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-gray-50'>
        <header className='bg-white shadow-sm border-b'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center h-16'>
              <h1 className='text-xl font-semibold text-gray-900 font-montserrat'>
                Admin Panel - Marcela Cordero Makeup
              </h1>
              <nav className='flex items-center space-x-4'>
                <Link
                  href='/admin'
                  className='text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium font-montserrat transition-colors'
                >
                  Dashboard
                </Link>
                <Link
                  href='/admin/appointments'
                  className='text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium font-montserrat transition-colors'
                >
                  Citas
                </Link>
                <Link
                  href='/admin/availability'
                  className='text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium font-montserrat transition-colors'
                >
                  Disponibilidad
                </Link>
                <Link
                  href='/admin/change-password'
                  className='text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium font-montserrat transition-colors'
                >
                  Cambiar Contraseña
                </Link>
                <Link
                  href='/'
                  className='text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium font-montserrat transition-colors'
                >
                  Ver Sitio
                </Link>

                {/* Notification Center */}
                <NotificationCenter />

                {/* User Info & Logout */}
                <div className='flex items-center space-x-2 border-l border-gray-200 pl-4'>
                  <div className='flex items-center space-x-2 text-sm text-gray-600'>
                    <User className='h-4 w-4' />
                    <span className='font-montserrat'>
                      {session?.user?.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className='flex items-center space-x-1 text-gray-600 hover:text-red-600 px-2 py-1 rounded-md text-sm font-medium font-montserrat transition-colors'
                    title='Cerrar sesión'
                  >
                    <LogOut className='h-4 w-4' />
                    <span>Salir</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </header>
        <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
