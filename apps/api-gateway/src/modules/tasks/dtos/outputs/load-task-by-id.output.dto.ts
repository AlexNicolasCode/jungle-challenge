import { ApiProperty } from '@nestjs/swagger';
import { TaskPriorityEnum, TaskStatusEnum } from 'src/shared/enums';

class TaskUserDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({ description: 'User name', example: 'John Doe' })
  name: string;
}

export class LoadTaskByIdOutputDto {
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
    type: [TaskUserDto],
    description: 'List of users associated with the task',
  })
  users: TaskUserDto[];
}
