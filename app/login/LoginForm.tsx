"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="text-2xl font-bold text-green-900">Admin Login</h1>

      <label className="mt-6 block text-sm font-medium text-green-900" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        className="mt-1 w-full rounded-lg border border-green-200 px-4 py-2 outline-none focus:border-green-600"
      />

      <label className="mt-4 block text-sm font-medium text-green-900" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        className="mt-1 w-full rounded-lg border border-green-200 px-4 py-2 outline-none focus:border-green-600"
      />

      {state?.error && (
        <p className="mt-4 text-sm font-medium text-red-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-full bg-green-700 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}