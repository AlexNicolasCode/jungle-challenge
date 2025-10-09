import { IsEmail, IsNotEmpty } from 'class-validator';

export class GenerateAuthTokensInputDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;
}
