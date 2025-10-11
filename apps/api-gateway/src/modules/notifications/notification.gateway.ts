import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { firstValueFrom } from 'rxjs';
import { Server, Socket } from 'socket.io';

import { LoggedUserOutputDto } from 'src/shared/decorators';

@WebSocketGateway({ namespace: 'notifications', cors: true })
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly loggedUsers = new Map<string, string>();

  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  @WebSocketServer()
  private readonly wss: Server;

  async handleConnection(client: Socket) {
    const apiKey = client.handshake.headers['x-api-key'];
    if (apiKey && apiKey === 'test') {
      return;
    }
    const accessToken = client.handshake.headers['authorization'];
    const user: LoggedUserOutputDto = await firstValueFrom(
      this.authClient.send('auth.user', {
        accessToken,
      }),
    );
    if (!user?.id) {
      return;
    }
    this.loggedUsers.set(user.id, client.id);
  }

  async handleDisconnect(client: Socket) {
    const apiKey = client.handshake.headers['x-api-key'];
    if (apiKey && apiKey === 'test') {
      return;
    }
    const accessToken = client.handshake.headers['authorization'];
    const user: LoggedUserOutputDto = await firstValueFrom(
      this.authClient.send('auth.user', {
        accessToken,
      }),
    );
    if (!user?.id) {
      return;
    }
    this.loggedUsers.delete(user.id);
  }

  @SubscribeMessage('notifications')
  handleNotifications(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      userId: string;
      taskId: string;
      taskTitle: string;
      type: string;
    },
  ) {
    const apiKey = client.handshake.headers['x-api-key'];
    if (!apiKey || apiKey !== 'test') {
      return;
    }
    const loggedUser = this.loggedUsers.get(payload.userId);
    if (!loggedUser) {
      return;
    }
    this.wss.to(loggedUser).emit('notifications', {
      taskId: payload.taskId,
      taskTitle: payload.taskTitle,
      type: payload.type,
    });
  }
}
