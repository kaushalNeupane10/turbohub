"use client";

import { ReactNode } from "react";

interface ModalBodyProps {
  children: ReactNode;
}

export default function ModalBody({ children }: ModalBodyProps) {
  return (
    <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
  );
}
