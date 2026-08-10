"use client";

import { useFeaturedVehicles } from "@/hook/user/vehicle/useFeaturedVehicles";
import VehicleGrid from "@/components/user/vehicle/VehicleGrid";
import SectionHeading from "./SectionHeading";

/**
 * Homepage section showcasing the manually curated "Featured Fleet"
 * (is_featured=True). Sits on an elevated background band to contrast with the
 * Top Rented section above it. Hidden when the catalogue has no featured
 * vehicles and nothing is loading/erroring.
 */
export default function FeaturedVehiclesSection() {
  const { data, isLoading, isError, refetch } = useFeaturedVehicles();

  if (!isLoading && !isError && (!data || data.length === 0)) {
    return null;
  }

  return (
    <section
      id="featured"
      className="border-y border-border/30 bg-bg-elevated py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Handpicked For You"
          title="Featured Fleet"
          description="A curated selection of our finest rides — premium, inspected and ready for your next journey."
          actionHref="/vehicles"
          actionLabel="Browse all"
        />

        <VehicleGrid
          vehicles={data}
          isLoading={isLoading}
          isError={isError}
          skeletonCount={4}
          onRetry={() => refetch()}
          emptyMessage="No featured vehicles yet — check back soon."
        />
      </div>
    </section>
  );
}
