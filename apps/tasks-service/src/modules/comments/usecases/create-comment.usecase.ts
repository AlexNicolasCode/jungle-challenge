import {
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';

import { LoadTaskByIdService } from 'src/modules/tasks/services';
import { CreateCommentInputDto } from '../dtos/inputs';
import { CreateCommentOutputDto } from '../dtos/outputs';
import { CreateCommentService } from '../services';
import { NotifyCommentCreatedService } from '../services/notify-comment-created';

@Injectable()
export class CreateCommentUseCase {
  private readonly logger = new Logger(CreateCommentUseCase.name);

  constructor(
    private readonly loadTaskByIdService: LoadTaskByIdService,
    private readonly createCommentService: CreateCommentService,
    private readonly notifyCommentCreatedService: NotifyCommentCreatedService,
  ) {}

  async execute(dto: CreateCommentInputDto): Promise<CreateCommentOutputDto> {
    const taskId = dto.taskId;
    const task = await this.loadTaskByIdService.loadTaskById({
      taskId,
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    try {
      const comment = await this.createCommentService.createComment({
        taskId,
        authorId: dto.authorId,
        authorName: dto.authorName,
        content: dto.content,
      });
      this.notifyCommentCreatedService.notifyCommentCreated({
        task: {
          id: task.id,
          title: task.title,
          releatedUsersId: task.users.map((u) => u.id),
        },
        comment: comment,
      });
      return null;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
