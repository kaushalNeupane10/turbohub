"use client";

import { useState } from "react";
import Image from "next/image";
import { MediaFile } from "@/types/mediaManager/media";
import { formatBytes } from "@/utils/formatBytes";

interface MediaCardProps {
  file: MediaFile;
  selected?: boolean;
  selectable?: boolean;
  onSelect?: (file: MediaFile) => void;
  onDelete?: (id: string) => void;
}

export default function MediaCard({
  file,
  selected = false,
  selectable = false,
  onSelect,
  onDelete,
}: MediaCardProps) {
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
      return;
    }
    setDeleting(true);
    await onDelete?.(file.id);
    setDeleting(false);
  };

  const handleSelect = () => {
    if (selectable) onSelect?.(file);
  };

  return (
    <div
      onClick={handleSelect}
      className={[
        "group relative overflow-hidden rounded-lg border transition-all duration-200",
        "bg-(--color-bg-surface)",
        selectable ? "cursor-pointer" : "",
        selected
          ? "border-(--color-brand) ring-2 ring-(--ring) shadow-brand"
          : "border-(--color-border-subtle) hover:border-(--color-border)",
      ].join(" ")}
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-(--color-bg-sunken)">
        <Image
          src={file.secure_url}
          alt={file.original_filename || file.public_id}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />

        {/* Selected overlay */}
        {selected && (
          <div className="absolute inset-0 bg-(--color-brand) opacity-20 pointer-events-none" />
        )}

        {/* Checkmark */}
        {selectable && (
          <div
            className={[
              "absolute top-2 right-2 w-5 h-5 rounded-full border-2 transition-all duration-200",
              "flex items-center justify-center",
              selected
                ? "bg-(--color-brand) border-(--color-brand)"
                : "bg-white/70 border-white opacity-0 group-hover:opacity-100",
            ].join(" ")}
          >
            {selected && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        )}

        {/* Delete button — only when not selectable mode */}
        {!selectable && onDelete && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={[
              "absolute top-2 right-2 h-7 px-2 rounded-sm text-xs font-medium",
              "transition-all duration-200 opacity-0 group-hover:opacity-100",
              deleteConfirm
                ? "bg-(--error-default) text-white opacity-100"
                : "bg-black/50 text-white backdrop-blur-sm",
            ].join(" ")}
          >
            {deleting ? "..." : deleteConfirm ? "Confirm" : "Delete"}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-2 py-2">
        <p className="text-[var(--font-size-xs)] text-[var(--color-text-muted)] truncate leading-tight">
          {file.original_filename || "Untitled"}
        </p>
        {file.bytes && (
          <p className="text-[var(--font-size-xs)] text-[var(--color-text-muted)] opacity-70">
            {formatBytes(file.bytes)}
          </p>
        )}
      </div>
    </div>
  );
}
