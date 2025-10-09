import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { LoadTaskByIdService, UpdateTaskByIdService } from '../services';
import { UpdateTaskByIdInputDto } from '../dtos/inputs';
import { UpdateTaskByIdOutputDto } from '../dtos/outputs';

@Injectable()
export class UpdateTaskByIdUseCase {
  private readonly logger = new Logger(UpdateTaskByIdUseCase.name);

  constructor(
    private readonly loadTaskByIdService: LoadTaskByIdService,
    private readonly updateTaskByIdService: UpdateTaskByIdService,
  ) {}

  async execute(
    taskId: string,
    task: UpdateTaskByIdInputDto,
  ): Promise<UpdateTaskByIdOutputDto> {
    const storagedTask = await this.loadTaskByIdService.loadTaskById({
      taskId,
    });
    if (!storagedTask) {
      throw new NotFoundException('Task not found');
    }
    try {
      await this.updateTaskByIdService.updateTaskById({ taskId, task });
      return null;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
