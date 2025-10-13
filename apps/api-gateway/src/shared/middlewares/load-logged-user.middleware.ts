import {
    Inject,
    Injectable,
    Logger,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NextFunction } from 'express';
import { firstValueFrom } from 'rxjs';

import { LoggedUserOutputDto } from '../decorators';

@Injectable()
export class LoadLoggedUserMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoadLoggedUserMiddleware.name);

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const token = req.headers['authorization'];
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const user: LoggedUserOutputDto = await firstValueFrom(
        this.authClient.send('auth.user', {
          accessToken: token,
        }),
      );
      if (!user?.id) {
        throw new UnauthorizedException();
      }
      req['user'] = user;
    } catch (_error) {
      throw new UnauthorizedException();
    }
    next();
  }
}
