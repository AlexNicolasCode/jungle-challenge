import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

import { UserRepository } from 'src/database/repositories';
import { LoadUsersInputDto } from './load-users.input.dto';
import { LoadUsersOutputDto } from './load-users.output.dto';

@Injectable()
export class LoadUsersService {
  private readonly logger = new Logger(LoadUsersService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async loadUsers(dto: LoadUsersInputDto): Promise<LoadUsersOutputDto> {
    try {
        const response = await this.userRepository.loadUsers(dto);
        const users = response.users.map((user) => ({
            id: user.id,
            name: user.name,
        }));
        return {
            list: users,
            page: dto.page,
            size: dto.size,
            totalPages: Math.ceil(response.count / dto.size),
        }
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
