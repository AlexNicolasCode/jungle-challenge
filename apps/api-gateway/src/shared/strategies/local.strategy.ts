import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { firstValueFrom } from 'rxjs';

import { LoggedUserOutputDto } from '../decorators';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly authClient: ClientProxy,
  ) {
    super({
      usernameField: 'email',
    });
  }
  async validate(
    email: string,
    password: string,
  ): Promise<LoggedUserOutputDto> {
    const user: LoggedUserOutputDto = await firstValueFrom(
      this.authClient.send('auth.validateUser', {
        email,
        password,
      }),
    );
    if (!user?.id) {
      throw new UnauthorizedException();
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
