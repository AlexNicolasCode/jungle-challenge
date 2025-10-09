import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { CommentRepository } from 'src/database/repositories';
import { LoadCommentsInputDto } from './load-comments.input.dto';
import { LoadCommentsOutputDto } from './load-comments.output.dto';

@Injectable()
export class LoadCommentsService {
  private readonly logger = new Logger(LoadCommentsService.name);

  constructor(private readonly commentRepository: CommentRepository) {}

  async loadComments(
    dto: LoadCommentsInputDto,
  ): Promise<LoadCommentsOutputDto> {
    try {
      const { count, comments } = await this.commentRepository.loadAll({
        page: dto.page,
        size: dto.size,
        where: { authorId: dto.authorId },
      });
      return {
        count,
        comments: comments.map((comment) => ({
          authorName: comment.author.name,
          content: comment.content,
        })),
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
