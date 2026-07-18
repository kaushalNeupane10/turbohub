"use client";

import { useState } from "react";
import { SelectedMedia } from "@/types/mediaManager/media";
import MediaPickerModal from "@/components/admin/media/MediaPickerModal"; // adjust to your actual path

interface VehicleImagePickerProps {
  images: SelectedMedia[];
  onChange: (images: SelectedMedia[]) => void;
  error?: string;
}

export default function VehicleImagePicker({
  images,
  onChange,
  error,
}: VehicleImagePickerProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleConfirm = (selected: SelectedMedia[]) => {
    const existingIds = new Set(images.map((img) => img.id));
    onChange([...images, ...selected.filter((s) => !existingIds.has(s.id))]);
    setPickerOpen(false);
  };

  const handleRemove = (id: string) => {
    onChange(images.filter((img) => img.id !== id));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-text-heading mb-2">
        Vehicle Images <span className="text-(--error-default)">*</span>
      </label>

      <div className="flex flex-wrap gap-3">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative w-24 h-24 rounded-lg overflow-hidden border border-(--color-border-subtle) group"
          >
            <img
              src={img.url}
              alt={img.original_filename || "Vehicle image"}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(img.id)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <svg
                className="w-3 h-3"
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
        ))}

        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="w-24 h-24 rounded-lg border-2 border-dashed border-(--color-border) flex flex-col items-center justify-center text-text-muted hover:border-(--color-brand) hover:text-(--color-brand) transition-colors"
        >
          <svg
            className="w-6 h-6 mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span className="text-xs">Add</span>
        </button>
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-(--error-default)">{error}</p>
      )}

      <MediaPickerModal
        open={pickerOpen}
        multiple
        onConfirm={handleConfirm}
        onClose={() => setPickerOpen(false)}
      />
    </div>
  );
}
