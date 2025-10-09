import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaginationInput } from 'src/shared/dtos';

import { TaskPriorityEnum, TaskStatusEnum } from 'src/shared/enums';

export class LoadTasksInputDto extends PaginationInput {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDateString()
  deadline?: Date;

  @IsEnum(TaskPriorityEnum)
  @IsOptional()
  priority?: TaskPriorityEnum;

  @IsEnum(TaskStatusEnum)
  @IsOptional()
  status?: TaskStatusEnum;

  @IsUUID('all', { each: true })
  @IsOptional()
  usersIds?: string[];
}
