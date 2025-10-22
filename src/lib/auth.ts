import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          const returnUser = {
            id: user.id,
            email: user.email,
            role: user.role,
          };
          return returnUser;
        } catch (error) {
          // Log error in development only
          if (process.env.NODE_ENV === "development") {
            console.error("Auth error:", error);
          }
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 2, // 2 hours - Sesión más corta para mayor seguridad
    updateAge: 60 * 15, // 15 minutes - Actualizar sesión cada 15 minutos si está activa
  },
  jwt: {
    maxAge: 60 * 60 * 2, // 2 hours - JWT expira en 2 horas
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Cuando hay un nuevo login, establecer los datos del usuario en el token
        token.sub = user.id;
        token.role = (user as { role: string }).role;
        token.loginTime = Date.now();
      }

      // Si no hay user y el token no tiene sub, significa que hay un token corrupto
      if (!user && !token.sub) {
        // Retornar token mínimo para forzar limpieza
        return {
          sub: "",
          role: "",
          loginTime: 0,
        };
      }

      // Verificar si el token ha expirado (2 horas)
      const now = Date.now();
      const loginTime = token.loginTime || now;
      const maxAge = 2 * 60 * 60 * 1000; // 2 horas en millisegundos

      if (loginTime && now - loginTime > maxAge) {
        // Retornar token vacío para forzar re-autenticación
        return {
          sub: "",
          role: "",
          loginTime: 0,
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (token && token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role || "";

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
    signIn: "/admin/login",
    signOut: "/admin/login",
    error: "/admin/login",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};
