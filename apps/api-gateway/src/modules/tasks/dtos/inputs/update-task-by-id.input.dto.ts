import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriorityEnum, TaskStatusEnum } from 'src/shared/enums';

export class UpdateTaskByIdInputDto {
  @ApiProperty({ description: 'Task title', example: 'Finish NestJS API' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'Task description',
    example: 'Build REST and GraphQL endpoints',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Task deadline',
    example: '2025-12-31T23:59:59.999Z',
  })
  @IsDateString()
  @IsNotEmpty()
  deadline: Date;

  @ApiProperty({
    enum: TaskPriorityEnum,
    description: 'Task priority',
    example: TaskPriorityEnum.HIGH,
  })
  @IsEnum(TaskPriorityEnum)
  @IsNotEmpty()
  priority: TaskPriorityEnum;

  @ApiProperty({
    enum: TaskStatusEnum,
    description: 'Task status',
    example: TaskStatusEnum.TODO,
  })
  @IsEnum(TaskStatusEnum)
  @IsNotEmpty()
  status: TaskStatusEnum;
}
