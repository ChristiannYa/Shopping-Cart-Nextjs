import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createSession } from "@/app/lib/session";
import pool from "@/lib/db";
import { generateRandomHash } from "@/app/lib/utils";

// Helper function to split name into first and last name
function splitName(fullName: string): { firstName: string; lastName: string } {
  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";
  return { firstName, lastName };
}

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }): Promise<boolean> {
      if (account?.provider === "google" && user.email) {
        try {
          // Check if user exists by email
          const result = await pool.query(
            "SELECT user_id FROM users WHERE email = $1",
            [user.email]
          );

          if (result.rowCount === 0 || result.rowCount === null) {
            // Split name into first name and last name
            const { firstName, lastName } = user.name
              ? splitName(user.name)
              : { firstName: "", lastName: "" };

            // Create new user if they don't exist
            await pool.query(
              "INSERT INTO users (email, first_name, last_name, name, password_hash, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING user_id",
              [
                user.email,
                firstName,
                lastName,
                user.name || "",
                generateRandomHash(),
              ]
            );
          }
          return true;
        } catch (error) {
          console.error("Error handling Google sign in:", error);
          return false;
        }
      }
      return true;
    },
  },
  events: {
    async signIn({ user }): Promise<void> {
      // Create custom session after successful sign in
      if (user.email) {
        const result = await pool.query(
          "SELECT user_id FROM users WHERE email = $1",
          [user.email]
        );
        if (result.rowCount && result.rowCount > 0) {
          await createSession(result.rows[0].user_id.toString());
        }
      }
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth(authConfig);
