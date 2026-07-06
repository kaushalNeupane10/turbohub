import { useState, useCallback } from "react";
import {
  getMediaFiles,
  uploadMediaFile,
  deleteMediaFile,
} from "@/lib/services/mediaService";
import {
  MediaFile,
  MediaListParams,
  MediaUploadPayload,
} from "@/types/mediaManager/media";

export interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  error: string | null;
}

export function useMediaFiles(params?: MediaListParams) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);

  const fetchFiles = useCallback(
    async (overrideParams?: MediaListParams) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMediaFiles(overrideParams ?? params);
        setFiles(data.results);
        setCount(data.count);
        setNext(data.next);
        setPrevious(data.previous);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load media";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [params],
  );

  const uploadFiles = useCallback(
    async (payload: Omit<MediaUploadPayload, "file"> & { files: File[] }) => {
      const { files: rawFiles, ...rest } = payload;

      // Register each file in the uploading queue
      const entries: UploadingFile[] = rawFiles.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        progress: 0,
        error: null,
      }));
      setUploading((prev) => [...prev, ...entries]);

      const results = await Promise.allSettled(
        entries.map((entry) =>
          uploadMediaFile({ ...rest, file: entry.file }, (percent) => {
            setUploading((prev) =>
              prev.map((u) =>
                u.id === entry.id ? { ...u, progress: percent } : u,
              ),
            );
          })
            .then((media) => {
              setFiles((prev) => [media, ...prev]);
              setUploading((prev) => prev.filter((u) => u.id !== entry.id));
              return media;
            })
            .catch((err: unknown) => {
              const msg = err instanceof Error ? err.message : "Upload failed";
              setUploading((prev) =>
                prev.map((u) => (u.id === entry.id ? { ...u, error: msg } : u)),
              );
              throw err;
            }),
        ),
      );

      return results;
    },
    [],
  );

  const removeFile = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteMediaFile(id);
      setFiles((prev) => prev.filter((f) => f.id !== id));
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete file";
      setError(msg);
      return false;
    }
  }, []);

  const clearUploadError = useCallback((id: string) => {
    setUploading((prev) => prev.filter((u) => u.id !== id));
  }, []);

  return {
    files,
    loading,
    error,
    uploading,
    fetchFiles,
    uploadFiles,
    removeFile,
    clearUploadError,
    count,
    next,
    previous,
  };
}
