import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { CommentRepository } from 'src/database/repositories';
import { CreateCommentInputDto } from './create-comment.input.dto';
import { CreateCommentOutputDto } from './create-comment.output.dto';

@Injectable()
export class CreateCommentService {
  private readonly logger = new Logger(CreateCommentService.name);

  constructor(private readonly commentRepository: CommentRepository) {}

  async createComment(
    dto: CreateCommentInputDto,
  ): Promise<CreateCommentOutputDto> {
    try {
      await this.commentRepository.save(dto);
      return null;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
