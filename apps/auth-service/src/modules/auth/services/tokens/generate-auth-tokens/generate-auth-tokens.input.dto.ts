import { IsEmail, IsUUID } from 'class-validator';

export class GenerateAuthTokensInputDto {
  @IsEmail()
  email: string;

  @IsUUID()
  id: string;
}
