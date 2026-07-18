"use client";
import Input from "@/components/ui/formFields/Input";
import Select from "@/components/ui/formFields/Select";
import Textarea from "@/components/ui/formFields/Textarea";
import VehicleImagePicker from "./VehicleImagePicker";
import { VehicleFormData } from "@/types/vehicle.types";
import { SelectedMedia } from "@/types/mediaManager/media";
import { STATUS_OPTIONS, VEHICLE_TYPES } from "@/constants/vehicle";

interface VehicleFormProps {
  formData: VehicleFormData;
  onChange: (
    field: keyof Omit<VehicleFormData, "images">,
    value: string,
  ) => void;
  onImagesChange: (images: SelectedMedia[]) => void;
  errors?: Partial<Record<keyof VehicleFormData, string>>;
}

export default function VehicleForm({
  formData,
  onChange,
  onImagesChange,
  errors,
}: VehicleFormProps) {
  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          required
          label="Vehicle Name"
          value={formData.name}
          onChange={(e) => onChange("name", e.target.value)}
          error={errors?.name}
        />
        <Input
          required
          label="Price Per Day"
          type="number"
          value={formData.price_per_day}
          onChange={(e) => onChange("price_per_day", e.target.value)}
          error={errors?.price_per_day}
        />
        <Select
          required
          label="Vehicle Type"
          value={formData.vehicle_type}
          options={VEHICLE_TYPES}
          onChange={(value) => onChange("vehicle_type", value)}
          error={errors?.vehicle_type}
        />
        <Select
          required
          label="Status"
          value={formData.status}
          options={STATUS_OPTIONS}
          onChange={(value) => onChange("status", value)}
          error={errors?.status}
        />
        <Input
          label="Badge"
          value={formData.badge}
          onChange={(e) => onChange("badge", e.target.value)}
          error={errors?.badge}
        />
        <Input
          label="Tagline"
          value={formData.tagline}
          onChange={(e) => onChange("tagline", e.target.value)}
          error={errors?.tagline}
        />
        <Input
          required
          label="Location"
          value={formData.location}
          onChange={(e) => onChange("location", e.target.value)}
          error={errors?.location}
        />
      </div>

      <VehicleImagePicker
        images={formData.images}
        onChange={onImagesChange}
        error={errors?.images}
      />

      <div>
        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => onChange("description", e.target.value)}
          required
          rows={5}
          placeholder="Write vehicle description..."
          error={errors?.description}
        />
      </div>
    </form>
  );
}
