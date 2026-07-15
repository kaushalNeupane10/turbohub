"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "@/hook/common/useDebounce";
import { ApiError } from "@/lib/api/apiClient";
import { VehicleFormData, VehicleApiResponse } from "@/types/vehicle.types";
import { vehicleService } from "@/lib/services/vehicle.service";
import { initialFormData } from "@/constants/vehicle";
interface LoadingState {
  fetch: boolean;
  create: boolean;
  update: boolean;
  deleteId: number | null;
}

const LIMIT = 10;

export default function useVehicleCrud() {
  const [formData, setFormData] = useState(initialFormData);
  const [data, setData] = useState<VehicleApiResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState<LoadingState>({
    fetch: false,
    create: false,
    update: false,
    deleteId: null,
  });

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage < 1 || newPage > totalPages) return;

      setPage(newPage);
    },
    [totalPages],
  );

  // get error message
  function getErrorMessage(error: unknown) {
    const err = error as ApiError;
    return err.message;
  }

  // get vehicles
  const fetchVehicles = useCallback(async () => {
    try {
      setLoading((prev) => ({
        ...prev,
        fetch: true,
      }));

      const response = await vehicleService.getVehicles({
        page,
        limit: LIMIT,
        search: debouncedSearch || undefined,
      });
      setData(response.results ?? []);
      setCount(response.count);
      setTotalPages(response.total_pages);
      return response.results ?? [];
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    } finally {
      setLoading((prev) => ({
        ...prev,
        fetch: false,
      }));
    }
  }, [page, debouncedSearch]);

  // useEffect(() => {
  //   setPage(1);
  // }, [debouncedSearch]);

  // useEffect(() => {
  //   fetchVehicles();
  // }, [fetchVehicles]);

  // create vehicles
  const createVehicle = async () => {
    try {
      setLoading((prev) => ({
        ...prev,
        create: true,
      }));

      await vehicleService.createVehicle(formData);
      resetForm();
      await fetchVehicles();
      toast.success("Vehicle created successfully");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    } finally {
      setLoading((prev) => ({
        ...prev,
        create: false,
      }));
    }
  };

  // update vehicle
  const updateVehicle = async (id: number) => {
    try {
      setLoading((prev) => ({
        ...prev,
        update: true,
      }));

      await vehicleService.updateVehicle(id, formData);
      resetForm();
      await fetchVehicles();
      toast.success("Vehicle updated successfully");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    } finally {
      setLoading((prev) => ({
        ...prev,
        update: false,
      }));
    }
  };

  // delete vehicle
  const deleteVehicle = async (id: number) => {
    try {
      setLoading((prev) => ({
        ...prev,
        deleteId: id,
      }));

      await vehicleService.deleteVehicle(id);
      if (data.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await fetchVehicles();
      }
      toast.success("Vehicle deleted successfully");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
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
    createVehicle,
    updateVehicle,
    deleteVehicle,
  };
}
