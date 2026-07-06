import { useState, useCallback } from "react";
import {
  getFolders,
  createFolder,
  deleteFolder,
  renameFolder,
} from "@/lib/services/mediaService";
import {
  MediaFolder,
  CreateFolderPayload,
  FolderListParams,
} from "@/types/mediaManager/media";

export function useMediaFolders(params?: FolderListParams) {
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFolders = useCallback(
    async (overrideParams?: FolderListParams) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getFolders(overrideParams ?? params);
        setFolders(data.results);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to load folders";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [params],
  );

  const addFolder = useCallback(
    async (payload: CreateFolderPayload): Promise<MediaFolder | null> => {
      try {
        const folder = await createFolder(payload);
        setFolders((prev) => [...prev, folder]);
        return folder;
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to create folder";
        setError(msg);
        return null;
      }
    },
    [],
  );

  const removeFolder = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteFolder(id);
      setFolders((prev) => prev.filter((f) => f.id !== id));
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete folder";
      setError(msg);
      return false;
    }
  }, []);

  const updateFolderName = useCallback(
    async (id: string, name: string): Promise<boolean> => {
      try {
        const updated = await renameFolder(id, name);
        setFolders((prev) => prev.map((f) => (f.id === id ? updated : f)));
        return true;
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to rename folder";
        setError(msg);
        return false;
      }
    },
    [],
  );

  return {
    folders,
    loading,
    error,
    fetchFolders,
    addFolder,
    removeFolder,
    updateFolderName,
  };
}
