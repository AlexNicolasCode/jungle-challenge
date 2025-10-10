import { Controller, Post, Body, Inject, HttpException, UsePipes, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, Observable, throwError } from 'rxjs';

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
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  @Post('register')
  register(@Body() dto: CreateUserInputDto): Observable<CreateUserOutputDto> {
    return this.authClient
      .send('auth.register', dto)
  }

  @Post('login')
  login(@Body() dto: LoginInputDto): Observable<LoginOutputDto> {
    return this.authClient.send('auth.login', dto);
  }

  @Post('refresh')
  refreshToken(
    @Body() dto: RefreshTokenInputDto,
  ): Observable<RefreshTokenOutputDto> {
    return this.authClient.send('auth.refresh', dto);
  }
}
