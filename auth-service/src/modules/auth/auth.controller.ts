import { Controller, Post, Body } from '@nestjs/common';

import { CreateUserUseCase, LoginUseCase } from './usecases';
import {
  CreateUserInputDto,
  CreateUserOutputDto,
  LoginInputDto,
  LoginOutputDto,
} from './dtos';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  register(@Body() dto: CreateUserInputDto): Promise<CreateUserOutputDto> {
    return this.createUserUseCase.execute(dto);
  }

  @Post('login')
  login(@Body() dto: LoginInputDto): Promise<LoginOutputDto> {
    return this.loginUseCase.execute(dto);
  }
}
