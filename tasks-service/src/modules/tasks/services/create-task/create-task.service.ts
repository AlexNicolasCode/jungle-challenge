import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { CreateTaskInputDto } from '../../dtos/inputs';
import { CreateTaskOutputDto } from '../../dtos/outputs';
import { TaskRepository } from 'src/database/repositories';

@Injectable()
export class CreateTaskService {
  private readonly logger = new Logger(CreateTaskService.name);

  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask(dto: CreateTaskInputDto): Promise<CreateTaskOutputDto> {
    try {
      const task = await this.taskRepository.save(dto);
      return { id: task.id };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
