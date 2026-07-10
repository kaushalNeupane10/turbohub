"use client";

import { ReactNode, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLockBodyScroll } from "@/hook/common/useLockBodyScroll";
import { ModalContext } from "./ModalContext";
import ModalHeader from "./ModalHeader";
import ModalBody from "./ModalBody";
import ModalFooter from "./ModalFooter";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlay?: boolean;
  closeOnEsc?: boolean;
}

const SIZE_CLASSES = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  full: "max-w-[95vw]",
} as const;

function Modal({
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

  if (!open) {
    return null;
  }

  return createPortal(
    <ModalContext.Provider value={{ onClose }}>
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
          aria-labelledby="modal-title"
          onClick={(event) => event.stopPropagation()}
          className={`w-full rounded-2xl bg-bg-surface shadow-xl ${SIZE_CLASSES[size]}`}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>,
    document.body,
  );
}

type ModalComponent = typeof Modal & {
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
};

const CompoundModal = Modal as ModalComponent;

CompoundModal.Header = ModalHeader;
CompoundModal.Body = ModalBody;
CompoundModal.Footer = ModalFooter;

export default CompoundModal;
