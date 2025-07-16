'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log('🔐 ProtectedRoute check:', {
      status,
      hasSession: !!session,
      userRole: session?.user?.role,
      sessionData: session
    });

    if (status === 'loading') return; // Still loading

    if (!session) {
      console.log('❌ No session found, redirecting to login');
      router.push('/admin/login');
      return;
    }

    // Optional: Check for admin role
    if (session.user.role !== 'ADMIN') {
      console.log('❌ User role is not ADMIN:', session.user.role);
      router.push('/admin/login');
      return;
    }

    console.log('✅ ProtectedRoute: Access granted');
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <LoadingSpinner />
      </div>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
