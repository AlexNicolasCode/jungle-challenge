import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { LocalAuthGuard } from 'src/shared/guards/local-auth.guard';
import {
    CreateUserInputDto,
    CreateUserOutputDto,
    LoginInputDto,
    LoginOutputDto,
    RefreshTokenInputDto,
    RefreshTokenOutputDto,
} from './dtos';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: CreateUserOutputDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiBody({ type: CreateUserInputDto })
  register(@Body() dto: CreateUserInputDto): Observable<CreateUserOutputDto> {
    return this.authClient.send('auth.register', dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: LoginOutputDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: LoginInputDto })
  login(@Body() dto: LoginInputDto): Observable<LoginOutputDto> {
    return this.authClient.send('auth.login', dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: RefreshTokenOutputDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @ApiBody({ type: RefreshTokenInputDto })
  refreshToken(
    @Body() dto: RefreshTokenInputDto,
  ): Observable<RefreshTokenOutputDto> {
    return this.authClient.send('auth.refresh', dto);
  }
}
