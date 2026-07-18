"use client";

import { useEffect, useState } from "react";
import { SelectedMedia } from "@/types/mediaManager/media";
import { VehicleApiResponse, VehicleFormData } from "@/types/vehicle.types";
import { useVehicleMutation } from "./useVehicleMutation";

interface UseVehicleFormProps {
  mode: "create" | "edit";
  vehicle?: VehicleApiResponse | null;
  initialValues: VehicleFormData;
  onClose: () => void;
}

type FormErrors = Partial<Record<keyof VehicleFormData, string>>;

export function useVehicleForm({
  mode,
  vehicle,
  initialValues,
  onClose,
}: UseVehicleFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>(initialValues);

  const [errors, setErrors] = useState<FormErrors>({});

  const mutation = useVehicleMutation({
    mode,
    id: vehicle?.id,
  });

  /*
  Populate form when switching
  create <-> edit
  */

  useEffect(() => {
    if (!vehicle) {
      setFormData(initialValues);
      return;
    }

    setFormData({
      name: vehicle.name,
      description: vehicle.description,
      vehicle_type: vehicle.vehicle_type,
      status: vehicle.status,
      badge: vehicle.badge,
      tagline: vehicle.tagline,
      images: vehicle.images,
      location: vehicle.location,
      price_per_day: String(vehicle.price_per_day),
    });
  }, [vehicle]);

  /*
  Handle field changes
  */

  const handleChange = (field: keyof VehicleFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  // handle image change
  const handleImagesChange = (images: SelectedMedia[]) => {
    setFormData((prev) => ({ ...prev, images }));
  };

  /*
  Validation
  */

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Vehicle name is required.";

    if (!formData.vehicle_type)
      newErrors.vehicle_type = "Vehicle type is required.";

    if (!formData.status) newErrors.status = "Status is required.";

    if (!formData.location.trim()) newErrors.location = "Location is required.";

    if (!formData.price_per_day) newErrors.price_per_day = "Price is required.";

    if (!formData.description.trim())
      newErrors.description = "Description is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /*
  Submit
  */

  const handleSubmit = async () => {
    if (!validate()) return;

    await mutation.mutateAsync(formData);

    onClose();
  };

  return {
    formData,
    errors,
    loading: mutation.isPending,
    handleChange,
    handleSubmit,
    handleImagesChange,
  };
}
