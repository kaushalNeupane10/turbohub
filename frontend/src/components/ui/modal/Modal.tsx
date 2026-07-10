"use client";

import { ReactNode, useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useLockBodyScroll } from "@/hook/common/useLockBodyScroll";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
}

const SIZE_CLASSES = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
};

export default function Modal({
  open,
  onClose,
  children,
  size = "md",
  closeOnOverlay = true,
  closeOnEsc = true,
}: ModalProps) {
  useLockBodyScroll(open);

  const handleEsc = useCallback(
    (event: KeyboardEvent) => {
      if (!closeOnEsc) return;

      if (event.key === "Escape") {
        onClose();
      }
    },
    [closeOnEsc, onClose],
  );

  useEffect(() => {
    if (!open) return;

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, handleEsc]);

  const modal = useMemo(() => {
    if (!open) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/50 p-4"
        onClick={() => {
          if (closeOnOverlay) {
            onClose();
          }
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          className={`w-full rounded-2xl bg-bg-surface shadow-xl ${SIZE_CLASSES[size]}`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    );
  }, [children, closeOnOverlay, onClose, open, size]);

  if (typeof window === "undefined") {
    return null;
  }

  return createPortal(modal, document.body);
}
