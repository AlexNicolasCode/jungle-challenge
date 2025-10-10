export class CreateUserOutputDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  expireAt: Date;
  status: string;
  message: string;
  code: number;
  data: any;
}
