"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
// import Pagination from "@/components/ui/common/Pagination";
import TableSkeleton from "@/components/admin/vehicle/TableSkeleton";
import VehicleTable from "@/components/admin/vehicle/VehicleTable";
import useVehicleCrud from "@/hook/admin/vehicle/useVehicleCrud";
// import VehicleToolBar from "@/components/admin/vehicle/VehicleToolBar";
import { SelectOption } from "@/types/common/select";
import EmptyState from "@/components/admin/vehicle/EmptyState";
import { VehicleApiResponse } from "@/types/vehicle.types";

export default function VehicleManagementPage() {
  const {
    searchQuery,
    setSearchQuery,
    loading,
    data,
    page,
    totalPages,
    count,
    handlePageChange,
    // filters,
    // setFilters,
    deleteVehicle,
    // filterOptions,
  } = useVehicleCrud();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] =
    useState<VehicleApiResponse | null>(null);

  // add vehicle
  const handleCreateVehicle = () => {
    setEditingVehicle(null);
    setModalOpen(true);
  };

  // update vehicle
  const handleEditVehicle = (vehicle: VehicleApiResponse) => {
    setEditingVehicle(vehicle);
    setModalOpen(true);
  };
  // close pop up modal
  const handleCloseModal = () => {
    setEditingVehicle(null);
    setModalOpen(false);
  };

  const STATUS_FILTERS: SelectOption[] = [
    {
      label: "Available",
      value: "available",
    },
    {
      label: "Unavailable",
      value: "unavailable",
    },
  ];

  const handleClearFilters = () => {
    setSearchQuery("");

    // setFilters({
    //   status: "",
    //   location: "",
    // });
  };

  const hasFilters =
    // Boolean(filters.status) ||
    // Boolean(filters.location) ||
    Boolean(searchQuery);

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

      {/* Main Table */}
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

        {/* <VehicleToolBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            status={filters.status}
            category={filters.category}
            onStatusChange={...}
            onCategoryChange={...}
            categoryOptions={filterOptions.categories}
            hasFilters={hasFilters}
            onClearFilters={handleClearFilters}
          /> */}

        {/* Loading */}
        {loading.fetch && <TableSkeleton />}

        {/* Empty State */}
        {!loading.fetch && (!data || data.length === 0) && (
          <EmptyState
            onAddVehicle={handleCreateVehicle}
            hasFilters={hasFilters}
            onClearFilters={handleClearFilters}
          />
        )}

        {/* Table */}
        {!loading.fetch && data && data.length > 0 && (
          <VehicleTable
          // vehicles={data}
          // loading={loading}
          // onEdit={handleEditVehicle}
          // onDelete={deleteVehicle}
          />
        )}
      </div>

      {/* Pagination */}

      {/* <Pagination onPageChange={handlePageChange} /> */}
    </section>
  );
}
