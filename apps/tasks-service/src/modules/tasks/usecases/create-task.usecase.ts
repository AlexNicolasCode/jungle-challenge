import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { CreateTaskInputDto } from '../dtos/inputs';
import { CreateTaskOutputDto } from '../dtos/outputs';
import { CreateTaskService, NotifyTaskCreatedService } from '../services';

@Injectable()
export class CreateTaskUseCase {
  private readonly logger = new Logger(CreateTaskUseCase.name);

  constructor(
    private readonly createTaskService: CreateTaskService,
    private readonly notifyTaskCreatedService: NotifyTaskCreatedService,
  ) {}

  async execute(dto: CreateTaskInputDto): Promise<CreateTaskOutputDto> {
    try {
      const task = await this.createTaskService.createTask(dto);
      for (const author of dto.users) {
        this.notifyTaskCreatedService.notifyTaskCreated({
          authorId: author.id,
          taskId: task.id,
          taskTitle: dto.title,
        });
      }
      return { id: task.id };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
