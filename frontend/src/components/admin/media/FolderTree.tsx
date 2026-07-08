"use client";

import { useState } from "react";
import { MediaFolder } from "@/types/mediaManager/media";

interface FolderTreeProps {
  folders: MediaFolder[];
  activeFolderId: string | null;
  onSelectFolder: (id: string | null) => void;
  onCreateFolder: (name: string, parentId: string | null) => Promise<void>;
  onDeleteFolder: (id: string) => Promise<void>;
  onRenameFolder: (id: string, name: string) => Promise<void>;
}

interface FolderItemProps {
  folder: MediaFolder;
  depth: number;
  allFolders: MediaFolder[];
  activeFolderId: string | null;
  onSelectFolder: (id: string | null) => void;
  onCreateFolder: (name: string, parentId: string | null) => Promise<void>;
  onDeleteFolder: (id: string) => Promise<void>;
  onRenameFolder: (id: string, name: string) => Promise<void>;
}

function FolderItem({
  folder,
  depth,
  allFolders,
  activeFolderId,
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
}: FolderItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(folder.name);
  const [showActions, setShowActions] = useState(false);
  const [addingChild, setAddingChild] = useState(false);
  const [newChildName, setNewChildName] = useState("");

  const children = allFolders.filter((f) => f.parent === folder.id);
  const isActive = activeFolderId === folder.id;
  const hasChildren = folder.children_count > 0 || children.length > 0;

  const handleRename = async () => {
    if (renameValue.trim() && renameValue !== folder.name) {
      await onRenameFolder(folder.id, renameValue.trim());
    }
    setRenaming(false);
  };

  const handleAddChild = async () => {
    if (!newChildName.trim()) return;
    await onCreateFolder(newChildName.trim(), folder.id);
    setNewChildName("");
    setAddingChild(false);
    setExpanded(true);
  };

  return (
    <li>
      <div
        className={[
          "group flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer",
          "transition-colors duration-150 relative",
          isActive
            ? "bg-(--color-brand) text-white"
            : "hover:bg-(--color-bg-sunken) text-text-body",
        ].join(" ")}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Expand chevron */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((p) => !p);
          }}
          className="w-4 h-4 flex items-center justify-center shrink-0 opacity-60"
        >
          {hasChildren ? (
            <svg
              className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          ) : (
            <span className="w-3" />
          )}
        </button>

        {/* Folder icon */}
        <svg
          className="w-4 h-4 shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>

        {/* Name or rename input */}
        {renaming ? (
          <input
            autoFocus
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();
              if (e.key === "Escape") setRenaming(false);
            }}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-transparent border-b border-white/50 outline-none text-sm"
          />
        ) : (
          <span
            className="flex-1 text-sm truncate"
            onClick={() => onSelectFolder(folder.id)}
          >
            {folder.name}
          </span>
        )}

        {/* Count badge */}
        {folder.files_count > 0 && !isActive && (
          <span className="text-[10px] text-text-muted ml-auto shrink-0">
            {folder.files_count}
          </span>
        )}

        {/* Actions */}
        {showActions && !renaming && (
          <div
            className="flex items-center gap-0.5 ml-auto shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setAddingChild(true)}
              title="New subfolder"
              className={[
                "w-5 h-5 rounded flex items-center justify-center transition-colors",
                isActive
                  ? "hover:bg-white/20 text-white"
                  : "hover:bg-(--color-border) text-text-muted",
              ].join(" ")}
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
            <button
              onClick={() => {
                setRenaming(true);
                setRenameValue(folder.name);
              }}
              title="Rename"
              className={[
                "w-5 h-5 rounded flex items-center justify-center transition-colors",
                isActive
                  ? "hover:bg-white/20 text-white"
                  : "hover:bg-(--color-border) text-text-muted",
              ].join(" ")}
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => onDeleteFolder(folder.id)}
              title="Delete"
              className={[
                "w-5 h-5 rounded flex items-center justify-center transition-colors",
                isActive
                  ? "hover:bg-red-500/30 text-white"
                  : "hover:bg-(--error-light) text-(--error-default)",
              ].join(" ")}
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Add child folder input */}
      {addingChild && (
        <div
          className="flex items-center gap-1 mt-1"
          style={{ paddingLeft: `${24 + depth * 16}px` }}
        >
          <input
            autoFocus
            placeholder="Folder name"
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddChild();
              if (e.key === "Escape") setAddingChild(false);
            }}
            className="flex-1 text-sm px-2 py-1 rounded-sm border border-(--color-border) bg-(--color-bg-sunken) outline-none focus:border-(--color-brand) text-text-body"
          />
          <button
            onClick={handleAddChild}
            className="text-(--color-brand) text-sm font-medium px-1"
          >
            Add
          </button>
        </div>
      )}

      {/* Children */}
      {expanded && children.length > 0 && (
        <ul className="mt-0.5">
          {children.map((child) => (
            <FolderItem
              key={child.id}
              folder={child}
              depth={depth + 1}
              allFolders={allFolders}
              activeFolderId={activeFolderId}
              onSelectFolder={onSelectFolder}
              onCreateFolder={onCreateFolder}
              onDeleteFolder={onDeleteFolder}
              onRenameFolder={onRenameFolder}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function FolderTree({
  folders,
  activeFolderId,
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
}: FolderTreeProps) {
  const [newRootName, setNewRootName] = useState("");
  const [showNewRoot, setShowNewRoot] = useState(false);

  const rootFolders = folders.filter((f) => f.parent === null);

  const handleCreateRoot = async () => {
    if (!newRootName.trim()) return;
    await onCreateFolder(newRootName.trim(), null);
    setNewRootName("");
    setShowNewRoot(false);
  };

  return (
    <nav className="flex flex-col gap-1">
      {/* All files */}
      <button
        onClick={() => onSelectFolder(null)}
        className={[
          "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors w-full text-left",
          activeFolderId === null
            ? "bg-(--color-brand) text-white"
            : "hover:bg-(--color-bg-sunken) text-text-body",
        ].join(" ")}
      >
        <svg
          className="w-4 h-4 shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
        All Media
      </button>

      {/* Root folders */}
      {rootFolders.length > 0 && (
        <ul className="mt-1 space-y-0.5">
          {rootFolders.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              depth={0}
              allFolders={folders}
              activeFolderId={activeFolderId}
              onSelectFolder={onSelectFolder}
              onCreateFolder={onCreateFolder}
              onDeleteFolder={onDeleteFolder}
              onRenameFolder={onRenameFolder}
            />
          ))}
        </ul>
      )}

      {/* New root folder */}
      {showNewRoot ? (
        <div className="flex items-center gap-1 mt-1 px-2">
          <input
            autoFocus
            placeholder="Folder name"
            value={newRootName}
            onChange={(e) => setNewRootName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateRoot();
              if (e.key === "Escape") setShowNewRoot(false);
            }}
            className="flex-1 text-sm px-2 py-1 rounded-sm border border-(--color-border) bg-(--color-bg-sunken) outline-none focus:border-(--color-brand) text-text-body"
          />
          <button
            onClick={handleCreateRoot}
            className="text-(--color-brand) text-sm font-medium"
          >
            Add
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowNewRoot(true)}
          className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-text-muted hover:text-(--color-brand) transition-colors mt-1 w-full text-left rounded-md hover:bg-(--color-bg-sunken)"
        >
          <svg
            className="w-3.5 h-3.5"
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
          New folder
        </button>
      )}
    </nav>
  );
}
