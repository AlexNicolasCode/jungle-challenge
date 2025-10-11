import {
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';

import { LoadTaskByIdService } from 'src/modules/tasks/services';
import { LoadCommentsInputDto } from '../dtos/inputs';
import { LoadCommentsOutputDto } from '../dtos/outputs';
import { LoadCommentsService } from '../services';

@Injectable()
export class LoadCommentsUseCase {
  private readonly logger = new Logger(LoadCommentsUseCase.name);

  constructor(
    private readonly loadTaskByIdService: LoadTaskByIdService,
    private readonly loadCommentsService: LoadCommentsService,
  ) {}

  async execute(dto: LoadCommentsInputDto): Promise<LoadCommentsOutputDto> {
    const taskId = dto.taskId;
    const task = await this.loadTaskByIdService.loadTaskById({
      taskId,
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    try {
      const { count, comments } =
        await this.loadCommentsService.loadComments(dto);
      return {
        list: comments,
        page: dto.page,
        size: dto.size,
        totalPages: Math.ceil(count / 10),
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
