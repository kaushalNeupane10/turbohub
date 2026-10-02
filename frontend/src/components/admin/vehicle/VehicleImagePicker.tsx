"use client";

import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { SelectedMedia } from "@/types/mediaManager/media";
import MediaPickerModal from "@/components/admin/media/MediaPickerModal";

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
      <label className="mb-2 block text-sm font-medium text-text-heading">
        Vehicle Images{" "}
        <span className="text-error" aria-hidden="true">
          *
        </span>
      </label>

      <div className="flex flex-wrap gap-3">
        {/* Existing / selected images */}
        {images.map((img) => (
          <div
            key={img.id}
            className="group relative h-24 w-24 overflow-hidden rounded-xl border border-border-subtle shadow-sm"
          >
            {/* Preview */}
            <img
              src={img.url}
              alt={img.original_filename || "Vehicle image"}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />

            {/* Remove button */}
            <button
              type="button"
              onClick={() => handleRemove(img.id)}
              aria-label={`Remove ${img.original_filename || "image"}`}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={10} strokeWidth={2.5} />
            </button>
          </div>
        ))}

        {/* Add image button */}
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="flex h-24 w-24 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border text-text-muted transition-colors hover:border-brand hover:text-brand"
        >
          <ImagePlus size={22} strokeWidth={1.75} />
          <span className="text-xs font-medium">Add</span>
        </button>
      </div>

      {/* Validation error */}
      {error && (
        <p className="mt-1.5 text-xs text-error" role="alert">
          {error}
        </p>
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
