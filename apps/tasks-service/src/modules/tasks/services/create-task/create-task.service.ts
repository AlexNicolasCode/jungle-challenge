import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

import { TaskRepository } from 'src/database/repositories';
import { CreateTaskInputDto } from './create-task.input.dto';
import { CreateTaskOutputDto } from './create-task.output.dto';

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
