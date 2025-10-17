import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { NotificationGateway } from './notification.gateway';

@Module({
  imports: [
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
  ],
  providers: [NotificationGateway],
})
export class NotificationModule {}
