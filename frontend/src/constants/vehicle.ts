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
    value: "Dirt-Bike",
  },
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
