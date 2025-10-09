import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class SendMessageToWebsocketSession {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('connected')
  handleConnected(client: Socket, roomId: string): void {
    client.join(roomId);
    client.emit('connected', roomId);
  }

  @SubscribeMessage('sendMessageToRoom')
  handleSendMessageToRoom(
    @MessageBody() data: { roomId: string; message: string },
  ): void {
    const { roomId, message } = data;
    this.server.to(roomId).emit('roomMessage', message);
  }

  @SubscribeMessage('disconnected')
  handleDisconnected(client: Socket, roomId: string): void {
    client.join(roomId);
    client.emit('disconnected', roomId);
  }

}
