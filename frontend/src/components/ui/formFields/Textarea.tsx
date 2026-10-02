"use client";

import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export default function Textarea({
  label,
  error,
  required,
  className = "",
  rows = 5,
  ...props
}: TextareaProps) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-body">
          {label}

          {required && <span className="ml-1 text-error">*</span>}
        </label>
      )}

      <textarea
        {...props}
        rows={rows}
        className={`w-full resize-none rounded-xl border bg-bg-surface px-4 py-3 text-text-body placeholder:text-text-muted outline-none transition-colors
          ${
            error
              ? "border-error focus:border-error"
              : "border-border focus:border-border-focus"
          }

          ${className}
        `}
      />

      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
