import { SelectOption } from "@/types/common/select";
import { VehicleFormData } from "@/types/vehicle.types";

export const STATUS_OPTIONS: SelectOption[] = [
  {
    label: "Available",
    value: "available",
  },
  {
    label: "Unavailable",
    value: "unavailable",
  },
  {
    label: "Maintenance",
    value: "maintenance",
  },
];

export const VEHICLE_TYPES: SelectOption[] = [
  {
    label: "Car",
    value: "car",
  },
  {
    label: "Bike",
    value: "bike",
  },
  {
    label: "Scooter",
    value: "scooter",
  },
  {
    label: "Suv",
    value: "suv",
  },
  {
    label: "Electric",
    value: "electric",
  },
  {
    label: "Dirt-Bike",
    value: "dirt-bike",
  },
];

// ─── Public browse page sort options ──────────────────────────────────────────
// Values map directly to the public API `ordering` query param
// (see PublicVehicleViewSet.ordering_fields).
export const VEHICLE_SORT_OPTIONS: SelectOption[] = [
  { label: "Newest", value: "-created_at" },
  { label: "Price: Low to High", value: "price_per_day" },
  { label: "Price: High to Low", value: "-price_per_day" },
  { label: "Top Rated", value: "-rating" },
  { label: "Most Reviewed", value: "-review_count" },
];

export const initialFormData: VehicleFormData = {
  name: "",
  description: "",
  vehicle_type: "",
  badge: "",
  tagline: "",
  images: [],
  price_per_day: "",
  location: "",
  status: "available",
};
