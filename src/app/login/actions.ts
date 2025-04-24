"use server";

import { z } from "zod";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

type LoginForm =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
    }
  | undefined;

const testUser = {
  id: "1",
  email: "me@chriswebdev.com",
  password: "password123",
};

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export async function login(prevState: LoginForm, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

  if (email !== testUser.email || password !== testUser.password) {
    return {
      errors: {
        /* 
          Either the emai or password is incorrect

          Not providing the user which field was incorrect
          to provde more security
        */
        email: ["Invalid email or password"],
      },
    };
  }

  await createSession(testUser.id);

  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
