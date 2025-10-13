import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthController } from './auth.controller';

@Module({
  imports: [
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
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
