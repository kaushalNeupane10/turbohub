"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

import { useModalContext } from "./ModalContext";

interface ModalHeaderProps {
  children: ReactNode;
}

export default function ModalHeader({ children }: ModalHeaderProps) {
  const { onClose } = useModalContext();

  return (
    <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
      <h2 id="modal-title" className="text-xl font-semibold text-text-heading">
        {children}
      </h2>

      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="rounded-lg p-2 text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-heading"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
