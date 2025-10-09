import { IsString } from 'class-validator';

export class RefreshTokenInputDto {
  @IsString()
  refresToken: string;
}
