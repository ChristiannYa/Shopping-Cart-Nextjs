import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decrypt } from "@/app/lib/session";
import pool from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ isLoggedIn: false });
    }

    const session = await decrypt(sessionCookie);

    /* 
      Verify that we have a valid session with a user ID

      Even if a cookie exists, it could be invalid, expired,
      or missing data
     */
    if (!session?.userId) {
      return NextResponse.json({ isLoggedIn: false });
    }

    const result = await pool.query(
      "SELECT user_id, name, email, created_at FROM users WHERE user_id = $1",
      [session.userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ isLoggedIn: false });
    }

    // Return user data without sensitive information
    return NextResponse.json({
      isLoggedIn: true,
      user: {
        id: result.rows[0].user_id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        createdAt: result.rows[0].created_at,
      },
    });
  } catch (error) {
    console.error("Error getting user data:", error);
    return NextResponse.json(
      { isLoggedIn: false, error: "Failed to get user data" },
      { status: 500 }
    );
  }
}
