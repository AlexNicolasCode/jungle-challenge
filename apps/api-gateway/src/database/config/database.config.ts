import { TypeOrmModule } from '@nestjs/typeorm';

export const dbConfig = TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'audit_db',
  entities: ['dist/database/entities/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  migrationsRun: true,
});
