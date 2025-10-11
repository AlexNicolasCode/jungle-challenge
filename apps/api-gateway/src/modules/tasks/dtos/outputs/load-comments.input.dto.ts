import { PaginationOutput } from 'src/shared/dtos';

export class LoadCommentsOutputDto extends PaginationOutput<{
  id: string;
  authorName: string;
  content: string;
  updatedAt: Date;
}> {}
