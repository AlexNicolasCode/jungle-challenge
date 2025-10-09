export type PaginationOutput<T> = {
  list: T[];
  take: number;
  page: number;
  totalPages: number;
};
