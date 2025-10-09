import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { UserEntity } from 'src/database/entities';
import { UserRepository } from 'src/database/repositories';

@Injectable()
export class LoadUserByEmailService {
  private readonly logger = new Logger(LoadUserByEmailService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async loadUserByEmail(email: string): Promise<UserEntity | null> {
    try {
      return this.userRepository.loadByEmail(email);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
