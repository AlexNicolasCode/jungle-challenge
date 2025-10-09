import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { PasswordRepository } from 'src/database/repositories';

@Injectable()
export class LoadPasswordByUserIdService {
  private readonly logger = new Logger(LoadPasswordByUserIdService.name);

  constructor(private readonly passwordRepository: PasswordRepository) {}

  async loadPasswordByUserId(userId: string): Promise<string | undefined> {
    try {
      const password = await this.passwordRepository.loadByUserId(userId);
      return password?.hash;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
