import React from "react";
import SearchBox from "@/components/common/SearchBox";
import Select from "@/components/ui/formFields/Select";
import { SelectOption } from "@/types/common/select";

interface VehicleToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  status: string;
  category: string;
  statusOptions: SelectOption[];
  categoryOptions: SelectOption[];
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  hasFilters: boolean;
  onClearFilters: () => void;
}

export default function VehicleToolBar({
  searchQuery,
  onSearchChange,
  status,
  category,
  statusOptions,
  categoryOptions,
  onStatusChange,
  onCategoryChange,
  hasFilters,
  onClearFilters,
}: VehicleToolbarProps) {
  return (
    <div className="border-b border-border-subtle bg-surface p-4 sm:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search Wrapper: Scales clean across viewports */}
        <div className="w-full md:max-w-xs lg:max-w-md">
          <SearchBox
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search vehicles..."
          />
        </div>

        {/* Filters Group: Aligns side-by-side gracefully */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto md:justify-end">
          <div className="flex-1 min-w-35 sm:flex-initial sm:w-44">
            <Select
              value={status}
              options={statusOptions}
              placeholder="All Status"
              onChange={onStatusChange}
            />
          </div>

          <div className="flex-1 min-w-35 sm:flex-initial sm:w-44">
            <Select
              value={category}
              options={categoryOptions}
              placeholder="All Categories"
              onChange={onCategoryChange}
            />
          </div>

          {hasFilters && (
            <button
              onClick={onClearFilters}
              className="h-11 w-full sm:w-auto rounded-xl border border-border px-4 text-sm font-medium text-text-body transition-colors hover:bg-bg-elevated active:scale-[0.98]"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
