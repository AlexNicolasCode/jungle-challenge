import { Module } from '@nestjs/common';

import { dbConfig } from './database/config';
import { HealthzController } from './healthz.controller';
import { CommentModule } from './modules/comments';
import { TaskModule } from './modules/tasks/task.module';

@Module({
  imports: [dbConfig, TaskModule, CommentModule],
  controllers: [HealthzController],
})
export class AppModule {}
