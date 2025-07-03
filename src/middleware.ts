import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
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
          return token?.role === 'ADMIN';
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
