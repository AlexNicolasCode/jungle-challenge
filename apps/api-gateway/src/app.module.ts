import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule, NotificationModule, TaskModule } from './modules';
import { JwtStrategy, LocalStrategy } from './shared/strategies';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    TaskModule,
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
          host: '127.0.0.1',
          port: 3001,
          retryAttempts: 10,
          retryDelay: 3000,
        },
      },
    ]),
  ],
  controllers: [],
  providers: [JwtStrategy, LocalStrategy],
})
export class AppModule {}
