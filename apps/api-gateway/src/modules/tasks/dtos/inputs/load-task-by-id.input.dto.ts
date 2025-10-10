import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoadTaskByIdInputDto {
  @ApiProperty({
    description: 'Task UUID to load',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  @IsUUID()
  id: string;
}
