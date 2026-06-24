import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  type,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-body">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          {...props}
          type={isPassword && showPassword ? "text" : type}
          className={`
            w-full
            rounded-lg
            border
            bg-bg-surface
            px-4
            py-3
            text-text-body
            outline-none
            transition
            placeholder:text-text-muted
            ${isPassword ? "pr-12" : ""}
            ${
              error
                ? "border-error focus:border-error"
                : "border-border focus:border-border-focus"
            }
            ${className}
          `}
        />

        {isPassword && (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((prev) => !prev)}
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-text-muted
              hover:text-text-body
              transition-colors
            "
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
