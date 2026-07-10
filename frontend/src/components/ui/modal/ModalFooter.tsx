"use client";

import { ReactNode } from "react";

interface ModalFooterProps {
  children: ReactNode;
}

export default function ModalFooter({ children }: ModalFooterProps) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-border-subtle px-6 py-4 sm:flex-row sm:justify-end">
      {children}
    </div>
  );
}
