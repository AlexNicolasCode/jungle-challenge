import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import {
    CreateUserInputDto,
    CreateUserOutputDto,
    GetUserByTokenInputDto,
    GetUserByTokenOutputDto,
    LoginInputDto,
    LoginOutputDto,
    RefreshTokenInputDto,
    RefreshTokenOutputDto,
} from './dtos';
import {
    CreateUserUseCase,
    GetUserByTokenUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
} from './usecases';

@Controller()
export class AuthController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly getUserByTokenUseCase: GetUserByTokenUseCase,
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

  @MessagePattern('auth.profile')
  token(dto: GetUserByTokenInputDto): Promise<GetUserByTokenOutputDto> {
    return this.getUserByTokenUseCase.execute(dto);
  }
}
