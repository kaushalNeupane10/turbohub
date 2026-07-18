"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

import Pagination from "@/components/ui/common/Pagination";
import TableSkeleton from "@/components/admin/vehicle/TableSkeleton";
import VehicleTable from "@/components/admin/vehicle/VehicleTable";
import VehicleToolBar from "@/components/admin/vehicle/VehicleToolBar";
import EmptyState from "@/components/admin/vehicle/EmptyState";
import VehicleModal from "@/components/admin/vehicle/VehicleModal";

import { useFetchVehicles } from "@/hook/admin/vehicle/useFetchVehicle";
import { useDeleteVehicle } from "@/hook/admin/vehicle/useDeleteVehicle";
import { useDebounce } from "@/hook/common/useDebounce";

import { VehicleApiResponse, VehicleCategory } from "@/types/vehicle.types";
import {
  initialFormData,
  STATUS_OPTIONS,
  VEHICLE_TYPES,
} from "@/constants/vehicle";

export default function VehicleManagementPage() {
  // --- States for Filtering & Pagination ---
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 400);

  // --- Modal States ---
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] =
    useState<VehicleApiResponse | null>(null);

  // --- React Query Fetch ---
  const {
    data: response,
    isLoading: isFetchLoading,
    isError,
    error,
  } = useFetchVehicles({
    page,
    limit: 4,
    search: debouncedSearch || undefined,
    status: status || undefined,
    vehicle_type: (category as VehicleCategory) || undefined,
  });

  // --- React Query Mutations ---
  const deleteMutation = useDeleteVehicle();

  // --- Actions ---
  const handleCreateVehicle = () => {
    setEditingVehicle(null);
    setModalOpen(true);
  };

  const handleEditVehicle = (vehicle: VehicleApiResponse) => {
    setEditingVehicle(vehicle);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingVehicle(null);
    setModalOpen(false);
  };

  const handleDeleteVehicle = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Vehicle deleted successfully");

      // Senior Developer touch: if we deleted the last item on the current page, page backward
      if (response && response.results.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete vehicle");
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatus("");
    setCategory("");
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1); // reset to page 1 on new search
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1); // reset to page 1 on filter change
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1); // reset to page 1 on filter change
  };

  const hasFilters =
    Boolean(searchQuery) || Boolean(status) || Boolean(category);
  const vehicles = response?.results || [];

  return (
    <section className="container-main py-8 md:py-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-8 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-heading">
              Vehicle Management
            </h1>

            <p className="mt-2 text-sm text-text-muted max-w-xl">
              Manage TurboHub rental vehicles, availability, categories, and
              vehicle inventory.
            </p>
          </div>

          <button
            onClick={handleCreateVehicle}
            className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground shadow-brand transition-all duration-200 hover:bg-brand-dark active:scale-[0.98]"
          >
            <Plus size={18} />

            <span>Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-3xl border border-border-subtle bg-surface shadow-md">
        {/* Toolbar */}
        <VehicleToolBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          status={status}
          category={category}
          statusOptions={STATUS_OPTIONS}
          categoryOptions={VEHICLE_TYPES}
          onStatusChange={handleStatusChange}
          onCategoryChange={handleCategoryChange}
          hasFilters={hasFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Loading Skeleton */}
        {isFetchLoading && <TableSkeleton />}

        {/* Empty State */}
        {!isFetchLoading && !isError && vehicles.length === 0 && (
          <EmptyState
            onAddVehicle={handleCreateVehicle}
            hasFilters={hasFilters}
            onClearFilters={handleClearFilters}
          />
        )}

        {/* Error State */}
        {isError && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-error font-medium mb-4">
              Error fetching vehicles:{" "}
              {error?.message || "Something went wrong."}
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-brand text-brand-foreground rounded-xl text-sm font-semibold hover:bg-brand-dark transition-colors"
            >
              Reset View
            </button>
          </div>
        )}

        {/* Vehicle Table */}
        {!isFetchLoading && !isError && vehicles.length > 0 && (
          <VehicleTable
            vehicles={vehicles}
            loading={{
              deleteId: deleteMutation.isPending
                ? (deleteMutation.variables as number)
                : null,
            }}
            onEdit={handleEditVehicle}
            onDelete={handleDeleteVehicle}
          />
        )}

        {/* Pagination */}
        {!isFetchLoading &&
          !isError &&
          response &&
          response.total_pages > 1 && (
            <Pagination
              pagination={{
                page: response.page,
                pageSize: response.page_size,
                count: response.count,
                totalPages: response.total_pages,
              }}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
      </div>

      {/* vehicle modal pop up */}
      <VehicleModal
        open={modalOpen}
        mode={editingVehicle ? "edit" : "create"}
        vehicle={editingVehicle}
        initialValues={initialFormData}
        onClose={handleCloseModal}
      />
    </section>
  );
}
