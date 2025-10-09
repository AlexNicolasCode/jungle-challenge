import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GenerateTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(payload: Record<string, string | number>): {
    accessToken: string;
    expiresIn: string;
    expireAt: Date;
  } {
    const expiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
      '10m',
    );
    const secret = this.configService.get<string>(
      'JWT_ACCESS_SECRET',
      'fallback-secret',
    );
    const accessToken = this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
    const expireAt = this.calculateExpireAt(expiresIn);
    return {
      accessToken,
      expiresIn,
      expireAt,
    };
  }

  generateRefreshToken(payload: Record<string, string | number>): {
    refreshToken: string;
    expiresIn: string;
    expireAt: Date;
  } {
    const expiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
      '10m',
    );
    const secret = this.configService.get<string>(
      'JWT_ACCESS_SECRET',
      'fallback-secret',
    );
    const refreshToken = this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
    const expireAt = this.calculateExpireAt(expiresIn);
    return {
      refreshToken,
      expiresIn,
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
