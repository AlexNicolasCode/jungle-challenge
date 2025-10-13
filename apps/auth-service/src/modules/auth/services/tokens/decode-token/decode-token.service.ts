import {
    Injectable,
    Logger,
    UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { DecodeTokenInputDto } from './decode-token.input.dto';
import { DecodeTokenOutputDto } from './decode-token.output.dto';

@Injectable()
export class DecodeTokenService {
  private readonly logger = new Logger(DecodeTokenService.name);

  private readonly secret: string;
  private readonly refreshSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.secret = this.configService.get<string>(
      'JWT_ACCESS_SECRET',
      'fallback-secret',
    );
    this.refreshSecret = this.configService.get<string>(
      'JWT_REFRESH_SECRET',
      'fallback-secret',
    );
  }

  decodeToken({ token, type }: DecodeTokenInputDto): DecodeTokenOutputDto {
    try {
      const tokenTypeMapper = {
        access: () => this.decodeAccessToken(token),
        refresh: () => this.decodeRefreshToken(token),
      };
      return tokenTypeMapper[type]();
    } catch (_error) {
      throw new UnauthorizedException();
    }
  }

  private decodeAccessToken(accessToken: string): DecodeTokenOutputDto {
    try {
      const decodedToken = this.jwtService.verify<DecodeTokenOutputDto>(
        accessToken,
        {
          secret: this.secret,
        },
      );
      return {
        name: decodedToken['name'],
        email: decodedToken['email'],
        iat: decodedToken.iat,
        exp: decodedToken.exp,
      };
    } catch (_error) {
      throw new UnauthorizedException();
    }
  }

  private decodeRefreshToken(refreshToken: string): DecodeTokenOutputDto {
    try {
      const decodedToken = this.jwtService.verify<DecodeTokenOutputDto>(
        refreshToken,
        {
          secret: this.refreshSecret,
        },
      );
      return {
        name: decodedToken['name'],
        email: decodedToken['email'],
        iat: decodedToken.iat,
        exp: decodedToken.exp,
      };
    } catch (_error) {
      throw new UnauthorizedException();
    }
  }
}
