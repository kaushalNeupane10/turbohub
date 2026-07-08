export interface PaginatedResponse<T> {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: T[];
}

export interface PaginationMeta {
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
