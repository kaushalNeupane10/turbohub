"use client";

import { useEffect, useState, useCallback } from "react";
import { MediaFile, SelectedMedia } from "@/types/mediaManager/media";
import { useMediaFiles } from "@/hook/admin/media/useMediaFiles";
import { useMediaFolders } from "@/hook/admin/media/useMediaFolders";
import FolderTree from "./FolderTree";
import MediaCard from "./MediaCard";
import MediaUploadZone from "./MediaUploadZone";
import Pagination from "@/components/ui/common/Pagination";
interface MediaManagerProps {
  // If true, renders as a picker: checkboxes + confirm button
  pickerMode?: boolean;
  multiple?: boolean;
  isAdminSpace?: boolean;
  onConfirm?: (selected: SelectedMedia[]) => void;
  onCancel?: () => void;
}

export default function MediaManager({
  pickerMode = false,
  multiple = true,
  isAdminSpace = false,
  onConfirm,
  onCancel,
}: MediaManagerProps) {
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const space = isAdminSpace ? "admin" : "mine";

  const {
    files,
    loading: filesLoading,
    error: filesError,
    uploading,
    fetchFiles,
    uploadFiles,
    removeFile,
    clearUploadError,
    page,
    setPage,
    pagination,
  } = useMediaFiles();

  const {
    folders,
    loading: foldersLoading,
    fetchFolders,
    addFolder,
    removeFolder,
    updateFolderName,
  } = useMediaFolders();

  const load = useCallback(() => {
    fetchFiles({
      folder: activeFolderId ?? undefined,
      search: debouncedSearch,
      space,
      page,
    });
    fetchFolders({ space });
  }, [activeFolderId, debouncedSearch, space, page, fetchFiles, fetchFolders]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpload = async (rawFiles: File[]) => {
    await uploadFiles({
      files: rawFiles,
      folder: activeFolderId ?? undefined,
      is_admin_space: isAdminSpace,
    });
  };

  const handleDelete = async (id: string) => {
    await removeFile(id);
    setSelectedIds((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
  };

  const handleSelect = (file: MediaFile) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(file.id)) {
        next.delete(file.id);
      } else {
        if (!multiple) next.clear();
        next.add(file.id);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    const selected = files
      .filter((f) => selectedIds.has(f.id))
      .map<SelectedMedia>((f) => ({
        id: f.id,
        url: f.secure_url,
        public_id: f.public_id,
        width: f.width,
        height: f.height,
        original_filename: f.original_filename,
      }));
    onConfirm?.(selected);
  };

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-bg-page">
      {/* ── Mobile overlay ──────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-30 w-56 flex flex-col border-r border-(--color-border-subtle)",
          "bg-(--color-bg-surface) p-4 transition-transform duration-300 ease-in-out",
          "lg:static lg:z-auto lg:translate-x-0 lg:flex",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <span className="text-sm font-semibold text-text-heading">
            Folders
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-text-muted"
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

        {foldersLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-7 rounded-md bg-(--skeleton) animate-pulse"
              />
            ))}
          </div>
        ) : (
          <FolderTree
            folders={folders}
            activeFolderId={activeFolderId}
            onSelectFolder={(id) => {
              setActiveFolderId(id);
              setSidebarOpen(false);
            }}
            onCreateFolder={async (name, parentId) => {
              await addFolder({
                name,
                parent: parentId,
                is_admin_space: isAdminSpace,
              });
            }}
            onDeleteFolder={async (id) => {
              await removeFolder(id);
            }}
            onRenameFolder={async (id, name) => {
              await updateFolderName(id, name);
            }}
          />
        )}
      </aside>

      {/* ── Main content ────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-(--color-border-subtle) bg-(--color-bg-surface) flex-wrap">
          {/* Mobile folder toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-md hover:bg-(--color-bg-sunken) text-text-muted"
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
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>

          {/* Search */}
          <div className="relative flex-1 min-w-40">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              placeholder="Search media..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border border-(--color-border) bg-(--color-bg-sunken) outline-none focus:border-(--color-brand) text-text-body placeholder:text-text-muted"
            />
          </div>

          {/* Upload button (compact) */}
          <MediaUploadZone
            onUpload={handleUpload}
            uploading={uploading}
            onClearError={clearUploadError}
            compact
          />

          {/* Picker confirm / cancel */}
          {pickerMode && (
            <div className="flex items-center gap-2 ml-auto">
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="px-3 py-1.5 text-sm rounded-md border border-(--color-border) text-text-body hover:bg-(--color-bg-sunken) transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleConfirm}
                disabled={selectedIds.size === 0}
                className="px-3 py-1.5 text-sm rounded-md bg-(--color-brand) text-white font-medium hover:bg-(--color-brand-dark) transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {selectedIds.size > 0
                  ? `Use ${selectedIds.size} image${selectedIds.size > 1 ? "s" : ""}`
                  : "Select images"}
              </button>
            </div>
          )}
        </div>

        {/* Upload dropzone — only show in full manager (not compact toolbar) */}
        {!pickerMode && (
          <div className="px-4 pt-4">
            <MediaUploadZone
              onUpload={handleUpload}
              uploading={[]}
              onClearError={clearUploadError}
              compact={false}
            />
          </div>
        )}

        {/* Picker mode drop zone */}
        {pickerMode && (
          <div className="px-4 pt-3">
            <MediaUploadZone
              onUpload={handleUpload}
              uploading={uploading}
              onClearError={clearUploadError}
              compact={false}
            />
          </div>
        )}

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filesError && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-(--error-light) text-(--error-default) text-sm">
              {filesError}
            </div>
          )}

          {filesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg bg-(--skeleton) animate-pulse"
                />
              ))}
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-(--color-bg-sunken) flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-text-body">No media yet</p>
              <p className="text-xs text-text-muted mt-1">
                Upload images to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {files.map((file) => (
                <MediaCard
                  key={file.id}
                  file={file}
                  selected={selectedIds.has(file.id)}
                  selectable={pickerMode}
                  onSelect={pickerMode ? handleSelect : undefined}
                  onDelete={!pickerMode ? handleDelete : undefined}
                />
              ))}
            </div>
          )}
        </div>
        {pagination && (
          <Pagination pagination={pagination} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
}
