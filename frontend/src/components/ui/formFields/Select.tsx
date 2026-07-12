"use client";

import { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { SelectOption } from "@/types/common/select";

interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "onChange"
> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  onChange: (value: string) => void;
}

export default function Select({
  label,
  error,
  options,
  placeholder = "Select",
  value,
  onChange,
  className = "",
  disabled,
  ...props
}: SelectProps) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-body">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          {...props}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-11 w-full appearance-none rounded-xl border bg-bg-surface px-4 pr-10 text-sm text-text-body outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60
            ${
              error
                ? "border-error focus:border-error"
                : "border-border focus:border-border-focus"
            }

            ${className}
          `}
        >
          <option value="">{placeholder}</option>

          {options.map((option) => (
            <option key={String(option.value)} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
      </div>

      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
