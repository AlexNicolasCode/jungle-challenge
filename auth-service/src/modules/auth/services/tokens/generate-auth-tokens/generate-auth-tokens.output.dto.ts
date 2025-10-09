export class GenerateAuthTokensOutputDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  expireAt: Date;
}
