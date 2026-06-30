export type VehicleCategory = "car" | "bike" | "dirt-bike" | "suv" | "electric";

export interface VehicleFeature {
  icon: string;
  label: string;
}

export interface Vehicle {
  id: string;
  name: string;
  description: string;
  image: string;
  category: VehicleCategory;
  badge: string;
  tagline: string;
  rating: number;
  reviews: number;
  pricePerDay: number;
  available: boolean;
  features: VehicleFeature[];
}

export interface VehicleFormData {
  name: string;
  description: string;
  vehicle_type: VehicleCategory[];
  badge: string;
  tagline: string;
  image_id: string;
  price_per_day: string;
  location: string;
  status: "available" | "unavailable" | "maintenance";
  features: VehicleFeature[];
}
