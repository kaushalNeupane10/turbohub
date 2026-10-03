import { PublicVehicleListParams, VehicleListParams } from "@/types/vehicle.types";

/**
 * Centralised query key factory for TanStack Query.
 *
 * Namespacing:
 *   vehicles.*       — private admin vehicle queries (requires auth)
 *   publicVehicles.* — public vehicle showcase queries (no auth required)
 *   bookings.*       — user booking queries (requires auth)
 *
 * Pattern: coarse → specific, so you can invalidate whole namespaces easily:
 *   queryClient.invalidateQueries({ queryKey: queryKeys.publicVehicles.all })
 */
export const queryKeys = {
  // ─── Private admin vehicle queries ──────────────────────────────────────
  vehicles: {
    all: ["vehicles"] as const,
    list: (params?: VehicleListParams) =>
      ["vehicles", "list", params] as const,
    detail: (id: string | number) => ["vehicles", "detail", id] as const,
  },

  // ─── Public vehicle showcase queries ────────────────────────────────────
  publicVehicles: {
    all: ["publicVehicles"] as const,
    list: (params?: PublicVehicleListParams) =>
      ["publicVehicles", "list", params] as const,
    detail: (id: string | number) =>
      ["publicVehicles", "detail", id] as const,
    featured: ["publicVehicles", "featured"] as const,
    topRented: ["publicVehicles", "top-rented"] as const,
  },

  // ─── Booking queries ─────────────────────────────────────────────────────
  bookings: {
    all: ["bookings"] as const,
    list: ["bookings", "list"] as const,
    detail: (id: string | number) => ["bookings", "detail", id] as const,
    /** Unauthenticated public tracking query key. */
    track: (id: string | number) => ["bookings", "track", String(id)] as const,
    /** Bookings on vehicles owned by the current user (admin dashboard). */
    ownerAll: ["bookings", "owner"] as const,
    owner: (params?: { page?: number; page_size?: number; status?: string; vehicle_type?: string; search?: string }) =>
      ["bookings", "owner", params] as const,
  },
} as const;
