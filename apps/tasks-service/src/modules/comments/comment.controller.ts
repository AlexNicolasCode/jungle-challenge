import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { CreateCommentInputDto, LoadCommentsInputDto } from './dtos/inputs';
import { CreateCommentOutputDto, LoadCommentsOutputDto } from './dtos/outputs';
import { CreateCommentUseCase, LoadCommentsUseCase } from './usecases';

@Controller()
export class CommentController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly loadCommentsUseCase: LoadCommentsUseCase,
  ) {}

  @MessagePattern('comment.load')
  loadComments(dto: LoadCommentsInputDto): Promise<LoadCommentsOutputDto> {
    return this.loadCommentsUseCase.execute(dto);
  }

  @MessagePattern('comment.create')
  createComment(dto: CreateCommentInputDto): Promise<CreateCommentOutputDto> {
    return this.createCommentUseCase.execute(dto);
  }
}
