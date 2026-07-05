"use client";

import MediaManager from "@/components/admin/media/MediaManger";

interface MediaManagerPageProps {
  isAdminSpace?: boolean;
}

export default function MediaManagerPage({
  isAdminSpace = false,
}: MediaManagerPageProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="px-6 py-5 border-b border-(--color-border-subtle) bg-(--color-bg-surface) shrink-0">
        <h1 className="text-xl font-bold text-text-heading">
          {isAdminSpace ? "Admin Media Library" : "Media Library"}
        </h1>
        <p className="text-sm text-text-muted mt-0.5">
          {isAdminSpace
            ? "Manage shared admin assets — banners, icons, and platform-wide images"
            : "Upload and organize your images. Reuse them across any listing."}
        </p>
      </div>

      {/* Manager fills remaining height */}
      <div className="flex-1 min-h-0">
        <MediaManager isAdminSpace={isAdminSpace} />
      </div>
    </div>
  );
}
