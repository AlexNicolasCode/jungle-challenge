import { PaginationOutput } from 'src/shared/dtos';

export class LoadUsersOutputDto extends PaginationOutput<{
  id: string;
  name: string;
}> {}
