import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { dbConfig } from './database/config/database.config';

@Module({
  imports: [dbConfig, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
