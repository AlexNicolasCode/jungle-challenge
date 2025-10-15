import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import {
    LoadUsersInputDto,
    LoadUsersOutputDto
} from './dtos';

@ApiTags('Users')
@Controller('api/users')
export class UserController {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  @Get()
  loadUsers(@Query() dto: LoadUsersInputDto): Observable<LoadUsersOutputDto> {
    return this.authClient.send('user.load', dto);
  }
}
