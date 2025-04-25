"use server";

import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createSession } from "../lib/session";
import { redirect } from "next/navigation";

type RegisterForm =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
      };
      values?: {
        name?: string;
        email?: string;
      };
    }
  | undefined;

const registerSchema = z
  .object({
    name: z
      .string()
      .min(4, { message: "Name must be at least 4 characters" })
      .trim(),
    email: z.string().email({ message: "Invalid email address" }).trim(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .trim(),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" })
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function register(prevState: RegisterForm, formData: FormData) {
  // Will store our redirect path if registration is successful
  let redirectPath: string | null = null;

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  try {
    const result = registerSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
      return {
        errors: result.error.flatten().fieldErrors,
        values: { name, email },
      };
    }

    const { password } = result.data;

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT user_id FROM users WHERE email = $1",
      [email]
    );

    if ((existingUser.rowCount ?? 0) > 0) {
      return {
        errors: {
          email: ["Email already registered"],
        },
        values: { name, email },
      };
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new user
    const newUser = await pool.query(
      "INSERT INTO users (email, password_hash, name, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING user_id",
      [email, passwordHash, name]
    );

    // Create session for the new user
    await createSession(newUser.rows[0].user_id.toString());

    redirectPath = "/";
  } catch (error) {
    console.error("Registration error:", error);
    return {
      errors: {
        email: ["An error occurred during registration"],
      },
      values: { name, email },
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
