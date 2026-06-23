"use client";

import Link from "next/link";

import useLogin from "@/hook/auth/useLogin";

import Input from "../ui/formFields/Input";
import Button from "../ui/formFields/Button";

import { Alert } from "@/components/ui/alert";

export default function LoginForm() {
  const { loading, error, serverError, formData, updateField, handleLogin } =
    useLogin();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await handleLogin();
  };

  return (
    <div
      className="
      w-full
      rounded-2xl
      border
      border-border-subtle
      bg-bg-surface
      p-6
      shadow-xl
      transition-all
      duration-300
      hover:shadow-brand

      sm:p-8
      "
    >
      {/* Branding */}

      <div className="mb-7">
        <div
          className="
          mb-3
          inline-flex
          items-center
          gap-2
          "
        >
          <svg
            className="h-5 w-5 text-brand"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="
              M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z
              "
            />
          </svg>

          <span
            className="
            font-sans
            text-lg
            font-black
            tracking-wider
            text-text-heading
            uppercase
            "
          >
            Turbo
            <span className="text-brand">Hub</span>
          </span>
        </div>

        <h1
          className="
          text-2xl
          font-bold
          tracking-tight
          text-text-heading

          sm:text-3xl
          "
        >
          Welcome Back
        </h1>

        <p
          className="
          mt-1.5
          text-sm
          text-text-muted
          text-pretty
          "
        >
          Sign in to continue your TurboHub journey.
        </p>
      </div>

      {/* Server Error */}

      {serverError && (
        <Alert variant="error" className="mb-6">
          {serverError}
        </Alert>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Email */}

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          placeholder="john@example.com"
          error={error.email}
        />

        {/* Password */}

        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => updateField("password", e.target.value)}
          placeholder="••••••••"
          error={error.password}
        />

        <div className="pt-1">
          <Button type="submit" loading={loading}>
            Sign In
          </Button>
        </div>
      </form>

      {/* Footer links */}

      <div
        className="
        mt-6
        text-center
        text-sm
        text-text-muted
        "
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/register"
          className="
          font-medium
          text-brand
          hover:text-brand-dark
          transition-colors
          underline
          underline-offset-4
          "
        >
          Create account
        </Link>
      </div>
    </div>
  );
}
