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
          // Always allow access to login page
          if (req.nextUrl.pathname === '/admin/login') {
            return true;
          }
          
          // Si hay un token pero está corrupto (sin sub o con sub vacío), forzar logout
          if (token && (!token.sub || token.sub === '')) {
            return false;
          }
          
          // For other admin routes, check authentication
          if (!token) {
            return false;
          }

          if (!token.sub) {
            return false;
          }

          if (token.role !== 'ADMIN') {
            return false;
          }
          
          return true;
        }
        
        // Allow access to all non-admin routes
        return true;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
