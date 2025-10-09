import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';

import { LoginInputDto, LoginOutputDto } from '../dtos';
import {
  CompareHashsService,
  GenerateAuthTokensService,
  LoadPasswordByUserIdService,
  LoadUserByEmailService,
} from '../services';

@Injectable()
export class LoginUseCase {
  private readonly logger = new Logger(LoginUseCase.name);

  constructor(
    private readonly loadUserByEmailService: LoadUserByEmailService,
    private readonly loadPasswordByUserIdService: LoadPasswordByUserIdService,
    private readonly compareHashsService: CompareHashsService,
    private readonly generateAuthTokensService: GenerateAuthTokensService,
  ) {}

  async execute(dto: LoginInputDto): Promise<LoginOutputDto> {
    const user = await this.loadUserByEmailService.loadUserByEmail(dto.email);
    if (!user) {
      throw new UnprocessableEntityException('Invalid login');
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
      throw new UnprocessableEntityException('Invalid login');
    }
    return this.generateAuthTokensService.generateAuthTokens({
      name: user.name,
      email: user.email,
    });
  }
}
