import { Controller, Post, Body } from '@nestjs/common';

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

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Post('register')
  register(@Body() dto: CreateUserInputDto): Promise<CreateUserOutputDto> {
    return this.createUserUseCase.execute(dto);
  }

  @Post('login')
  login(@Body() dto: LoginInputDto): Promise<LoginOutputDto> {
    return this.loginUseCase.execute(dto);
  }

  @Post('refresh')
  refreshToken(
    @Body() dto: RefreshTokenInputDto,
  ): Promise<RefreshTokenOutputDto> {
    return this.refreshTokenUseCase.execute(dto);
  }
}
