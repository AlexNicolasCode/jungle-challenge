export class PaginationOutput<T> {
  list: T[];
  size: number;
  page: number;
  totalPages: number;
}
