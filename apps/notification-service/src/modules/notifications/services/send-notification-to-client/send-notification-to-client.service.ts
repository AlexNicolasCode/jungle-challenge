import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';

import { SendNotificationToClientInputDto } from './send-notification-to-client.input.dto';
import { SendNotificationToClientOutputDto } from './send-notification-to-client.output.dto';

@Injectable()
export class SendNotificationToClientService
  implements OnModuleInit, OnModuleDestroy
{
  private apiGatewayWs: Socket;

  onModuleInit() {
    this.connect();
  }

  private connect() {
    this.apiGatewayWs = io('http://localhost:3000/notifications', {
      extraHeaders: {
        'x-api-key': 'test',
      },
    });

    this.apiGatewayWs.on('connect', () => {
      console.log(`✅ Connected to server with ID: ${this.apiGatewayWs.id}`);
    });

    this.apiGatewayWs.on('disconnect', (reason) => {
      console.warn(`⚠️ Disconnected: ${reason}`);
    });

    this.apiGatewayWs.on('connect_error', (error) => {
      console.error(`❌ Connection error: ${error.message}`);
    });
  }

  onModuleDestroy() {
    console.log('Closing Socket.IO connection...');
    if (this.apiGatewayWs) {
      this.apiGatewayWs.disconnect();
    }
  }

  sendNotificationToClient({
    userId,
    taskId,
    taskTitle,
    event,
  }: SendNotificationToClientInputDto): SendNotificationToClientOutputDto {
    if (this.apiGatewayWs && this.apiGatewayWs.connected) {
      console.log(`📤 Emitting event gateway:${event}`);
      this.apiGatewayWs.emit(`gateway:${event}`, {
        userId,
        taskId,
        taskTitle,
      });
    } else {
      console.warn(`Socket not connected, cannot emit`);
    }
  }
}
