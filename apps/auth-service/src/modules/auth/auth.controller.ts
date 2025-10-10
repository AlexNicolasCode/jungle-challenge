import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import {
  CreateUserUseCase,
  LoginUseCase,
  RefreshTokenUseCase,
} from './usecases';
import {
  CreateUserInputDto,
  CreateUserOutputDto,
  LoginInputDto,
  LoginOutputDto,
  RefreshTokenInputDto,
  RefreshTokenOutputDto,
} from './dtos';

@Controller()
export class AuthController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @MessagePattern('auth.register')
  register(dto: CreateUserInputDto): Promise<CreateUserOutputDto> {
    return this.createUserUseCase.execute(dto);
  }

  @MessagePattern('auth.login')
  login(dto: LoginInputDto): Promise<LoginOutputDto> {
    return this.loginUseCase.execute(dto);
  }

  @MessagePattern('auth.refresh')
  refreshToken(dto: RefreshTokenInputDto): Promise<RefreshTokenOutputDto> {
    return this.refreshTokenUseCase.execute(dto);
  }
}
