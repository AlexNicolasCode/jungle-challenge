import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { dbConfig } from './database/config';
import { HealthzController } from './healthz.controller';
import { CommentModule } from './modules/comments';
import { TaskModule } from './modules/tasks/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    dbConfig,
    TaskModule,
    CommentModule,
  ],
  controllers: [HealthzController],
})
export class AppModule {}
