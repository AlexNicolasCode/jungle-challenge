import { Type } from 'class-transformer';
import {
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    ValidateNested,
} from 'class-validator';
import { LoggedUserInputDto } from 'src/shared/dtos';

import { TaskPriorityEnum, TaskStatusEnum } from 'src/shared/enums';

export class UpdateTaskByIdUseCaseInputDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  deadline: Date;

  @IsEnum(TaskPriorityEnum)
  @IsNotEmpty()
  priority: TaskPriorityEnum;

  @IsEnum(TaskStatusEnum)
  @IsNotEmpty()
  status: TaskStatusEnum;

  @ValidateNested()
  @Type(() => LoggedUserInputDto)
  loggedUser: LoggedUserInputDto;
}
