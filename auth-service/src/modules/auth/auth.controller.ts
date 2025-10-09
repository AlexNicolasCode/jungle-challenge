import { Controller, Post, Body } from '@nestjs/common';

import { CreateUserInputDto } from './dtos/inputs';
import { CreateUserOutputDto } from './dtos/outputs';
import { CreateUserUseCase } from './usecases';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post('register')
  register(@Body() dto: CreateUserInputDto): Promise<CreateUserOutputDto> {
    return this.createUserUseCase.execute(dto);
  }
}
