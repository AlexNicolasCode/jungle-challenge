import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { dbConfig } from './database/config/database.config';
import { HealthzController } from './healthz.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { ErrorTransformInterceptor } from './shared/interceptors';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    dbConfig,
    AuthModule,
    UserModule,
  ],
  controllers: [HealthzController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorTransformInterceptor,
    },
  ]
})
export class AppModule {}
