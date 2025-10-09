import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './auth.controller';
import {
  CheckUserExistsByEmailService,
  CreateUserService,
  GenerateAuthTokensService,
  GenerateTokenService,
  HashService,
} from './services';
import { UserRepository } from 'src/database/repositories';
import { PasswordEntity, UserEntity } from 'src/database/entities';
import { CreateUserUseCase } from './usecases';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity, PasswordEntity]),
  ],
  controllers: [AuthController],
  providers: [
    CreateUserUseCase,
    CreateUserService,
    CheckUserExistsByEmailService,
    GenerateAuthTokensService,
    GenerateTokenService,
    JwtService,
    HashService,
    UserRepository,
  ],
})
export class AuthModule {}
