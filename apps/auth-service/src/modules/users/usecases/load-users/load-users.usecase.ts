import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

import { LoadUsersService } from '../../services';
import { LoadUsersInputDto } from './load-users.input.dto';
import { LoadUsersOutputDto } from './load-users.output.dto';

@Injectable()
export class LoadUsersUseCase {
  private readonly logger = new Logger(LoadUsersUseCase.name);

  constructor(private readonly loadUsersService: LoadUsersService) {}

  async execute(dto: LoadUsersInputDto): Promise<LoadUsersOutputDto> {
    try {
        const response = await this.loadUsersService.loadUsers(dto);
        return {
            list: response.list,
            page: dto.page,
            size: dto.size,
            totalPages: response.totalPages,
        }
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
