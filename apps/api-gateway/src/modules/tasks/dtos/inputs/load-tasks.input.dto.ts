import { ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({
    description: 'Filter by task description',
    example: 'Build REST and GraphQL endpoints',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Filter by deadline',
    example: '2025-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDateString()
  deadline?: Date;

  @ApiPropertyOptional({
    enum: TaskPriorityEnum,
    description: 'Filter by priority',
    example: TaskPriorityEnum.HIGH,
  })
  @IsEnum(TaskPriorityEnum)
  @IsOptional()
  priority?: TaskPriorityEnum;

  @ApiPropertyOptional({
    enum: TaskStatusEnum,
    description: 'Filter by status',
    example: TaskStatusEnum.TODO,
  })
  @IsEnum(TaskStatusEnum)
  @IsOptional()
  status?: TaskStatusEnum;

  @ApiPropertyOptional({
    description: 'Filter by task title',
    example: 'Update system',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by user IDs',
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    type: [String],
  })
  @IsUUID('all', { each: true })
  @IsOptional()
  usersIds?: string[];
}
