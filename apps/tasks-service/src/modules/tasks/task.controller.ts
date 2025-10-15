import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import {
    CreateTaskUseCase,
    CreateTaskUseCaseInputDto,
    CreateTaskUseCaseOutputDto,
    DeleteTaskByIdUseCase,
    DeleteTaskByIdUseCaseInputDto,
    DeleteTaskByIdUseCaseOutputDto,
    LoadTaskByIdUseCase,
    LoadTaskByIdUseCaseInputDto,
    LoadTaskByIdUseCaseOutputDto,
    LoadTasksUseCase,
    LoadTasksUseCaseInputDto,
    LoadTasksUseCaseOutputDto,
    UpdateTaskByIdUseCase,
    UpdateTaskByIdUseCaseInputDto,
    UpdateTaskByIdUseCaseOutputDto,
} from './usecases';

@Controller()
export class TaskController {
  constructor(
    private readonly loadTasksUseCase: LoadTasksUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly loadTaskByIdUseCase: LoadTaskByIdUseCase,
    private readonly updateTaskByIdUseCase: UpdateTaskByIdUseCase,
    private readonly deleteTaskByIdUseCase: DeleteTaskByIdUseCase,
  ) {}

  @MessagePattern('task.load')
  loadTasks(dto: LoadTasksUseCaseInputDto): Promise<LoadTasksUseCaseOutputDto> {
    return this.loadTasksUseCase.execute(dto);
  }

  @MessagePattern('task.loadById')
  loadTaskById(
    params: LoadTaskByIdUseCaseInputDto,
  ): Promise<LoadTaskByIdUseCaseOutputDto> {
    return this.loadTaskByIdUseCase.execute(params);
  }

  @MessagePattern('task.updateById')
  updateTaskById(
    dto: UpdateTaskByIdUseCaseInputDto,
  ): Promise<UpdateTaskByIdUseCaseOutputDto> {
    return this.updateTaskByIdUseCase.execute(dto);
  }

  @MessagePattern('task.deleteById')
  deleteTaskById(
    body: DeleteTaskByIdUseCaseInputDto,
  ): Promise<DeleteTaskByIdUseCaseOutputDto> {
    return this.deleteTaskByIdUseCase.execute(body);
  }

  @MessagePattern('task.create')
  createTask(
    dto: CreateTaskUseCaseInputDto,
  ): Promise<CreateTaskUseCaseOutputDto> {
    return this.createTaskUseCase.execute(dto);
  }
}
