import {
    Injectable,
    InternalServerErrorException,
    Logger,
    UnprocessableEntityException,
} from '@nestjs/common';

import { ValidateUserInputDto, ValidateUserOutputDto } from '../dtos';
import {
    CompareHashsService,
    LoadPasswordByUserIdService,
    LoadUserByEmailService,
} from '../services';

@Injectable()
export class ValidateUserUseCase {
  private readonly logger = new Logger(ValidateUserUseCase.name);

  constructor(
    private readonly loadUserByEmailService: LoadUserByEmailService,
    private readonly loadPasswordByUserIdService: LoadPasswordByUserIdService,
    private readonly compareHashsService: CompareHashsService,
  ) {}

  async execute(dto: ValidateUserInputDto): Promise<ValidateUserOutputDto | void> {
    try {
      const user = await this.loadUserByEmailService.loadUserByEmail(dto.email);
      if (!user) {
        throw new UnprocessableEntityException('Invalid credentials');
      }
      const password =
        await this.loadPasswordByUserIdService.loadPasswordByUserId(user.id);
      if (!password) {
        this.logger.error(`User without password`);
        throw new InternalServerErrorException();
      }
      const isValidPassword = await this.compareHashsService.compare({
        hash: password,
        value: dto.password,
      });
      if (!isValidPassword) {
        throw new UnprocessableEntityException('Invalid credentials');
      }
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
