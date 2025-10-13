import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

import { UserRepository } from 'src/database/repositories';

@Injectable()
export class LoadUserByEmailService {
  private readonly logger = new Logger(LoadUserByEmailService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async loadUserByEmail(
    email: string,
  ): Promise<{ id: string; name: string; email: string } | null> {
    try {
      const user = await this.userRepository.loadByEmail(email);
      if (!user) {
        return null;
      }
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
