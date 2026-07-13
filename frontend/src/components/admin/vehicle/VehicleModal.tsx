"use client";

import Modal from "@/components/ui/modal";
import { VehicleApiResponse, VehicleFormData } from "@/types/vehicle.types";
import VehicleForm from "./VehicleForm";
import Button from "@/components/ui/formFields/Button";

interface VehicleModalProps {
  open: boolean;
  mode: "create" | "edit";
  loading: boolean;
  initialValues: VehicleFormData;
  onClose: () => void;
  onSubmit: (values: VehicleFormData) => Promise<void>;
}

export default function VehicleModal({
  open,
  mode,
  vehicle,
  loading,
  initialValues,
  onClose,
  onSubmit,
}: VehicleModalProps) {
  // handle change for fields
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
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <Modal.Header>
        {mode === "create" ? "Add Vehicle" : "Edit Vehicle"}
      </Modal.Header>

      <Modal.Body>
        <VehicleForm
          formData={formData}
          onChange={handleChange}
          errors={errors}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button loading={loading} onClick={handleSubmit}>
          {mode === "create" ? "Create Vehicle" : "Update Vehicle"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
