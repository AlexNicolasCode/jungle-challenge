import {
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';

import {
    LoadTaskByIdService,
    NotifyTaskUpdatedService,
    UpdateTaskByIdService,
} from '../../services';
import { UpdateTaskByIdUseCaseInputDto } from './update-task-by-id.input.dto';
import { UpdateTaskByIdUseCaseOutputDto } from './update-task-by-id.output.dto';

@Injectable()
export class UpdateTaskByIdUseCase {
  private readonly logger = new Logger(UpdateTaskByIdUseCase.name);

  constructor(
    private readonly loadTaskByIdService: LoadTaskByIdService,
    private readonly updateTaskByIdService: UpdateTaskByIdService,
    private readonly notifyTaskUpdatedService: NotifyTaskUpdatedService,
  ) {}

  async execute(
    dto: UpdateTaskByIdUseCaseInputDto,
  ): Promise<UpdateTaskByIdUseCaseOutputDto> {
    const storagedTask = await this.loadTaskByIdService.loadTaskById({
      taskId: dto.id,
    });
    if (!storagedTask) {
      throw new NotFoundException('Task not found');
    }
    try {
      await this.updateTaskByIdService.updateTaskById({
        id: dto.id,
        title: dto.title,
        deadline: dto.deadline,
        priority: dto.priority,
        status: dto.status,
      });
      for (const users of storagedTask.users) {
        this.notifyTaskUpdatedService.notifyTaskUpdate({
          taskId: dto.id,
          authorId: users.id,
          taskTitle: dto.title,
        });
      }
      return null;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
