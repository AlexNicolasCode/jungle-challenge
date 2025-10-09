import { Body, Controller, Post } from '@nestjs/common';

import { CreateTaskInputDto } from './dtos/inputs';
import { CreateTaskOutputDto } from './dtos/outputs';
import { CreateTaskUseCase } from './usecases';

@Controller('api/tasks')
export class TaskController {
  constructor(private readonly createTaskUseCase: CreateTaskUseCase) {}

  @Post()
  createTask(@Body() dto: CreateTaskInputDto): Promise<CreateTaskOutputDto> {
    return this.createTaskUseCase.execute(dto);
  }
}
