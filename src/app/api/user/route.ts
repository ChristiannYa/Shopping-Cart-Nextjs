import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decrypt } from "@/app/lib/session";
import pool from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function GET(request: Request) {
  try {
    // Check for custom session
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    // First try the custom session
    if (sessionCookie) {
      try {
        const session = await decrypt(sessionCookie);
        if (session?.userId) {
          const result = await pool.query(
            "SELECT user_id, first_name, last_name, email, created_at FROM users WHERE user_id = $1",
            [session.userId]
          );

          if (result.rows.length > 0) {
            return NextResponse.json({
              isLoggedIn: true,
              user: {
                id: result.rows[0].user_id,
                firstName: result.rows[0].first_name,
                lastName: result.rows[0].last_name,
                email: result.rows[0].email,
                createdAt: result.rows[0].created_at,
              },
              authType: "custom",
            });
          }
        }
      } catch (error) {
        // Just log the error and continue to try NextAuth
        console.error("Error with custom session:", error);
      }
    }

    // If custom session failed, try NextAuth
    try {
      const token = await getToken({
        req: request,
        secret: process.env.SESSION_TOKEN,
      });

      if (token?.sub) {
        const result = await pool.query(
          "SELECT user_id, first_name, last_name, email, created_at FROM users WHERE user_id = $1",
          [token.sub]
        );

        if (result.rows.length > 0) {
          return NextResponse.json({
            isLoggedIn: true,
            user: {
              id: result.rows[0].user_id,
              firstName: result.rows[0].first_name,
              lastName: result.rows[0].last_name,
              email: result.rows[0].email,
              createdAt: result.rows[0].created_at,
            },
            authType: "nextauth",
          });
        }
      }
    } catch (error) {
      console.error("Error with NextAuth session:", error);
    }

    // If we get here, neither auth method worked
    return NextResponse.json({ isLoggedIn: false });
  } catch (error) {
    console.error("Error getting user data:", error);
    return NextResponse.json(
      { isLoggedIn: false, error: "Failed to get user data" },
      { status: 500 }
    );
  }
}
