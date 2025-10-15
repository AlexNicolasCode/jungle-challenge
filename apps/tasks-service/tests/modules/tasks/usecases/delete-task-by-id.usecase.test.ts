import { faker } from '@faker-js/faker';
import {
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import {
    DeleteTaskByIdService,
    LoadTaskByIdService,
} from 'src/modules/tasks/services';
import {
    DeleteTaskByIdUseCase,
    DeleteTaskByIdUseCaseInputDto,
} from 'src/modules/tasks/usecases';
import { createLoggedUserMock, createTaskMock } from 'tests/shared/mocks';

interface SutTypes {
  sut: DeleteTaskByIdUseCase;
  loadTaskByIdService: LoadTaskByIdService;
  deleteTaskByIdService: DeleteTaskByIdService;
  makeFakeDto: () => DeleteTaskByIdUseCaseInputDto;
}

const makeSut = async (): Promise<SutTypes> => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      DeleteTaskByIdUseCase,
      {
        provide: LoadTaskByIdService,
        useValue: { loadTaskById: jest.fn() },
      },
      {
        provide: DeleteTaskByIdService,
        useValue: { deleteTaskById: jest.fn() },
      },
    ],
  }).compile();
  const sut = module.get<DeleteTaskByIdUseCase>(DeleteTaskByIdUseCase);
  const loadTaskByIdService = module.get(LoadTaskByIdService);
  const deleteTaskByIdService = module.get(DeleteTaskByIdService);
  jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  const makeFakeDto = (): DeleteTaskByIdUseCaseInputDto => ({
    id: faker.string.uuid(),
    loggedUser: createLoggedUserMock(),
  });
  return {
    sut,
    loadTaskByIdService,
    deleteTaskByIdService,
    makeFakeDto,
  };
};

describe('DeleteTaskByIdUseCase', () => {
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

  it('should call deleteTaskByIdService only required times', async () => {
    const { sut, loadTaskByIdService, deleteTaskByIdService, makeFakeDto } =
      await makeSut();
    const dto = makeFakeDto();
    jest
      .spyOn(loadTaskByIdService, 'loadTaskById')
      .mockResolvedValue(createTaskMock());
    const deleteTaskByIdServiceSpy = jest
      .spyOn(deleteTaskByIdService, 'deleteTaskById')
      .mockResolvedValue(null);

    await sut.execute(dto);

    expect(deleteTaskByIdServiceSpy).toHaveBeenCalledTimes(1);
  });

  it('should call deleteTaskByIdService with correct params', async () => {
    const { sut, loadTaskByIdService, deleteTaskByIdService, makeFakeDto } =
      await makeSut();
    const dto = makeFakeDto();
    jest
      .spyOn(loadTaskByIdService, 'loadTaskById')
      .mockResolvedValue(createTaskMock());
    const deleteTaskByIdServiceSpy = jest
      .spyOn(deleteTaskByIdService, 'deleteTaskById')
      .mockResolvedValue(null);

    await sut.execute(dto);

    expect(deleteTaskByIdServiceSpy).toHaveBeenCalledWith({
      taskId: dto.id,
    });
  });

  it('should throw InternalServerErrorException when deleteTaskByIdService throws', async () => {
    const { sut, loadTaskByIdService, deleteTaskByIdService, makeFakeDto } =
      await makeSut();
    const dto = makeFakeDto();
    jest
      .spyOn(loadTaskByIdService, 'loadTaskById')
      .mockResolvedValue(createTaskMock());
    jest
      .spyOn(deleteTaskByIdService, 'deleteTaskById')
      .mockRejectedValue(new InternalServerErrorException());

    const promise = sut.execute(dto);

    await expect(promise).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw InternalServerErrorException when loadTaskByIdService throws', async () => {
    const { sut, loadTaskByIdService, deleteTaskByIdService, makeFakeDto } =
      await makeSut();
    const dto = makeFakeDto();
    jest
      .spyOn(loadTaskByIdService, 'loadTaskById')
      .mockRejectedValue(new InternalServerErrorException());
    jest.spyOn(deleteTaskByIdService, 'deleteTaskById').mockResolvedValue(null);

    const promise = sut.execute(dto);

    await expect(promise).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw NotFoundException when loadTaskByIdService not found task', async () => {
    const { sut, loadTaskByIdService, deleteTaskByIdService, makeFakeDto } =
      await makeSut();
    const dto = makeFakeDto();
    jest.spyOn(loadTaskByIdService, 'loadTaskById').mockResolvedValue(null);
    jest.spyOn(deleteTaskByIdService, 'deleteTaskById').mockRejectedValue(null);

    const promise = sut.execute(dto);

    await expect(promise).rejects.toThrow(
      new NotFoundException('Task not found'),
    );
  });
});
