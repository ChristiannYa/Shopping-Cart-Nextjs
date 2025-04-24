import { LoginForm } from "./LoginForm";
import HomeButton from "@/components/navigation/HomeButton";

export default function Login() {
  return (
    <div className="p-4">
      <div className="w-fit space-y-2">
        <LoginForm />
        <div className="flex justify-center">
          <HomeButton />
        </div>
      </div>
    </div>
  );
}
