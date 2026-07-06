import { apiClient, buildUrl } from "@/lib/api/apiClient";
import { PaginatedResponse } from "@/types/common/pagination";
import {
  MediaFile,
  MediaFolder,
  MediaUploadPayload,
  CreateFolderPayload,
  MediaListParams,
  FolderListParams,
} from "@/types/mediaManager/media";

// folder

export const getFolders = (
  params?: FolderListParams,
): Promise<PaginatedResponse<MediaFolder>> =>
  apiClient(buildUrl("/api/media/folders/", params));

export const createFolder = (
  payload: CreateFolderPayload,
): Promise<MediaFolder> =>
  apiClient<MediaFolder>("/api/media/folders/", {
    method: "POST",
    data: payload,
  });

export const deleteFolder = (id: string): Promise<void> =>
  apiClient<void>(`/api/media/folders/${id}/`, { method: "DELETE" });

export const renameFolder = (id: string, name: string): Promise<MediaFolder> =>
  apiClient<MediaFolder>(`/api/media/folders/${id}/`, {
    method: "PATCH",
    data: { name },
  });

//   file
export const getMediaFiles = (
  params?: MediaListParams,
): Promise<PaginatedResponse<MediaFile>> =>
  apiClient(buildUrl("/api/media/files/", params));

export const uploadMediaFile = (
  payload: MediaUploadPayload,
  onUploadProgress?: (percent: number) => void,
): Promise<MediaFile> => {
  const form = new FormData();
  form.append("file", payload.file);
  if (payload.folder) form.append("folder", payload.folder);
  if (payload.is_admin_space !== undefined)
    form.append("is_admin_space", String(payload.is_admin_space));

  return apiClient<MediaFile>("/api/media/files/upload/", {
    method: "POST",
    data: form,
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: onUploadProgress
      ? (e) => {
          const percent = e.total ? Math.round((e.loaded * 100) / e.total) : 0;
          onUploadProgress(percent);
        }
      : undefined,
  });
};

export const deleteMediaFile = (id: string): Promise<void> =>
  apiClient<void>(`/api/media/files/${id}/`, { method: "DELETE" });

export const moveMediaFile = (
  id: string,
  folderId: string | null,
): Promise<MediaFile> =>
  apiClient<MediaFile>(`/api/media/files/${id}/`, {
    method: "PATCH",
    data: { folder: folderId },
  });
