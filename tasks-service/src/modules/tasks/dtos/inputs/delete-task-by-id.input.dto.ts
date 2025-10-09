import { IsUUID } from 'class-validator';

export class DeleteTaskByIdInputDto {
  @IsUUID()
  taskId: string;
}
