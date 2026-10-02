// Re-export VehicleCategory from the single source of truth
export type { VehicleCategory } from "./vehicle.types";

export interface VehicleFeature {
  icon: string;
  label: string;
}

/**
 * UI-layer vehicle shape used by VehicleCard.
 * This is the normalised/mapped type, not the raw API response.
 * Use mapPublicVehicleToCard() in vehicle.utils.ts to convert API → this type.
 */
export interface Vehicle {
  id: string;
  name: string;
  description: string;
  image: string;
  /** All gallery image URLs, cover-first. Used by the detail page. */
  images: string[];
  category: import("./vehicle.types").VehicleCategory;
  badge: string;
  tagline: string;
  location: string;
  rating: number;
  reviews: number;
  pricePerDay: number;
  available: boolean;
  isFeatured: boolean;
  bookingCountThisWeek?: number;
  features: VehicleFeature[];
}