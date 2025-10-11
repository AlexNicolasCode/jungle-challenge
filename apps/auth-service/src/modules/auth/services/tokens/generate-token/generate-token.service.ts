import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { GenerateTokenInputDto } from './generate-token.input.dto';
import { GenerateTokenOutputDto } from './generate-token.output.dto';

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
      '10m',
    );
  }

  generateAccessToken(input: GenerateTokenInputDto): GenerateTokenOutputDto {
    const accessToken = this.jwtService.sign(input, {
      secret: this.secret,
      expiresIn: this.expiresIn,
    });
    const expireAt = this.calculateExpireAt(this.expiresIn);
    return {
      token: accessToken,
      expiresIn: this.expiresIn,
      expireAt,
    };
  }

  generateRefreshToken(input: GenerateTokenInputDto): GenerateTokenOutputDto {
    const refreshToken = this.jwtService.sign(input, {
      secret: this.refreshSecret,
      expiresIn: this.expiresRefreshTokenIn,
    });
    const expireAt = this.calculateExpireAt(this.expiresRefreshTokenIn);
    return {
      token: refreshToken,
      expiresIn: this.expiresRefreshTokenIn,
      expireAt,
    };
  }

  private calculateExpireAt(expiresIn: string): Date {
    const now = new Date();
    const regex = /^(\d+)([dswm])$/i;
    const match = expiresIn.match(regex);
    if (!match) {
      throw new Error("Invalid format. Use '3d', '3s', '3w' ou '3m'.");
    }
    const amount = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    const unitMap: Record<string, (date: Date, value: number) => void> = {
      s: (date, value) => date.setSeconds(date.getSeconds() + value),
      m: (date, value) => date.setMinutes(date.getMinutes() + value),
      d: (date, value) => date.setDate(date.getDate() + value),
      w: (date, value) => date.setDate(date.getDate() + value * 7),
    };
    if (!unitMap[unit]) {
      throw new Error("Unidade inválida. Use 's', 'm', 'd' ou 'w'.");
    }
    unitMap[unit](now, amount);
    return now;
  }
}
