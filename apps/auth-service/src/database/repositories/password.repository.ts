import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PasswordEntity } from '../entities';

@Injectable()
export class PasswordRepository {
  constructor(
    @InjectRepository(PasswordEntity)
    private readonly passwordRepository: Repository<PasswordEntity>,
  ) {}

  loadByUserId(userId: string): Promise<PasswordEntity | null> {
    return this.passwordRepository.findOne({ where: { user: { id: userId } } });
  }
}
