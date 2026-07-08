"use client";

import { useRouter } from "next/navigation";
import { Plus, CarFront } from "lucide-react";

import SearchBox from "@/components/common/SearchBox";
import Pagination from "@/components/common/Pagination";
import TableSkeleton from "@/components/admin/vehicle/TableSkeleton";
import Select from "@/components/ui/formFields/Select";
import VehicleTable from "@/components/admin/vehicle/VehicleTable";
import useVehicleCrud from "@/hook/admin/vehicle/useVehicleCrud";

interface FilterOption {
  label: string;
  value: string | boolean;
}

export default function VehicleManagementPage() {
  const router = useRouter();

  const {
    searchQuery,
    setSearchQuery,
    loading,
    data,
    page,
    totalPages,
    count,
    handlePageChange,
    filters,
    setFilters,
    deleteVehicle,
    filterOptions,
  } = useVehicleCrud();

  const STATUS_FILTERS: FilterOption[] = [
    {
      label: "Available",
      value: true,
    },
    {
      label: "Unavailable",
      value: false,
    },
  ];

  const handleClearFilters = () => {
    setSearchQuery("");

    setFilters({
      status: "",
      category: "",
    });
  };

  const hasFilters =
    Boolean(filters.status) ||
    Boolean(filters.category) ||
    Boolean(searchQuery);

  const handleCreateVehicle = () => {
    router.push("/admin/vehicles/create");
  };

  const handleEditVehicle = (id: string) => {
    router.push(`/admin/vehicles/${id}/edit`);
  };

  return (
    <section
      className="
        container-main
        py-8
        md:py-12
        animate-in
        fade-in
        duration-300
      "
    >
      {/* Header */}
      <div className="mb-8 space-y-6">
        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <h1
              className="
                text-2xl
                md:text-3xl
                font-bold
                tracking-tight
                text-text-heading
              "
            >
              Vehicle Management
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-text-muted
                max-w-xl
              "
            >
              Manage TurboHub rental vehicles, availability, categories, and
              vehicle inventory.
            </p>
          </div>

          <button
            onClick={handleCreateVehicle}
            className="
              flex
              items-center
              justify-center
              gap-2

              w-full
              sm:w-auto

              rounded-xl

              bg-brand
              px-5
              py-3

              text-sm
              font-semibold

              text-brand-foreground

              shadow-brand

              transition-all
              duration-200

              hover:bg-brand-dark

              active:scale-[0.98]
            "
          >
            <Plus size={18} />

            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div
        className="
          overflow-hidden

          rounded-3xl

          border
          border-border-subtle

          bg-surface

          shadow-md
        "
      >
        {/* Toolbar */}
        <div
          className="
            border-b
            border-border-subtle

            bg-surface

            p-5
          "
        >
          <div
            className="
              flex
              flex-col

              gap-4

              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            {/* Search */}
            <div
              className="
                w-full
                lg:max-w-md
              "
            >
              <SearchBox
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vehicles..."
              />
            </div>

            {/* Filters */}
            <div
              className="
                flex
                flex-wrap

                gap-3

                items-center

                lg:justify-end
              "
            >
              <Select
                value={filters.status}
                options={STATUS_FILTERS}
                placeholder="All Status"
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,

                    status: value,
                  }))
                }
              />

              <Select
                value={filters.category}
                options={filterOptions.categories}
                placeholder="All Categories"
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,

                    category: value,
                  }))
                }
              />

              {hasFilters && (
                <button
                  onClick={handleClearFilters}
                  className="
                      h-11

                      rounded-xl

                      border

                      border-border

                      px-4

                      text-sm

                      font-medium

                      text-text-body

                      transition

                      hover:bg-bg-elevated
                    "
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading.fetch && <TableSkeleton count={5} />}

        {/* Empty State */}
        {!loading.fetch && (!data || data.length === 0) && (
          <div
            className="
                flex

                min-h-[420px]

                flex-col

                items-center

                justify-center

                bg-surface

                p-8
                text-center
              "
          >
            <div
              className="
                  mb-5
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  bg-brand-subtle/10
                  text-brand
                "
            >
              <CarFront size={32} />
            </div>

            <h2
              className="
                  text-xl
                  font-bold
                  text-text-heading
                "
            >
              No Vehicles Found
            </h2>
            <p
              className="
                  mt-2
                  max-w-md
                  text-sm
                  leading-relaxed
                  text-text-muted
                "
            >
              Your rental vehicles will appear here. Add vehicles or adjust your
              filters to view inventory.
            </p>
          </div>
        )}

        {/* Table */}
        {!loading.fetch && data && data.length > 0 && (
          <VehicleTable
            vehicles={data}
            loading={loading}
            onEdit={handleEditVehicle}
            onDelete={deleteVehicle}
          />
        )}
      </div>

      {/* Pagination */}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={count}
        hasNext={page < totalPages}
        hasPrev={page > 1}
        loading={loading.fetch}
        onPageChange={handlePageChange}
      />
    </section>
  );
}
