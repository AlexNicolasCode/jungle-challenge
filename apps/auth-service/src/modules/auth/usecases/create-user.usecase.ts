import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';

import { CreateUserInputDto, CreateUserOutputDto } from '../dtos';
import {
  CheckUserExistsByEmailService,
  CreateUserService,
  GenerateAuthTokensService,
  HashService,
} from '../services';

@Injectable()
export class CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);

  constructor(
    private readonly checkUserExistsByEmailService: CheckUserExistsByEmailService,
    private readonly hashService: HashService,
    private readonly generateAuthTokensService: GenerateAuthTokensService,
    private readonly createUserService: CreateUserService,
  ) {}

  async execute(dto: CreateUserInputDto): Promise<CreateUserOutputDto> {
    const hasUser =
      await this.checkUserExistsByEmailService.checkUserExistsByEmail(
        dto.email,
      );
    if (hasUser) {
      throw new UnprocessableEntityException('User already exists');
    }
    try {
      const passwordHash = await this.hashService.hash(dto.password);
      await this.createUserService.createUser({
        name: dto.name,
        email: dto.email,
        password: passwordHash,
      });
      return this.generateAuthTokensService.generateAuthTokens({
        name: dto.name,
        email: dto.email,
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
