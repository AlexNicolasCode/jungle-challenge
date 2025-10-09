import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';

import { CreateCommentInputDto, LoadCommentsInputDto } from './dtos/inputs';
import { CreateCommentOutputDto, LoadCommentsOutputDto } from './dtos/outputs';
import { CreateCommentUseCase, LoadCommentsUseCase } from './usecases';

@Controller('api/tasks/:taskId/comments')
export class CommentController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly loadCommentsUseCase: LoadCommentsUseCase,
  ) {}

  @Get()
  loadComments(
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
    @Query() dto: LoadCommentsInputDto,
  ): Promise<LoadCommentsOutputDto> {
    return this.loadCommentsUseCase.execute(taskId, dto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createComment(
    @Param('taskId', new ParseUUIDPipe()) taskId: string,
    @Body() dto: CreateCommentInputDto,
  ): Promise<CreateCommentOutputDto> {
    return this.createCommentUseCase.execute(taskId, dto);
  }
}
