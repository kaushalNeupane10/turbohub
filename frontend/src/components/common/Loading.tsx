"use client";

interface LoadingProps {
  text?: string;
}

export default function Loading({ text = "Loading..." }: LoadingProps) {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-5">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-(--color-border-subtle)" />
        <div
          aria-label="Loading spinner"
          className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-(--color-brand)"
        />
      </div>

      <p className="text-sm font-medium text-text-body md:text-base">{text}</p>
    </div>
  );
}
