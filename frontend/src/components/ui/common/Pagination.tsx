"use client";

import { PaginationMeta } from "@/types/common/pagination";

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  pagination,
  onPageChange,
}: PaginationProps) {
  const { page, totalPages, count, pageSize } = pagination;
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, count);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-(--color-border-subtle)">
      <p className="text-sm text-text-muted">
        Showing {from}–{to} of {count}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 text-sm rounded-md border border-(--color-border) disabled:opacity-40 hover:bg-[var(--color-bg-sunken)] transition-colors text-text-body"
        >
          Previous
        </button>
        <span className="text-sm text-text-muted px-1">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 text-sm rounded-md border border-(--color-border) disabled:opacity-40 hover:bg-[var(--color-bg-sunken)] transition-colors text-text-body"
        >
          Next
        </button>
      </div>
    </div>
  );
}
