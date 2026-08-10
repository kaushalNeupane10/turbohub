"use client";

import { useTopRentedVehicles } from "@/hook/user/vehicle/useTopRentedVehicles";
import VehicleGrid from "@/components/user/vehicle/VehicleGrid";
import SectionHeading from "./SectionHeading";

/**
 * Homepage section showcasing the algorithm-ranked "Top Rented This Week"
 * vehicles. Renders ranked cards (#1, #2, …). Hidden entirely when there is
 * no data and no in-flight/error state, so an empty catalogue doesn't leave a
 * bare section on the marketing page.
 */
export default function TopRentedSection() {
  const { data, isLoading, isError, refetch } = useTopRentedVehicles();

  // Nothing to show and nothing happening → don't render the section at all.
  if (!isLoading && !isError && (!data || data.length === 0)) {
    return null;
  }

  return (
    <section
      id="top-rented"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-10 h-72 w-72 rounded-full bg-brand/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Trending This Week"
          title="Top Rented Rides"
          description="The most in-demand vehicles right now, ranked by real bookings, ratings and recent activity."
          actionHref="/vehicles"
          actionLabel="Browse all"
        />

        <VehicleGrid
          vehicles={data}
          isLoading={isLoading}
          isError={isError}
          ranked
          skeletonCount={4}
          priorityCount={4}
          onRetry={() => refetch()}
          emptyMessage="No trending vehicles yet — check back soon."
        />
      </div>
    </section>
  );
}
