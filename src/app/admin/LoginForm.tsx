"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login, type LoginState } from "./actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-solid h-12 justify-center" disabled={pending}>
      {pending ? "Checking…" : "Sign in"}
    </button>
  );
}

export function LoginForm() {
  const [state, action] = useFormState<LoginState, FormData>(login, { error: null });
  return (
    <form action={action} className="panel mx-auto mt-10 grid max-w-sm gap-4 p-6 sm:p-8">
      <p className="label">Owner only</p>
      <h1 className="display text-4xl">Visitors</h1>
      <label htmlFor="admin-password" className="text-sm text-ink2">
        Password
      </label>
      <input
        id="admin-password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        autoFocus
        className="h-12 rounded-xl border border-line-strong bg-paper px-4 text-base text-ink outline-none focus:border-ink"
      />
      {state.error && (
        <p role="alert" className="text-sm text-accent">
          {state.error}
        </p>
      )}
      <Submit />
    </form>
  );
}
