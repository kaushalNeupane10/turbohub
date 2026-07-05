"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { SelectedMedia } from "@/types/mediaManager/media";
import MediaManager from "./MediaManger";

interface MediaPickerModalProps {
  open: boolean;
  multiple?: boolean;
  isAdminSpace?: boolean;
  onConfirm: (selected: SelectedMedia[]) => void;
  onClose: () => void;
}

export default function MediaPickerModal({
  open,
  multiple = true,
  isAdminSpace = false,
  onConfirm,
  onClose,
}: MediaPickerModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-8"
      style={{ backgroundColor: "var(--overlay)" }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className={[
          "relative flex flex-col w-full bg-(--color-bg-surface) rounded-2xl",
          "shadow-xl overflow-hidden",
          "h-[95dvh] sm:h-[90dvh]",
          "max-w-6xl",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="Media picker"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-(--color-border-subtle) shrink-0">
          <div>
            <h2 className="text-base font-semibold text-text-heading">
              {isAdminSpace ? "Admin Media Library" : "My Media Library"}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {multiple ? "Select one or more images" : "Select an image"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md flex items-center justify-center text-text-muted hover:bg-(--color-bg-sunken) hover:text-text-body transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Manager fills the rest */}
        <div className="flex-1 min-h-0">
          <MediaManager
            pickerMode
            multiple={multiple}
            isAdminSpace={isAdminSpace}
            onConfirm={(selected) => {
              onConfirm(selected);
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
