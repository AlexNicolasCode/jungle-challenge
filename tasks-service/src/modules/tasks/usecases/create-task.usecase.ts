import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { CreateTaskInputDto } from '../dtos/inputs';
import { CreateTaskOutputDto } from '../dtos/outputs';
import { CreateTaskService } from '../services';

@Injectable()
export class CreateTaskUseCase {
  private readonly logger = new Logger(CreateTaskUseCase.name);

  constructor(private readonly createTaskService: CreateTaskService) {}

  async execute(dto: CreateTaskInputDto): Promise<CreateTaskOutputDto> {
    try {
      const task = await this.createTaskService.createTask(dto);
      return { id: task.id };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
