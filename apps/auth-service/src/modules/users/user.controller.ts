import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import {
    LoadUsersInputDto,
    LoadUsersOutputDto,
    LoadUsersUseCase,
} from './usecases';

@Controller()
export class UserController {
  constructor(
    private readonly loadUsersUseCase: LoadUsersUseCase,
  ) {}

  @MessagePattern('user.load')
  register(dto: LoadUsersInputDto): Promise<LoadUsersOutputDto> {
    return this.loadUsersUseCase.execute(dto);
  }
}
