"use client";

import { useState } from "react";

import BrowseToolbar from "@/components/user/vehicle/BrowseToolbar";
import VehicleGrid from "@/components/user/vehicle/VehicleGrid";
import Pagination from "@/components/ui/common/Pagination";

import { usePublicVehicles } from "@/hook/user/vehicle/usePublicVehicles";
import { useDebounce } from "@/hook/common/useDebounce";

import { VEHICLE_TYPES, VEHICLE_SORT_OPTIONS } from "@/constants/vehicle";
import { VehicleCategory } from "@/types/vehicle.types";

const PAGE_SIZE = 12;
const DEFAULT_SORT = "-created_at";

export default function BrowseVehiclesPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState(DEFAULT_SORT);

  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data, isLoading, isError, isFetching, refetch } = usePublicVehicles({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    vehicle_type: (category as VehicleCategory) || undefined,
    ordering: sort || undefined,
  });

  const vehicles = data?.results ?? [];
  const hasFilters =
    Boolean(searchQuery) || Boolean(category) || sort !== DEFAULT_SORT;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSort(value || DEFAULT_SORT);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategory("");
    setSort(DEFAULT_SORT);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll back to the top of the list on page change.
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-bg-page">
      {/* Page header band */}
      <section className="border-b border-border/40 bg-bg-elevated">
        <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <span className="inline-block text-xs font-extrabold uppercase tracking-[0.3em] text-brand">
            The Full Fleet
          </span>
          <h1 className="mt-3 text-balance text-3xl font-black tracking-tight text-text-heading sm:text-4xl lg:text-5xl">
            Browse Vehicles
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-text-muted sm:text-lg">
            Explore our complete range of premium cars, bikes, EVs, SUVs and
            scooters. Filter by category, sort by price or rating, and book in
            minutes.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8">
          <BrowseToolbar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            category={category}
            onCategoryChange={handleCategoryChange}
            sort={sort}
            onSortChange={handleSortChange}
            categoryOptions={VEHICLE_TYPES}
            sortOptions={VEHICLE_SORT_OPTIONS}
            hasFilters={hasFilters}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Result count */}
        {!isLoading && !isError && data && (
          <p className="mb-6 text-sm text-text-muted">
            {data.count > 0 ? (
              <>
                Showing{" "}
                <span className="font-semibold text-text-body">
                  {vehicles.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-text-body">
                  {data.count}
                </span>{" "}
                {data.count === 1 ? "vehicle" : "vehicles"}
              </>
            ) : (
              "No vehicles match your filters"
            )}
          </p>
        )}

        <div
          className={
            isFetching && !isLoading ? "opacity-60 transition-opacity" : ""
          }
        >
          <VehicleGrid
            vehicles={vehicles}
            isLoading={isLoading}
            isError={isError}
            skeletonCount={PAGE_SIZE}
            onRetry={() => refetch()}
            emptyMessage={
              hasFilters
                ? "No vehicles match your filters. Try adjusting your search."
                : "No vehicles are available right now. Please check back soon."
            }
          />
        </div>

        {/* Pagination */}
        {!isLoading && !isError && data && data.total_pages > 1 && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-border/60 bg-bg-surface">
            <Pagination
              pagination={{
                page: data.page,
                pageSize: data.page_size,
                count: data.count,
                totalPages: data.total_pages,
              }}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </section>
    </div>
  );
}
