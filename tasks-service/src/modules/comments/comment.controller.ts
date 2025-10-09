import { Body, Controller, Param, ParseUUIDPipe, Post } from '@nestjs/common';

import { CreateCommentInputDto } from './dtos/inputs';
import { CreateCommentOutputDto } from './dtos/outputs';
import { CreateCommentUseCase } from './usecases/create-comment.usecase';

@Controller('api/tasks/:taskId/comments')
export class CommentController {
  constructor(private readonly createCommentUseCase: CreateCommentUseCase) {}

  @Post()
  createComment(
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
    @Body() dto: CreateCommentInputDto,
  ): Promise<CreateCommentOutputDto> {
    return this.createCommentUseCase.execute(taskId, dto);
  }
}
