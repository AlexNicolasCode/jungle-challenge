import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PasswordEntity, UserEntity } from 'src/database/entities';
import { PasswordRepository, UserRepository } from 'src/database/repositories';
import { AuthController } from './auth.controller';
import {
    CheckUserExistsByEmailService,
    CompareHashsService,
    CreateUserService,
    DecodeTokenService,
    GenerateAuthTokensService,
    GenerateTokenService,
    HashService,
    LoadPasswordByUserIdService,
    LoadUserByEmailService,
} from './services';
import {
    CreateUserUseCase,
    GetUserByTokenUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    ValidateUserUseCase,
} from './usecases';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity, PasswordEntity]),
  ],
  controllers: [AuthController],
  providers: [
    ValidateUserUseCase,
    GetUserByTokenUseCase,
    LoginUseCase,
    CreateUserUseCase,
    RefreshTokenUseCase,
    CreateUserService,
    DecodeTokenService,
    CheckUserExistsByEmailService,
    LoadUserByEmailService,
    LoadPasswordByUserIdService,
    GenerateAuthTokensService,
    GenerateTokenService,
    CompareHashsService,
    JwtService,
    HashService,
    UserRepository,
    PasswordRepository,
  ],
})
export class AuthModule {}
