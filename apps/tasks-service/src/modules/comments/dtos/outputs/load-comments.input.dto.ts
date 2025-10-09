import { PaginationOutput } from 'src/shared/dtos';

export type LoadCommentsOutputDto = PaginationOutput<{
  authorName: string;
  content: string;
}>;
