import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('🔐 AUTHORIZE CALLED with:', {
          email: credentials?.email || 'NO EMAIL',
          hasPassword: !!credentials?.password,
          passwordLength: credentials?.password?.length || 0,
        });

        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials');
          return null;
        }

        try {
          console.log('🔍 Looking for user:', credentials.email);
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          console.log(
            '👤 User query result:',
            user
              ? {
                  id: user.id,
                  email: user.email,
                  role: user.role,
                  hasPassword: !!user.password,
                }
              : 'USER NOT FOUND'
          );

          if (!user) {
            console.log('❌ User not found in database');
            return null;
          }

          console.log('🔑 Checking password...');
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log('🔓 Password validation result:', isPasswordValid);

          if (!isPasswordValid) {
            console.log('❌ Invalid password');
            return null;
          }

          console.log('✅ Authentication successful, returning user object');
          const returnUser = {
            id: user.id,
            email: user.email,
            role: user.role,
          };
          console.log('📤 Returning:', returnUser);
          return returnUser;
        } catch (error) {
          console.error('🚨 Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 2, // 2 hours - Sesión más corta para mayor seguridad
    updateAge: 60 * 15, // 15 minutes - Actualizar sesión cada 15 minutos si está activa
  },
  jwt: {
    maxAge: 60 * 60 * 2, // 2 hours - JWT expira en 2 horas
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
        token.loginTime = Date.now(); // Guardar tiempo de login
      }
      
      // Verificar si el token ha expirado (2 horas)
      const now = Date.now();
      const loginTime = token.loginTime || now;
      const maxAge = 2 * 60 * 60 * 1000; // 2 horas en millisegundos
      
      if (loginTime && (now - loginTime) > maxAge) {
        console.log('🚨 Token expired, forcing logout');
        // Retornar token mínimo que forzará re-autenticación
        return {
          sub: undefined,
          role: '',
          loginTime: 0
        };
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role || '';
        
        // Agregar información de expiración a la sesión
        const loginTime = token.loginTime || Date.now();
        const now = Date.now();
        const maxAge = 2 * 60 * 60 * 1000; // 2 horas
        const timeLeft = maxAge - (now - loginTime);
        
        session.expiresAt = new Date(now + timeLeft).toISOString();
        session.timeLeft = Math.max(0, Math.floor(timeLeft / 1000)); // en segundos
      } else {
        // Si no hay token válido, limpiar la sesión
        session.expiresAt = new Date().toISOString();
        session.timeLeft = 0;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.error('🚨 NextAuth Error:', code, metadata);
    },
    warn(code) {
      console.warn('⚠️ NextAuth Warning:', code);
    },
    debug(code, metadata) {
      console.log('🐛 NextAuth Debug:', code, metadata);
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
