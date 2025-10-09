import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { CreateTaskInputDto, LoadTasksInputDto } from './dtos/inputs';
import { CreateTaskOutputDto, LoadTasksOutputDto } from './dtos/outputs';
import { CreateTaskUseCase, LoadTasksUseCase } from './usecases';

@Controller('api/tasks')
export class TaskController {
  constructor(
    private readonly loadTasksUseCase: LoadTasksUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
  ) {}

  @Get()
  loadTasks(@Query() dto: LoadTasksInputDto): Promise<LoadTasksOutputDto> {
    console.log(dto);
    return this.loadTasksUseCase.execute(dto);
  }

  @Post()
  createTask(@Body() dto: CreateTaskInputDto): Promise<CreateTaskOutputDto> {
    return this.createTaskUseCase.execute(dto);
  }
}
