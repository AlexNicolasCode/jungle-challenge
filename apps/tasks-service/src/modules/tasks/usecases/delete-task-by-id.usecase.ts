import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { DeleteTaskByIdInputDto } from '../dtos/inputs';
import { DeleteTaskByIdOutputDto } from '../dtos/outputs';
import { DeleteTaskByIdService, LoadTaskByIdService } from '../services';

@Injectable()
export class DeleteTaskByIdUseCase {
  private readonly logger = new Logger(DeleteTaskByIdUseCase.name);

  constructor(
    private readonly loadTaskByIdService: LoadTaskByIdService,
    private readonly deleteTaskByIdService: DeleteTaskByIdService,
  ) {}

  async execute(dto: DeleteTaskByIdInputDto): Promise<DeleteTaskByIdOutputDto> {
    const taskId = dto.id;
    const task = await this.loadTaskByIdService.loadTaskById({ taskId });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    try {
      await this.deleteTaskByIdService.deleteTaskById({ taskId });
      return null;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
