"use client";

import SearchBox from "@/components/common/SearchBox";
import Select from "@/components/ui/formFields/Select";
import { SelectOption } from "@/types/common/select";

interface BrowseToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  categoryOptions: SelectOption[];
  sortOptions: SelectOption[];
  hasFilters: boolean;
  onClearFilters: () => void;
}

/**
 * Filter/sort toolbar for the public /vehicles browse page.
 * Mirrors the admin VehicleToolBar layout for visual consistency, but exposes
 * public-facing controls (search, category, sort) instead of status.
 */
export default function BrowseToolbar({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  categoryOptions,
  sortOptions,
  hasFilters,
  onClearFilters,
}: BrowseToolbarProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-bg-surface p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="w-full lg:max-w-md">
          <SearchBox
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, location…"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 lg:justify-end">
          <div className="flex-1 min-w-40 sm:flex-initial sm:w-48">
            <Select
              value={category}
              options={categoryOptions}
              placeholder="All Categories"
              onChange={onCategoryChange}
            />
          </div>

          <div className="flex-1 min-w-40 sm:flex-initial sm:w-52">
            <Select
              value={sort}
              options={sortOptions}
              placeholder="Sort by"
              onChange={onSortChange}
            />
          </div>

          {hasFilters && (
            <button
              onClick={onClearFilters}
              className="h-11 w-full rounded-xl border border-border px-4 text-sm font-medium text-text-body transition-colors hover:bg-bg-elevated active:scale-[0.98] sm:w-auto"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
