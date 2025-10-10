import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
  IsArray,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { TaskPriorityEnum, TaskStatusEnum } from 'src/shared/enums';

export class TaskUserInputDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateTaskInputDto {
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskUserInputDto)
  users: TaskUserInputDto[];
}
