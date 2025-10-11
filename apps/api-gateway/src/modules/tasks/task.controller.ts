import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { LoggedUser, LoggedUserOutputDto } from 'src/shared/decorators';
import {
    CreateCommentInputDto,
    CreateCommentOutputDto,
    CreateTaskInputDto,
    CreateTaskOutputDto,
    DeleteTaskByIdInputDto,
    DeleteTaskByIdOutputDto,
    LoadCommentsInputDto,
    LoadCommentsOutputDto,
    LoadTaskByIdInputDto,
    LoadTaskByIdOutputDto,
    LoadTasksInputDto,
    LoadTasksOutputDto,
    UpdateTaskByIdInputDto,
    UpdateTaskByIdOutputDto,
} from './dtos';

@ApiTags('Tasks')
@Controller('api/tasks')
export class TaskController {
  constructor(@Inject('TASK_SERVICE') private taskClient: ClientProxy) {}

  @Get()
  @ApiOperation({ summary: 'Load all tasks with optional filters' })
  @ApiQuery({ type: LoadTasksInputDto, required: false })
  @ApiResponse({
    status: 200,
    description: 'Tasks loaded successfully',
    type: LoadTasksOutputDto,
  })
  loadTasks(
    @Query() params: LoadTasksInputDto,
  ): Observable<LoadTasksOutputDto> {
    return this.taskClient.send('task.load', params);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Load a task by its ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Task UUID' })
  @ApiResponse({
    status: 200,
    description: 'Task loaded successfully',
    type: LoadTaskByIdOutputDto,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  loadTaskById(
    @Param() params: LoadTaskByIdInputDto,
  ): Observable<LoadTaskByIdOutputDto> {
    return this.taskClient.send('task.loadById', params);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update a task by its ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Task UUID' })
  @ApiBody({ type: UpdateTaskByIdInputDto })
  @ApiResponse({ status: 204, description: 'Task updated successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  updateTaskById(
    @Param('id', new ParseUUIDPipe()) taskId: string,
    @Body() dto: UpdateTaskByIdInputDto,
    @LoggedUser() loggedUser: LoggedUserOutputDto,
  ): Observable<UpdateTaskByIdOutputDto> {
    return this.taskClient.send('task.updateById', {
      ...dto,
      id: taskId,
      loggedUser,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task by its ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Task UUID' })
  @ApiResponse({ status: 204, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  deleteTaskById(
    @Param() params: DeleteTaskByIdInputDto,
    @LoggedUser() loggedUser: LoggedUserOutputDto,
  ): Observable<DeleteTaskByIdOutputDto> {
    return this.taskClient.send('task.deleteById', { ...params, loggedUser });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: CreateTaskInputDto })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: CreateTaskOutputDto,
  })
  createTask(
    @Body() dto: CreateTaskInputDto,
    @LoggedUser() loggedUser: LoggedUserOutputDto,
  ): Observable<CreateTaskOutputDto> {
    return this.taskClient.send('task.create', {
      ...dto,
      users: [{ id: loggedUser.id, name: loggedUser.name }],
      loggedUser,
    });
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Delete a task by its ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Task UUID' })
  @ApiResponse({ status: 200, description: 'Comments loaded successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  loadTaskComments(
    @Param('id', new ParseUUIDPipe()) taskId: string,
    @Query() params: LoadCommentsInputDto,
  ): Observable<LoadCommentsOutputDto> {
    return this.taskClient.send('comment.load', {
      taskId,
      page: params.page,
      size: params.size,
    });
  }

  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create Comment in Task' })
  @ApiParam({ name: 'id', type: 'string', description: 'Task UUID' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  createTaskComment(
    @Param('id', new ParseUUIDPipe()) taskId: string,
    @Body() dto: CreateCommentInputDto,
    @LoggedUser() loggedUser: LoggedUserOutputDto,
  ): Observable<CreateCommentOutputDto> {
    return this.taskClient.send('comment.create', {
      ...dto,
      taskId,
      authorId: loggedUser.id,
      authorName: loggedUser.name,
    });
  }
}
