import { ApiProperty } from '@nestjs/swagger';

export class LoginOutputDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token',
    example: 'dGhpc2lzYXJlZnJlc2h0b2tlbg==',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Token expiration time in seconds',
    example: '3600',
  })
  expiresIn: string;

  @ApiProperty({
    description: 'Exact date-time when the token expires',
    example: '2025-10-10T06:30:00.000Z',
  })
  expireAt: Date;
}
