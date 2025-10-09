import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { UserRepository } from 'src/database/repositories';

@Injectable()
export class CreateUserService {
  private readonly logger = new Logger(CreateUserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async createUser(dto: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ id: string }> {
    try {
      const storagedUser = await this.userRepository.save({
        name: dto.name,
        email: dto.email,
        password: dto.password,
      });
      return { id: storagedUser.id };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
