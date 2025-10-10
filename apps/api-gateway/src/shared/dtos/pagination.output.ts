import { ApiProperty } from '@nestjs/swagger';

export class PaginationOutput<T> {
  @ApiProperty({ isArray: true, description: 'List of items' })
  list: T[];

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  size: number;

  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Total number of pages', example: 5 })
  totalPages: number;
}
