import { ApiProperty } from '@nestjs/swagger';
import { PaginationOutput } from 'src/shared/dtos';
import { TaskPriorityEnum, TaskStatusEnum } from 'src/shared/enums';
import { TaskUserInputDto } from '../inputs';

class TaskSummaryDto {
  @ApiProperty({ description: 'Task title', example: 'Finish NestJS API' })
  title: string;

  @ApiProperty({
    description: 'Task deadline',
    example: '2025-12-31T23:59:59.999Z',
  })
  deadline: Date;

  @ApiProperty({
    enum: TaskPriorityEnum,
    description: 'Task priority',
    example: TaskPriorityEnum.HIGH,
  })
  priority: TaskPriorityEnum;

  @ApiProperty({
    enum: TaskStatusEnum,
    description: 'Task status',
    example: TaskStatusEnum.TODO,
  })
  status: TaskStatusEnum;

  @ApiProperty({
    description: 'Task creation timestamp',
    example: '2025-10-10T05:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Task last update timestamp',
    example: '2025-10-10T06:30:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    type: [TaskUserInputDto],
    description: 'List of users associated with the task',
  })
  users: TaskUserInputDto[];
}

export class LoadTasksOutputDto extends PaginationOutput<TaskSummaryDto> {
  @ApiProperty({
    type: [TaskSummaryDto],
    description: 'List of tasks with pagination info',
  })
  declare list: TaskSummaryDto[];
}
