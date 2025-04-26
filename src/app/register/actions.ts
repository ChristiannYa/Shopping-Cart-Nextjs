"use server";

import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createSession } from "../lib/session";
import { redirect } from "next/navigation";

type RegisterForm =
  | {
      errors?: {
        firstName?: string[];
        lastName?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
      };
      values?: {
        firstName?: string;
        lastName?: string;
        email?: string;
      };
    }
  | undefined;

const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters" })
      .trim(),
    lastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters" })
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

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;

  try {
    const result = registerSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
      return {
        errors: result.error.flatten().fieldErrors,
        values: { firstName, lastName, email },
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
        values: { firstName, lastName, email },
      };
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new user with first_name and last_name
    const newUser = await pool.query(
      "INSERT INTO users (email, password_hash, first_name, last_name, name, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING user_id",
      [email, passwordHash, firstName, lastName, `${firstName} ${lastName}`]
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
      values: { firstName, lastName, email },
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
