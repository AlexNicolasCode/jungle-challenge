import {
    ArrayNotEmpty,
    IsArray,
    IsDateString,
    IsEnum,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';
import { PaginationInput } from 'src/shared/dtos';
import { TaskPriorityEnum, TaskStatusEnum } from 'src/shared/enums';

export class LoadTasksInputDto extends PaginationInput {
  @IsOptional()
  @IsDateString()
  deadline?: Date;

  @IsOptional()
  @IsEnum(TaskPriorityEnum)
  priority?: TaskPriorityEnum;

  @IsOptional()
  @IsEnum(TaskStatusEnum)
  status?: TaskStatusEnum;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  usersIds?: string[];
}
