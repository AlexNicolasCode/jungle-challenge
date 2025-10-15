import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

import { CreateTaskService, NotifyTaskCreatedService } from '../../services';
import { CreateTaskUseCaseInputDto } from './create-task.input.dto';
import { CreateTaskUseCaseOutputDto } from './create-task.output.dto';

@Injectable()
export class CreateTaskUseCase {
  private readonly logger = new Logger(CreateTaskUseCase.name);

  constructor(
    private readonly createTaskService: CreateTaskService,
    private readonly notifyTaskCreatedService: NotifyTaskCreatedService,
  ) {}

  async execute(
    dto: CreateTaskUseCaseInputDto,
  ): Promise<CreateTaskUseCaseOutputDto> {
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
