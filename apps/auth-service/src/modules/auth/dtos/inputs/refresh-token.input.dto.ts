import { IsString } from 'class-validator';

export class RefreshTokenInputDto {
  @IsString()
  refreshToken: string;
}
