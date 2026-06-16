"use client";

import useRegister from "@/hook/auth/useRegister";
import { Loader2 } from "lucide-react";
export default function RegisterForm() {
  const { loading, error, serverError, formData, updateField, handleRegister } =
    useRegister();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = await handleRegister();

    if (user) {
      console.log("Registered", user);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-border-subtle bg-bg-surface p-6 shadow-lg sm:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-heading">Create Account</h1>

        <p className="mt-2 text-sm text-text-muted">
          Create your account to get started.
        </p>
      </div>

      {serverError && (
        <div className="mb-6 rounded-lg border border-error bg-error-light/10 p-3 text-sm text-error">
          {serverError}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-body">
            Full Name
          </label>

          <input
            value={formData.full_name}
            onChange={(e) => updateField("full_name", e.target.value)}
            placeholder="John Doe"
            className={`w-full rounded-lg border bg-bg-surface px-4 py-3 outline-none transition
              ${
                error.full_name
                  ? "border-error"
                  : "border-border focus:border-border-focus"
              }
            `}
          />

          {error.full_name && (
            <p className="mt-1 text-sm text-error">{error.full_name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-body">
            Email Address
          </label>

          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="john@example.com"
            className={`w-full rounded-lg border bg-bg-surface px-4 py-3 outline-none transition
              ${
                error.email
                  ? "border-error"
                  : "border-border focus:border-border-focus"
              }
            `}
          />

          {error.email && (
            <p className="mt-1 text-sm text-error">{error.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-body">
            Password
          </label>

          <input
            type="password"
            value={formData.password}
            onChange={(e) => updateField("password", e.target.value)}
            placeholder="••••••••"
            className={`w-full rounded-lg border bg-bg-surface px-4 py-3 outline-none transition
              ${
                error.password
                  ? "border-error"
                  : "border-border focus:border-border-focus"
              }
            `}
          />

          {error.password && (
            <p className="mt-1 text-sm text-error">{error.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text-body">
            Confirm Password
          </label>

          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
            placeholder="••••••••"
            className={`w-full rounded-lg border bg-bg-surface px-4 py-3 outline-none transition
              ${
                error.confirmPassword
                  ? "border-error"
                  : "border-border focus:border-border-focus"
              }
            `}
          />

          {error.confirmPassword && (
            <p className="mt-1 text-sm text-error">{error.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="
            w-full rounded-lg
            bg-brand
            px-4 py-3
            font-medium
            text-brand-foreground
            transition
            hover:bg-brand-dark
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ? (
            <div className="flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            "Create Account"
          )}
        </button>
      </form>
    </div>
  );
}
