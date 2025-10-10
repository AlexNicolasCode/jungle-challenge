import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteTaskByIdInputDto {
  @ApiProperty({
    description: 'Task UUID to delete',
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
  })
  @IsUUID()
  id: string;
}
