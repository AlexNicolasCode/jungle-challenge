import { IsUUID } from 'class-validator';

import { PaginationInput } from 'src/shared/dtos';

export class LoadCommentsInputDto extends PaginationInput {
  @IsUUID()
  taskId: string;
}
