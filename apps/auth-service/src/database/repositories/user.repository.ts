import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { v4 } from 'uuid';

import { PaginationInput } from 'src/shared/dtos';
import { PasswordEntity, UserEntity } from '../entities';

@Injectable()
export class UserRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PasswordEntity)
    private readonly passwordRepository: Repository<PasswordEntity>,
  ) {}

  checkIfExistsByEmail(email: string): Promise<boolean> {
    return this.userRepository.exists({ where: { email } });
  }

  async loadUsers({ page, size }: PaginationInput): Promise<{ users: UserEntity[]; count: number }> {
    const [users, count] = await this.userRepository.findAndCount({
      select: ['id', 'name'],
      skip: (page - 1) * size,
      take: size,
      order: { id: 'ASC' },
    });
    return { users, count };
  }

  loadByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async save({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ id: string }> {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.save(this.userRepository.target, {
        id: v4(),
        name,
        email,
      });
      await manager.save(this.passwordRepository.target, {
        hash: password,
        user: user,
      });
      return { id: user.id };
    });
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.softDelete(id);
  }
}
