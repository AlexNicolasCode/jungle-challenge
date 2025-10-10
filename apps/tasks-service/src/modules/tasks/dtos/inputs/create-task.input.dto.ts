import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
  IsArray,
  IsUUID,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { TaskPriorityEnum, TaskStatusEnum } from 'src/shared/enums';
import { LoggedUserInputDto } from 'src/shared/dtos';

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

  @ValidateNested()
  @Type(() => LoggedUserInputDto)
  loggedUser: LoggedUserInputDto;

  @IsEnum(TaskStatusEnum)
  @IsNotEmpty()
  status: TaskStatusEnum;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskUserInputDto)
  @ArrayMinSize(2)
  users: TaskUserInputDto[];
}
