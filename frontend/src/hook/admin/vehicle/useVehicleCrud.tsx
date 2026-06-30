"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "@/hook/common/useDebounce";
import { apiClient } from "@/lib/api/apiClient";
import { VehicleFormData } from "@/types/vehicle.types";

interface LoadingState {
  fetch: boolean;
  fetchOne: boolean;
  create: boolean;
  update: boolean;
  deleteId: number | null;
}

interface PaginationResponse {
  count: number;
  total_pages: number;
}

interface VehicleResponse {
  id: number;
  name: string;
  description: string;
  vehicle_type: "car" | "bike";
  badge: string;
  tagline: string;
  image_id: string;
  price_per_day: string;
  location: string;
  status: string;
  features: {
    id: number;
    icon: string;
    label: string;
  }[];
}

const LIMIT = 10;

export default function useVehicleCrud() {
  const initialFormData: VehicleFormData = {
    name: "",
    description: "",
    vehicle_type: [],
    badge: "",
    tagline: "",
    image_id: "",
    price_per_day: "",
    location: "",
    status: "available",
    features: [],
  };

  const [formData, setFormData] = useState<VehicleFormData>(initialFormData);
  const [data, setData] = useState<VehicleResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState<LoadingState>({
    fetch: false,
    fetchOne: false,
    create: false,
    update: false,
    deleteId: null,
  });

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage < 1 || newPage > totalPages) return;

      setPage(newPage);
    },
    [totalPages],
  );

  const buildPayload = useCallback(() => {
    return {
      name: formData.name,
      description: formData.description,
      vehicle_type: formData.vehicle_type,
      badge: formData.badge,
      tagline: formData.tagline,
      image_id: formData.image_id,
      price_per_day: formData.price_per_day,
      location: formData.location,
      status: formData.status,
      features: formData.features,
    };
  }, [formData]);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading((prev) => ({
        ...prev,
        fetch: true,
      }));

      const response = await apiClient.get("/dashboard/vehicles/", {
        params: {
          page,
          limit: LIMIT,
          search: debouncedSearch || undefined,
        },
      });

      setData(response.data.results ?? []);

      const pagination = response.data.pagination as PaginationResponse;

      setTotalPages(pagination?.total_pages ?? 1);

      setCount(pagination?.count ?? 0);

      return response.data.results ?? [];
    } catch (error) {
      toast.error("Failed to load vehicles");

      return [];
    } finally {
      setLoading((prev) => ({
        ...prev,
        fetch: false,
      }));
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const fetchVehicleById = useCallback(async (id: number) => {
    try {
      setLoading((prev) => ({
        ...prev,
        fetchOne: true,
      }));

      const response = await apiClient.get(`/dashboard/vehicles/${id}/`);

      const vehicle = response.data;

      setFormData({
        name: vehicle.name ?? "",

        description: vehicle.description ?? "",

        vehicle_type: vehicle.vehicle_type ?? "car",

        badge: vehicle.badge ?? "",

        tagline: vehicle.tagline ?? "",

        image_id: vehicle.image_id ?? "",

        price_per_day: vehicle.price_per_day ?? "",

        location: vehicle.location ?? "",

        status: vehicle.status ?? "available",

        features: vehicle.features ?? [],
      });

      return vehicle;
    } catch (error) {
      toast.error("Failed to load vehicle");

      return null;
    } finally {
      setLoading((prev) => ({
        ...prev,
        fetchOne: false,
      }));
    }
  }, []);

  const createVehicle = async () => {
    try {
      setLoading((prev) => ({
        ...prev,
        create: true,
      }));

      await apiClient.post("/dashboard/vehicles/", buildPayload());

      resetForm();

      await fetchVehicles();

      toast.success("Vehicle created successfully");

      return true;
    } catch (error) {
      toast.error("Failed to create vehicle");

      return false;
    } finally {
      setLoading((prev) => ({
        ...prev,
        create: false,
      }));
    }
  };

  const updateVehicle = async (id: number) => {
    try {
      setLoading((prev) => ({
        ...prev,
        update: true,
      }));

      await apiClient.put(
        `/dashboard/vehicles/${id}/`,

        buildPayload(),
      );

      resetForm();

      await fetchVehicles();

      toast.success("Vehicle updated successfully");

      return true;
    } catch (error) {
      toast.error("Failed to update vehicle");

      return false;
    } finally {
      setLoading((prev) => ({
        ...prev,
        update: false,
      }));
    }
  };

  const deleteVehicle = async (id: number) => {
    try {
      setLoading((prev) => ({
        ...prev,
        deleteId: id,
      }));

      await apiClient.delete(`/dashboard/vehicles/${id}/`);

      if (data.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await fetchVehicles();
      }

      toast.success("Vehicle deleted successfully");

      return true;
    } catch (error) {
      toast.error("Failed to delete vehicle");

      return false;
    } finally {
      setLoading((prev) => ({
        ...prev,
        deleteId: null,
      }));
    }
  };

  return {
    formData,
    setFormData,

    initialFormData,
    resetForm,

    data,

    searchQuery,
    setSearchQuery,

    loading,

    page,
    totalPages,
    count,

    handlePageChange,

    fetchVehicles,
    fetchVehicleById,

    createVehicle,
    updateVehicle,
    deleteVehicle,
  };
}
