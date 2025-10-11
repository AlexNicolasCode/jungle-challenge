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

  async loadAll({
    page,
    size,
    where,
  }: {
    page: number;
    size: number;
    where: {
      authorId?: string;
    };
  }): Promise<{ comments: CommentEntity[]; count: number }> {
    const query = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .orderBy('comment.createdAt', 'DESC');
    const skip = (page - 1) * size;
    query.skip(skip);
    query.take(size);
    const fieldMapper: Record<
      string,
      { query: string; variables: Record<string, any> }
    > = {
      authorId: {
        query: 'comment.authorId ILIKE :authorId',
        variables: { authorId: `%${where.authorId}%` },
      },
    };
    const fields: string[] = Object.keys(where);
    for (const field of fields) {
      const whereParams = fieldMapper[field];
      if (
        !where[field] ||
        !whereParams ||
        !whereParams.query ||
        !whereParams.variables
      ) {
        continue;
      }
      query.andWhere(whereParams.query, whereParams.variables);
    }
    const [comments, count] = await query.getManyAndCount();
    return { count, comments };
  }
}
