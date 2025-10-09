import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { UserRepository } from 'src/database/repositories';

@Injectable()
export class CheckUserExistsByEmailService {
  private readonly logger = new Logger(CheckUserExistsByEmailService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async checkUserExistsByEmail(email: string): Promise<boolean> {
    try {
      return this.userRepository.checkIfExistsByEmail(email);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
