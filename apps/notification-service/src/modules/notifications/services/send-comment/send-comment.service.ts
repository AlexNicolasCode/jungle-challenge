import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';

import { SendCommentInputDto } from './send-comment.input.dto';
import { SendCommentOutputDto } from './send-comment.output.dto';

@Injectable()
export class SendCommentService implements OnModuleInit, OnModuleDestroy {
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

  sendComment(dto: SendCommentInputDto): SendCommentOutputDto {
    if (this.apiGatewayWs && this.apiGatewayWs.connected) {
      console.log(`📤 Emitting event`);
      this.apiGatewayWs.emit('comments', dto);
    } else {
      console.warn(`Socket not connected, cannot emit`);
    }
  }
}
