import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function Button({
  children,
  loading,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`
w-full
rounded-lg
bg-brand
px-4
py-3
font-medium
text-brand-foreground
transition
hover:bg-brand-dark
disabled:cursor-not-allowed
disabled:opacity-60
${className}

`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
