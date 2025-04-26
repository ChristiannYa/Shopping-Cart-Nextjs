"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "./actions";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";

export function LoginForm() {
  const [state, loginAction] = useActionState(login, undefined);

  return (
    <div className="form">
      <form action={loginAction} className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <input id="email" name="email" placeholder="Email" />
        </div>
        {state?.errors?.email && (
          <p className="text-red-500">{state.errors.email}</p>
        )}

        <div className="flex flex-col gap-2">
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
          />
        </div>
        {state?.errors?.password && (
          <p className="text-red-500">{state.errors.password}</p>
        )}
        <SubmitButton />
      </form>

      <div className="flex items-center my-2">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-300 text-sm">OR</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <GoogleLoginButton />
    </div>
  );
}

// Why would the submit button be outsie the
// form?
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit" className="submit-btn">
      Log in
    </button>
  );
}
