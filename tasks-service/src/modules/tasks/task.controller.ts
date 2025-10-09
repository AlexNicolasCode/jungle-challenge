import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import {
  CreateTaskInputDto,
  LoadTaskByIdInputDto,
  LoadTasksInputDto,
} from './dtos/inputs';
import {
  CreateTaskOutputDto,
  LoadTaskByIdOutputDto,
  LoadTasksOutputDto,
} from './dtos/outputs';
import {
  CreateTaskUseCase,
  LoadTaskByIdUseCase,
  LoadTasksUseCase,
} from './usecases';

@Controller('api/tasks')
export class TaskController {
  constructor(
    private readonly loadTaskByIdUseCase: LoadTaskByIdUseCase,
    private readonly loadTasksUseCase: LoadTasksUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
  ) {}

  @Get()
  loadTasks(@Query() dto: LoadTasksInputDto): Promise<LoadTasksOutputDto> {
    return this.loadTasksUseCase.execute(dto);
  }

  @Get(':taskId')
  loadTaskById(
    @Param() params: LoadTaskByIdInputDto,
  ): Promise<LoadTaskByIdOutputDto> {
    return this.loadTaskByIdUseCase.execute(params);
  }

  @Post()
  createTask(@Body() dto: CreateTaskInputDto): Promise<CreateTaskOutputDto> {
    return this.createTaskUseCase.execute(dto);
  }
}
