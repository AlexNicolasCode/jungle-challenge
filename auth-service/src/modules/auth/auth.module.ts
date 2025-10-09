import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './auth.controller';
import {
  CheckUserExistsByEmailService,
  CompareHashsService,
  CreateUserService,
  GenerateAuthTokensService,
  GenerateTokenService,
  HashService,
  LoadPasswordByUserIdService,
  LoadUserByEmailService,
} from './services';
import { PasswordRepository, UserRepository } from 'src/database/repositories';
import { PasswordEntity, UserEntity } from 'src/database/entities';
import { CreateUserUseCase, LoginUseCase } from './usecases';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity, PasswordEntity]),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    CreateUserUseCase,
    CreateUserService,
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
