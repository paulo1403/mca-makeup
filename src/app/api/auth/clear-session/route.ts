import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Session cleared" });

  // Limpiar todas las cookies de NextAuth
  const cookieNames = [
    "next-auth.session-token",
    "next-auth.csrf-token",
    "next-auth.callback-url",
    "__Secure-next-auth.session-token",
    "__Secure-next-auth.csrf-token",
    "__Secure-next-auth.callback-url",
    "next-auth.pkce.code_verifier",
  ];

  cookieNames.forEach((cookieName) => {
    response.cookies.delete(cookieName);
    response.cookies.set(cookieName, "", {
      maxAge: 0,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
  });

  return response;
}

export async function GET() {
  return POST();
}
