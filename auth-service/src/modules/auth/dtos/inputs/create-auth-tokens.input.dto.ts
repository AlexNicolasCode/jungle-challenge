import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAuthTokensInputDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;
}
