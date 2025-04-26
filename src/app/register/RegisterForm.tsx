"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { register } from "./actions";

export function RegisterForm() {
  const [state, formAction] = useActionState(register, undefined);

  return (
    <form action={formAction} className="form">
      <div className="flex flex-col gap-0.5">
        <label htmlFor="firstName" className="text-white mb-1">
          First Name
        </label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          placeholder="Your First Name"
          defaultValue={state?.values?.firstName || ""}
        />
        {state?.errors?.firstName && (
          <div className="text-red-500 text-sm mt-1">
            {state.errors.firstName[0]}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <label htmlFor="lastName" className="text-white mb-1">
          Last Name
        </label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          placeholder="Your Last Name"
          defaultValue={state?.values?.lastName || ""}
        />
        {state?.errors?.lastName && (
          <div className="text-red-500 text-sm mt-1">
            {state.errors.lastName[0]}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <label htmlFor="email" className="text-white mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Your Email"
          defaultValue={state?.values?.email || ""}
        />
        {state?.errors?.email && (
          <div className="text-red-500 text-sm mt-1">
            {state.errors.email[0]}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <label htmlFor="password" className="text-white mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
        />
        {state?.errors?.password && (
          <div className="text-red-500 text-sm mt-1">
            {state.errors.password[0]}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <label htmlFor="confirmPassword" className="text-white mb-1">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
        />
        {state?.errors?.confirmPassword && (
          <div className="text-red-500 text-sm mt-1">
            {state.errors.confirmPassword[0]}
          </div>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit" className="submit-btn mt-1.5 mb-1">
      Submit
    </button>
  );
}
