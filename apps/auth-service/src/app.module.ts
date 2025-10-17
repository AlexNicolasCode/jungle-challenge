import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { dbConfig } from './database/config/database.config';
import { HealthzController } from './healthz.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    dbConfig,
    AuthModule,
    UserModule,
  ],
  controllers: [HealthzController],
})
export class AppModule {}
