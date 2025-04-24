"use server";

import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createSession, deleteSession } from "@/app/lib/session";
import { redirect } from "next/navigation";

type LoginForm =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
    }
  | undefined;

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export async function login(prevState: LoginForm, formData: FormData) {
  // Will store our redirect path if login is successful
  let redirectPath: string | null = null;

  try {
    const result = loginSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
      return {
        errors: result.error.flatten().fieldErrors,
      };
    }

    const { email, password } = result.data;

    const userResult = await pool.query(
      "SELECT user_id, email, password_hash, name FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rowCount === 0) {
      return {
        errors: {
          email: ["Invalid email or password"],
        },
      };
    }

    const user = userResult.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return {
        errors: {
          password: ["Invalid email or password"],
        },
      };
    }

    await createSession(user.user_id.toString());

    redirectPath = "/";
  } catch (error) {
    console.error("Login error:", error);
    return {
      errors: {
        email: ["An error occurred during login"],
      },
    };
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }

  // This return is needed for TypeScript, though it will never be reached
  // if redirect is called in the finally block
  return { success: true };
}

export async function logout() {
  let redirectPath: string | null = null;

  try {
    await deleteSession();
    redirectPath = "/login";
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }
}
