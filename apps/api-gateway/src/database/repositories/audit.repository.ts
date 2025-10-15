import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuditEntity } from '../entities';

@Injectable()
export class AuditRepository {
  private readonly logger = new Logger(AuditRepository.name);

  constructor(
    @InjectRepository(AuditEntity)
    private readonly auditRepository: Repository<AuditEntity>,
  ) {}

  async save(entity: {
    userId: string;
    url: string;
    ip: string;
    method: string;
    body: string;
    response: string;
  }): Promise<void> {
    try {
      await this.auditRepository.save(entity);
    } catch (error) {
      this.logger.error(
        `Error to create audit log with payload ${JSON.stringify(entity)}`,
        error,
      );
    }
  }
}
