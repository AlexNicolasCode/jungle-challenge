import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PaginationInput {
  @IsNumber()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  size: number;

  @IsNumber()
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  page: number;
}
