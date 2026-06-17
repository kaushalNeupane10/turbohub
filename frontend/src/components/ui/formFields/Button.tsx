import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function Button({
  children,
  loading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`
        flex
        w-full
        items-center
        justify-center
        gap-2
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
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
        </>
      ) : (
        children
      )}
    </button>
  );
}
