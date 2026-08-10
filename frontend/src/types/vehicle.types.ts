import { SelectedMedia } from "./mediaManager/media";

// ─── Vehicle Categories ───────────────────────────────────────────────────────
// Single source of truth — import from here, not from vehicle_card.types.ts
export type VehicleCategory =
  | "car"
  | "bike"
  | "dirt-bike"
  | "suv"
  | "electric"
  | "scooter";

// ─── Admin API types (private, requires auth) ────────────────────────────────

export interface VehicleListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  vehicle_type?: VehicleCategory | "";
}

/** Shape returned by the private admin vehicle API (includes write fields) */
export interface VehicleApiResponse {
  id: number;
  name: string;
  description: string;
  vehicle_type: VehicleCategory;
  badge: string;
  tagline: string;
  images: SelectedMedia[];
  price_per_day: string;
  location: string;
  status: string;
  rating: string;
  review_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface VehicleFormData {
  name: string;
  description: string;
  vehicle_type: VehicleCategory | "";
  badge: string;
  tagline: string;
  images: SelectedMedia[];
  price_per_day: string;
  location: string;
  status: string;
}

// ─── Public API types (no auth required) ────────────────────────────────────

export interface PublicVehicleImage {
  id: string;
  url: string;
  order: number;
  is_cover: boolean;
}

/** Shape returned by the public vehicle API (read-only, no owner info) */
export interface PublicVehicleApiResponse {
  id: number;
  name: string;
  description: string;
  vehicle_type: VehicleCategory;
  badge: string;
  tagline: string;
  price_per_day: string;
  location: string;
  status: "available" | "unavailable" | "maintenance";
  rating: string;
  review_count: number;
  is_featured: boolean;
  images: PublicVehicleImage[];
  /** Only populated by the top-rented endpoint */
  booking_count_this_week: number | null;
  created_at: string;
}

export interface PublicVehicleListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  vehicle_type?: VehicleCategory | "";
  location?: string;
  ordering?: string;
}
