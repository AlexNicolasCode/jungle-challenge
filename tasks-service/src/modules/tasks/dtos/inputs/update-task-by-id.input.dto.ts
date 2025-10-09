import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';

import { TaskPriorityEnum, TaskStatusEnum } from 'src/shared/enums';

export class UpdateTaskByIdInputDto {
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
}
