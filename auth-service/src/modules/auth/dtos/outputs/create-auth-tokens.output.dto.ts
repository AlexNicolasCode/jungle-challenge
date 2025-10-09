export class CreateAuthTokensOutputDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  expireAt: Date;
}
