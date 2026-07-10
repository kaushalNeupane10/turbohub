"use client";

import { Search } from "lucide-react";
import Input from "@/components/ui/formFields/Input";

type SearchBoxProps = Omit<React.ComponentProps<typeof Input>, "type">;

export default function SearchBox({
  className = "",
  placeholder = "Search...",
  ...props
}: SearchBoxProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted pointer-events-none" />

      <Input
        {...props}
        type="text"
        placeholder={placeholder}
        className={`pl-12 ${className}`}
      />
    </div>
  );
}
