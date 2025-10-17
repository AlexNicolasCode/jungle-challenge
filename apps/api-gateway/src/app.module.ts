import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ThrottlerModule } from '@nestjs/throttler';

import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './database/config/database.config';
import { AuditEntity } from './database/entities';
import { AuditRepository } from './database/repositories';
import { HealthzController } from './healthz.controller';
import {
    AuthModule,
    NotificationModule,
    TaskModule,
    UserModule,
} from './modules';
import { AuditInterceptor } from './shared/interceptors';
import { JwtStrategy, LocalStrategy } from './shared/strategies';

@Module({
  imports: [
    dbConfig,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    TaskModule,
    UserModule,
    NotificationModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE ?? '127.0.0.1',
          port: process.env.AUTH_SERVICE_PORT ? Number(process.env.AUTH_SERVICE_PORT) : 3002,
          retryAttempts: 10,
          retryDelay: 3000,
        },
      },
    ]),
    TypeOrmModule.forFeature([AuditEntity]),
  ],
  controllers: [HealthzController],
  providers: [
    JwtStrategy,
    LocalStrategy,
    AuditRepository,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
