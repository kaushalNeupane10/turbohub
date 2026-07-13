import { CarFront, Plus } from "lucide-react";

interface EmptyStateProps {
  onAddVehicle?: () => void;
  onClearFilters?: () => void;
  hasFilters?: boolean;
}

export default function EmptyState({
  onAddVehicle,
  onClearFilters,
  hasFilters = false,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-100 flex-col items-center justify-center rounded-3xl border border-border-subtle bg-bg-surface px-6 py-12 text-center shadow-sm transition-all duration-300 sm:px-12 lg:min-h-120">
      {/* Icon Container with Subtle Shadow/Glow */}
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-subtle/10 text-brand shadow-brand transition-transform duration-300 hover:scale-105">
        <CarFront size={32} className="stroke-[1.75]" />
      </div>

      {/* Content Stack */}
      <div className="max-w-md space-y-2">
        <h2 className="text-xl font-bold tracking-tight text-text-heading sm:text-2xl">
          No Vehicles Found
        </h2>
        <p className="text-sm leading-relaxed text-text-muted">
          Your rental vehicles will appear here. Add new vehicles to your fleet
          or adjust your filters to view current inventory.
        </p>
      </div>

      {/* Dynamic Action Zone for Production UX */}
      {(onAddVehicle || onClearFilters) && (
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {hasFilters && onClearFilters && (
            <button
              onClick={onClearFilters}
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-medium text-text-body transition-colors hover:bg-bg-elevated focus:outline-none focus:ring-2 focus:ring-brand"
            >
              Clear Active Filters
            </button>
          )}

          {onAddVehicle && (
            <button
              onClick={onAddVehicle}
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-medium text-brand-foreground transition-all hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            >
              <Plus size={16} className="stroke-[2.5]" />
              Add New Vehicle
            </button>
          )}
        </div>
      )}
    </div>
  );
}
