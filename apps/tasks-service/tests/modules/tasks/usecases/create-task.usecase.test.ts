import { faker } from '@faker-js/faker';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
    CreateTaskService,
    NotifyTaskCreatedService,
} from 'src/modules/tasks/services';
import {
    CreateTaskUseCase,
    CreateTaskUseCaseInputDto,
} from 'src/modules/tasks/usecases';
import { LoggedUserInputDto } from 'src/shared/dtos';
import { TaskPriorityEnum, TaskStatusEnum } from 'src/shared/enums';
import { createLoggedUserMock } from 'tests/shared/mocks';

interface SutTypes {
  sut: CreateTaskUseCase;
  createTaskService: CreateTaskService;
  notifyTaskCreatedService: NotifyTaskCreatedService;
  makeFakeDto: () => CreateTaskUseCaseInputDto;
}

const makeSut = async (): Promise<SutTypes> => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      CreateTaskUseCase,
      {
        provide: CreateTaskService,
        useValue: { createTask: jest.fn() },
      },
      {
        provide: NotifyTaskCreatedService,
        useValue: { notifyTaskCreated: jest.fn() },
      },
    ],
  }).compile();
  const sut = module.get<CreateTaskUseCase>(CreateTaskUseCase);
  const createTaskService = module.get(CreateTaskService);
  const notifyTaskCreatedService = module.get(NotifyTaskCreatedService);
  jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  const makeFakeDto = (): CreateTaskUseCaseInputDto => ({
    title: faker.lorem.words(3),
    description: faker.lorem.sentence(),
    deadline: faker.date.future(),
    priority: faker.helpers.enumValue(TaskPriorityEnum),
    loggedUser: {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
    } as LoggedUserInputDto,
    status: faker.helpers.enumValue(TaskStatusEnum),
    users: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(
      () => createLoggedUserMock(),
    ),
  });
  return {
    sut,
    createTaskService,
    notifyTaskCreatedService,
    makeFakeDto,
  };
};

describe('CreateTaskUseCase', () => {
  it('should call createTaskService.createTask once', async () => {
    const { sut, createTaskService, makeFakeDto } = await makeSut();
    const dto = makeFakeDto();
    const taskId = faker.string.uuid();
    const createTaskServiceSpy = jest
      .spyOn(createTaskService, 'createTask')
      .mockResolvedValue({ id: taskId });

    await sut.execute(dto);

    expect(createTaskServiceSpy).toHaveBeenCalledTimes(1);
  });

  it('should call createTaskService.createTask with the correct dto', async () => {
    const { sut, createTaskService, makeFakeDto } = await makeSut();
    const dto = makeFakeDto();
    const taskId = faker.string.uuid();
    const createTaskServiceSpy = jest
      .spyOn(createTaskService, 'createTask')
      .mockResolvedValue({ id: taskId });

    await sut.execute(dto);

    expect(createTaskServiceSpy).toHaveBeenCalledWith(dto);
  });

  it('should call notifyTaskCreatedService only required times', async () => {
    const { sut, notifyTaskCreatedService, createTaskService, makeFakeDto } =
      await makeSut();
    const dto = makeFakeDto();
    const taskId = faker.string.uuid();
    jest
      .spyOn(createTaskService, 'createTask')
      .mockResolvedValue({ id: taskId });
    const notifyTaskCreatedServiceSpy = jest.spyOn(
      notifyTaskCreatedService,
      'notifyTaskCreated',
    );

    await sut.execute(dto);

    expect(notifyTaskCreatedServiceSpy).toHaveBeenCalledTimes(dto.users.length);
  });

  it('should call notifyTaskCreatedService with correct params', async () => {
    const { sut, notifyTaskCreatedService, createTaskService, makeFakeDto } =
      await makeSut();
    const dto = makeFakeDto();
    const taskId = faker.string.uuid();
    jest
      .spyOn(createTaskService, 'createTask')
      .mockResolvedValue({ id: taskId });
    const notifyTaskCreatedServiceSpy = jest.spyOn(
      notifyTaskCreatedService,
      'notifyTaskCreated',
    );

    await sut.execute(dto);

    dto.users.forEach((user) => {
      expect(notifyTaskCreatedServiceSpy).toHaveBeenCalledWith({
        taskId,
        authorId: user.id,
        taskTitle: dto.title,
      });
    });
  });

  it('should return CreateTaskUseCaseOutputDto with the task id', async () => {
    const { sut, createTaskService, makeFakeDto } = await makeSut();
    const dto = makeFakeDto();
    const taskId = faker.string.uuid();
    jest
      .spyOn(createTaskService, 'createTask')
      .mockResolvedValue({ id: taskId });

    const result = await sut.execute(dto);

    expect(result).toEqual({ id: taskId });
  });

  it('should throw InternalServerErrorException when createTask throws', async () => {
    const { sut, createTaskService, makeFakeDto } = await makeSut();
    const dto = makeFakeDto();
    jest
      .spyOn(createTaskService, 'createTask')
      .mockRejectedValue(new Error('DB error'));

    const promise = sut.execute(dto);

    await expect(promise).rejects.toThrow(InternalServerErrorException);
  });

  it('should not throw InternalServerErrorException when notifyTaskCreatedService throws', async () => {
    const { sut, notifyTaskCreatedService, makeFakeDto } = await makeSut();
    const dto = makeFakeDto();
    jest
      .spyOn(notifyTaskCreatedService, 'notifyTaskCreated')
      .mockRejectedValue(new Error('DB error'));

    const promise = sut.execute(dto);

    await expect(promise).rejects.toThrow(InternalServerErrorException);
  });
});
