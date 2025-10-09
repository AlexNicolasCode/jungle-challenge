import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentEntity, UserEntity } from '../entities';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async save({
    taskId,
    authorId,
    authorName,
    content,
  }: {
    taskId: string;
    authorId: string;
    authorName: string;
    content: string;
  }): Promise<CommentEntity> {
    const author = await this.userRepository.save({
      id: authorId,
      name: authorName,
    });
    return this.commentRepository.save({
      content,
      task: { id: taskId },
      author: author,
    });
  }

  async update({
    id,
    authorId,
    content,
  }: {
    id: string;
    authorId: string;
    content: string;
  }): Promise<void> {
    await this.commentRepository.update(id, {
      content,
      author: { id: authorId },
    });
  }

  async delete(id: string): Promise<void> {
    await this.commentRepository.softDelete(id);
  }

  async loadAll(): Promise<CommentEntity[]> {
    return this.commentRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }
}
