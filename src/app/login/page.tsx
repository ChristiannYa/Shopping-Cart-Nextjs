"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LoginForm } from "./LoginForm";
import HomeButton from "@/components/navigation/HomeButton";

export default function Login() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("message");

  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <h1 className="page-title mb-4">Shopping Cart App</h1>
      {errorMessage && (
        <div className="bg-red-500/50 text-white p-3 rounded-md mb-4 max-w-md text-center">
          {errorMessage}
        </div>
      )}
      <LoginForm />
      <div className="text-center text-white mt-4">
        Don&apos;t have an account?
        <Link href="/register" className="empty-bg-btn">
          Register
        </Link>
      </div>
      <HomeButton />
    </div>
  );
}
