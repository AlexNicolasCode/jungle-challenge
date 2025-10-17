import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'comments', cors: true })
export class TaskCommentGateway {
  @WebSocketServer()
  private readonly wss: Server;

  @SubscribeMessage('comments')
  handleTaskComments(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      taskId: string;
      comment: {
        id: string;
        authorName: string;
        content: string;
        updatedAt: Date;
      };
    },
  ) {
    const apiKey = client.handshake.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.WEBSOCKET_API_KEY) {
      return;
    }
    this.wss.emit(`tasks/${payload.taskId}/comments`, payload.comment);
  }
}
