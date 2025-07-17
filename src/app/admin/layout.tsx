'use client';

import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
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
    <div className='min-h-screen bg-gray-50'>
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <h1 className='text-lg sm:text-xl font-semibold text-gray-900 font-montserrat truncate'>
              <span className='hidden sm:inline'>Admin Panel - </span>Marcela Cordero
            </h1>
            <nav className='flex items-center space-x-2 sm:space-x-4'>
              <Link
                href='/admin'
                className='text-gray-600 hover:text-gray-900 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium font-montserrat transition-colors'
              >
                <span className='hidden sm:inline'>Dashboard</span>
                <span className='sm:hidden'>Panel</span>
              </Link>
              <Link
                href='/admin/appointments'
                className='text-gray-600 hover:text-gray-900 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium font-montserrat transition-colors'
              >
                Citas
              </Link>
              <Link
                href='/admin/availability'
                className='hidden sm:inline-block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium font-montserrat transition-colors'
              >
                Disponibilidad
              </Link>
              <Link
                href='/admin/error-reports'
                className='hidden lg:inline-block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium font-montserrat transition-colors'
              >
                Errores
              </Link>
              <Link
                href='/admin/change-password'
                className='hidden md:inline-block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium font-montserrat transition-colors'
              >
                Cambiar Contraseña
              </Link>
              <Link
                href='/'
                className='hidden sm:inline-block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium font-montserrat transition-colors'
              >
                Ver Sitio
              </Link>

              {/* Notification Center */}
              <NotificationCenter />

              {/* User Info & Logout */}
              <div className='flex items-center space-x-1 sm:space-x-2 border-l border-gray-200 pl-2 sm:pl-4'>
                <div className='hidden sm:flex items-center space-x-2 text-sm text-gray-600'>
                  <User className='h-4 w-4' />
                  <span className='font-montserrat'>
                    {session?.user?.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className='flex items-center space-x-1 text-gray-600 hover:text-red-600 px-1 sm:px-2 py-1 rounded-md text-xs sm:text-sm font-medium font-montserrat transition-colors'
                  title='Cerrar sesión'
                >
                  <LogOut className='h-4 w-4' />
                  <span className='hidden sm:inline'>Salir</span>
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
  );
}
