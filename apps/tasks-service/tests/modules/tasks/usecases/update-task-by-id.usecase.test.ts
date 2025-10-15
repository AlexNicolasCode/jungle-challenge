import { faker } from '@faker-js/faker';
import {
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
    LoadTaskByIdService,
    NotifyTaskUpdatedService,
    UpdateTaskByIdService,
} from 'src/modules/tasks/services';
import {
    UpdateTaskByIdUseCase,
    UpdateTaskByIdUseCaseInputDto,
} from 'src/modules/tasks/usecases';
import { TaskPriorityEnum, TaskStatusEnum } from 'src/shared/enums';
import { createLoggedUserMock, createTaskMock } from 'tests/shared/mocks';

interface SutTypes {
  sut: UpdateTaskByIdUseCase;
  loadTaskByIdService: LoadTaskByIdService;
  updateTaskByIdService: UpdateTaskByIdService;
  notifyTaskUpdatedService: NotifyTaskUpdatedService;
  makeFakeDto: () => UpdateTaskByIdUseCaseInputDto;
}

const makeSut = async (): Promise<SutTypes> => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      UpdateTaskByIdUseCase,
      {
        provide: LoadTaskByIdService,
        useValue: { loadTaskById: jest.fn() },
      },
      {
        provide: UpdateTaskByIdService,
        useValue: { updateTaskById: jest.fn() },
      },
      {
        provide: NotifyTaskUpdatedService,
        useValue: { notifyTaskUpdate: jest.fn() },
      },
    ],
  }).compile();
  const sut = module.get<UpdateTaskByIdUseCase>(UpdateTaskByIdUseCase);
  const loadTaskByIdService = module.get(LoadTaskByIdService);
  const updateTaskByIdService = module.get(UpdateTaskByIdService);
  const notifyTaskUpdatedService = module.get(NotifyTaskUpdatedService);
  jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  const makeFakeDto = (): UpdateTaskByIdUseCaseInputDto => ({
    id: faker.string.uuid(),
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    deadline: faker.date.future(),
    priority: faker.helpers.enumValue(TaskPriorityEnum),
    loggedUser: createLoggedUserMock(),
    status: faker.helpers.enumValue(TaskStatusEnum),
  });
  return {
    sut,
    loadTaskByIdService,
    updateTaskByIdService,
    notifyTaskUpdatedService,
    makeFakeDto,
  };
};

