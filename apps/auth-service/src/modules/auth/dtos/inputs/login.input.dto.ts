import { IsEmail, MinLength } from 'class-validator';

export class LoginInputDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
