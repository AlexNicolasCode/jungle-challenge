import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

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
  loadTasks(dto: LoadTasksInputDto): Promise<LoadTasksOutputDto> {
    return this.loadTasksUseCase.execute(dto);
  }

  @MessagePattern('task.loadById')
  loadTaskById(params: LoadTaskByIdInputDto): Promise<LoadTaskByIdOutputDto> {
    return this.loadTaskByIdUseCase.execute(params);
  }

  @MessagePattern('task.updateById')
  updateTaskById(
    dto: UpdateTaskByIdInputDto,
  ): Promise<UpdateTaskByIdOutputDto> {
    return this.updateTaskByIdUseCase.execute(dto);
  }

  @MessagePattern('task.deleteById')
  deleteTaskById(
    body: DeleteTaskByIdInputDto,
  ): Promise<DeleteTaskByIdOutputDto> {
    return this.deleteTaskByIdUseCase.execute(body);
  }

  @MessagePattern('task.create')
  createTask(dto: CreateTaskInputDto): Promise<CreateTaskOutputDto> {
    return this.createTaskUseCase.execute(dto);
  }
}
