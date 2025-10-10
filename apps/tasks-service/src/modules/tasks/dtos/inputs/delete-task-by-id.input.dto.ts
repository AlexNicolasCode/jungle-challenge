import { Type } from 'class-transformer';
import { IsUUID, ValidateNested } from 'class-validator';

import { LoggedUserInputDto } from 'src/shared/dtos';

export class DeleteTaskByIdInputDto {
  @IsUUID()
  id: string;

  @ValidateNested()
  @Type(() => LoggedUserInputDto)
  loggedUser: LoggedUserInputDto;
}
