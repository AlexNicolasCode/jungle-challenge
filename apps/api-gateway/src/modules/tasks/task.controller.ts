import {
  Controller,
  Post,
  Body,
  Inject,
  HttpCode,
  HttpStatus,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import {
  CreateTaskInputDto,
  CreateTaskOutputDto,
  DeleteTaskByIdInputDto,
  DeleteTaskByIdOutputDto,
  LoadTaskByIdInputDto,
  LoadTaskByIdOutputDto,
  LoadTasksInputDto,
  LoadTasksOutputDto,
  UpdateTaskByIdInputDto,
  UpdateTaskByIdOutputDto,
} from './dtos';
import { LoggedUser, LoggedUserOutputDto } from 'src/shared/decorators';

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
}
