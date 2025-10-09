import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { LoadTaskByIdInputDto } from '../dtos/inputs';
import { LoadTaskByIdOutputDto } from '../dtos/outputs';
import { LoadTaskByIdService } from '../services';

@Injectable()
export class LoadTaskByIdUseCase {
  private readonly logger = new Logger(LoadTaskByIdUseCase.name);

  constructor(private readonly loadTaskByIdService: LoadTaskByIdService) {}

  async execute(dto: LoadTaskByIdInputDto): Promise<LoadTaskByIdOutputDto> {
    const task = await this.loadTaskByIdService.loadTaskById(dto);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    try {
      return task;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
