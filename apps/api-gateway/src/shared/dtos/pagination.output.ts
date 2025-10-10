export type PaginationOutput<T> = {
  list: T[];
  size: number;
  page: number;
  totalPages: number;
};
