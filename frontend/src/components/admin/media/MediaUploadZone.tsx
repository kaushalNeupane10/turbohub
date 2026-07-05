"use client";

import { useRef, useState } from "react";
import { UploadingFile } from "@/hook/admin/media/useMediaFiles";

interface MediaUploadZoneProps {
  onUpload: (files: File[]) => void;
  uploading: UploadingFile[];
  onClearError: (id: string) => void;
  compact?: boolean; // compact = small button, not full drop zone
}

export default function MediaUploadZone({
  onUpload,
  uploading,
  onClearError,
  compact = false,
}: MediaUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    onUpload(Array.from(files));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-(--color-brand) text-white text-sm font-medium hover:bg-(--color-brand-dark) transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          Upload
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {/* Compact upload progress */}
        {uploading.length > 0 && (
          <div className="flex items-center gap-2">
            {uploading.map((u) => (
              <div
                key={u.id}
                className="flex items-center gap-1.5 text-xs text-text-muted"
              >
                {u.error ? (
                  <button
                    onClick={() => onClearError(u.id)}
                    className="text-(--error-default) flex items-center gap-1"
                  >
                    <span>Failed</span>
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
                ) : (
                  <>
                    <div className="w-16 h-1.5 bg-(--color-bg-sunken) rounded-full overflow-hidden">
                      <div
                        className="h-full bg-(--color-brand) rounded-full transition-all duration-300"
                        style={{ width: `${u.progress}%` }}
                      />
                    </div>
                    <span>{u.progress}%</span>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={[
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
          dragging
            ? "border-(--color-brand) bg-(--color-brand)/5 scale-[1.01]"
            : "border-(--color-border) hover:border-(--color-brand) hover:bg-(--color-bg-sunken)/50",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-3">
          <div
            className={[
              "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
              dragging
                ? "bg-(--color-brand) text-white"
                : "bg-(--color-bg-sunken) text-text-muted",
            ].join(" ")}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-text-body">
              {dragging
                ? "Drop to upload"
                : "Drop images here or click to browse"}
            </p>
            <p className="text-xs text-text-muted mt-1">
              JPG, PNG, WebP, GIF — max 10MB each
            </p>
          </div>
        </div>
      </div>

      {/* Upload progress list */}
      {uploading.length > 0 && (
        <ul className="space-y-2">
          {uploading.map((u) => (
            <li
              key={u.id}
              className="flex items-center gap-3 px-3 py-2 rounded-md bg-(--color-bg-sunken)"
            >
              <div className="w-8 h-8 rounded bg-(--color-border) flex items-center justify-center shrink-0 overflow-hidden">
                {/* Tiny preview */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(u.file)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text-body truncate">
                  {u.file.name}
                </p>
                {u.error ? (
                  <p className="text-xs text-(--error-default)">{u.error}</p>
                ) : (
                  <div className="mt-1 h-1 bg-(--color-border) rounded-full overflow-hidden">
                    <div
                      className="h-full bg-(--color-brand) rounded-full transition-all duration-300"
                      style={{ width: `${u.progress}%` }}
                    />
                  </div>
                )}
              </div>
              {u.error && (
                <button
                  onClick={() => onClearError(u.id)}
                  className="text-text-muted hover:text-(--error-default) shrink-0"
                >
                  <svg
                    className="w-4 h-4"
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
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
