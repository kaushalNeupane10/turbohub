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

/**
 * Derive form values from a vehicle API response (for edit mode).
 */
function vehicleToFormData(vehicle: VehicleApiResponse): VehicleFormData {
  return {
    name: vehicle.name ?? "",
    description: vehicle.description ?? "",
    vehicle_type: vehicle.vehicle_type ?? "",
    status: vehicle.status ?? "",
    badge: vehicle.badge ?? "",
    tagline: vehicle.tagline ?? "",
    // images is already SelectedMedia[] in the API response
    images: Array.isArray(vehicle.images) ? vehicle.images : [],
    location: vehicle.location ?? "",
    price_per_day: String(vehicle.price_per_day ?? ""),
  };
}

export function useVehicleForm({
  mode,
  vehicle,
  initialValues,
  onClose,
}: UseVehicleFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>(
    mode === "edit" && vehicle ? vehicleToFormData(vehicle) : initialValues,
  );

  const [errors, setErrors] = useState<FormErrors>({});

  const mutation = useVehicleMutation({
    mode,
    id: vehicle?.id,
  });

  /**
   * Sync form data whenever the modal opens in a different mode / for a different vehicle.
   * This is the fix for "edit data not loading" and "images not shown in edit".
   */
  useEffect(() => {
    if (mode === "edit" && vehicle) {
      setFormData(vehicleToFormData(vehicle));
    } else {
      setFormData(initialValues);
    }
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, vehicle?.id]);

  /* ------------------------------------------------------------------
   * Field change handlers
   * ------------------------------------------------------------------ */

  const handleChange = (
    field: keyof Omit<VehicleFormData, "images">,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleImagesChange = (images: SelectedMedia[]) => {
    setFormData((prev) => ({ ...prev, images }));
    setErrors((prev) => ({ ...prev, images: undefined }));
  };

  /* ------------------------------------------------------------------
   * Reset — called explicitly when closing modal without submitting
   * ------------------------------------------------------------------ */
  const resetForm = () => {
    setFormData(initialValues);
    setErrors({});
  };

  /* ------------------------------------------------------------------
   * Validation
   * ------------------------------------------------------------------ */

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Vehicle name is required.";
    if (!formData.vehicle_type)
      newErrors.vehicle_type = "Vehicle type is required.";
    if (!formData.status) newErrors.status = "Status is required.";
    if (!formData.location.trim())
      newErrors.location = "Location is required.";
    if (!formData.price_per_day)
      newErrors.price_per_day = "Price is required.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ------------------------------------------------------------------
   * Submit
   * ------------------------------------------------------------------ */

  const handleSubmit = async () => {
    if (!validate()) return;

    await mutation.mutateAsync(formData);

    // Reset form state BEFORE closing so re-opening in create mode is fresh
    resetForm();
    onClose();
  };

  return {
    formData,
    errors,
    loading: mutation.isPending,
    handleChange,
    handleSubmit,
    handleImagesChange,
    resetForm,
  };
}
