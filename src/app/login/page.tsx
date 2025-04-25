import Link from "next/link";
import { LoginForm } from "./LoginForm";
import HomeButton from "@/components/navigation/HomeButton";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="page-title mb-3">Shopping Cart App</h1>
      <LoginForm />
      <div className="text-center text-white mt-4">
        Don&apos;t have an account?
        <Link href="/register" className="empty-bg-btn">
          Register
        </Link>
      </div>
      <div className="flex justify-center mt-1">
        <HomeButton />
      </div>
    </div>
  );
}
