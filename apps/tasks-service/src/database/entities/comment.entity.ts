import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { TaskEntity } from './task.entity';
import { UserEntity } from './user.entity';

@Entity('task_comments')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @ManyToOne(() => TaskEntity, (task) => task.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task: TaskEntity;

  @ManyToOne(() => UserEntity, (user) => user.comments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
