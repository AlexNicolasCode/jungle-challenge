import { UnauthorizedException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class GetUserByTokenInputDto {
  @IsString()
  @Transform(({ value }) => {
    if (!value || typeof value !== 'string') {
      return;
    }
    const [type, token] = value.split(' ');
    if (type !== 'Bearer') {
      throw new UnauthorizedException();
    }
    return token;
  })
  accessToken: string;
}
