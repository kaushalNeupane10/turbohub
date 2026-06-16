import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;

  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-body">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`
w-full
rounded-lg
border
bg-bg-surface
px-4
py-3 text-text-body
outline-none
transition
placeholder:text-text-muted
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
