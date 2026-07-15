export type VehicleCategory = "car" | "bike" | "dirt-bike" | "suv" | "electric";

export interface VehicleListParams {
  page?: number;
  limit?: number;
  search?: string;
}
export interface VehicleApiResponse {
  id: number;
  name: string;
  description: string;
  vehicle_type: VehicleCategory;
  badge: string;
  tagline: string;
  image_id: string;
  price_per_day: string;
  location: string;
  status: string;
}

export interface VehicleFormData {
  name: string;
  description: string;
  vehicle_type: VehicleCategory | "";
  badge: string;
  tagline: string;
  image_id: string;
  price_per_day: string;
  location: string;
  status: string;
}
