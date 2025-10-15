import { Module } from '@nestjs/common';

import { dbConfig } from './database/config/database.config';
import { HealthzController } from './healthz.controller';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [dbConfig, AuthModule],
  controllers: [HealthzController],
})
export class AppModule {}
