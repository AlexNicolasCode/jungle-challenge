import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskOutputDto {
  @ApiProperty({
    description: 'Unique identifier of the created task',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  id: string;
}
