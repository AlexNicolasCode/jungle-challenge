import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PasswordEntity, UserEntity } from 'src/database/entities';
import { UserRepository } from 'src/database/repositories';
import { LoadUsersService } from './services';
import { LoadUsersUseCase } from './usecases';
import { UserController } from './user.controller';


@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PasswordEntity])],
  controllers: [UserController],
  providers: [
    LoadUsersUseCase,
    LoadUsersService,
    UserRepository,
  ],
})
export class UserModule {}
