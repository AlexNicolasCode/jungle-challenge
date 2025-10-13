export class RefreshTokenOutputDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  expireAt: Date;
}
