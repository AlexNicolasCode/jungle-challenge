import { Module } from '@nestjs/common';

import { dbConfig } from './database/config/database.config';
import { HealthzController } from './healthz.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [dbConfig, AuthModule, UserModule],
  controllers: [HealthzController],
})
export class AppModule {}
