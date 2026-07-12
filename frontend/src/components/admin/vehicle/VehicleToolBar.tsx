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
    <>
      <div className="border-b border-border-subtle bg-surface p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="w-full lg:max-w-md">
            <SearchBox
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search vehicles..."
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center lg:justify-end">
            <Select
              value={status}
              options={statusOptions}
              placeholder="All Status"
              onChange={onStatusChange}
            />

            <Select
              value={category}
              options={categoryOptions}
              placeholder="All Categories"
              onChange={onCategoryChange}
            />

            {hasFilters && (
              <button
                onClick={onClearFilters}
                className="h-11 rounded-xl border border-border px-4 text-sm font-medium text-text-body transition hover:bg-bg-elevated"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
