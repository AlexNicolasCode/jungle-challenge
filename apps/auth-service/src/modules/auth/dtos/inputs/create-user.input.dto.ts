import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserInputDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  name: string;

  @MinLength(6)
  password: string;
}
