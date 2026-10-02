"use client";

import { AlertCircle, PackageOpen } from "lucide-react";
import { PublicVehicleApiResponse } from "@/types/vehicle.types";
import { mapPublicVehicleToCard } from "@/utils/vehicle.utils";
import VehicleCard from "./VechileCard";
import VehicleCardSkeleton from "./VehicleCardSkeleton";

interface VehicleGridProps {
  vehicles?: PublicVehicleApiResponse[];
  isLoading?: boolean;
  isError?: boolean;
  /** How many skeletons to render while loading. */
  skeletonCount?: number;
  /** Show 1-based rank badges (used by the Top Rented section). */
  ranked?: boolean;
  /** Mark the first N cover images as priority (LCP) — home/above-the-fold only. */
  priorityCount?: number;
  emptyMessage?: string;
  onRetry?: () => void;
}

/**
 * Reusable, responsive grid that renders VehicleCards for a set of public
 * vehicles and gracefully handles loading, error and empty states.
 *
 * Layout: 1 col (mobile) → 2 (sm) → 3 (lg) → 4 (2xl).
 */
export default function VehicleGrid({
  vehicles,
  isLoading = false,
  isError = false,
  skeletonCount = 8,
  ranked = false,
  priorityCount = 0,
  emptyMessage = "No vehicles found.",
  onRetry,
}: VehicleGridProps) {
  const gridClass =
    "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4";

  if (isLoading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <VehicleCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border/60 bg-bg-surface p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-error/10 text-error">
          <AlertCircle size={26} />
        </div>
        <div>
          <p className="font-semibold text-text-heading">
            Couldn&apos;t load vehicles
          </p>
          <p className="mt-1 text-sm text-text-muted">
            Something went wrong. Please try again.
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-dark"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-bg-surface p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
          <PackageOpen size={26} />
        </div>
        <p className="max-w-sm text-sm text-text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={gridClass}>
      {vehicles.map((v, index) => (
        <VehicleCard
          key={v.id}
          vehicle={mapPublicVehicleToCard(v)}
          rank={ranked ? index + 1 : undefined}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}
