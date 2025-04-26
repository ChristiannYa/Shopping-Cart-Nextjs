import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/lib/session";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/profile"];
const publicRoutes = ["/login", "/register"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  let isAuthenticated = false;

  try {
    // Try to get custom session
    const cookieStore = await cookies();
    const cookie = cookieStore.get("session")?.value;

    if (cookie) {
      const session = await decrypt(cookie);
      if (session?.userId) {
        isAuthenticated = true;
      }
    }

    // If not authenticated by custom session, check NextAuth
    if (!isAuthenticated) {
      const token = await getToken({ req, secret: process.env.SESSION_TOKEN });
      if (token) {
        isAuthenticated = true;
      }
    }
  } catch (error) {
    console.error("Session verification error:", error);
    // Continue even if there's an error - will treat as not authenticated
  }

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
