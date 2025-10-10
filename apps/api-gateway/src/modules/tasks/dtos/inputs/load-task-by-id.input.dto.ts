import { IsUUID } from 'class-validator';

export class LoadTaskByIdInputDto {
  @IsUUID()
  id: string;
}
