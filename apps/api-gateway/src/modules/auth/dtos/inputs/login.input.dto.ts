import { IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginInputDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'strongpassword123',
    minLength: 6,
  })
  @MinLength(6)
  password: string;
}
