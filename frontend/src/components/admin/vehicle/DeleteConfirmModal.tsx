"use client";

import { AlertTriangle } from "lucide-react";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/formFields/Button";

interface DeleteConfirmModalProps {
  open: boolean;
  vehicleName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * A reusable, accessible confirmation modal for destructive delete actions.
 * Uses the project's compound Modal component — no window.confirm().
 */
export default function DeleteConfirmModal({
  open,
  vehicleName,
  isDeleting,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="sm" closeOnOverlay={!isDeleting}>
      <Modal.Header>Delete Vehicle</Modal.Header>

      <Modal.Body>
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          {/* Warning icon */}
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-error-light/10">
            <AlertTriangle
              size={28}
              className="text-error"
              aria-hidden="true"
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-base font-semibold text-text-heading">
              Are you sure?
            </p>
            <p className="text-sm text-text-muted">
              You are about to permanently delete{" "}
              <span className="font-semibold text-text-body">
                &quot;{vehicleName}&quot;
              </span>
              . This action{" "}
              <span className="font-semibold text-error">cannot be undone</span>
              .
            </p>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        {/* Cancel */}
        <Button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="bg-transparent border border-border text-text-body hover:bg-bg-elevated hover:border-border-strong"
        >
          Cancel
        </Button>

        {/* Confirm delete */}
        <Button
          type="button"
          onClick={onConfirm}
          loading={isDeleting}
          className="bg-error hover:bg-error/90 text-white"
        >
          {isDeleting ? "Deleting…" : "Delete Vehicle"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