describe('UpdateTaskByIdUseCase', () => {
  it('should call loadTaskByIdService.loadTaskById once', async () => {
    const { sut, loadTaskByIdService, makeFakeDto } = await makeSut();
    const dto = makeFakeDto();
    const loadTaskByIdServiceSpy = jest
      .spyOn(loadTaskByIdService, 'loadTaskById')
      .mockResolvedValue(createTaskMock());

    await sut.execute(dto);

    expect(loadTaskByIdServiceSpy).toHaveBeenCalledTimes(1);
  });

  it('should call loadTaskByIdService.loadTaskById with the correct dto', async () => {
    const { sut, loadTaskByIdService, makeFakeDto } = await makeSut();
    const dto = makeFakeDto();
    const loadTaskByIdServiceSpy = jest
      .spyOn(loadTaskByIdService, 'loadTaskById')
      .mockResolvedValue(createTaskMock());

    await sut.execute(dto);

    expect(loadTaskByIdServiceSpy).toHaveBeenCalledWith({ taskId: dto.id });
  });

  it('should throw NotFoundException when loadTaskByIdService not found task', async () => {
    const { sut, loadTaskByIdService, makeFakeDto } = await makeSut();
    const dto = makeFakeDto();
    jest.spyOn(loadTaskByIdService, 'loadTaskById').mockResolvedValue(null);

    const promise = sut.execute(dto);

    await expect(promise).rejects.toThrow(
      new NotFoundException('Task not found'),
    );
  });

  it('should call updateTaskByIdService only required times', async () => {
    const { sut, loadTaskByIdService, updateTaskByIdService, makeFakeDto } =
      await makeSut();
    const dto = makeFakeDto();
    jest
      .spyOn(loadTaskByIdService, 'loadTaskById')
      .mockResolvedValue(createTaskMock());
    const updateTaskByIdServiceSpy = jest
      .spyOn(updateTaskByIdService, 'updateTaskById')
      .mockResolvedValue(null);

    await sut.execute(dto);

    expect(updateTaskByIdServiceSpy).toHaveBeenCalledTimes(1);
  });

  it('should call updateTaskByIdService with correct params', async () => {
    const { sut, loadTaskByIdService, updateTaskByIdService, makeFakeDto } =
      await makeSut();
    const dto = makeFakeDto();
    jest
      .spyOn(loadTaskByIdService, 'loadTaskById')
      .mockResolvedValue(createTaskMock());
    const updateTaskByIdServiceSpy = jest
      .spyOn(updateTaskByIdService, 'updateTaskById')
      .mockResolvedValue(null);

    await sut.execute(dto);

    expect(updateTaskByIdServiceSpy).toHaveBeenCalledWith({
      id: dto.id,
      title: dto.title,
      deadline: dto.deadline,
      priority: dto.priority,
      status: dto.status,
    });
  });

  it('should call updateTaskByIdService once by each user', async () => {
    const {
      sut,
      loadTaskByIdService,
      updateTaskByIdService,
      notifyTaskUpdatedService,
      makeFakeDto,
    } = await makeSut();
    const dto = makeFakeDto();
    const task = createTaskMock();
    jest.spyOn(loadTaskByIdService, 'loadTaskById').mockResolvedValue(task);
    jest.spyOn(updateTaskByIdService, 'updateTaskById').mockResolvedValue(null);
    const notifyTaskUpdatedServiceSpy = jest.spyOn(
      notifyTaskUpdatedService,
      'notifyTaskUpdate',
    );

    await sut.execute(dto);

    task.users.forEach((user) => {
      expect(notifyTaskUpdatedServiceSpy).toHaveBeenCalledWith({
        taskId: dto.id,
        authorId: user.id,
        taskTitle: dto.title,
      });
    });
  });

  it('should call updateTaskByIdService once by each user', async () => {
    const {
      sut,
      loadTaskByIdService,
      updateTaskByIdService,
      notifyTaskUpdatedService,
      makeFakeDto,
    } = await makeSut();
    const dto = makeFakeDto();
    const task = createTaskMock();
    jest.spyOn(loadTaskByIdService, 'loadTaskById').mockResolvedValue(task);
    jest.spyOn(updateTaskByIdService, 'updateTaskById').mockResolvedValue(null);
    const notifyTaskUpdatedServiceSpy = jest.spyOn(
      notifyTaskUpdatedService,
      'notifyTaskUpdate',
    );

    await sut.execute(dto);

    expect(notifyTaskUpdatedServiceSpy).toHaveBeenCalledTimes(
      task.users.length,
    );
  });

  it('should throw InternalServerErrorException when updateTaskByIdService throws', async () => {
    const { sut, loadTaskByIdService, updateTaskByIdService, makeFakeDto } =
      await makeSut();
    const dto = makeFakeDto();
    jest
      .spyOn(loadTaskByIdService, 'loadTaskById')
      .mockResolvedValue(createTaskMock());
    jest
      .spyOn(updateTaskByIdService, 'updateTaskById')
      .mockRejectedValue(new InternalServerErrorException());

    const promise = sut.execute(dto);

    await expect(promise).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw InternalServerErrorException when loadTaskByIdService throws', async () => {
    const { sut, loadTaskByIdService, updateTaskByIdService, makeFakeDto } =
      await makeSut();
    const dto = makeFakeDto();
    jest
      .spyOn(loadTaskByIdService, 'loadTaskById')
      .mockRejectedValue(new InternalServerErrorException());
    jest.spyOn(updateTaskByIdService, 'updateTaskById').mockResolvedValue(null);

    const promise = sut.execute(dto);

    await expect(promise).rejects.toThrow(InternalServerErrorException);
  });
});
