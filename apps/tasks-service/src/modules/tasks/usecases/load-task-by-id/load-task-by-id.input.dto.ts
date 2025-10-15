import { IsUUID } from 'class-validator';

export class LoadTaskByIdUseCaseInputDto {
  @IsUUID()
  id: string;
}
