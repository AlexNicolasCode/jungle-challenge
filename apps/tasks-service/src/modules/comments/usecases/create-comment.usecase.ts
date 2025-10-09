import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { CreateCommentInputDto } from '../dtos/inputs';
import { CreateCommentOutputDto } from '../dtos/outputs';
import { CreateCommentService } from '../services';
import { LoadTaskByIdService } from 'src/modules/tasks/services';

@Injectable()
export class CreateCommentUseCase {
  private readonly logger = new Logger(CreateCommentUseCase.name);

  constructor(
    private readonly loadTaskByIdService: LoadTaskByIdService,
    private readonly createCommentService: CreateCommentService,
  ) {}

  async execute(
    taskId: string,
    dto: CreateCommentInputDto,
  ): Promise<CreateCommentOutputDto> {
    const task = await this.loadTaskByIdService.loadTaskById({
      taskId,
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    try {
      await this.createCommentService.createComment({
        taskId,
        authorId: dto.authorId,
        authorName: dto.authorName,
        content: dto.content,
      });
      return null;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
