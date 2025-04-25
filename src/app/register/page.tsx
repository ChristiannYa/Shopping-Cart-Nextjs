import Link from "next/link";
import { RegisterForm } from "./RegisterForm";
import HomeButton from "@/components/navigation/HomeButton";

export default function Register() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="page-title mb-2">Register</h1>
      <RegisterForm />
      <div className="text-center text-white mt-2">
        Already have an account?
        <Link href="/login" className="empty-bg-btn">
          Log in
        </Link>
      </div>
      <HomeButton />
    </div>
  );
}
