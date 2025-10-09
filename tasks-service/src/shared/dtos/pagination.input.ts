import { Transform } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class PaginationInput {
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  size: number;

  @IsNumber()
  @Min(1)
  @Transform(({ value }) => Number(value), { toClassOnly: true })
  page: number;
}
