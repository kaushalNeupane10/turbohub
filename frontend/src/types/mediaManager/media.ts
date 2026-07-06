export interface MediaFolder {
  id: string;
  name: string;
  parent: string | null;
  is_admin_space: boolean;
  owner: string | null;
  created_at: string;
  updated_at: string;
  children_count: number;
  files_count: number;
}

export interface MediaFile {
  id: string;
  owner: string | null;
  is_admin_space: boolean;
  folder: string | null;
  public_id: string;
  resource_type: string;
  format: string;
  secure_url: string;
  file_type: "image" | "video" | "raw";
  width: number | null;
  height: number | null;
  bytes: number | null;
  original_filename: string;
  created_at: string;
}

export interface MediaUploadPayload {
  file: File;
  folder?: string;
  is_admin_space?: boolean;
}

export interface CreateFolderPayload {
  name: string;
  parent?: string | null;
  is_admin_space?: boolean;
}

export interface MediaListParams {
  folder?: string;
  search?: string;
  space?: "admin" | "mine";
  [key: string]: string | number | boolean | null | undefined;
}

export interface FolderListParams {
  parent?: string;
  space?: "admin" | "mine";
  [key: string]: string | number | boolean | null | undefined;
}

// Used by MediaPicker to return selected media to parent
export interface SelectedMedia {
  id: string;
  url: string;
  public_id: string;
  width: number | null;
  height: number | null;
  original_filename: string;
}
