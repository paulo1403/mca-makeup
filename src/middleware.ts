import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Agregar headers de seguridad
    const response = NextResponse.next();
    
    // Headers de seguridad para admin panel
    if (req.nextUrl.pathname.startsWith('/admin')) {
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
    }
    
    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user is accessing admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          // Allow access to login page
          if (req.nextUrl.pathname === '/admin/login') {
            return true;
          }
          
          // For other admin routes, check if user is authenticated and has admin role
          if (!token || token.role !== 'ADMIN') {
            return false;
          }
          
          // Verificar expiración del token
          const now = Date.now();
          const loginTime = token.loginTime || 0;
          const maxAge = 2 * 60 * 60 * 1000; // 2 horas
          
          if (loginTime && (now - loginTime) > maxAge) {
            console.log('🚨 Token expired in middleware, denying access');
            return false;
          }
          
          return true;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
