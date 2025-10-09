import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CompareHashsService {
  async compare({
    value,
    hash,
  }: {
    value: string;
    hash: string;
  }): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
