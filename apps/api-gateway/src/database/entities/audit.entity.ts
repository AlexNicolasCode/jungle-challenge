import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('audits')
export class AuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  ip: string;

  @Column()
  method: string;

  @Column()
  url: string;

  @Column({ type: 'jsonb', nullable: true })
  body: string;

  @Column({ type: 'jsonb', nullable: true })
  response?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
