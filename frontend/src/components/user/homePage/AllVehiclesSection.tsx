"use client";

import { useTopRentedVehicles } from "@/hook/user/vehicle/useTopRentedVehicles";
import { useOtherVehicles } from "@/hook/user/vehicle/useOtherVehicles";
import VehicleGrid from "@/components/user/vehicle/VehicleGrid";
import SectionHeading from "./SectionHeading";

/**
 * Homepage section showing a normal "Explore All Vehicles" grid below the
 * algorithmically ranked Top Rented and curated Featured sections.
 *
 * Automatically excludes vehicles already shown in Top Rented to avoid
 * duplication. Sorted by highest rating by default.
 */
export default function AllVehiclesSection() {
  const { data: topRented } = useTopRentedVehicles();
  const topRentedIds = (topRented ?? []).map((v) => v.id);

  const { data, isLoading, isError, refetch } = useOtherVehicles(
    topRentedIds,
    // Only enable once we know the top-rented IDs (even if empty array)
    topRented !== undefined,
  );

  const vehicles = data?.results ?? [];

  // Nothing to show and nothing happening → don't render the section at all.
  if (!isLoading && !isError && vehicles.length === 0) {
    return null;
  }

  return (
    <section
      id="all-vehicles"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 bottom-10 h-64 w-64 rounded-full bg-brand/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The Full Fleet"
          title="Explore All Vehicles"
          description="Browse our complete collection of premium rides — filtered, sorted and ready to rent."
          actionHref="/vehicles"
          actionLabel="View all"
        />

        <VehicleGrid
          vehicles={vehicles}
          isLoading={isLoading}
          isError={isError}
          skeletonCount={4}
          priorityCount={0}
          onRetry={() => refetch()}
          emptyMessage="No additional vehicles available right now."
        />
      </div>
    </section>
  );
}
