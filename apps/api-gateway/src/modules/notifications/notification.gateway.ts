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

@WebSocketGateway({ namespace: 'notifications' })
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly userSessions: { sessionId: string; userId: string }[] = [];

  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {}

  @WebSocketServer()
  private readonly wss: Server;

  async handleConnection(client: Socket) {
    try {
      const apiKey = client.handshake.headers['x-api-key'];
      if (apiKey && apiKey === process.env.WEBSOCKET_API_KEY) {
        return;
      }
      const accessToken = client.handshake.headers['authorization'];
      const user: LoggedUserOutputDto = await firstValueFrom(
        this.authClient.send('auth.profile', {
          accessToken,
        }),
      );
      if (!user?.id) {
        return;
      }
      this.userSessions.push({ sessionId: client.id, userId: user.id });
    } catch (error) {
      console.log(error);
    }
  }

  handleDisconnect(client: Socket) {
    const apiKey = client.handshake.headers['x-api-key'];
    if (apiKey && apiKey === process.env.WEBSOCKET_API_KEY) {
      return;
    }
    const userSessions = this.userSessions.filter(
      (u) => u.sessionId === client.id,
    );
    for (const session of userSessions) {
      const sessionIndex = this.userSessions.indexOf(session);
      if (!sessionIndex) {
        continue;
      }
      this.userSessions.slice(sessionIndex, 1);
    }
  }

  @SubscribeMessage('gateway:task:created')
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
    if (!apiKey || apiKey !== process.env.WEBSOCKET_API_KEY) {
      return;
    }
    const userSessions = this.userSessions.filter(
      (u) => u.userId === payload.userId,
    );
    const hasUserSessions = userSessions.length > 0;
    if (!hasUserSessions) {
      return;
    }
    for (const session of userSessions) {
      this.wss.to(session.sessionId).emit('task:created', {
        taskId: payload.taskId,
        taskTitle: payload.taskTitle,
        type: payload.type,
      });
    }
  }

  @SubscribeMessage('gateway:task:updated')
  handleTaskUpdated(
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
    if (!apiKey || apiKey !== process.env.WEBSOCKET_API_KEY) {
      return;
    }
    const userSessions = this.userSessions.filter(
      (u) => u.userId === payload.userId,
    );
    const hasUserSessions = userSessions.length > 0;
    if (!hasUserSessions) {
      return;
    }
    for (const session of userSessions) {
      this.wss.to(session.sessionId).emit('task:updated', {
        taskId: payload.taskId,
        taskTitle: payload.taskTitle,
        type: payload.type,
      });
    }
  }

  @SubscribeMessage('gateway:comment:new')
  handleTaskComments(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      task: {
        id: string;
        title: string;
        releatedUsersId: string[];
      };
      comment: {
        id: string;
        authorName: string;
        content: string;
        updatedAt: string;
      };
    },
  ) {
    const apiKey = client.handshake.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.WEBSOCKET_API_KEY) {
      return;
    }
    for (const userId of payload.task.releatedUsersId) {
      const relatedUserSessions = this.userSessions.filter(
        (u) => u.userId === userId,
      );
      const hasUserSessions = relatedUserSessions.length > 0;
      if (!hasUserSessions) {
        return;
      }
      for (const session of relatedUserSessions) {
        this.wss.to(session.sessionId).emit('comment:new', {
          task: payload.task,
          comment: payload.comment,
        });
      }
    }
  }
}
