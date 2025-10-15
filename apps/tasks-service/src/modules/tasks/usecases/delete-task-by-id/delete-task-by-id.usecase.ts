import {
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';

import { DeleteTaskByIdService, LoadTaskByIdService } from '../../services';
import { DeleteTaskByIdUseCaseInputDto } from './delete-task-by-id.input.dto';
import { DeleteTaskByIdUseCaseOutputDto } from './delete-task-by-id.output.dto';

@Injectable()
export class DeleteTaskByIdUseCase {
  private readonly logger = new Logger(DeleteTaskByIdUseCase.name);

  constructor(
    private readonly loadTaskByIdService: LoadTaskByIdService,
    private readonly deleteTaskByIdService: DeleteTaskByIdService,
  ) {}

  async execute(
    dto: DeleteTaskByIdUseCaseInputDto,
  ): Promise<DeleteTaskByIdUseCaseOutputDto> {
    const taskId = dto.id;
    const task = await this.loadTaskByIdService.loadTaskById({ taskId });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    try {
      await this.deleteTaskByIdService.deleteTaskById({ taskId });
      return null;
    } catch (error) {
      this.logger.error(`Error when try delete task by id`, error);
      this.logger.error(`Payload ${JSON.stringify(dto)}`);
      throw new InternalServerErrorException();
    }
  }
}
