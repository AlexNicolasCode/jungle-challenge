import { PaginationOutput } from 'src/shared/dtos';

export class LoadCommentsOutputDto extends PaginationOutput<{
  authorName: string;
  content: string;
}> {}
