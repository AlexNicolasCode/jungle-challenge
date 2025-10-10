import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserInputDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    minLength: 6,
    maxLength: 100,
  })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'User password',
    example: 'strongpassword123',
    minLength: 6,
  })
  @MinLength(6)
  password: string;
}
