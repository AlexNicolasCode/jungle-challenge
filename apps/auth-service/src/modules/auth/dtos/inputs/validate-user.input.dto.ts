import { IsEmail, MinLength } from 'class-validator';

export class ValidateUserInputDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
