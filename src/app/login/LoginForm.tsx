"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "./actions";

export function LoginForm() {
  const [state, loginAction] = useActionState(login, undefined);

  return (
    <form
      action={loginAction}
      className="flex min-w-[260px] max-w-full flex-col gap-3"
    >
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
  );
}

// Why would the submit button be outsie the
// form?
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className="bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white p-2 rounded-sm"
    >
      Login
    </button>
  );
}
