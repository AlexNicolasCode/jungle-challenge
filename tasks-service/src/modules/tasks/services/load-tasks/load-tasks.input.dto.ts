import {
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
  IsUUID,
} from 'class-validator';
import { PaginationInput } from 'src/shared/dtos';
import { TaskPriorityEnum, TaskStatusEnum } from 'src/shared/enums';

export class LoadTasksInputDto extends PaginationInput {
  @IsOptional()
  @IsString()
  title?: string;

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
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  usersIds?: string[];
}
