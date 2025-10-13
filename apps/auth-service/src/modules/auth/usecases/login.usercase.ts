import { Injectable } from '@nestjs/common';

import { LoginInputDto, LoginOutputDto } from '../dtos';
import { GenerateAuthTokensService } from '../services';
import { ValidateUserUseCase } from './validate-user.usecase';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly validateUserUseCase: ValidateUserUseCase,
    private readonly generateAuthTokensService: GenerateAuthTokensService,
  ) {}

  async execute(dto: LoginInputDto): Promise<LoginOutputDto> {
    const user = await this.validateUserUseCase.execute({
      email: dto.email,
      password: dto.password,
    });
    return this.generateAuthTokensService.generateAuthTokens({
      id: user.id,
      email: user.email,
    });
  }
}
