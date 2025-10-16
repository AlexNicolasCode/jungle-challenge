import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { GenerateTokenInputDto } from './generate-token.input.dto';
import { GenerateTokenOutputDto } from './generate-token.output.dto';
import { calculateExpireAt, durationToMs } from 'src/shared/utils';

@Injectable()
export class GenerateTokenService {
  private readonly secret: string;
  private readonly refreshSecret: string;
  private readonly expiresIn: string;
  private readonly expiresRefreshTokenIn: string;

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
    this.expiresRefreshTokenIn = this.configService.get<string>(
      'JWT_REFRESH_TOKEN_EXPIRES_IN',
      '7d',
    );
    this.expiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
      '15m',
    );
  }

  generateAccessToken(input: GenerateTokenInputDto): GenerateTokenOutputDto {
    const accessToken = this.jwtService.sign(input, {
      secret: this.secret,
      expiresIn: durationToMs(this.expiresIn),
    });
    const expireAt = calculateExpireAt(this.expiresIn);
    return {
      token: accessToken,
      expiresIn: this.expiresIn,
      expireAt,
    };
  }

  generateRefreshToken(input: GenerateTokenInputDto): GenerateTokenOutputDto {
    const refreshToken = this.jwtService.sign(input, {
      secret: this.refreshSecret,
      expiresIn: durationToMs(this.expiresRefreshTokenIn),
    });
    const expireAt = calculateExpireAt(this.expiresRefreshTokenIn);
    return {
      token: refreshToken,
      expiresIn: this.expiresRefreshTokenIn,
      expireAt,
    };
  }
}
