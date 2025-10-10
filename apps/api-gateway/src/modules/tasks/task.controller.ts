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

@Controller('api/tasks')
export class TaskController {
  constructor(@Inject('TASK_SERVICE') private taskClient: ClientProxy) {}

  @Get()
  loadTasks(
    @Query() params: LoadTasksInputDto,
  ): Observable<LoadTasksOutputDto> {
    return this.taskClient.send('task.load', params);
  }

  @Get(':id')
  loadTaskById(
    @Param() params: LoadTaskByIdInputDto,
  ): Observable<LoadTaskByIdOutputDto> {
    return this.taskClient.send('task.loadById', params);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
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
  deleteTaskById(
    @Param() params: DeleteTaskByIdInputDto,
    @LoggedUser() loggedUser: LoggedUserOutputDto,
  ): Observable<DeleteTaskByIdOutputDto> {
    return this.taskClient.send('task.deleteById', { ...params, loggedUser });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
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
