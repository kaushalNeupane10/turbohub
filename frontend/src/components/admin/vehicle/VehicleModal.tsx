"use client";

import Modal from "@/components/ui/modal";
import Button from "@/components/ui/formFields/Button";

import VehicleForm from "./VehicleForm";
import { useVehicleForm } from "@/hook/admin/vehicle/useVehicleForm";

import { VehicleApiResponse, VehicleFormData } from "@/types/vehicle.types";

interface VehicleModalProps {
  open: boolean;
  mode: "create" | "edit";
  vehicle?: VehicleApiResponse | null;
  initialValues: VehicleFormData;
  onClose: () => void;
}

export default function VehicleModal({
  open,
  mode,
  vehicle,
  initialValues,
  onClose,
}: VehicleModalProps) {
  const {
    formData,
    errors,
    loading,
    handleChange,
    handleImagesChange,
    handleSubmit,
  } = useVehicleForm({
    mode,
    vehicle,
    initialValues,
    onClose,
  });

  // handle image change

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <Modal.Header>
        {mode === "create" ? "Add Vehicle" : "Edit Vehicle"}
      </Modal.Header>

      <Modal.Body>
        <VehicleForm
          formData={formData}
          errors={errors}
          onChange={handleChange}
          onImagesChange={handleImagesChange}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>

        <Button loading={loading} onClick={handleSubmit}>
          {mode === "create" ? "Create Vehicle" : "Update Vehicle"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
