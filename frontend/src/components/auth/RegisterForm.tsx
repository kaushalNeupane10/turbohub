"use client";

import useRegister from "@/hook/auth/useRegister";
import Input from "../ui/formFields/Input";
import Button from "../ui/formFields/Button";
import { Alert } from "@/components/ui/alert";
import Link from "next/link";

export default function RegisterForm() {
  const { loading, error, serverError, formData, updateField, handleRegister } =
    useRegister();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await handleRegister();
  };

  return (
    <div className="w-full rounded-2xl border border-border-subtle bg-bg-surface p-6 shadow-xl transition-all duration-300 hover:shadow-brand sm:p-8">
      {/* TurboHub Branding & Header */}
      <div className="mb-7">
        <div className="inline-flex items-center gap-2 mb-3">
          {/* Micro vector brand mark representing speed/motion */}
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
              d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
            />
          </svg>
          <span className="font-sans text-lg font-black tracking-wider text-text-heading uppercase">
            Turbo<span className="text-brand">Hub</span>
          </span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-text-heading sm:text-3xl">
          Create Account
        </h1>
        <p className="mt-1.5 text-sm text-text-muted text-pretty">
          Get started with TurboHub to find your perfect ride.
        </p>
      </div>

      {/* Clean Server Error Alert Box */}
      {serverError && (
        <Alert variant="error" className="mb-6">
          {serverError}
        </Alert>
      )}

      {/* Form Fields Stack */}
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Name */}
        <Input
          label="Full Name"
          value={formData.full_name}
          onChange={(e) => updateField("full_name", e.target.value)}
          placeholder="John Doe"
          error={error.full_name}
        />

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

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => updateField("confirmPassword", e.target.value)}
          placeholder="••••••••"
          error={error.confirmPassword}
        />

        {/* Action Button Container */}
        <div className="pt-1">
          <Button type="submit" loading={loading}>
            Create Account
          </Button>
        </div>
      </form>

      {/* Secondary Quick-Link Option */}
      <div className="mt-6 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-brand hover:text-brand-dark transition-colors underline underline-offset-4"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
