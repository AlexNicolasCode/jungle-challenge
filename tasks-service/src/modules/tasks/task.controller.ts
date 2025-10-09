import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import {
  CreateTaskInputDto,
  LoadTaskByIdInputDto,
  LoadTasksInputDto,
  UpdateTaskByIdInputDto,
} from './dtos/inputs';
import {
  CreateTaskOutputDto,
  LoadTaskByIdOutputDto,
  LoadTasksOutputDto,
  UpdateTaskByIdOutputDto,
} from './dtos/outputs';
import {
  CreateTaskUseCase,
  LoadTaskByIdUseCase,
  LoadTasksUseCase,
  UpdateTaskByIdUseCase,
} from './usecases';

@Controller('api/tasks')
export class TaskController {
  constructor(
    private readonly loadTasksUseCase: LoadTasksUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly loadTaskByIdUseCase: LoadTaskByIdUseCase,
    private readonly updateTaskByIdUseCase: UpdateTaskByIdUseCase,
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

  @Put(':taskId')
  updateTaskById(
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
    @Body() dto: UpdateTaskByIdInputDto,
  ): Promise<UpdateTaskByIdOutputDto> {
    return this.updateTaskByIdUseCase.execute(taskId, dto);
  }

  @Post()
  createTask(@Body() dto: CreateTaskInputDto): Promise<CreateTaskOutputDto> {
    return this.createTaskUseCase.execute(dto);
  }
}
