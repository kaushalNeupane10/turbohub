"use client";

import React from "react";
import { Edit, Trash2, MapPin, CarFront, Loader2 } from "lucide-react";
import { VehicleApiResponse } from "@/types/vehicle.types";

interface VehicleTableProps {
  vehicles: VehicleApiResponse[];
  loading?: {
    deleteId: number | null;
  };
  onEdit: (vehicle: VehicleApiResponse) => void;
  onDelete: (id: number) => void;
}

export default function VehicleTable({
  vehicles,
  loading,
  onEdit,
  onDelete,
}: VehicleTableProps) {
  // Gracefully handles image rendering or shows a modern fallback
  const renderVehicleImage = (vehicle: VehicleApiResponse) => {
    const imageUrl = vehicle.image_id;
    const hasImage =
      imageUrl && (imageUrl.startsWith("http") || imageUrl.startsWith("/"));

    if (hasImage) {
      return (
        <img
          src={imageUrl}
          alt={vehicle.name}
          className="h-12 w-16 rounded-lg object-cover border border-border-subtle shadow-sm transition-transform duration-200 group-hover:scale-105"
        />
      );
    }

    return (
      <div className="flex h-12 w-16 items-center justify-center rounded-lg border border-border-subtle bg-bg-sunken text-text-muted shadow-sm transition-transform duration-200 group-hover:scale-105">
        <CarFront size={22} className="stroke-[1.5]" />
      </div>
    );
  };

  // Helper to render vehicle type badges nicely
  const getCategoryStyles = (category: string) => {
    const base = "inline-flex items-center rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-wider ";
    switch (category?.toLowerCase()) {
      case "electric":
        return base + "bg-brand/10 text-brand border border-brand/20";
      case "suv":
        return base + "bg-accent/10 text-accent border border-accent/20";
      case "car":
        return base + "bg-info-light/10 text-info border border-info-light/20";
      case "bike":
      case "dirt-bike":
        return base + "bg-warning-light/10 text-warning border border-warning-light/20";
      default:
        return base + "bg-neutral-500/10 text-text-muted border border-border-subtle";
    }
  };

  // Helper to render vehicle status badges
  const getStatusStyles = (status: string) => {
    const isAvailable = status?.toLowerCase() === "available";
    return isAvailable
      ? "inline-flex items-center gap-1.5 rounded-full bg-success-light/10 px-2.5 py-1 text-xs font-medium text-success border border-success-light/20"
      : "inline-flex items-center gap-1.5 rounded-full bg-neutral-500/10 px-2.5 py-1 text-xs font-medium text-text-muted border border-border-subtle";
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[800px] border-collapse text-left text-sm text-text-body">
        <thead>
          <tr className="border-b border-border-subtle bg-bg-sunken text-xs font-bold uppercase tracking-wider text-text-muted">
            <th className="px-6 py-4">Vehicle</th>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4">Price Per Day</th>
            <th className="px-6 py-4">Location</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border-subtle">
          {vehicles.map((vehicle) => {
            const isDeleting = loading?.deleteId === vehicle.id;

            return (
              <tr
                key={vehicle.id}
                className="group border-b border-border-subtle hover:bg-bg-elevated transition-colors duration-150"
              >
                {/* Vehicle Details (with badge/tagline/image) */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {renderVehicleImage(vehicle)}
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-heading group-hover:text-brand transition-colors truncate">
                          {vehicle.name}
                        </span>
                        {vehicle.badge && (
                          <span className="inline-flex rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-foreground shadow-sm">
                            {vehicle.badge}
                          </span>
                        )}
                      </div>
                      {vehicle.tagline && (
                        <span className="text-xs text-text-muted mt-0.5 line-clamp-1">
                          {vehicle.tagline}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category Type */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getCategoryStyles(vehicle.vehicle_type)}>
                    {vehicle.vehicle_type}
                  </span>
                </td>

                {/* Price per Day */}
                <td className="px-6 py-4 font-semibold text-text-heading whitespace-nowrap">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(Number(vehicle.price_per_day))}
                </td>

                {/* Location */}
                <td className="px-6 py-4 text-text-muted whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-text-muted/65" />
                    <span>{vehicle.location}</span>
                  </div>
                </td>

                {/* Status Indicator */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusStyles(vehicle.status)}>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        vehicle.status?.toLowerCase() === "available"
                          ? "bg-success"
                          : "bg-text-muted"
                      }`}
                    />
                    {vehicle.status}
                  </span>
                </td>

                {/* Actions (Edit / Delete) */}
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => onEdit(vehicle)}
                      disabled={isDeleting}
                      aria-label="Edit vehicle"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-body transition-colors hover:bg-bg-sunken disabled:opacity-50"
                    >
                      <Edit size={16} />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${vehicle.name}"?`)) {
                          onDelete(vehicle.id);
                        }
                      }}
                      disabled={isDeleting}
                      aria-label="Delete vehicle"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-error-light/20 text-error transition-colors hover:bg-error-light/10 disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
