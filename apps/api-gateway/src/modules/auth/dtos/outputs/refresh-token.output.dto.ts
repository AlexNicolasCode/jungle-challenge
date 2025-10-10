import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenOutputDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

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
