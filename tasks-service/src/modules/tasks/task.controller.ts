import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import {
  CreateTaskInputDto,
  DeleteTaskByIdInputDto,
  LoadTaskByIdInputDto,
  LoadTasksInputDto,
  UpdateTaskByIdInputDto,
} from './dtos/inputs';
import {
  CreateTaskOutputDto,
  DeleteTaskByIdOutputDto,
  LoadTaskByIdOutputDto,
  LoadTasksOutputDto,
  UpdateTaskByIdOutputDto,
} from './dtos/outputs';
import {
  CreateTaskUseCase,
  DeleteTaskByIdUseCase,
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
    private readonly deleteTaskByIdUseCase: DeleteTaskByIdUseCase,
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
  @HttpCode(HttpStatus.NO_CONTENT)
  updateTaskById(
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
    @Body() dto: UpdateTaskByIdInputDto,
  ): Promise<UpdateTaskByIdOutputDto> {
    return this.updateTaskByIdUseCase.execute(taskId, dto);
  }

  @Delete(':taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTaskById(
    @Param() params: DeleteTaskByIdInputDto,
  ): Promise<DeleteTaskByIdOutputDto> {
    return this.deleteTaskByIdUseCase.execute(params);
  }

  @Post()
  createTask(@Body() dto: CreateTaskInputDto): Promise<CreateTaskOutputDto> {
    return this.createTaskUseCase.execute(dto);
  }
}
