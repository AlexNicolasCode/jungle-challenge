import { IsUUID } from 'class-validator';

export class DeleteTaskByIdInputDto {
  @IsUUID()
  id: string;
}
