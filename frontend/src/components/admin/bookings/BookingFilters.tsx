"use client";

import { Search, Filter, Car, X } from "lucide-react";
import { BookingStatus } from "@/types/booking.types";
import { VehicleCategory } from "@/types/vehicle.types";

const STATUS_OPTIONS: { value: BookingStatus | ""; label: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

const VEHICLE_TYPE_OPTIONS: { value: VehicleCategory | ""; label: string }[] = [
  { value: "", label: "All Types" },
  { value: "car", label: "Car" },
  { value: "bike", label: "Bike" },
  { value: "dirt-bike", label: "Dirt Bike" },
  { value: "suv", label: "SUV" },
  { value: "electric", label: "Electric" },
  { value: "scooter", label: "Scooter" },
];

interface BookingFiltersProps {
  search: string;
  status: BookingStatus | "";
  vehicleType: VehicleCategory | "";
  hasFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: BookingStatus | "") => void;
  onVehicleTypeChange: (value: VehicleCategory | "") => void;
  onClearFilters: () => void;
}

export default function BookingFilters({
  search,
  status,
  vehicleType,
  hasFilters,
  onSearchChange,
  onStatusChange,
  onVehicleTypeChange,
  onClearFilters,
}: BookingFiltersProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border-subtle px-5 py-4 sm:flex-row sm:items-center sm:flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-0 max-w-sm">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          id="booking-search"
          type="search"
          placeholder="Search renter name, email or vehicle…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="
            w-full rounded-xl border border-border bg-bg-sunken
            py-2 pl-9 pr-4 text-sm text-text-body placeholder-text-muted
            outline-none ring-0 transition
            focus:border-border-focus focus:ring-2 focus:ring-brand/20
          "
        />
      </div>

      {/* Status filter + Vehicle Type filter + clear */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Status dropdown */}
        <div className="relative">
          <Filter
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <select
            id="booking-status-filter"
            value={status}
            onChange={(e) =>
              onStatusChange(e.target.value as BookingStatus | "")
            }
            className="
              rounded-xl border border-border bg-bg-sunken
              py-2 pl-8 pr-8 text-sm text-text-body
              outline-none ring-0 transition appearance-none cursor-pointer
              focus:border-border-focus focus:ring-2 focus:ring-brand/20
            "
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Vehicle Type dropdown */}
        <div className="relative">
          <Car
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <select
            id="booking-vehicle-type-filter"
            value={vehicleType}
            onChange={(e) =>
              onVehicleTypeChange(e.target.value as VehicleCategory | "")
            }
            className="
              rounded-xl border border-border bg-bg-sunken
              py-2 pl-8 pr-8 text-sm text-text-body
              outline-none ring-0 transition appearance-none cursor-pointer
              focus:border-border-focus focus:ring-2 focus:ring-brand/20
            "
          >
            {VEHICLE_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            aria-label="Clear filters"
            className="
              inline-flex items-center gap-1.5 rounded-xl border border-border
              px-3 py-2 text-xs font-semibold text-text-muted
              transition hover:border-error/40 hover:bg-error/5 hover:text-error
            "
          >
            <X size={13} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
